export function timeMillis<T>(func: () => T): { result: T; millis: number } {
    const startTime = new Date();

    const result = func();

    const endTime = new Date();
    const totalMillis = endTime.getMilliseconds() - startTime.getMilliseconds();

    return { result, millis: totalMillis };
}

export async function timeMillisAsync<T>(func: () => Promise<T>): Promise<{ result: T; millis: number }> {
    const startTime = new Date().getTime();

    const result = await func();

    const endTime = new Date().getTime();
    const totalMillis = endTime - startTime;

    return { result, millis: totalMillis };
}
