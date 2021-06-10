const express = require('express');
const router = express.Router();

const { Subject } = require('../models/subjects');
const { User } = require('../models/users');
const { auth, professorAuth } = require('../middleware/authentication');

const crypto = require('crypto');
const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

// 강의 개설
router.post('/create', professorAuth, (req, res) => {
    /*  #swagger.tags = ['Subject']
        #swagger.path = '/subject/create' 
        #swagger.responses[201] = {
            description: '성공적으로 해당 subject를 개설했을 경우',
            schema: {
                success: true,
                code: '519hi32hkjifb12'
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
        #swagger.responses[403] = {
            description: 'type이 professor가 아닌 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            description: 'time과 days는 배열, days는 0~6까지 일요일부터 토요일을 의미',
            schema: { $ref: "#/definitions/createSubject" }
        } */
    
    const salt = Math.round((new Date().valueOf() + Math.random())) + "";
    const hashCode = crypto.createHash("sha512").update(salt).digest('hex').slice(0, 16);

    User.findOne({ email: req.session.email }, (err, user) => {
        if (err) return res.status(500).json(err);

        const subject = new Subject({
            name: req.body.name,
            professor: user._id,
            start_period: req.body.start_period,
            end_period: req.body.end_period,
            start_time: req.body.start_time,
            end_time: req.body.end_time,
            days: req.body.days,
            code: hashCode
        });
        subject.save((err, doc) => {
            if (err) return res.status(500).json(err);

            user.subjects.push(doc._id);
            user.save((err) => {
                if (err) return res.status(500).json(err);

                res.status(201).json({
                    success: true,
                    code: hashCode
                });
            });
        });
    });
});

// 강의 방 참가
router.put('/join', auth, (req, res) => {
    /*  #swagger.tags = ['Subject']
        #swagger.path = '/subject/join' 
        #swagger.responses[200] = {
            description: '성공시 success, subject 객체 반환',
            schema: {
                success: true,
                subject: { $ref : "#/definitions/subject "}
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
        #swagger.responses[404] = {
            description: '해당하는 코드의 강의가 없는 경우',
            schema: {
                success: false,
                codeValidation: false
            }
        }
        #swagger.responses[409] = {
            description: '이미 참여한 수업일 경우',
            schema: {
                success: false,
                subjectExist: true
            }
        }
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            description: '참여코드 입력',
            schema: { 
                $code: ""
            }
        } */

    User.findOne({ email: req.session.email }, (err, user) => {
        if(err) return res.status(500).json(err);
        
        Subject.findOne({ code: req.body.code }, (err, subject) => {
            if (err) return res.status(500).json(err);

            if (subject === null) res.status(404).json({ 
                success: false,
                codeValidation: false
            });
            else {
                if (user.subjects.includes(subject._id)) res.status(409).json({
                    success: false,
                    subjectExist: true
                });
                user.subjects.push(subject._id);
                user.save((err) => {
                    if (err) return res.status(500).json(err);

                    subject.students.push(user._id);
                    subject.save((err) => {
                        if (err) return res.status(500).json(err);

                        res.status(200).json({ 
                            success: true,
                            subject
                        });
                    });
                });
            }
        });
    });
});

// subject 정보 받아오기
router.get('/info/:id', auth, (req, res)=>{
    /*  #swagger.tags = ['Subject']
        #swagger.path = '/subject/info/{id}' 
        #swagger.responses[200] = {
            description: '성공적으로 해당 강의 정보 받아온 경우',
            schema: {
                success: true,
                subject: { $ref : "#/definitions/subject" }
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
            description: '해당 subject가 존재하지 않는 경우',
            schema: {
                success: false,
                existSubject: false
            }
        }
    */
    Subject.findOne({ _id: req.params.id }, (err, subject)=>{
        if (err) return res.status(500).json(err);
        if (subject===null) return res.status(404).json({
            success: false,
            existSubject: false
        })

        res.status(200).json({
            success: true,
            subject
        });
    })
})

// subject 정보 업데이트하기
router.put('/info/update/:id', professorAuth, (req, res)=>{
    /*  #swagger.tags = ['Subject']
        #swagger.path = '/subject/info/update/{id}' 
        #swagger.responses[200] = {
            description: '성공적으로 해당 강의 정보를 수정했을 경우',
            schema: { $ref : "#/definitions/subject" }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
        #swagger.responses[403] = {
            description: 'type이 professor가 아닌 경우,
                \n해당 과목을 만든 본인이 아닐 경우, success: false, isValidProfessor: false 반환',
            schema: {
                교수아님: { $ref: "#/definitions/proAuthFailed" },
                본인아님: {
                    success: false,
                    isValidProfessor: false
                }
            }
        }
        #swagger.responses[404] = {
            description: '해당 강의가 존재하지 않을 경우',
            schema: {
                success: false,
                existSubject: false
            }

        }
    */
    Subject.findOne({ _id: req.params.id }, async (err, subject)=>{
        if (err) return res.status(500).json(err);
        if (subject === null) return res.status(404).json({
            success: false,
            existSubject: false
        })

        if (subject.professor === req.session._id) {
            await subject.updateOne({
                name: req.body.name,
                start_period: req.body.start_period,
                end_period: req.body.end_period,
                start_time: req.body.start_time,
                end_time: req.body.end_time,
                days: req.body.days,
                introURL: req.body.introURL
            });

            res.status(200).json({ 
                success: true,
                subject
            });
        }
        else {
            req.status(403).json({ 
                success: false,
                isValidProfessor: false
            });
        }
    })
})

// 내 강의 목록 확인
router.get('/get/mySubjects', auth, (req, res) => {
    /*  #swagger.tags = ['Subject']
        #swagger.path = '/subject/get/mySubjects' 
        #swagger.responses[200] = {
            description: '성공 시, 본인이 수강하고 있는 강의들을 subjects로 반환',
            schema: {
                success: true,
                subjects: [{ $ref : "#/definitions/subject "}]
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
    */
    User.findOne({ email: req.session.email }).populate({
        path: 'subjects',
        populate: { 
            path: 'professor',
            model: 'user'
        }
    }).exec((err, user)=>{
        if(err) return res.status(500).json(err);

        res.status(200).json({
            success: true,
            subjects: user.subjects
        });
    });
});

// 곧 있을 수업 정보 받아오기
router.get('/get/upcoming', auth, (req, res) => {
    /*  #swagger.tags = ['Subject']
        #swagger.path = '/subject/get/upcoming' 
        #swagger.description = '현재 수업 중인 강의, 또는 곧 있을 강의 // 얼마나 지났는 지, 또는 해당 강의까지 남은 시간 반환',
        #swagger.responses[200] = {
            description: '현재 진행중인 수업이 있을 경우
                \n오늘 내에 강의가 있을 경우
                \n오늘 내에 강의가 없을 경우',
            schema: {
                진행중: {
                    success: true,
                    inProgress: true,
                    subject: 0,
                    diffH: 0,
                    diffM: -15
                },
                곧있음: {
                    success: true,
                    upcoming: true,
                    subject: 0,
                    diffH: 0,
                    diffM: 30
                },
                없음: {
                    success: false
                }
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
    */
    User.findOne({ email: req.session.email }).populate('subjects').exec((err, user)=>{
        if (err) return res.status(500).json(err);

        let minDiff = 60 * 24;
        let existUpcomingLecture = false;
        let upcomingLecture;

        const today = moment();

        const nowDay = today.day();
        const nowHour = today.hours();
        const nowMin = today.minutes();

        user.subjects.some((subject)=>{
            subject.days.some((day, dayIndex)=>{
                if (day == nowDay) {
                    const startTime = subject.start_time[dayIndex].split(':');
                    const endTime = subject.end_time[dayIndex].split(':');

                    let startHourDiff = (startTime[0] - nowHour);
                    let endHourDiff = (endTime[0] - nowHour);
                    let startMinuteDiff = (startTime[1] - nowMin);
                    let endMinuteDiff = (endTime[1] - nowMin);

                    const needBorrowing = (time, minute)=>{
                        if (time[1] - minute < 0) return true;
                        else return false;
                    }
                    
                    if (needBorrowing(startTime, nowMin)) {
                        startHourDiff = (startTime[0] - nowHour - 1);
                        startMinuteDiff = (startTime[1] - nowMin + 60);
                    }
                    else {
                        startHourDiff = (startTime[0] - nowHour);
                        startMinuteDiff = (startTime[1] - nowMin);
                    }
                    if (needBorrowing(endTime, nowMin)) {
                        endHourDiff = (endTime[0] - nowHour - 1);
                        endMinuteDiff = (endTime[1] - nowMin + 60);
                    }
                    else {
                        endHourDiff = (endTime[0] - nowHour);
                        endMinuteDiff = (endTime[1] - nowMin);
                    }

                    const startTimeDiff = startHourDiff * 60 + startMinuteDiff;
                    const endTimeDiff = endHourDiff * 60 + endMinuteDiff;

                    if (endTimeDiff > 0) {
                        if (startTimeDiff < 0) {
                            return res.status(200).json({
                                success: true,
                                inProgress: true,
                                subject: subject._id,
                                diffH: startHourDiff,
                                diffM: startMinuteDiff
                            });
                        }

                        if (startTimeDiff < minDiff) {
                            minDiff = startTimeDiff;
                            upcomingLecture = subject._id;
                            existUpcomingLecture = true;
                        }
                    }
                }
            });
        });
        if (existUpcomingLecture) {
            res.status(200).json({
                success: true,
                upcoming: true,
                subject: upcomingLecture._id,
                diffH: minDiff / 60,
                diffM: minDiff % 60
            });
        }
        else {
            res.status(200).json({
                success: false
            })
        }
    });
});

module.exports = router;