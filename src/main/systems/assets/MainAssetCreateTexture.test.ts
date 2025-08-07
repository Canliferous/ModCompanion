import { test, expect } from "vitest";
import { deriveTextureDisplayName, deriveTextureGameFileName } from "./MainAssetCreateTexture.js";

test("Derive texture game file name - 'materialsrc/_hr/tiles/office_tiles_01/office_tile_01_normal.png'", () => {
    expect(deriveTextureGameFileName("materialsrc/_hr/tiles/office_tiles_01/office_tile_01_normal")).toBe(
        "materials/_hr/tiles/office_tiles_01/office_tile_01_normal.vtf",
    );
});

test("Derive texture display name - 'materialsrc/_hr/tiles/office_tiles_01/office_tile_01_normal.png'", () => {
    expect(deriveTextureDisplayName("materialsrc/_hr/tiles/office_tiles_01/office_tile_01_normal")).toBe(
        "_hr/tiles/office_tiles_01/office_tile_01_normal",
    );
});
