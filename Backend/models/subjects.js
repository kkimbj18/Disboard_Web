const { Schema, model } = require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const lectureSchema = new Schema({
    date: { 
        type: Date,
        required: true 
    },
    status: { 
        type: String,
        required: true
    },
    start_time: { 
        type: String,
        required: true 
    },
    end_time: { type: String },
    subject: {
        type: Number,
        ref: 'subject'
    },
    options: {
        subtitle: { type: Boolean },
        record: { type: Boolean },
        attendance: { type: Boolean },
        limit: { type: Number }
    },
    students: [{
        student: { 
            type: Number,
            ref: 'user'
        },
        attendance: { type: String },
        activeScore: { type: Number }
    }],
    subtitle: {
        type: Number,
        ref: 'subtitle'
    },
    chatting: {
        type: Number,
        ref: 'chatting'
    },
    questions: [{
        type: Number,
        ref: 'question'
    }]
});

const subjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    professor: {
        type: Number,
        ref: 'user',
        required: true
    },
    start_period: {
        type: Date,
        required: true
    },
    end_period: {
        type: Date,
        required: true
    },
    start_time: [{ type: String }],
    end_time: [{ type: String }],
    days: [{ type: Number }],
    code: { 
        type: String,
        required: true
    },
    lectures: [{ type: Number, ref: 'lecture' }],
    students: [{ type: Number, ref: 'user' }],
    introURL: { type: Number, ref: 'file' }
});

lectureSchema.plugin(mongooseAutoInc.plugin, 'lecture');
subjectSchema.plugin(mongooseAutoInc.plugin, 'subject');

const lectureModel = model('lecture', lectureSchema);
const subjectModel = model('subject', subjectSchema);

module.exports = {
    Lecture: lectureModel,
    Subject: subjectModel
};