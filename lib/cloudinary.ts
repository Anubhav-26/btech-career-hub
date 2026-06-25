
import { v2 as cloudinary } from "cloudinary";

console.log("=================================");
console.log("CLOUDINARY CHECK");
console.log("NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("KEY:", process.env.CLOUDINARY_API_KEY);
console.log(
  "SECRET:",
  process.env.CLOUDINARY_API_SECRET ? "FOUND" : "MISSING"
);
console.log("=================================");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Signs an upload so the browser can PUT the file straight to Cloudinary,
 * never proxying file bytes through a Vercel serverless function.
 */
export function signUpload(folder = "btech-career-hub/resources") {
  const timestamp = Math.round(Date.now() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET as string
  );

  return {
    timestamp,
    signature,
    folder,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  };
}

export { cloudinary };