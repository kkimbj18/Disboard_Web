const express = require('express');
const router = express.Router();

const { LectureNote } = require('../models/models');
const { auth, professorAuth } = require('../middleware/authentication');

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

router.get('/get/subject/:id', auth, (req, res)=>{
     /*  #swagger.tags = ['LectureNote']
        #swagger.path = '/lectureNote/get/subject/{id}' 
        #swagger.responses[200] = {
            description: '해당 과목의 강의노트들을 성공적으로 가져올 경우',
            schema: {
                success: true,
                lectureNotes: [{
                    _id: 0,
                    subject: { $ref: "#/definitions/subject" },
                    title: '아니 인공지능',
                    content: '아니 인공지능 성적 언제 나옴???',
                    date: '2021-05-05T15:38:19.424Z',
                    comments: [{
                        user: { $ref: "#/definitions/user" },
                        content: '진심 몇 일째냐고~~~~~',
                        date: '2021-05-05T15:40:19.424Z'
                    }],
                    emotions: [{
                        user: 0,
                        emotion: 'angry'
                    }]
                }]
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        } */
    LectureNote.find({ subject: req.params.id }).sort({date: -1}).populate({
        path: 'comments',
        populate: {
            path: 'user',
            model: 'user'
        }
    }).exec((err, lectureNotes)=>{
        if (err) return res.status(500).json(err);

        const lectureNoteArray = [];

        lectureNotes.forEach((lectureNote)=>{
            const lectureNoteForm = {
                id: lectureNote._id,
                title: lectureNote.title,
                content: lectureNote.content,
                file: lectureNote.file,
                date: lectureNote.date,
                comments: lectureNote.comments,
                emotions: lectureNote.emotions
            }
            lectureNoteArray.push(lectureNoteForm);
        })

        res.status(200).json({
            success: true,
            lectureNotes: lectureNoteArray
        })
    })
})

router.get('/get/:id', auth, (req, res)=>{
     /*  #swagger.tags = ['LectureNote']
        #swagger.path = '/lectureNote/get/{id}' 
        #swagger.responses[200] = {
            description: '해당 강의노트를 성공적으로 받아올 경우',
            schema: {
                success: true,
                lectureNote: {
                    _id: 0,
                    subject: { $ref: "#/definitions/subject" },
                    title: '아~ 이제 이거 너무 귀찮은데',
                    content: '그래도 해야겠지ㅠ',
                    date: '2021-05-05T15:38:19.424Z',
                    comments: [{
                        user: { $ref: "#/definitions/user" },
                        content: 'ㅋㅋ',
                        date: '2021-05-05T15:40:19.424Z'
                    }],
                    emotions: [{
                        user: 1,
                        emotion: 'smile'
                    }]
                }
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
        #swagger.responses[404] = {
            description: '해당하는 강의노트가 존재하지 않을 경우',
            schema: {
                success: false,
                existLectureNote: false
            }
        } */
    LectureNote.findOne({ _id: req.params.id }).populate('subject').populate({
        path: 'comments',
        populate: {
            path: 'user',
            model: 'user'
        }
    }).exec((err, lectureNote)=>{
        if (err) return res.status(500).json(err);
        if (lectureNote === null) return res.status(404).json({
            success: false,
            existLectureNote: false
        })

        res.status(200).json({
            success: true,
            lectureNote: lectureNote
        })
    })
})

router.post('/create', professorAuth, (req, res)=>{
     /*  #swagger.tags = ['LectureNote']
        #swagger.path = '/lectureNote/create' 
        #swagger.responses[201] = {
            description: '정상적으로 강의노트를 생성했을 경우',
            schema: {
                success: true,
                lectureNote: {
                    _id: 0,
                    subject: 0,
                    title: '오늘은 여기까지만...',
                    content: '힘들드아',
                    file: 0,
                    date: '2021-05-05T15:38:19.424Z',
                    comments: [],
                    emotions: []
                }
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
        #swagger.responses[403] = {
            description: 'type이 professor가 아닌 경우',
            schema: { $ref: "#/definitions/proAuthFailed" }
        }
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            schema: {
                subject: 0,
                title: '오늘은 여기까지만...',
                content: '힘들드아',
                file: 0,
            }
        } */
    console.log(moment());
    
    const lectureNote = new LectureNote({
        subject: req.body.subject,
        title: req.body.title,
        content: req.body.content,
        file: req.body.file,
        date: moment()
    });
    lectureNote.save((err, doc)=>{
        if (err) return res.status(500).json(err);

        res.status(201).json({
            success: true,
            lectureNote: doc
        })
    })
})

router.put('/update', professorAuth, (req, res)=>{
    /*  #swagger.tags = ['LectureNote']
        #swagger.path = '/lectureNote/update' 
         #swagger.responses[200] = {
            description: '정상적으로 공지를 수정했을 경우',
            schema: {
                success: true,
                lectureNote: {
                    _id: 0,
                    subject: 0,
                    title: '오늘은 여기까지만...',
                    content: '힘들드아',
                    file: 0,
                    date: '2021-05-05T15:38:19.424Z',
                    comments: [],
                    emotions: []
                }
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
        #swagger.responses[403] = {
            description: 'type이 professor가 아닌 경우',
            schema: { $ref: "#/definitions/proAuthFailed" }
        }
        #swagger.responses[404] = {
            description: '해당 lectureNote가 존재하지 않는 경우',
            schema: {
                success: false,
                existLectureNote: false
            }
        }
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            schema: {
                id: 0,
                title: '오늘은 여기까지만...',
                content: '힘들드아',
                file: 0
            }
        } */
    LectureNote.findOneAndUpdate({ _id: req.body.id }, {
        title: req.body.title,
        content: req.body.content,
        file: req.body.file
    }, { new: true }, (err, lectureNote)=>{
        if (err) return res.status(500).json(err);
        if (lectureNote === null) return res.status(404).json({
            success: false,
            existLectureNote: false
        })

        res.status(200).json({
            success: true,
            lectureNote: lectureNote
        })
    })
})

router.delete('/delete/:id', professorAuth, (req, res)=>{
    /*  #swagger.tags = ['LectureNote']
        #swagger.path = '/lectureNote/delete/{id}' 
         #swagger.responses[200] = {
            description: '정상적으로 공지를 삭제했을 경우',
            schema: {
                success: true
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
        #swagger.responses[403] = {
            description: 'type이 professor가 아닌 경우',
            schema: { $ref: "#/definitions/proAuthFailed" }
        }
        #swagger.responses[404] = {
            description: '해당 lectureNote가 존재하지 않는 경우',
            schema: {
                success: false,
                existLectureNote: false
            }
        } */
    LectureNote.findOneAndDelete({ _id: req.params.id }, (err, lectureNote)=>{
        if (err) return res.status(500).json(err);
        if (lectureNote === null) return res.status(404).json({
            success: false,
            existLectureNote: false
        })

        res.status(200).json({
            success: true
        })
    })
})

module.exports = router;