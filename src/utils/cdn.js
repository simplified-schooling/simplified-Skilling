const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('../config/config');

// Set S3 endpoint to DigitalOcean Spaces
// const spacesEndpoint = 'https://simplifiedskilling-cdn.blr1.digitaloceanspaces.com';

const spacesEndpoint = 'https://simplifiedskilling.blr1.digitaloceanspaces.com';

const s3Client = new S3Client({
  forcePathStyle: true,
  endpoint: spacesEndpoint,
  region: config.cdn.region || 'blr1', // Ensure REGION is set
  credentials: {
    accessKeyId: config.cdn.accessKey,
    secretAccessKey: config.cdn.secreteKey, // Fix the typo
  },
});


// const upload = multer({
//   storage: multerS3({
//     s3: s3Client,
//     bucket: 'simplifiedskilling',
//     acl: 'public-read',
//     metadata(req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key(req, file, cb) {
//       const safeFileName = file.originalname.replace(/\s+/g, '_'); // Replace spaces with underscores
//       cb(null, `${Date.now()}-${safeFileName}`);
//     },
//   }),
// });

// const uploadImages = (req, res, next) => {
//   upload.fields([
//     { name: 'image1', maxCount: 1 },
//     { name: 'image2', maxCount: 1 },
//   ])(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       // A Multer error occurred when uploading
//       return res.status(400).json({ message: 'Error uploading images', error: err });
//     }
//     if (err) {
//       // An unknown error occurred
//       return res.status(500).json({ message: 'Internal server error', error: err });
//     }
//     // Everything went fine
//     next();
//   });
// };

// module.exports = uploadImages;
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'simplifiedskilling',
    acl: 'public-read',
    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      const safeFileName = file.originalname.replace(/\s+/g, '_');
      cb(null, `${Date.now()}-${safeFileName}`);
    },
  }),
});

const uploadImages = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: 'Multer error', error: err });
    }
    if (err) {
      return res.status(500).json({ message: 'Unknown error', error: err });
    }
    console.log("🖼️ Uploaded files:", req.files.map(f => f.key));
    next();
  });
};
module.exports = { s3Client, upload, uploadImages };
