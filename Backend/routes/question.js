const express = require('express');
const router = express.Router();

const { Question } = require('../models/models');
const { Lecture } = require('../models/subjects');
const { auth, professorAuth } = require('../middleware/authentication');

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

const increaseActiveScore = require('../modules/activeScore');

router.post('/create', auth, (req, res)=>{
    /*  #swagger.tags = ['Question']
        #swagger.path = '/question/create' 
        #swagger.responses[201] = {
            description: '성공적으로 질문을 등록한 경우',
            schema: {
                success: true,
                question: { 
                    lecture: 0,
                    questioner: '김민건',
                    questionContent: 'ang?'
                }
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            schema: {
                $lectureId: 0,
                $name: '김민건',
                questionContent: 'ang?'
            }
        } */
    const question = new Question({
        lecture: req.body.lectureId,
        questioner: req.body.name,
        questionContent: req.body.questionContent
    });
    question.save((err, doc)=>{
        if (err) return res.status(500).json(err);

        Lecture.findOneAndUpdate({ _id: req.body.lectureId }, {
            $push: { questions: doc._id }
        }, { new: true }, (err)=>{
            if (err) return res.status(500).json(err);

            const activeScoreResult = increaseActiveScore(req.body.lectureId, req.session._id);

            if (req.session.type === 'student' && !activeScoreResult) return res.status(500).json({
                success: false,
                error: 'active score err'
            })

            res.status(201).json({
                success: true,
                question: doc
            })
        });
    })
});

router.put('/reply', auth, (req, res)=>{
    /*  #swagger.tags = ['Question']
        #swagger.path = '/question/reply' 
        #swagger.responses[200] = {
            description: '성공적으로 질문에 답변을 한 경우',
            schema: {
                success: true,
                answer: { 
                    respondent: '최민우',
                    content: '흐에'
                }
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            schema: {
                $lectureId: 0,
                $name: '김민건',
                questionContent: 'ang?'
            }
        } */
    const answerForm = {
        respondent: req.body.name,
        content: req.body.content
    }

    Question.findOneAndUpdate({ _id: req.body.questionId }, {
        $push: { answers: answerForm }, 
    }, { new: true }, (err)=>{
        if (err) return res.status(500).json(err);

        const activeScoreResult = increaseActiveScore(req.body.lectureId, req.session._id);

        if (req.session.type === 'student' && !activeScoreResult) return res.status(500).json({
            success: false,
            error: 'active score err'
        })

        res.status(200).json({
            success: true,
            answer: answerForm
        })
    })
})

module.exports = router