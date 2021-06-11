const express = require('express');
const router = express.Router();
const { User } = require('../models/users');
const { auth } = require('../middleware/authentication');

// 로그인

router.post('/login', (req, res) => {
    /*  #swagger.tags = ['Auth']
        #swagger.path = '/auth/login'
        #swagger.responses[200] = {
            description: '로그인 성공할 경우
            \n로그인 실패할 경우',
            schema: {
                성공: {
                    success: true,           
                    userExist: true
                },
                실패: {
                    success: false,
                    userExist: false
                }
            }
        }
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            schema: { $email: "kkimbj18@ajou.ac.kr" }
        } */

    User.findOne({
        email: req.body.email
    }, (err, user) => {
        if (err) return res.status(500).json(err);

        if (user === null) {
            res.status(200).json({ 
                success: false,
                userExist: false 
            });
        }
        else {
            req.session.isLogined = true;
            req.session.name = user.name;
            req.session.email = user.email;
            req.session.type = user.type;
            req.session._id = user._id;

            req.session.save(()=>{
                res.status(200).json({
                    success: true,
                    userExist: true
                });
            });
        }
    });
});

// 회원가입

router.post('/signup', (req, res) => {
    /*  #swagger.tags = ['Auth']
        #swagger.path = '/auth/signup'
        #swagger.responses[201] = {
            description: '성공적으로 회원가입한 경우',
            schema: {
                success: true
            }
        }
        #swagger.responses[409] = {
            description: '해당 고유값을 지니는 유저가 이미 존재할 경우',
            schema: {
                success: false,
                userExist: true
            }
        }
        #swagger.parameters['obj'] = {
            in: 'body',
            type: 'object',
            schema: { $ref: "#/definitions/signUp" }
        } */
    const newUser = new User({
        email: req.body.email,
        name: req.body.name,
        photourl: req.body.photourl,
        identityID: req.body.identityID,
        school: req.body.school,
        major: req.body.major,
        grade: req.body.grade,
        type: req.body.type
    });
    newUser.save((err) => {
        if (err) {
            User.findOne({ email: req.body.email }, (err, user) => {
                if (err) return res.status(500).json(err);
                
                res.status(409).json({
                    success: false,
                    userExist: true
                });
            });
        }
        else res.status(201).json({ success: true });
    });
});

router.get("/logout", auth, function (req, res) {
    /*  #swagger.tags = ['Auth']
        #swagger.path = '/auth/logout'
        #swagger.responses[200] = {
            description: '성공적으로 로그아웃 성공 시, success 반환',
            schema: {
                success: true
            }
        }
        #swagger.responses[401] = {
            description: 'user가 로그인이 되지 않은 경우',
            schema: { $ref: "#/definitions/authFailed" }
        }
    */
    req.session.destroy();
    res.clearCookie('sid');

    res.status(200).json({
        success: true
    });
});

module.exports = router;