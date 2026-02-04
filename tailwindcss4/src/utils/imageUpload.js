import {
  CLOUDINARY_UPLOAD_URL,
  CLOUDINARY_UPLOAD_PRESET,
} from "./cloudinary";

// blob URL → File
export async function blobUrlToFile(blobUrl) {
  const res = await fetch(blobUrl);
  const blob = await res.blob();
  return new File([blob], "snippix-image.webp", { type: blob.type });
}

// compress image
export async function compressImage(file, quality = 0.8) {
  const img = await createImageBitmap(file);
  const canvas = document.createElement("canvas");

  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(blob), "image/webp", quality)
  );
}

// upload
export async function uploadImageToCloudinary(blob) {
  const formData = new FormData();
  formData.append("file", blob);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  return data.secure_url;
}
