// Builds a Cloudinary delivery URL from a stored public_id. Cloud name is
// not a secret (it's part of every delivery URL), so it's safe as a
// NEXT_PUBLIC_ var and usable in both server and client components.
export function cloudinaryUrl(
  publicId: string,
  { width, quality = "auto", format = "auto" }: { width?: number; quality?: string | number; format?: string } = {}
) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set.");
  }

  const transforms = ["f_" + format, "q_" + quality];
  if (width) transforms.push("w_" + width);

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transforms.join(",")}/${publicId}`;
}
