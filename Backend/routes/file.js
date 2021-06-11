const express = require('express');
const router = express.Router();

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const s3 = require('../config/s3');

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

const { File } = require('../models/models');
const iconv = require('iconv-lite');

router.post('/upload', upload.single('file'), (req, res)=>{
    /*  #swagger.tags = ['File']
        #swagger.path = '/file/upload' */
    const storage = s3.storage;
    const s3Params = s3.params;

    const file = req.file;
    const originalname = iconv.decode(file.originalname, 'euc-kr');

    console.log(originalname);

    const savedName = moment().format('hh-mm-ss') + originalname;

    const uploadedFile = new File({
        originalName: originalname,
        savedName: savedName
    });
    uploadedFile.save((err)=>{
        if (err) return res.status(500).json(err);
    })

    s3Params.Key = savedName;
    s3Params.Body = file.buffer;
    s3Params.ACL = 'public-read';

    console.log(s3Params);

    storage.upload(s3Params, (err, data)=>{
        if (err) return res.status(500).json(err);

        res.status(201).json(data);
    })
});

router.get('/read/:id', (req, res)=>{
    /*  #swagger.tags = ['File']
        #swagger.path = '/file/read/{id}' */
    const storage = s3.storage;
    const s3Params = s3.params;

    File.findOne({ _id: req.params.id }, (err, file)=>{
        if (err) return res.status(500).json(err);

        s3Params.Key = file.savedName;

        storage.getSignedUrl('getObject', s3Params, (err, data)=>{
            if (err) return res.status(500).json(err);

            res.status(200).json({
                url: data
            });
        })
    })
})

module.exports = router;