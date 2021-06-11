const AWS = require('aws-sdk');

const s3 = {};

const storage = new AWS.S3({
    accessKeyId: process.env.ACCESSKEY,
    secretAccessKey: process.env.SECRETKEY,
    region: 'ap-northeast-2'
});
const params = {
    'Bucket': process.env.BUCKET_NAME,
    'Key': '',
}

s3.storage = storage;
s3.params = params;

module.exports = s3;


