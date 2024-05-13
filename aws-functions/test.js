const S3Client = require('./streamvid')



try {
    const file_s = S3Client.getObjectFileSize('r6dfg50nt2qz275926m05gkfwb1wj7e8');
    console.log('Here >>>>>>>>', file_s);
} catch (error) {
    console.log(error)
}