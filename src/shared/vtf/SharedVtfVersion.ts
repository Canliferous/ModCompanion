export const SharedVtfVersions = {
    v74: "7.4",
    v75: "7.5",
    v76: "7.6",
} as const;
export type SharedVtfVersion = (typeof SharedVtfVersions)[keyof typeof SharedVtfVersions];
export const SharedVtfDefaultVersion = SharedVtfVersions.v76;

export function getVtfVersionName(version: SharedVtfVersion): string {
    switch (version) {
        case SharedVtfVersions.v74:
            return "7.4 (Orange Box)";
        case SharedVtfVersions.v75:
            return "7.5 (Alien Swarm)";
        case SharedVtfVersions.v76:
            return "7.6 (Strata)";
        default:
            return version;
    }
}
