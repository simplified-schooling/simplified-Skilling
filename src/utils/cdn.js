const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('../config/config');

// Set S3 endpoint to DigitalOcean Spaces
const spacesEndpoint = 'https://lmscontent-cdn.blr1.digitaloceanspaces.com';

// Create an S3 client
// const s3Client = new S3Client({
//   forcePathStyle: true,
//   endpoint: spacesEndpoint,
//   region: config.cdn.region,
//   credentials: {
//     accessKeyId: config.cdn.accessKey,
//     secretAccessKey: config.cdn.secreteKey,
//   },
// });
const s3Client = new S3Client({
  forcePathStyle: true,
  endpoint: spacesEndpoint,
  region: config.cdn.region || 'blr1', // Ensure REGION is set
  credentials: {
    accessKeyId: config.cdn.accessKey,
    secretAccessKey: config.cdn.secreteKey, // Fix the typo
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: 'lmscontent',
    acl: 'public-read',
    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname }); // Set any metadata you want to associate with the uploaded file
    },
    key(req, file, cb) {
      cb(null, `${Date.now().toString()}-${file.originalname}`); // Set the key (filename) for the uploaded file
    },
  }),
});

const uploadImages = (req, res, next) => {
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
  ])(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading
      return res.status(400).json({ message: 'Error uploading images', error: err });
    }
    if (err) {
      // An unknown error occurred
      return res.status(500).json({ message: 'Internal server error', error: err });
    }
    // Everything went fine
    next();
  });
};

// module.exports = uploadImages;

module.exports = { s3Client, upload, uploadImages };
