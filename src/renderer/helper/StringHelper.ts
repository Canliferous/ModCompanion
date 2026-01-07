export function getCommonPrefix(strs: string[]): string {
    if (strs.length === 0) return "";
    const shortestStringLen = strs
        .map((s) => s.length)
        .reduce((prev, curr) => (curr < prev ? curr : prev), Number.MAX_VALUE);

    let prefix = "";
    for (let i = 0; i < shortestStringLen; i++) {
        let c = "";
        for (let j = 0; j < strs.length; j++) {
            const str = strs[j];
            if (j === 0) {
                c = str[i];
                continue;
            }
            if (str[i] !== c) {
                return prefix;
            }
        }

        prefix += c;
        c = "";
    }

    return prefix;
}

export function removeTrailing(str: string, char: string) {
    let end = str.length;

    for (let i = str.length - 1; i > 0; i--) {
        if (str[i] === char) {
            end--;
        } else {
            break;
        }
    }

    return str.substring(0, end);
}
