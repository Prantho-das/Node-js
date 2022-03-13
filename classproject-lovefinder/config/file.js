import multer from "multer";
import path from "path"
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("./public/assets/upload"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage });

export default upload;