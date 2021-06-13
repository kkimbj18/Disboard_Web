const express = require('express');
const router = express.Router();
const { User } = require('../models/users');

const { auth } = require('../middleware/authentication');

router.get('/get/current', (req, res)=>{
    // #swagger.tags = ['User']
    // #swagger.path = '/user/get/current'
    User.findOne({ email: req.session.email }).populate('subject').exec((err, user) => {
        if(err) res.status(500).json(err);
        else {
            res.status(200).json(user);
        }
    });
});

router.get('/get/professor', (req, res)=>{
    // #swagger.tags = ['User']
    // #swagger.path = '/user/get/professor'
    User.find({ type: 'professor' }).populate('subject').exec((err, user)=>{
        if(err) return res.status(500).json(err);

        res.status(200).json(user);
    })
});

router.get('/get/student', (req, res)=>{
    // #swagger.tags = ['User']
    // #swagger.path = '/user/get/student'
    User.find({ type: 'student' }).populate('subject').exec((err, user)=>{
        if(err) return res.status(500).json(err);

        res.status(200).json(user);
    })
})

router.get('/get/:id', (req, res)=>{
    // #swagger.tags = ['User']
    // #swagger.path = '/user/get/{id}'
    User.findOne({ _id: req.params.id }).populate('subject').exec((err, user)=>{
        if (err) return res.status(500).json(err);

        res.status(200).json(user);
    })
})

router.delete('/delete', auth, (req, res)=>{
    // #swagger.tags = ['User']
    // #swagger.path = '/user/delete'
    User.findOneAndDelete({ _id: req.session._id }, (err, user)=>{
        if (err) return res.status(500).json(err);

        return res.status(200).json({
            success: true,
            user: user
        });
    })
})

module.exports = router;