import { SharedVtfCreateOptions } from "Shared/SharedVtf.js";
import { getAppConfig } from "~/renderer-config.js";
import { SharedVtfDefaultImageFormat } from "Shared/vtf/SharedVtfFormat.js";
import { SharedVtfDefaultVersion } from "Shared/vtf/SharedVtfVersion.js";
import { SharedVtfDefaultFilter } from "Shared/vtf/SharedVtfFilter.js";
import {
    SharedVtfDefaultCompressionLevel,
    SharedVtfDefaultCompressionMethod,
} from "Shared/vtf/SharedVtfCompression.js";

let defaults: SharedVtfCreateOptions | undefined;
export function getVtfDefaults(): SharedVtfCreateOptions {
    if (defaults) return defaults;

    defaults = getAppConfig().assetDefaults?.vtfOptions ?? {};
    if (defaults.format === undefined) defaults.format = SharedVtfDefaultImageFormat;
    if (defaults.version === undefined) defaults.version = SharedVtfDefaultVersion;
    if (defaults.filter === undefined) defaults.filter = SharedVtfDefaultFilter;
    if (defaults.compressionMethod === undefined) defaults.compressionMethod = SharedVtfDefaultCompressionMethod;
    if (defaults.compressionLevel === undefined) defaults.compressionLevel = SharedVtfDefaultCompressionLevel;
    if (defaults.bumpScale === undefined) defaults.bumpScale = 1; // TODO: Where should this be grouped??

    return defaults;
}
