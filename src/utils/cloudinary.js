import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

const getPublicIdFromUrl = (cloudinaryUrl) => {
  if (!cloudinaryUrl) return null;

  try {
    const url = new URL(cloudinaryUrl);
    const pathname = url.pathname;
    const parts = pathname.split("/");

    const uploadIndex = parts.findIndex((part) => part === "upload");
    const publicIdParts = parts.slice(uploadIndex + 2);

    const filename = publicIdParts.join("/");
    const publicId = filename.replace(/\.[^/.]+$/, "");
    return publicId;
  } catch (err) {
    console.error("Invalid Cloudinary URL", err);
    return null;
  }
};

const deleteFromCloudinary = async (cloudinaryUrl) => {
  const publicId = getPublicIdFromUrl(cloudinaryUrl);
  if (!publicId) return null;

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    return result;
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
