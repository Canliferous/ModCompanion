export const SharedVtfCompressionMethods = {
    None: "",
    Deflate: "DEFLATE",
    Zstd: "ZSTD",
    ConsoleLzma: "CONSOLE_LZMA",
} as const;
export type SharedVtfCompressionMethod = (typeof SharedVtfCompressionMethods)[keyof typeof SharedVtfCompressionMethods];
export const SharedVtfDefaultCompressionMethod = SharedVtfCompressionMethods.Deflate;
export const SharedVtfDefaultCompressionLevel = 6;

export function getVtfCompressionMethodName(compressionMethod: SharedVtfCompressionMethod): string {
    switch (compressionMethod) {
        case SharedVtfCompressionMethods.None: {
            return "None";
        }
        case SharedVtfCompressionMethods.Deflate: {
            return "Deflate";
        }
        case SharedVtfCompressionMethods.Zstd: {
            return "ZSTD";
        }
        case SharedVtfCompressionMethods.ConsoleLzma: {
            return "LZMA (Console Only)";
        }
        default: {
            return compressionMethod;
        }
    }
}

export function isVtfCompressionMethodDisabled(compressionMethod: SharedVtfCompressionMethod): boolean {
    return compressionMethod === SharedVtfCompressionMethods.ConsoleLzma;
}
