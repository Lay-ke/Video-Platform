const AWS = require('aws-sdk')
require('dotenv').config()

AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.BUCKET_REGION
});

// Create S3 service object
const s3 = new AWS.S3();

const videoBuffers = {};

async function fetchVideoFromS3(key) {
  if (videoBuffers[key]) {
    console.log(`Video "${key}" already loaded in buffer`);
    return videoBuffers[key];
  }

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: key,
  };

  try {
    const data = await s3.getObject(params).promise();
    videoBuffers[key] = data.Body;
    console.log(`Video "${key}" loaded into memory`);
    console.log('Buffers: ', videoBuffers)
    return videoBuffers[key];
  } catch (err) {
    console.error(`Error fetching video "${key}" from S3:`, err);
    throw err; // Propagate the error
  }
}
  
  
  module.exports = { fetchVideoFromS3 };