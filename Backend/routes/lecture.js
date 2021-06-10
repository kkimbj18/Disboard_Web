const express = require('express');
const router = express.Router();

const { Subject, Lecture } = require('../models/subjects');
const { Chatting } = require('../models/models');
const { auth, professorAuth } = require('../middleware/authentication');

const moment = require('moment');
const { User } = require('../models/users');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

// 수업 시작하기
router.post('/start', professorAuth, (req, res)=>{
    /*  #swagger.tags = ['Lecture']
        #swagger.path = '/lecture/start' 
        #swagger.description = 'lecture의 status는 inProgress/done으로 나뉨'
        #swagger.responses[201] = {
            description: '성공적으로 수업을 시작한 경우',
            schema: {
                success: true,
                lecture: { 
                    $ref: "#/definitions/lecture",
                    status: 'inProgress',
                    students: [],
                    chatting: []
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
            description: 'subjectId, 옵션만 지정하면 나머지는 기본 값으로 할당되어 저장됨',
            schema: {
                $subjectId: 0,
                $options: {
                    $subtitle: false,
                    $record: false,
                    $attendance: false,
                    $limit: 5
                }
            }
        } */
    Subject.findOne({ _id: req.body.subjectId }, (err, subject)=>{
        if (err) return res.status(500).json(err);

        const today = moment();

        const studentsForm = subject.students.map((element)=>{
            return {
                student: element,
                attendance: 'X'
            }
        });

        const lectureForm = {
            date: today.format('YYYY-MM-DD'),
            status: 'inProgress',
            start_time: today.format('HH:mm'),
            subject: subject._id,
            options: {
                subtitle: req.body.options.subtitle,
                record: req.body.options.record,
                attendance: req.body.options.attendance,
                limit: req.body.options.limit
            },
            students: studentsForm
        };

        const lecture = new Lecture(lectureForm);

        const promise = ()=>{
            return new Promise((resolve, reject)=>{
                lecture.save((err, lecture)=>{
                    if (err) reject(err);

                    subject.lectures.push(lecture._id);
                    resolve(lecture);
                })
            })
        }
        
        promise().then((lecture)=>{
            subject.save(()=>{
                res.status(201).json({
                    success: true,
                    lecture: lecture
                })
            })
        }).catch((err)=>{
            res.status(500).json(err);
        })
    })
});

// 수업 종료하기
router.put('/close', professorAuth, (req, res)=>{
    /*  #swagger.tags = ['Lecture']
        #swagger.path = '/lecture/close' 
        #swagger.responses[200] = {
            description: 'success, lecture 객체 반환',
            schema: {
                success: true,
                lecture: { 
                    $ref: "#/definitions/lecture",
                    status: 'done',
                    end_time: '12:00',
                    students: [{
                        student: 0,
                        attendance: 'O'
                    }]
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
            schema: { $ref: "#/definitions/closeLecture" }
        } */
    const chatting = new Chatting({
        lecture: req.body.lectureId,
        chat: req.body.chatting
    });
    chatting.save((err, doc)=>{
        if (err) return res.status(500).json(err);

        Lecture.findOneAndUpdate({ _id: req.body.lectureId }, {
            status: 'done',
            end_time: moment().format('HH:mm'),
            chatting: doc._id
        }, { new: true }, (err, lecture)=>{
            if (err) return res.status(500).json(err);
    
            const lectureForm = {
                date: lecture.date,
                status: lecture.status,
                start_time: lecture.start_time,
                end_time: lecture.end_time,
                subject: lecture.subject,
                options: lecture.options,
                students: lecture.students
            }
            res.status(200).json({
                success: true,
                lecture: lectureForm
            });
        })
    })
});

// 현재 진행중인 수업이 있는지 확인
router.put('/get/inProgress', auth, (req, res)=>{
    /*  #swagger.tags = ['Lecture']
        #swagger.path = '/lecture/get/inProgress' 
        #swagger.description = '현재 진행중인 수업이 있으면 어떤 수업이든 받아오기',
        #swagger.responses[200] = {
            description: '진행중인 수업이 있는 경우,
            \n진행중인 수업이 없는 경우',
            schema: {
                있음: {
                    success: true,
                    lecture: {
                        $ref: "#/definitions/lecture",
                        subject: { $ref : "#/definitions/subject "},
                        students: [],
                        chatting: []
                    }
                },
                없음: {
                    success: false,
                    existInProgressLecture: false
                }
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
    */
    User.findOne({ _id: req.session._id }, (err, user)=>{
        if (err) return res.status(500).json(err);

        Lecture.findOne({ 
            status: 'inProgress',
            subject: { $in: user.subjects }
        }).populate('subject').exec((err, lecture)=>{
            if (err) return  res.status(500).json(err);
    
            if (lecture === null) {
                res.status(200).json({
                    success: false,
                    existInProgressLecture: false
                });
            }
            else {
                res.status(200).json({
                    success: true,
                    lecture: lectures[0]
                });
            }
        });
    })
});

// 해당 과목의 현재 진행중인 수업 받아오기
router.get('/get/inProgress/subject/:id', auth, (req, res)=>{
    /*  #swagger.tags = ['Lecture']
        #swagger.path = '/lecture/get/inProgress/subject/{id}' 
        #swagger.responses[200] = {
            description: '해당 과목에 현재 진행중인 수업이 있을 경우
                \n해당 과목에 현재 진행중인 수업이 없을 경우',
            schema: {
                있음: {
                    success: true,
                    lecture: {
                        $ref: "#/definitions/lecture",
                        students: [],
                        chatting: [],
                    }
                },
                없음: {
                    success: false,
                    existInProgressLecture: false
                }
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        } */
    Subject.findOne({ _id: req.body.subjectId }).populate('lectures').exec((err, subject)=>{
        if (err) res.status(500).json(err);

        for (let i = subject.lectures.length; i >= 0; i--) {
            if (subject.lectures[i].status === 'inProgress') {
                return res.status(200).json({
                    success: true,
                    lecture: subject.lectures[i]
                });
            }
        }

        res.status(200).json({
            success: false,
            existInProgressLecture: false
        });
    });
});

// lectureId로 수업 참가
router.put('/join/:id', auth, (req, res)=>{
    /*  #swagger.tags = ['Lecture']
        #swagger.path = '/lecture/join/{id}' 
        #swagger.description = 'lectureId로 수업 참가',
        #swagger.responses[200] = {
            description: '수업에 정상적으로 참가한 경우',
            schema: {
                success: true,
                lecture: {
                    $ref: "#/definitions/lecture",
                    student: [{
                        student: 0,
                        attendance: 'O',
                        activeScore: 0
                    }],
                    chatting: []
                }
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
        #swagger.responses[404] = {
            description: '해당하는 lectureId의 lecture가 존재하지 않음',
            schema: {
                success: false,
                existLecture: false
            }
        }
        #swagger.responses[409] = {
            description: '해당 lecture는 진행 중이지 않음',
            schema: {
                success: false,
                isInProgress: false
            }
        }
    */
    Lecture.findOne({ _id: req.params.id }).populate({
        path: 'subject',
        populate: {
            path: 'professor',
            model: 'user'
        }
    }).populate('students').populate('questions').populate('subtitle').exec((err, lecture)=>{
        if (err) return res.status(500).json(err);
        if (lecture === null) return res.status(404).json({
            success: false,
            existLecture: false
        });
        if (lecture.status === 'done') return res.status(409).json({
            success: false,
            isInProgress: false
        });

        lecture.students.some((student)=>{
            if (student.student === req.session._id) {
                student.activeScore = 0;
                if (student.attendance === 'X')
                    student.attendance = 'O';

                return true;
            }
        });
        lecture.save((err)=>{
            if (err) return res.status(500).json(err);

            res.status(200).json({
                success: true,
                lecture
            })
        })
    })
})

router.get('/get/subject/:id', auth, (req, res)=>{
    /*  #swagger.tags = ['Lecture']
        #swagger.path = '/lecture/get/subject/{id}' 
        #swagger.description = '해당 subject에 해당하는 모든 lecture 정보 받아오기',
        #swagger.responses[200] = {
            description: '정상적으로 lecture 정보 받아온 경우',
            schema: {
                success: true,
                lecture: {
                    $ref: "#/definitions/lecture",
                    students: [{
                        student: {
                            _id: 0,
                            name: '김민건'
                        },
                        attendance: false
                    }],
                    chatting: []
                }
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
    */
    Lecture.find({ subject: req.params.id }).populate('student', {
        name: 1, _id: 1
    }).exec((err, lectures)=>{
        if (err) return res.status(500).json(err);

        res.status(200).json({
            success: true,
            lectures: lectures
        })
    })
})

module.exports = router;