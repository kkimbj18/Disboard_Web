const { Schema, model } = require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

const quizSchema = new Schema({
    name: { type: String, required: true },
    subject: { type: Number, ref: 'subject' },
    lecture: { type: Number, ref: 'lecture' },
    date: { type: Date },
    deadLine: { type: Date },
    answerSheets: [{
        question: { type: String },
        answer: { type: String },
        points: { type: Number }
    }],
    status: { type: String },
    type: { type: String, required: true },
    responses: [{
        date: { type: Date },
        student: { type: Number, ref: 'user' },
        response: [{
            answer: { type: String },
            correctness: { type: Boolean }
        }],
        score: { type: Number }
    }]
});

const questionSchema = new Schema({
    lecture: { type: Number, ref: 'lecture' },
    // subject: { type: Number, ref: 'subject' },
    questioner: { type: String },
    questionContent: { type: String, required: true },
    answers: [{
        respondent: { type: String },
        content: { type: String, required: true }
    }]
});

const chattingSchema = new Schema({
    lecture: { type: Number, ref: 'lecture' },
    chat: [{
        name: { type: String },
        content: { type: String },
        time: { type: String }
    }]
});

const understandingProSchema = new Schema({
    type: { type: String, required: true },
    name: { type: String },
    date: { type: Date },
    deadLine: { type: Date },
    status: { type: String },
    lecture: { type: Number, ref: 'lecture' },
    responses: [{
        student: { type: Number, ref: 'user' },
        response: { type: String },
        date: { type: Date }
    }]
});

const understandingStuSchema = new Schema({
    student: { type: Number, ref: 'user' },
    lecture: { type: Number, ref: 'lecture' },
    response: { type: Boolean },
    minutes: { type: Number },
    isCounted: { type: Number }
})

const subtitleSchema = new Schema({
    lecture: { type: Number, ref: 'lecture' },
    contents: [{
        content: { type: String },
        time: { type: String }
    }]
})
    
const noticeSchema = new Schema({
    subject: { type: Number, ref: 'subject' },
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date },
    comments: [{
        user: { type: Number, ref: 'user' },
        content: { type: String },
        date: { type: Date }
    }],
    emotions: [{
        user: { type: Number, ref: 'user' },
        emotion: { type: String, required: true }
    }]
});

const lectureNoteSchema = new Schema({
    subject: { type: Number, ref: 'subject' },
    title: { type: String, required: true },
    content: { type: String, required: true },
    file: { type: Number, ref: 'file' },
    date: { type: Date },
    comments: [{
        user: { type: Number, ref: 'user' },
        content: { type: String },
        date: { type: Date }
    }],
    emotions: [{
        user: { type: Number, ref: 'user' },
        emotion: { type: String }
    }]
});

const assignmentSchema = new Schema({
    subject: { type: Number, ref: 'subject' },
    title: { type: String, required: true },
    content: { type: String, required: true },
    file: { type: Number, ref: 'file' },
    score: { type: Number },
    comments: [{
        user: { type: Number, ref: 'user' },
        content: { type: String },
        date: { type: Date }
    }],
    emotions: [{
        user: { type: Number, ref: 'user' },
        emotion: { type: String, required: true }
    }],
    deadline: { type: Date },
    date: { type: Date },
    checked: { type: Boolean },
    submission: [{
        user: { type: Number, ref: 'user' },
        file: { type: Number, ref: 'file' },
        content: { type: String },
        date: { type: Date },
        score: { type: Number }
    }]
});

const scheduleSchema = new Schema({
    user: { type: Number, ref: 'user' },
    contents: [{
        type: { type: String },
        startDate: { type: String },
        endDate: { type: String },
        status: { type: String },
        URL: { type: String }
    }]
});

const recordSchema = new Schema({
    lecture: { type: Number, ref: 'lecture' },
    file: { type: Number, ref: 'file' }
});

const fileSchema = new Schema({
    originalName: { type: String },
    saveName: { type: String },
    url: { type: String }
});

quizSchema.plugin(mongooseAutoInc.plugin, 'quiz');
questionSchema.plugin(mongooseAutoInc.plugin, 'question');
chattingSchema.plugin(mongooseAutoInc.plugin, 'chatting');
understandingProSchema.plugin(mongooseAutoInc.plugin, 'understandingPro');
understandingStuSchema.plugin(mongooseAutoInc.plugin, 'understandingStu');
subtitleSchema.plugin(mongooseAutoInc.plugin, 'subtitle');
noticeSchema.plugin(mongooseAutoInc.plugin, 'notice');
lectureNoteSchema.plugin(mongooseAutoInc.plugin, 'lectureNote');
assignmentSchema.plugin(mongooseAutoInc.plugin, 'assignment');
scheduleSchema.plugin(mongooseAutoInc.plugin, 'schedule');
recordSchema.plugin(mongooseAutoInc.plugin, 'record');
fileSchema.plugin(mongooseAutoInc.plugin, 'file');

const quizModel = model('quiz', quizSchema);
const questionModel = model('question', questionSchema);
const chattingModel = model('chatting', chattingSchema);
const understandingProModel = model('understandingPro', understandingProSchema);
const understandingStuModel = model('understandingStu', understandingStuSchema);
const subtitleModel = model('subtitle', subtitleSchema);
const noticeModel = model('notice', noticeSchema);
const lectureNoteModel = model('lectureNote', lectureNoteSchema);
const assignmentModel = model('assignment', assignmentSchema);
const scheduleModel = model('schedule', scheduleSchema);
const recordModel = model('record', recordSchema);
const fileModel = model('file', fileSchema);

module.exports = {
    Quiz : quizModel,
    Question : questionModel,
    Chatting : chattingModel,
    UnderstandingPro : understandingProModel,
    UnderstandingStu : understandingStuModel,
    Subtitle : subtitleModel,
    Notice : noticeModel,
    LectureNote : lectureNoteModel,
    Assignment : assignmentModel,
    Schedule : scheduleModel,
    Record : recordModel,
    File : fileModel
};