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