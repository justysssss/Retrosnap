import { Storage } from "@google-cloud/storage";


const privateKey = process.env.GOOGLE_PRIVATE_KEY
  ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;


const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
const projectId = process.env.GOOGLE_PROJECT_ID;


if (!privateKey || !clientEmail || !projectId) {
  console.warn("⚠️ Missing Google Storage credentials in environment variables.");
}


export const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials : {
    client_email: clientEmail,
    private_key: privateKey,
  }
});

export const UPLOAD_BUCKET_NAME = "retrosnap-raw-uploads";
export const PUBLIC_BUCKET_NAME = "retrosnap-public-feed";
