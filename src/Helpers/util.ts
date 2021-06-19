export const formUrlEncoded = (x: any) =>
    Object.keys(x).reduce((p: any, c: any) => p + `&${c}=${encodeURIComponent(x[c])}`, '')

export const messageFormatter = (
    action: 'CREATE' | 'UPDATE',
    payload: any
): string => {
    return JSON.stringify({
        action,
        payload
    })
}

export const sleep = (timeout: number) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            return resolve(null);
        }, timeout);
    });
}