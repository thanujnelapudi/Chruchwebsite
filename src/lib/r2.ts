export const R2_URL = import.meta.env?.R2_PUBLIC_URL ?? "https://pub-c0ea559d9e3b44439fe9f2006b1ea8bb.r2.dev";
export const r2Asset = (path: string) => `${R2_URL}/${path}`;
