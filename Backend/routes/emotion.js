const express = require('express');
const router = express.Router();

const { Notice, LectureNote, Assignment } = require('../models/models');
const { auth } = require('../middleware/authentication');

router.put('/add', auth, (req, res)=>{
    /*  #swagger.tags = ['Emotion']
        #swagger.path = '/emotion/add' 
        #swagger.responses[200] = {
            description: '성공적으로 해당 게시글에 대한 내 반응 추가/수정',
            schema: {
                success: true
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
        #swagger.responses[404] = {
            description: '해당하는 게시글이 존재하지 않을 경우',
            schema: {
                success: false,
                existPost: false
            }
        }
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            schema: {
                $postType: 'lectureNote',
                $postId: 0,
                $emotion: 'heart'
            }
        } */
    const Post = (req.body.postType === 'notice') ? Notice : (req.body.postType === 'lectureNote') ? LectureNote : Assignment;

    Post.findOne({ _id: req.body.postId }, (err, post)=>{
        if (err) return res.status(500).json(err);
        if (post === null) return res.status(404).json({
            success: false,
            existPost: false
        });

        const targetIndex = post.emotions.findIndex(obj=>obj.user === req.session._id);
    
        const emotionForm = {
            user: req.session._id,
            emotion: req.body.emotion
        }
        if (targetIndex === -1) 
            post.emotions.push(emotionForm);
        else                    
            post.emotions[targetIndex] = emotionForm;

        post.save((err)=>{
            if (err) return res.status(500).json(err);

            res.status(200).json({ success: true });
        })
    })
})

router.put('/delete', auth, (req, res)=>{
    /*  #swagger.tags = ['Emotion']
        #swagger.path = '/emotion/delete' 
        #swagger.responses[200] = {
            description: '성공적으로 해당 게시글에 대한 내 반응 삭제',
            schema: {
                success: true
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
        #swagger.responses[404] = {
            description: '해당하는 게시글이 존재하지 않을 경우
            \n해당 게시글에 반응을 하지 않았을 경우',
            schema: {
                게시글: {
                    success: false,
                    existPost: false
                },
                반응: {
                    success: false,
                    existEmotion: false
                }
            }
        }
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            schema: {
                $postType: 'lectureNote',
                $postId: 0
            }
        } */
    const Post = (req.body.postType === 'notice') ? Notice : (req.body.postType === 'lectureNote') ? LectureNote : Assignment;

    Post.findOne({ _id: req.body.postId }, (err, post)=>{
        if (err) return res.status(500).json(err);
        if (post === null) return res.status(404).json({
            success: false,
            existPost: false
        });

        const targetIndex = post.emotions.findIndex(obj=>obj.user === req.session._id);
    
        if (targetIndex === -1) 
            return res.status(404).json({
                success: false,
                existEmotion: false
            });
        else                    
            post.emotions.splice(targetIndex, 1);

        post.save((err)=>{
            if (err) return res.status(500).json(err);

            res.status(200).json({ success: true });
        })
    })
})

module.exports = router;