const AWS = require('aws-sdk');

const storage = new AWS.S3({
    accessKeyId: process.env.ACCESSKEY,
    secretAccessKey: process.env.SECRETKEY,
    region: 'ap-northeast-2'
});

const params = {
    'Bucket': process.env.BUCKET_NAME,
    'Key': '',
    'Body': null,
    'ACL': 'public-read'
}

const s3 = {};
s3.storage = storage;
s3.params = params;

module.exports = s3;


