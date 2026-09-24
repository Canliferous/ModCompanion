export function timeMillis<T>(func: () => T): { result: T; millis: number } {
    const startTime = Date.now();

    const result = func();

    const endTime = Date.now();
    const totalMillis = endTime - startTime;

    return { result, millis: totalMillis };
}

export async function timeMillisAsync<T>(func: () => Promise<T>): Promise<{ result: T; millis: number }> {
    const startTime = Date.now();

    const result = await func();

    const endTime = Date.now();
    const totalMillis = endTime - startTime;

    return { result, millis: totalMillis };
}
