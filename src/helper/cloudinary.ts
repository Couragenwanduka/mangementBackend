import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  folder: string
): Promise<UploadApiResponse> => {
  try {
    // Upload the image to Cloudinary
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) {
            reject(error); // Reject if error occurs during upload
          }
          resolve(result as UploadApiResponse); // Resolve with the result
        }
      );
      stream.end(fileBuffer); // End the stream with the image buffer
    });
    return result;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Error uploading image to Cloudinary');
  }
};
