var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const cors = require('cors');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);

process.env.NODE_ENV = (process.env.NODE_ENV && (process.env.NODE_ENV).trim().toLowerCase() == 'production') ? 'production' : 'development';

const dotenv = require('dotenv');

dotenv.config({
    path: path.resolve(
        process.cwd(),
        process.env.NODE_ENV == "production" ? ".env" : ".env.dev"
    )
});

var app = express();

// app.set('trust proxy', 1);

// Cors Setting
const corsConfig = {
    origin: true,
    credentials: true,
    allowedheaders: ['Content-Type', 'x-requested-with', 'origin', '*']
}

app.use(cors(corsConfig));
app.options('*', cors(corsConfig));

// Session Setting
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 2000 * 60 * 60
    },
    store: new MemoryStore({
        checkPeriod: 2000 * 60 * 60
    })
}));

// Mongoose 연결
const mongoose = require('mongoose');
const mongooseAutoInc = require('mongoose-auto-increment');

mongoose.connect(`mongodb://${process.env.DB}:27017/capstone`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
const connection = mongoose.connection;
mongooseAutoInc.initialize(connection);

connection.on('error', console.error);
connection.once('open', () => {
    console.log('Connected to mongoDB server');
})

// Router 설정
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const subjectRouter = require('./routes/subject');
const lectureRouter = require('./routes/lecture');
const noticeRouter = require('./routes/notice');
const lectureNoteRouter = require('./routes/lectureNote');
const quizRouter = require('./routes/quiz');
const commentRouter = require('./routes/comment');
const emotionRouter = require('./routes/emotion');
const understandingRouter = require('./routes/understanding');
const subtitleRouter = require('./routes/subtitle');
const questionRouter = require('./routes/question');
const assignmentRouter = require('./routes/assignment');

// Passport for OAuth
// app.use(passport.initialize());
// app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/subject', subjectRouter);
app.use('/lecture', lectureRouter);
app.use('/notice', noticeRouter);
app.use('/lectureNote', lectureNoteRouter);
app.use('/quiz', quizRouter);
app.use('/comment', commentRouter);
app.use('/emotion', emotionRouter);
app.use('/understanding', understandingRouter);
app.use('/subtitle', subtitleRouter);
app.use('/question', questionRouter);
app.use('/assignemnt', assignmentRouter);

// Swagger Setting
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

module.exports = app;
