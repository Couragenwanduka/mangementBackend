import multer from 'multer';

// Memory storage for direct buffer access
const storage = multer.memoryStorage();

// File filter (still useful for validating types)
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// File size limit (optional)
const limits = {
  fileSize: 10 * 1024 * 1024 // 10MB
};

export const upload = multer({
  storage,
  fileFilter,
  limits
});
