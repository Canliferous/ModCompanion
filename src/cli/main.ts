import { program } from "commander";
import * as Core from "mod_companion_core";
import * as Shared from "mod_companion_shared";
import chalk from "chalk";
import humanizePlus from "humanize-plus";
import { getAssetsFromMcaFiles } from "../core/systems/asset/CoreAssetRepository.js";

program.name("Mod Companion CLI").description("Headless cli for mod companion tasks without GUI");

program
    .command("convert")
    .option("-f, --force", "Convert all assets, no matter their state")
    .option("-l, --list", "List all assets and their conversion state")
    .option(
        "-d, --dry",
        "Don't run the converter, just show what would be converted. Same as list but only lists assets with pending state",
    )
    .option("-v, --verbose", "Print more details for troubleshooting")
    .argument(
        "[files...]",
        "Paths to assets (.mca files) that you want to convert explicitly. Relative to the repo root (Starting with content/...)",
    )
    .action(async (files, opts) => {
        if (opts.verbose) {
            console.debug("Root Dir", Core.FileSystem.getRootDir());
            console.debug("Main Assets Dir", Core.FileSystem.getMainAssetsDir());
        }

        await Core.ConfigSystem.initConfigSystem();
        Core.MareTfSystem.initSystem();
        if (opts.verbose) console.debug("Maretf Path", Core.MareTfSystem.getMareTfBinaryPath());
        await Core.AssetRepository.rescan();
        const assets = Core.AssetRepository.getAssetMap();

        if (files.length > 0) {
            const assets = Core.AssetRepository.getAssetsFromMcaFiles(files);
            for (const asset of assets) {
                Core.ConversionAgentSystem.enqueue(asset.def.id, opts.force);
            }
        } else {
            await Core.ConversionAgentSystem.initStates(assets);
        }

        if (opts.list || opts.dry) {
            if (opts.dry) {
                console.log("Assets that would be converted if this wasn't a dry run:");
            }

            let itemCount = 0;

            for (const c of Core.ConversionAgentSystem.getConversionsMap().values()) {
                if (opts.dry && c.state !== Shared.Conversion.State.Pending) continue;
                const asset = assets.get(c.assetId);
                if (!asset) {
                    continue;
                }
                const stateName = Shared.Conversion.getConversionStateName(c.state).padStart(11, " ");
                const typeName = Shared.Asset.getAssetTypeName(asset.def.type).padEnd(7, " ");
                const colorFunc = getConversionStateChalkColor(c.state);
                console.log(colorFunc(stateName), "-", chalk.yellow(typeName), chalk.gray(asset.defFilePath));
                itemCount++;
            }

            console.log("End of list (", itemCount, ")");
            if (opts.dry) {
                return;
            }
        }

        console.log("Starting to convert assets...");
        const startTime = new Date().getTime();

        let assetCount = 0;
        await Core.ConversionAgentSystem.runAndConvertUntilItIsDone(opts.force && files.length === 0, (assetId) => {
            const asset = assets.get(assetId);
            if (asset) {
                assetCount++;
                console.log(
                    chalk.green("Converting"),
                    chalk.yellow(Shared.Asset.getAssetTypeName(asset.def.type)),
                    chalk.gray(asset.defFilePath),
                );
            }
        });

        const endTime = new Date().getTime();
        const duration = (endTime - startTime) / 1000;
        console.log(`Done! Converted ${assetCount} assets in ${duration} seconds`);
    });

function getConversionStateChalkColor(state: Shared.Conversion.State) {
    switch (state) {
        case Shared.Conversion.State.Pending:
        case Shared.Conversion.State.PendingForced:
            return chalk.bgGray;
        case Shared.Conversion.State.InProgress:
            return chalk.bgBlue;
        case Shared.Conversion.State.Finished:
            return chalk.bgGreenBright;
        case Shared.Conversion.State.Invalid:
        case Shared.Conversion.State.Failed:
            return chalk.bgRed;
        case Shared.Conversion.State.NoChange:
            return chalk.green;
        case Shared.Conversion.State.Unknown:
        default:
            return (a: string) => a;
    }
}

program.parse();
