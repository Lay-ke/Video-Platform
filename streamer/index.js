const { S3Client } = require('@aws-sdk/client-s3');
const SmartStream = require('./smart-stream');
const AWS = require('aws-sdk')
require('dotenv').config()

AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.BUCKET_REGION
});

// Create S3 service object
const s3 = new AWS.S3();

async function createAWSStream(Key) {
    return new Promise((resolve, reject) => {
        const bucketParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: Key
        };

        try {
            

            s3.headObject(bucketParams, (error, data) => {
                if (error) {
                    reject(error);
                    return;
                }
                const {ContentLength} = data
                
                // getting stream from s3
                // const maxLength = end - start + 1;
                const stream = new SmartStream(bucketParams, s3, ContentLength);
                // console.log('STREAM HERE >>>>>', stream)
                resolve(stream);
            });
        } catch (error) {
            reject(error);
        }
    });
}

// createAWSStream()
//     .then((result) => {
//         console.log('Result Here >>>>>>>>>',result)
//     }).catch((err) => {
//         console.log('Error>>', err)
//     });

module.exports = createAWSStream;