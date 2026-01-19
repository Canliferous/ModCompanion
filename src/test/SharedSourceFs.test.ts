import { expect, test } from "vitest";
import {
    forwardSlashed,
    getGameOrContentRelativePath,
    getRelativePath,
    isRelativeToRoot,
} from "../shared/SharedSourceFs";

test("getRelativePath - content/revolution/materialsrc/dev/test.png", () => {
    expect(getRelativePath("content/revolution/materialsrc/dev/test.png", "P:\\", "content", "revolution")).toBe(
        "materialsrc/dev/test.png",
    );
});

test("getRelativePath - materialsrc/dev/test.png", () => {
    expect(getRelativePath("materialsrc/dev/test.png", "P:\\", "content", "revolution")).toBe(
        "materialsrc/dev/test.png",
    );
});

test("getRelativePath - P:/content/revolution/materialsrc/dev/test.png", () => {
    expect(
        getRelativePath(
            "P:/content/revolution/materialsrc/dev/test.png",
            "P:\\content\\revolution",
            "content",
            "revolution",
        ),
    ).toBe("materialsrc/dev/test.png");
});

test("forwardSlashed - P:\\content/revolution\\materialsrc/dev\\test.png", () => {
    expect(forwardSlashed("P:\\content/revolution\\materialsrc/dev\\test.png")).toBe(
        "P:/content/revolution/materialsrc/dev/test.png",
    );
});

test("isRelativeToRoot - true content/revolution/materialsrc/dev/test.png", () => {
    expect(isRelativeToRoot("content/revolution/materialsrc/dev/test.png", "revolution")).toBeTruthy();
});

test("isRelativeToRoot - true game/revolution/materials/dev/test.vtf", () => {
    expect(isRelativeToRoot("game/revolution/materials/dev/test.vtf", "revolution")).toBeTruthy();
});

test("isRelativeToRoot - false materials/dev/test.vtf", () => {
    expect(isRelativeToRoot("materials/dev/test.vtf", "revolution")).toBeFalsy();
});

test("isRelativeToRoot - false P:\\content/revolution\\materialsrc/dev\\test.png", () => {
    expect(isRelativeToRoot("P:\\content/revolution\\materialsrc/dev\\test.png", "revolution")).toBeFalsy();
});

test("getGameOrContentRelativePath - P:/content/revolution/materialsrc/dev/test.png", () => {
    expect(getGameOrContentRelativePath("P:/content/revolution/materialsrc/dev/test.png", "revolution", "P:\\")).toBe(
        "materialsrc/dev/test.png",
    );
});

test("getGameOrContentRelativePath - content/revolution/materialsrc/dev/test.png", () => {
    expect(getGameOrContentRelativePath("content/revolution/materialsrc/dev/test.png", "revolution", "P:\\")).toBe(
        "materialsrc/dev/test.png",
    );
});

test("getGameOrContentRelativePath - game/revolution/materials/dev/test.png", () => {
    expect(getGameOrContentRelativePath("game/revolution/materials/dev/test.vtf", "revolution", "P:\\")).toBe(
        "materials/dev/test.vtf",
    );
});

test("getGameOrContentRelativePath - P:/game/revolution/materials/dev/test.png", () => {
    expect(getGameOrContentRelativePath("P:/game/revolution/materials/dev/test.vtf", "revolution", "P:\\")).toBe(
        "materials/dev/test.vtf",
    );
});

test("getGameOrContentRelativePath - content/revolution/materialsrc/_hr/models/props_office/lab_copy_machine/lab_copy_machine_normal.png", () => {
    expect(
        getGameOrContentRelativePath(
            "content/revolution/materialsrc/_hr/models/props_office/lab_copy_machine/lab_copy_machine_normal.png",
            "revolution",
            "P:\\",
        ),
    ).toBe("materialsrc/_hr/models/props_office/lab_copy_machine/lab_copy_machine_normal.png");
});
