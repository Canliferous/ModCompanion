import { SharedVtfVersion, SharedVtfVersions } from "./SharedVtfVersion.js";
import { SharedVtfFilter, SharedVtfFilters } from "./SharedVtfFilter.js";
import { SharedVtfFlag } from "./SharedVtfFlag.js";
import { SharedVtfCompressionMethod, SharedVtfCompressionMethods } from "./SharedVtfCompression.js";
import { SharedVtfImageFormat, SharedVtfImageFormats } from "./SharedVtfFormat.js";
import { SharedVtfHotspotRect } from "./SharedVtfHotspotRect.js";

export interface SharedVtfCreateOptions {
    version?: SharedVtfVersion;
    format?: SharedVtfImageFormat;
    filter?: SharedVtfFilter;
    flags?: SharedVtfFlag[];
    noMips?: boolean;
    noAnimation?: boolean;
    noThumbnail?: boolean;
    compressionMethod?: SharedVtfCompressionMethod;
    compressionLevel?: number;
    bumpScale?: number;
    gammaCorrect?: boolean;

    /**
     *  The quality of DXTn/BCn format compression, between 0.0 and 1.0. Higher quality will take significantly longer to create the texture.
     *  Ignored if output format is uncompressed.
     *  default: 0.105
     */
    quality?: number;

    /**
     * Default: 2.2. This is a string and not a number because of floating point precision
     */
    gammaCorrectAmount?: string;

    hotspot?: SharedVtfHotspotRect[];
}

export type SharedVtfCreateEnumOptions =
    | typeof SharedVtfVersions
    | typeof SharedVtfImageFormats
    | typeof SharedVtfFilters
    | typeof SharedVtfCompressionMethods;

export type SharedVtfCreateNumberOptions = "compressionLevel" | "bumpScale";

export function buildMareTfCreateArgs(options: SharedVtfCreateOptions): string {
    let a = "";

    if (options.version) {
        a += ` --version ${options.version}`;
    }
    if (options.flags) {
        for (const flags of options.flags) {
            a += ` --flag ${flags}`;
        }
    }
    if (options.format) {
        a += ` --format ${options.format}`;
    }
    if (options.filter) {
        a += ` --filter ${options.filter}`;
    }
    if (options.noMips) {
        a += ` --no-mips`;
    }
    if (options.noAnimation) {
        a += ` --no-animation`;
    }
    if (options.noThumbnail) {
        a += ` --no-thumbnail`;
    }
    if (options.compressionMethod) {
        a += ` --compression-method ${options.compressionMethod}`;
    }
    if (options.compressionLevel) {
        a += ` --compression-level ${options.compressionLevel}`;
    }
    if (options.bumpScale) {
        a += ` --bump-scale ${options.bumpScale}`;
    }
    if (options.gammaCorrect) {
        a += ` --gamma-correct`;
    }
    if (options.gammaCorrectAmount) {
        a += ` --gamma-correct-amount ${options.gammaCorrectAmount}`;
    }
    if (options.quality) {
        a += ` --quality ${options.quality}`;
    }

    return a;
}
