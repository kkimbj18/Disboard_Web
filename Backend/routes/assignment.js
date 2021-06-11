const express = require('express');
const router = express.Router();

const { Assignment } = require('../models/models');
const { auth, professorAuth } = require('../middleware/authentication');

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

router.get('/get/subject/:id', auth, (req, res)=>{
     /*  #swagger.tags = ['Assignment']
        #swagger.path = '/assignment/get/subject/{id}' 
        #swagger.responses[200] = {
            description: '해당 과목의 퀴즈들을 성공적으로 가져올 경우',
            schema: {
                success: true,
                assignments: [{
                    id: 0,
                    subject: { $ref: "#/definitions/subject" },
                    title: '인공지능 과제 #2',
                    content: 'ㅋㅋ',
                    score: 10,
                    date: '2021-05-05T15:38:19.424Z',
                    deadline: '2021-05-08T00:00:00.000Z',
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
    Assignment.find({ subject: req.params.id }).sort({date: -1}).populate({
        path: 'comments',
        populate: {
            path: 'user',
            model: 'user'
        }
    }).exec((err, assignments)=>{
        if (err) return res.status(500).json(err);

        const assignmentArray = [];

        assignments.forEach((assignment)=>{
            const assignmentForm = {
                id: assignment._id,
                title: assignment.title,
                content: assignment.content,
                score: assignment.score,
                date: assignment.date,
                comments: assignment.comments,
                emotions: assignment.emotions,
                deadline: assignment.deadline
            }
            assignmentArray.push(assignmentForm);
        })

        res.status(200).json({
            success: true,
            assignments: assignmentArray
        })
    })
})

router.get('/get/:id', auth, (req, res)=>{
     /*  #swagger.tags = ['Assignment']
        #swagger.path = '/assignment/get/{id}' 
        #swagger.responses[200] = {
            description: '해당 과제를 성공적으로 받아올 경우',
            schema: {
                success: true,
                assignment: {
                    _id: 0,
                    subject: { $ref: "#/definitions/subject" },
                    title: '인지과제 #2',
                    content: 'ㅋㅋ',
                    date: '2021-05-05T15:38:19.424Z',
                    deadline: '2021-05-08T00:00:00.000Z',
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
                existAssignment: false
            }
        } */
    Assignment.findOne({ _id: req.params.id }).populate('subject').populate({
        path: 'comments',
        populate: {
            path: 'user',
            model: 'user'
        }
    }).exec((err, assignment)=>{
        if (err) return res.status(500).json(err);
        if (assignment === null) return res.status(404).json({
            success: false,
            existAssignment: false
        })

        res.status(200).json({
            success: true,
            assignment: assignment
        })
    })
})

router.post('/create', professorAuth, (req, res)=>{
     /*  #swagger.tags = ['Assignment']
        #swagger.path = '/assignment/create' 
        #swagger.responses[201] = {
            description: '정상적으로 과제를 생성했을 경우',
            schema: {
                success: true,
                assignment: {
                    _id: 0,
                    subject: 0,
                    title: '인지과제 #3',
                    content: 'ㅋㅅㅋ',
                    file: 0,
                    score: 10,
                    date: '2021-05-05T15:38:19.424Z',
                    deadline: '2021-05-08T00:00:00.000Z',
                    comments: [],
                    emotions: [],
                    checked: false
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
                score: 10,
                date: '2021-05-05',
                deadline: '2021-05-08'
            }
        } */
    date = req.body.date || moment();
    
    const assignment = new Assignment({
        subject: req.body.subject,
        title: req.body.title,
        content: req.body.content,
        file: req.body.file,
        deadline: req.body.deadline,
        date: date,
        checked: false
    });
    assignment.save((err, doc)=>{
        if (err) return res.status(500).json(err);

        res.status(201).json({
            success: true,
            assignment: doc
        })
    })
})

router.put('/update', professorAuth, (req, res)=>{
    /*  #swagger.tags = ['Assignment']
        #swagger.path = '/assignment/update' 
        #swagger.responses[200] = {
            description: '정상적으로 과제를 수정했을 경우',
            schema: {
                success: true,
                Assignment: {
                    _id: 0,
                    subject: 0,
                    title: '오늘은 여기까지만...',
                    content: '힘들드아',
                    file: 0,
                    score: 15,
                    date: '2021-05-05T15:38:19.424Z',
                    deadline: '2021-05-08T00:00:00.000Z',
                    comments: [],
                    emotions: [],
                    checked: true
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
            description: '해당 Assignment가 존재하지 않는 경우',
            schema: {
                success: false,
                existAssignment: false
            }
        }
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            schema: {
                id: 0,
                title: '오늘은 여기까지만...',
                content: '힘들드아',
                file: 0,
                score: 15,
                deadline: '2021-05-08',
                date: '2021-05-05',
                checked: true
            }
        } */
    Assignment.findOneAndUpdate({ _id: req.body.id }, {
        title: req.body.title,
        content: req.body.content,
        file: req.body.file,
        score: req.body.score,
        deadline: req.body.deadline,
        date: req.body.date,
        checked: req.body.checked
    }, { new: true }, (err, Assignment)=>{
        if (err) return res.status(500).json(err);
        if (Assignment === null) return res.status(404).json({
            success: false,
            existAssignment: false
        })

        res.status(200).json({
            success: true,
            Assignment: Assignment
        })
    })
})

router.delete('/delete/:id', professorAuth, (req, res)=>{
    /*  #swagger.tags = ['Assignment']
        #swagger.path = '/assignment/delete/{id}' 
         #swagger.responses[200] = {
            description: '정상적으로 과제를 삭제했을 경우',
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
            description: '해당 Assignment가 존재하지 않는 경우',
            schema: {
                success: false,
                existAssignment: false
            }
        } */
    Assignment.findOneAndDelete({ _id: req.params.id }, (err, Assignment)=>{
        if (err) return res.status(500).json(err);
        if (Assignment === null) return res.status(404).json({
            success: false,
            existAssignment: false
        })

        res.status(200).json({
            success: true
        })
    })
})

router.put('/submit', auth, (req, res)=>{
    /*  #swagger.tags = ['Assignment']
       #swagger.path = '/assignment/submit' 
       #swagger.responses[200] = {
           description: '학생이 해당 과제에 대한 답을 정상적으로 제출한 경우',
           schema: {
               success: true,
               assignment: {
                   assignmentId: 0,
                   title: 'assignment#1',
                   subjectName: '캡스톤 디자인',
                   $content: 'TDD를 구현하세요',
                   date: '2021-05-05T15:38:19.424Z',
                   deadLine: '2021-05-08T00:00:00.000Z',
                   submission: [{
                       date: '2021-05-05T15:59:19.424Z',
                       user: 0,
                       content: '',
                       file: 0
                   }]
               }
           }
       }
       #swagger.responses[401] = {
           description: 'user가 로그인이 되지 않은 경우',
           schema: { $ref: "#/definitions/authFailed" }
       } 
       #swagger.responses[409] = {
           description: 'assignment의 status가 done일 경우',
           schema: {
               success: true,
               isOver: true
           }
       }
       #swagger.parameters['obj'] = {
           in: 'body',
           type: 'object',
           schema: {
               $assignmentId: 0,
               submission: {
                   file: 0,
                   content: ''
               }
           }
       } */
       
   const now = moment();

   assignment.findOne({ _id: req.body.assignmentId }).populate('subject').exec((err, assignment)=>{
       if (err) return res.status(500).json(err);
       if (now > req.body.deadline) {
           return res.status(409).json({
               success: false,
               isOver: true
           });
       }

       assignment.submission.push({
           date: now,
           user: req.session._id,
           file: req.body.file,
           content: req.body.content
       });
       assignment.save((err, doc)=>{
           if (err) return res.status(500).json(err);

           const myResponse = doc.submission.filter(response=>response.student===req.session._id)

           const responseForm = {
               assignmentId: doc._id,
               title: doc.title,
               subjectName: assignment.subject.name,
               content: doc.content,
               date: doc.date,
               deadLine: doc.deadLine,
               submission: myResponse
           }

           res.status(200).json({
               success: true,
               assignment: responseForm
           });
       })
   })
})

module.exports = router;