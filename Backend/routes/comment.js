const express = require('express');
const router = express.Router();

const { Notice, LectureNote, Assignment } = require('../models/models');
const { auth } = require('../middleware/authentication');

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

router.put('/add', auth, (req, res)=>{
    /*  #swagger.tags = ['Comment']
        #swagger.path = '/comment/add' 
        #swagger.responses[200] = {
            description: '성공적으로 댓글을 달았을 경우',
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
                $postType: 'notice',
                $postId: 0,
                content: '롤 개마렵다 ㄹㅇ'
            }
        } */
    const Post = (req.body.postType === 'notice') ? Notice : (req.body.postType === 'lectureNote') ? LectureNote : Assignment;

    Post.findOne({ _id: req.body.postId }, (err, post)=>{
        if (err) return res.status(500).json(err);
        if (post === null) return res.status(404).json({
            success: false,
            existPost: false
        });

        post.comments.push({
            user: req.session._id,
            content: req.body.content,
            date: moment()
        });
        post.save((err)=>{
            if (err) return res.status(500).json(err);

            res.status(200).json({ success: true })
        })
    })
});

router.put('/edit', auth, (req, res)=>{
    /*  #swagger.tags = ['Comment']
        #swagger.path = '/comment/edit' 
        #swagger.responses[200] = {
            description: '댓글을 성공적으로 수정하였을 경우',
            schema: {
                success: true
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
        #swagger.responses[403] = {
            description: 'user가 해당 댓글에 대한 권한이 없을 경우',
            schema: {
                success: false,
                validUser: false
            }
        }
        #swagger.responses[404] = {
            description: '해당하는 게시글이 존재하지 않을 경우,
            \n해당하는 댓글이 존재하지 않을 경우',
            schema: {
                게시글: {
                    success: false,
                    existPost: false
                },
                댓글: {
                    success: false,
                    existComment: false
                }
            }
        }
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            description: 'commentIndex는 해당 게시물에서 수정하고자하는 comment의 index를 의미',
            schema: {
                $postType: 'lectureNote',
                $postId: 0,
                $commentIndex: 0,
                content: '중간발표 2주 남았네 ㅁㅊ'
            }
        } */
    const Post = (req.body.postType === 'notice') ? Notice : (req.body.postType === 'lectureNote') ? LectureNote : Assignment;

    Post.findOne({ _id: req.body.postId }, (err, post)=>{
        if (err) return res.status(500).json(err);
        if (post === null) return res.status(404).json({
            success: false,
            existPost: false
        });

        const targetComment = post.comments[req.body.commentIndex];
        if (targetComment === undefined) return res.status(404).json({
            success: false,
            existComment: false
        })
        if (req.session._id != targetComment.user) {
            return res.status(403).json({
                success: false,
                validUser: false
            });
        }

        targetComment.content = req.body.content;
        post.save((err)=>{
            if (err) return res.status(500).json(err);

            res.status(200).json({ success: true });
        })
    })
})

router.put('/delete', auth, (req, res)=>{
    /*  #swagger.tags = ['Comment']
        #swagger.path = '/comment/delete' 
        #swagger.responses[200] = {
            description: '성공적으로 댓글을 삭제한 경우',
            schema: {
                success: true
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
        #swagger.responses[403] = {
            description: 'user가 해당 댓글에 대한 권한이 없을 경우',
            schema: {
                success: false,
                validUser: false
            }
        }
        #swagger.responses[404] = {
            description: '해당하는 게시글이 존재하지 않을 경우,
            \n해당하는 댓글이 존재하지 않을 경우',
            schema: {
                게시글: {
                    success: false,
                    existPost: false
                },
                댓글: {
                    success: false,
                    existComment: false
                }
            }
        }
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            description: 'commentIndex는 해당 게시물에서 수정하고자하는 comment의 index를 의미',
            schema: {
                $postType: 'lectureNote',
                $postId: 0,
                $commentIndex: 0
            }
        } */
    const Post = (req.body.postType === 'notice') ? Notice : (req.body.postType === 'lectureNote') ? LectureNote : Assignment;

    Post.findOne({ _id: req.body.postId }, (err, post)=>{
        if (err) return res.status(500).json(err);
        if (post === null) return res.status(404).json({
            success: false,
            existPost: false
        });

        const targetComment = post.comments[req.body.commentIndex];
        if (targetComment === undefined) return res.status(404).json({
            success: false,
            existComment: false
        });
        if (req.session._id != targetComment.user) {
            return res.status(403).json({
                success: false,
                validUser: false
            });
        }
        
        post.comments.splice(req.body.commentIndex, 1);
        post.save((err)=>{
            if (err) return res.status(500).json(err);

            res.status(200).json({ success: true });
        })
    })
})

module.exports = router;