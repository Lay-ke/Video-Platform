const { S3Client } = require('@aws-sdk/client-s3');
const SmartStream = require('./smart-stream');
const AWS = require('aws-sdk')
require('dotenv').config()

async function createAWSStream() {
    return new Promise((resolve, reject) => {
        const bucketParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: 'r6dfg50nt2qz275926m05gkfwb1wj7e8'
        };

        try {
            AWS.config.update({
                accessKeyId: process.env.ACCESS_KEY,
                secretAccessKey: process.env.SECRET_ACCESS_KEY,
                region: process.env.BUCKET_REGION
            });

            // Create S3 service object
            const s3 = new AWS.S3();

            s3.headObject(bucketParams, (error, data) => {
                if (error) {
                    reject(error);
                    return;
                }
                // getting stream from s3
                const stream = new SmartStream(bucketParams, s3, data.ContentLength);
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