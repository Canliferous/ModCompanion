import { ipcMain } from "electron";
import { SharedIpcChannels } from "Shared/SharedIpcChannels.js";
import { SharedMapTimeReport } from "Shared/SharedMapTimeReport.js";
import { getAppConfig } from "../systems/MainConfigSystem.js";
import { SharedMapPath } from "Shared/SharedMapPath.js";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { SharedSeconds } from "Shared/SharedTypes.js";
import * as kv from "@sourcelib/kv";
import { SharedMapCompileStep } from "Shared/SharedMapCompile.js";

export function registerMapTimeReportApi(): boolean {
    ipcMain.handle(SharedIpcChannels.MapCreateTimeReport, (e, maps: SharedMapPath[]) => _createTimeReport(maps));
    return true;
}

const reportExtensions: SharedMapCompileStep[] = [
    SharedMapCompileStep.VBsp,
    SharedMapCompileStep.VVis,
    SharedMapCompileStep.VRad,
];

function _getReportExtension(step: SharedMapCompileStep) {
    switch (step) {
        case SharedMapCompileStep.VBsp:
            return ".report_vbsp.vdf";
        case SharedMapCompileStep.VVis:
            return ".report_vvis.vdf";
        case SharedMapCompileStep.VRad:
            return ".report_vrad.vdf";
        default:
            return undefined;
    }
}

async function _createTimeReport(maps: SharedMapPath[]): Promise<SharedMapTimeReport> {
    const config = getAppConfig();

    const srcPath = config.mapSourcePath;

    const report: SharedMapTimeReport = {
        maps: new Map<string, SharedSeconds>(),
        totals: new Map<SharedMapPath, SharedSeconds>(),
    };

    for (const map of maps) {
        for (const step of reportExtensions) {
            const extension = _getReportExtension(step);
            if (!extension) continue;

            const reportPath = path.join(srcPath, map.replace(".vmf", extension));

            if (!existsSync(reportPath)) continue;

            const logContents = await fs.readFile(reportPath, { encoding: "utf-8" });
            const time = _getCompileTime(logContents);
            if (time === undefined) continue;

            report.maps.set(map + step, time);

            const mapTotal = report.totals.get(map) ?? 0;
            report.totals.set(map, mapTotal + time);
        }
    }

    return report;
}

function _getCompileTime(logContents: string): SharedSeconds | undefined {
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
