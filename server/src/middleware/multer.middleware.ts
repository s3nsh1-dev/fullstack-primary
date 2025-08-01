import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    /**
     * ✅ Yes, adding a unique suffix prevents overwriting when multiple users upload
     * files with the same name.
     *
     * ⚠️ Small Note:
     * If you only use `file.originalname`, two files with identical names can overwrite each other before Cloudinary gets them.
     * Even if you delete files quickly, there's a small race condition risk (two uploads at the same time).
     * So adding a unique name is safer in production.
     *
     * Example:
     * const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
     * cb(null, uniqueSuffix + "-" + file.originalname);
     *
     * ✅ unlink (in cloudinary.ts) deletes the file after successful
     * upload to free space on your server.
     *
     * We do it later
     */
    cb(null, file.originalname);
  },
});

export const upload = multer({ storage });
