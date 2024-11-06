import { v2 as cloudinary } from 'cloudinary'; 

export const CloudinaryConfig = {
  cloud_name: 'dcnrj1fug',
  api_key: '754463113111354',
  api_secret: 'U6Nau91OKJpMJwyzI4bQukOLyAo',
};

cloudinary.config(CloudinaryConfig);

export { cloudinary };
