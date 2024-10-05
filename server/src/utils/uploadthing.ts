import { randomUUID } from "crypto";
import { createUploadthing, type FileRouter } from "uploadthing/express";
import { UTApi } from "uploadthing/server";

const f = createUploadthing();

export const uploadRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 4,
    },
  }).onUploadComplete((data) => {
    console.log("upload completed", data);
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;

export async function uploadFile(files: Express.Multer.File[]) {
  if (files && files.length > 0) {
    const utapi = new UTApi();
    const logo = files[0];
    const metadata = {};
    const uploadResponse = await utapi.uploadFiles(
      new File([logo.buffer], logo.originalname),
      { metadata }
    );
    if (uploadResponse.error) {
      console.error("error", uploadResponse.error);
      throw new Error("There was an issue with adding file.");
    }
    return {
      key: uploadResponse.data.key,
      url: uploadResponse.data.url,
      name: uploadResponse.data.name,
    };
  }
}

export async function updateFiles(key: string, files: Express.Multer.File[]) {
  if (files && files.length > 0) {
    const utapi = new UTApi();
    const logo = files[0];
    const metadata = {};
    const deleteOldFileResponse = await utapi.deleteFiles(key);
    if (deleteOldFileResponse.success === false) {
      throw new Error("There was an issue with deleting file.");
    }
    const uploadResponse = await utapi.uploadFiles(
      new File([logo.buffer], logo.originalname),
      { metadata }
    );
    if (uploadResponse.error) {
      console.error("error", uploadResponse.error);
      throw new Error("There was an issue with adding file.");
    }
    return {
      key: uploadResponse.data.key,
      url: uploadResponse.data.url,
      name: uploadResponse.data.name,
    };
  }
}

export async function deleteFile(key: string) {
  const utapi = new UTApi();
  const deleteResponse = await utapi.deleteFiles(key);
  if (deleteResponse.success === false) {
    throw new Error("There was an issue with deleting file.");
  }
  return deleteResponse;
}
