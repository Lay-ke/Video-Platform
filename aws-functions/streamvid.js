const AWS = require('aws-sdk');
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
require('dotenv').config

AWS.config.update({
  region: process.env.BUCKET_REGION,
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();
const bucket = process.env.BUCKET_NAME;

module.exports = {
  s3,
  bucket,

  async getObjectFileSize(Key) {
    try {
      const params = {
        Key: Key,
        Bucket: bucket
        
      }
      const data = this.s3.headObject(params);
      return data.ContentLength;
    } catch (error) {
      console.error("Error fetching object size:", error);
      throw error;
    }
  },

  async * initiateObjectStream(Key, start, end) {
    const streamRange = `bytes=${start}-${end}`;
    try {
      const data = await s3.getObject({ Key, Bucket: bucket, Range: streamRange }).promise();
      yield* data.Body;
    } catch (error) {
      console.error("Error initiating object stream:", error);
      throw error;
    }
  }
};

// async function createAWSStream(Key, start, end) {
//     return new Promise((resolve, reject) => {
//         const bucketParams = {
//             Bucket: process.env.BUCKET_NAME,
//             Key: Key,
//         };

//         try {
            

//             s3.headObject(bucketParams, (error, data) => {
//                 if (error) {
//                     reject(error);
//                     return;
//                 }
//                 const {ContentLength} = data
                
                
//                 const stream = new SmartStream(bucketParams, s3, ContentLength);
//                 // console.log('STREAM HERE >>>>>', stream)
//                 resolve(stream);
//             });
//         } catch (error) {
//             reject(error);
//         }
//     });
// }

// // createAWSStream()
// //     .then((result) => {
// //         console.log('Result Here >>>>>>>>>',result)
// //     }).catch((err) => {
// //         console.log('Error>>', err)
// //     });

// module.exports = createAWSStream;