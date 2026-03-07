import { ipcMain } from "electron";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import * as kv from "@sourcelib/kv";

import * as Core from "mod_companion_core";
import * as Shared from "mod_companion_shared";

export function registerMapTimeReportApi(): boolean {
    ipcMain.handle(Shared.Ipc.Channels.MapCreateTimeReport, (e, maps: Shared.Map.SharedMapPath[]) =>
        _createTimeReport(maps),
    );
    return true;
}

const reportExtensions: Shared.Map.SharedMapCompileStep[] = [
    Shared.Map.SharedMapCompileStep.VBsp,
    Shared.Map.SharedMapCompileStep.VVis,
    Shared.Map.SharedMapCompileStep.VRad,
];

function _getReportExtension(step: Shared.Map.SharedMapCompileStep) {
    switch (step) {
        case Shared.Map.SharedMapCompileStep.VBsp:
            return ".report_vbsp.vdf";
        case Shared.Map.SharedMapCompileStep.VVis:
            return ".report_vvis.vdf";
        case Shared.Map.SharedMapCompileStep.VRad:
            return ".report_vrad.vdf";
        default:
            return undefined;
    }
}

async function _createTimeReport(maps: Shared.Map.SharedMapPath[]): Promise<Shared.Map.SharedMapTimeReport> {
    const config = Core.ConfigSystem.getAppConfig();

    const srcPath = config.mapSourcePath;

    const report: Shared.Map.SharedMapTimeReport = {
        maps: new Map<string, number>(),
        totals: new Map<Shared.Map.SharedMapPath, number>(),
    };

    for (const map of maps) {
        for (const step of reportExtensions) {
            const extension = _getReportExtension(step);
            if (!extension) continue;

            const reportPath = path.join(srcPath, map.replace(".vmf", extension));

            if (!existsSync(reportPath)) continue;

            const logContents = await fs.readFile(reportPath, { encoding: "utf-8" });
            const seconds = _getCompileTimeSeconds(logContents);
            if (seconds === undefined) continue;

            report.maps.set(map + step, seconds);

            const mapTotal = report.totals.get(map) ?? 0;
            report.totals.set(map, mapTotal + seconds);
        }
    }

    return report;
}

function _getCompileTimeSeconds(logContents: string): number | undefined {
    const doc = kv.parseText(logContents);
    for (const root of doc.getRootItems()) {
        if (root.getKey().getUnquotedContent() !== "report") continue;

        const children = root.getChildren();
        if (!children) continue;

        for (const child of children) {
            if (child.getKey().getUnquotedContent() !== "total_seconds") continue;

            const values = child.getValues();
            if (!values || values.length < 1) continue;

            const val = values[0].getUnquotedContent();
            return Number.parseFloat(val);
        }
    }

    return undefined;
}
