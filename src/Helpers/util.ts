export const formUrlEncoded = (x: any) =>
    Object.keys(x).reduce((p: any, c: any) => p + `&${c}=${encodeURIComponent(x[c])}`, '')

