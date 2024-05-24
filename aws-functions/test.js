const S3Client = require('./streamvid')



// try {
//     const file_s = S3Client.getObjectFileSize('r6dfg50nt2qz275926m05gkfwb1wj7e8');
//     console.log('Here >>>>>>>>', file_s);
// } catch (error) {
//     console.log(error)
// }
// var position = 0

// const displayCurrent = () => {
//     return position
// }


// position++
// position++
// console.log(displayCurrent())

// console.log(position)

const videos = [
    {
        _id: '6646ac6b0eb8f4a247caf649',
        videoKey: '52zr43zj3kp3b3snta08u6aczxxyu9k13',
        title: 'Longer Tin',
        description: 'The very tall boy embarked on an adventurous journey strengthening him in all aspects of physique.',
        adminID: '6634da46657868f856063c2b',
        uploadDate: '2024-05-17T01:01:31.887Z',
        __v: 0
    },
    {
        _id: '454346ac6b0eb8f4a247caf649',
        videoKey: '52zr43zj3kpb3snta08u6aczxxyu9k13',
        title: 'Partttts',
        description: 'The very tall boy embarked on an adventurous journey strengthening him in all aspects of physique.',
        adminID: '6634da46657868f856063c2b',
        uploadDate: '2024-05-17T01:01:31.887Z',
        __v: 0
    }
]

// console.log(videos.videoKey[1]);

const vidIndex = videos.findIndex(video => video.videoKey === '52zr43zj3kpb3snta08u6aczxxyu9k13')
console.log(vidIndex)