import { ipcMain } from "electron";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import * as kv from "@sourcelib/kv";

import * as Core from "mod_companion_core";
import * as Shared from "mod_companion_shared";

export function registerMapTimeReportApi(): boolean {
    ipcMain.handle(Shared.Ipc.Channels.MapCreateTimeReport, (e, maps: string[]) =>
        _createTimeReport(maps),
    );
    return true;
}

const reportExtensions: Shared.Map.CompileStep[] = [
    Shared.Map.CompileStep.VBsp,
    Shared.Map.CompileStep.VVis,
    Shared.Map.CompileStep.VRad,
];

function _getReportExtension(step: Shared.Map.CompileStep) {
    switch (step) {
        case Shared.Map.CompileStep.VBsp:
            return ".report_vbsp.vdf";
        case Shared.Map.CompileStep.VVis:
            return ".report_vvis.vdf";
        case Shared.Map.CompileStep.VRad:
            return ".report_vrad.vdf";
        default:
            return undefined;
    }
}

async function _createTimeReport(maps: string[]): Promise<Shared.Map.TimeReport> {
    const config = Core.ConfigSystem.getAppConfig();

    const srcPath = config.mapSourcePath;

    const report: Shared.Map.TimeReport = {
        maps: new Map<string, number>(),
        totals: new Map<string, number>(),
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
