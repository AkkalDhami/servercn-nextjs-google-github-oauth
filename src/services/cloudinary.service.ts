import cloudinary from "@/configs/cloudinary";
import { DeleteApiResponse } from "cloudinary";

export type CloudinaryResourceType = "image" | "video" | "raw" | "auto";

export interface UploadOptions {
  folder: string;
  resource_type?: CloudinaryResourceType;
}

export interface CloudinaryUploadResult {
  url: string;
  public_id: string;
  size: number;
}

export const uploadToCloudinary = (
  buffer: Buffer,
  options: UploadOptions
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || "uploads",
        resource_type: options.resource_type || "auto"
      },
      (error, result) => {
        if (error || !result) {
          return reject(error);
        }
        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          size: result.bytes
        });
      }
    );

    stream.end(buffer);
  });
};


export const deleteFilesFromCloudinary = (
  publicIds: string[]
): Promise<DeleteApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.api.delete_resources(publicIds, (error, result) => {
      if (error) {
        return reject(error);
      }

      if (!result) {
        return reject(new Error("Failed to delete files."));
      }

      resolve(result);
    });
  });
};

export const deleteFileFromCloudinary = (
  publicId: string
): Promise<DeleteApiResponse> => {
  return deleteFilesFromCloudinary([publicId]);
};
