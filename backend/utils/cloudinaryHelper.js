export const getPublicIdFromUrl = (url) => {
  if (!url || typeof url !== "string") return null;

  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;

    const afterUpload = parts[1];
    const segments = afterUpload.split("/");

    const startIndex = segments[0].startsWith("v") && /^v\d+$/.test(segments[0]) ? 1 : 0;
    const pathSegments = segments.slice(startIndex);

    const last = pathSegments.pop();
    const publicId = last.split(".").slice(0, -1).join(".");

    return [...pathSegments, publicId].join("/") || null;
  } catch {
    return null;
  }
};
