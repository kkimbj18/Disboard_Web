const AWS = require('aws-sdk');

const s3 = {};

const storage = new AWS.S3({
    accessKeyId: process.env.ACCESSKEY,
    secretAccessKey: process.env.SECRETKEY,
    region: 'ap-northeast-2'
});
const uploadParams = {
    'Bucket': process.env.BUCKET_NAME,
    'ACL': '',
    'Body': null,
    'Key': ''
}
const readParams = {
    'Bucket': process.env.BUCKET_NAME,
    'Key': ''
}

s3.storage = storage;
s3.params = uploadParams;
s3.readParams = readParams;

module.exports = s3;


