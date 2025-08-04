export const SharedVtfCompressionMethods = {
    Deflate: "DEFLATE",
    Zstd: "ZSTD",
    ConsoleLzma: "CONSOLE_LZMA",
} as const;
export type SharedVtfCompressionMethod = (typeof SharedVtfCompressionMethods)[keyof typeof SharedVtfCompressionMethods];
export const SharedVtfDefaultCompressionMethod = SharedVtfCompressionMethods.Deflate;
