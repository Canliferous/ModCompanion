import { expect, test } from "vitest";
import { getCommonPrefix, removeTrailing } from "~/helper/StringHelper.js";

test("Common Prefix empty array", () => {
    const prefix = getCommonPrefix([]);
    expect(prefix).toBe("");
});
test("Common Prefix empty strings", () => {
    const prefix = getCommonPrefix(["", "", ""]);
    expect(prefix).toBe("");
});
test("Common Prefix all same", () => {
    const prefix = getCommonPrefix(["aaaa", "aaaa", "aaaa"]);
    expect(prefix).toBe("aaaa");
});
test("Common Prefix one has more", () => {
    const prefix = getCommonPrefix(["aaaa", "aaaa", "aaaaa"]);
    expect(prefix).toBe("aaaa");
});
test("Common Prefix same length but different", () => {
    const prefix = getCommonPrefix(["aaaa", "aaaa", "aaba"]);
    expect(prefix).toBe("aa");
});
test("Common Prefix texture names", () => {
    const prefix = getCommonPrefix([
        "_hr/glass/glass_01_color",
        "_hr/glass/glass_01_normal",
        "_hr/glass/glass_01_mrao",
    ]);
    expect(prefix).toBe("_hr/glass/glass_01_");
});

test("Remove trailing underscore", () => {
    expect(removeTrailing("_hr/glass/glass_01_color_", "_")).toBe("_hr/glass/glass_01_color");
    expect(removeTrailing("_hr/glass/glass_01_color___", "_")).toBe("_hr/glass/glass_01_color");
});
test("Remove trailing empty", () => {
    expect(removeTrailing("_hr/glass/glass_01_color_", "")).toBe("_hr/glass/glass_01_color_");
});
