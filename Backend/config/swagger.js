const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: "Test API with swagger",
        version: '1.0.0'
    },
    host: process.env.IP,
    basePath: "/api",
    schemes: ['https', 'http'],
    tags: [
        { "name": "Auth" },
        { "name": "User" },
        { "name": "Subject" },
        { "name": "Lecture" },
        { "name": "Quiz" },
        { "name": "Notice" },
        { "name": "LectureNote" },
        { "name": "Comment" },
        { "name": "Emotion" },
        { "name": "Understanding" },
        { "name": "Subtitle" },
        { "name": "Question" },
        { "name": "Assignment" },
        { "name": "File" }
    ],
    definitions: {
        signUp: {
            $email: 'kkimbj18@ajou.ac.kr',
            $name: '김민건',
            photourl: 'url',
            $identityID: '201620912',
            $school: '아주대',
            $major: '소프트웨어학과',
            grade: 4,
            $type: 'student'
        },
        createSubject: {
            $name: '캡스톤디자인',
            $start_period: '2021-03-02',
            $end_period: '2021-06-30',
            start_time: ['16:30', '18:00', '19:30'],
            end_time: ['18:00', '19:30', '21:00'],
            days: [1, 1, 1],
        },
        closeLecture: {
            chattings: [{
                time: '09:00',
                name: '노민도',
                content: '담타 ㄱㄱ?'
            },
            {
                time: '09:10',
                name: '윤다연',
                content: '혹시 제 말 안 들렸어요?'
            }],
            lectureId: 0
        },
        authFailed: {
            success: false,
            isLogined: false
        },
        proAuthFailed: {
            success: false,
            isProfessor: false
        },
        subject: {
            _id: 0,
            name: '캡스톤디자인',
            start_period: '2021-03-02',
            end_period: '2021-06-30',
            start_time: ['16:30', '18:00', '19:30'],
            end_time: ['18:00', '19:30', '21:00'],
            days: [1, 1, 1],
            code: '519hi32hkjifb12',
            lectures: [],
            students: [0],
            introURL: ''
        },
        subject2: {
            _id: 1,
            name: '인공지능',
            start_period: '2021-03-02',
            end_period: '2021-06-30',
            start_time: ['12:00', '13:30'],
            end_time: ['13:30', '15:00'],
            days: [1, 3],
            code: '235afwkjk153445',
            lectures: [],
            students: [0],
            introURL: ''
        },
        lecture: {
            _id: 0,
            date: '2021-05-05T00:00:00:000Z',
            start_time: '11:00',
            subject: 0,
            options: {
                subtitle: false,
                record: false,
                attendance: false,
                limit: 5
            },
        },
        user: {
            _id: 1,
            name: 'ㄱㄴㄷ',
            email: 'amola@ajou.ac.kr',
            school: '아주대학교',
            identityID: '201620817',
            major: '컴퓨터공학',
            type: 'student',
            subject: [0]
        }
    }
}

const outputFile = './swagger.json';
const endpointsFiles = [
    './routes/auth.js', 
    './routes/user.js', 
    './routes/subject.js',
    './routes/lecture.js',
    './routes/quiz.js',
    './routes/lectureNote.js',
    './routes/notice.js',
    './routes/comment.js',
    './routes/emotion.js',
    './routes/understanding.js',
    './routes/subtitle.js',
    './routes/question.js',
    './routes/assignment.js',
    './routes/file.js'
]

swaggerAutogen(outputFile, endpointsFiles, doc).then(()=>{
    require('../bin/www');
});