// Must mirror basePath in next.config.ts. Used to prefix asset paths that
// Next does not rewrite automatically (e.g. plain <img src> to /public files).
export const basePath =
  process.env.NODE_ENV === "production" ? "/tractor" : "";

export const asset = (p: string) => `${basePath}${p}`;
