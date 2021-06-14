const express = require('express');
const router = express.Router();

const { UnderstandingStu, UnderstandingPro } = require('../models/models');
const { Lecture } = require('../models/subjects');
const { auth, professorAuth } = require('../middleware/authentication');

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

const increaseActiveScore = require('../modules/activeScore');

router.post('/create', professorAuth, (req, res)=>{
    /*  #swagger.tags = ['Understanding']
        #swagger.path = '/understanding/create' 
        #swagger.description = 'status는 open/done으로 나뉨'
        #swagger.responses[201] = {
            description: '이해도평가가 정상적으로 생성된 경우',
            schema: {
                success: true,
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
                $name: '중간이해도평가',
                $lectureId: 0,
                $type: 'OX',
            }
        } */
    const understanding = new UnderstandingPro({
        type: req.body.type,
        name: req.body.name,
        date: new moment(),
        status: 'open',
        lecture: req.body.lectureId
    });

    understanding.save((err)=>{
        if (err) return res.status(500).json(err);

        res.status(201).json({
            success: true
        })
    })
})

router.put('/submit', auth, (req, res)=>{
    /*  #swagger.tags = ['Understanding']
        #swagger.path = '/understanding/submit' 
        #swagger.description = 'status는 open/done으로 나뉨'
        #swagger.responses[200] = {
            description: '이해도평가가 정상적으로 제출된 경우',
            schema: {
                success: true,
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
        #swagger.responses[404] = {
            description: 'udId에 해당하는 이해도평가가 존재하지 않는 경우',
            schema: {
                success: false,
                existUd: false
            }
        }
        #swagger.responses[409] = {
            description: '이해도평가가 이미 종료된 경우',
            schema: {
                success: false,
                isOver: false
            }
        }
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            schema: {
                $udId: 0,
                response: ['O']
            }
        } */
    const now = moment();

    UnderstandingPro.findOne({ _id: req.body.udId }, (err, ud)=>{
        if (err) return res.status(500).json(err);
        if (ud.status === 'done') {
            return res.status(409).json({
                success: false,
                isOver: true
            });
        }
        if (ud === null) {
            return res.status(404).json({
                success: false,
                existUd: false
            })
        }

        ud.responses.push({
            date: now,
            student: req.session._id,
            response: req.body.response
        });
        ud.save((err)=>{
            if (err) return res.status(500).json(err);

            res.status(200).json({
                success: true
            })
        })
    })
})

router.put('/close', professorAuth, (req, res)=>{
    /*  #swagger.tags = ['Understanding']
        #swagger.path = '/understanding/close' 
        #swagger.description = 'status는 open/done으로 나뉨'
        #swagger.responses[200] = {
            description: '이해도평가가 정상적으로 종료되었을 경우',
            schema: {
                success: true,
                understanding: {
                    type: 'OX',
                    name: '중간이해도평가',
                    date: '2021-05-05T15:38:19.424Z',
                    deadLine: '2021-05-05T16:00:00.000Z',
                    status: 'done',
                    lecture: 0,
                    responses: [{
                        student: 0,
                        response: 'O',
                        date: '2021-05-05T15:40:48.473Z'
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
        } */
    UnderstandingPro.findOneAndUpdate({ _id: req.body.udId }, {
        status: 'done',
        deadLine: new moment()
    }, { new: true }, (err, ud)=>{
        if (err) return res.status(500).json(err);

        if (req.body.attendanceOpt) {
            Lecture.findOne({ _id: req.body.lectureId }, (err, lecture)=>{
                if (err) return res.status(500).json(err);

                lecture.students.forEach((student)=>{
                    const targetStudent = ud.responses.find((element)=>element.student === student.student);

                    if (targetStudent === undefined) {
                        student.attendance = 'XX'
                    }
                })
            })
        }

        res.status(200).json({
            success: true,
            understanding: ud
        });
    })
});

router.post('/send', auth, (req, res)=>{
    /*  #swagger.tags = ['Understanding']
        #swagger.path = '/understanding/send' 
        #swagger.description = '학생이 주도적으로 교수님에게 "이해 안됨" 표시를 날릴 때 정보를 저장해주는 API'
        #swagger.responses[201] = {
            description: '학생의 이해 여부가 정상적으로 생성된 경우
                \n알람을 보낼지 말지에 따라 케이스 분류',
            schema: {
                알람없음: {
                    success: true,
                    understanding: {
                        student: 0,
                        lecture: 0,
                        response: false,
                        time: '0:23'
                    },
                    alarm: false,
                    alarmType: 'none'
                },
                긍정: {
                    success: true,
                    understanding: {
                        student: 0,
                        lecture: 0,
                        response: true,
                        time: '0:23'
                    },
                    alarm: true,
                    alarmType: 'positive'
                },
                부정: {
                    success: true,
                    understanding: {
                        student: 0,
                        lecture: 0,
                        response: false,
                        time: '0:23'
                    },
                    alarm: true,
                    alarmType: 'negative'
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
                $isUnderstood: false,
                $lectureId: 0,
                $lectureStartTime: '12:00',
                limit: 5
            }
        } */
    const now = moment();
    const currHour = now.hours();
    const currMinute = now.minutes();

    const startTime = req.body.lectureStartTime.split(":");
    const startHour = Number(startTime[0]);
    const startMinute = Number(startTime[1]);

    let hours;
    let minutes;

    const needBorrowing = currMinute-startMinute < 0 

    if (needBorrowing) {
        hours = (currHour-startHour-1);
        minutes = (currMinute-startMinute+60);
    }
    else {
        hours = (currHour-startHour);
        minutes = (currMinute-startMinute);
    }
    
    const time = hours + ":" + minutes;
    
    const understanding = new UnderstandingStu({
        student: req.session._id,
        lecture: req.body.lectureId,
        response: req.body.isUnderstood,
        minutes: hours*60 + minutes,
        isCounted: false
    });
    understanding.save((err, ud)=>{
        if (err) return res.status(500).json(err);

        const now = ud.minutes;
        let alarm = false;
        let alarmType = 'none';
        let studentArray = [new Set(), new Set()];

        const understandingForm = {
            student: ud._id,
            lecture: ud.lecture,
            response: ud.response,
            time: time
        }

        UnderstandingStu.find({ lecture: req.body.lectureId }).sort({ minutes: -1 }).exec((err, docs)=>{
            if (err) return res.status(500).json(err);

            const activeScoreResult = increaseActiveScore(req.body.lectureId, req.session._id);

            if (!activeScoreResult) return res.status(500).json({
                success: false,
                error: 'active score err'
            })
            docs.some((doc)=>{
                if (now - doc.minutes <= 5) {
                    if (doc.response) studentArray[0].add(doc.student);
                    else studentArray[1].add(doc.student);

                    doc.isCounted = true;
                }
                else return true;
            })

            studentArray.forEach((set, idx)=>{
                if (set.size === req.body.limit) {
                    docs.save((err)=>{
                        if (err) return res.status(500).json(err);

                        alarm = true;
                        alarmType = (idx) ? 'positive' : 'negative';
                    })
                }
            })
        })

        res.status(201).json({
            success: true,
            understanding: understandingForm,
            alarm: alarm,
            alarmType: alarmType
        })
    });
})

function count(docs) {
    return docs.reduce((acc, doc)=>{
        acc[doc.response] = (acc[doc.response]) ? acc[doc.response].push(doc) : [doc];

        return acc;
    }, {});
}

router.get('/get/lecture/:id', auth, (req, res)=>{
    /*  #swagger.tags = ['Understanding']
        #swagger.path = '/understanding/get/lecture/{id}' 
        #swagger.description = '주어진 id의 lecture에 해당하는 학생 주관의 모든 이해 평가 반환'
        #swagger.responses[200] = {
            description: '정상적으로 학생 주관의 이해 평가 반환',
            schema: {
                success: true,
                countResponse: {
                    O: [{
                        student: {
                            _id: 0,
                            name: '김민건'
                        },
                        lecture: 0,
                        response: 'O',
                        minutes: '10:03',
                        isCounted: false
                    }],
                    X: [{
                        student: {
                            _id: 1,
                            name: '윤다연'
                        },
                        lecture: 0,
                        response: 'X',
                        minutes: '10:05',
                        isCounted: false
                    }]
                }
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        } */
    UnderstandingStu.find({ lecture: req.params.id }).populate('student', { _id: 1, name: 1 }).exec((err, docs)=>{
        if (err) return res.status(500).json(err);
        
        const countObj = count(docs);

        res.status(200).json({
            success: true,
            countResponse: countObj
        });
    })
})

module.exports = router;