import { Storage } from "@google-cloud/storage";

export const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  keyFilename: "service-account.json",
});

export const UPLOAD_BUCKET_NAME = "retrosnap-raw-uploads";
export const PUBLIC_BUCKET_NAME = "retrosnap-public-feed";
