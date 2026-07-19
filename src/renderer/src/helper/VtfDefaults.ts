import { getAppConfig } from "~/renderer-config.js";
import * as Shared from "mod_companion_shared";

let defaults: Shared.Vtf.SharedVtfCreateOptions | undefined;
export function getVtfDefaults(): Shared.Vtf.SharedVtfCreateOptions {
    if (defaults) return defaults;

    defaults = getAppConfig().assetDefaults?.vtfOptions ?? {};
    if (defaults.format === undefined) defaults.format = Shared.Vtf.SharedVtfDefaultImageFormat;
    if (defaults.version === undefined) defaults.version = Shared.Vtf.SharedVtfDefaultVersion;
    if (defaults.filter === undefined) defaults.filter = Shared.Vtf.SharedVtfDefaultFilter;
    if (defaults.compressionMethod === undefined)
        defaults.compressionMethod = Shared.Vtf.SharedVtfDefaultCompressionMethod;
    if (defaults.compressionLevel === undefined)
        defaults.compressionLevel = Shared.Vtf.SharedVtfDefaultCompressionLevel;
    if (defaults.bumpScale === undefined) defaults.bumpScale = 1; // TODO: Where should this be grouped??

    return defaults;
}
