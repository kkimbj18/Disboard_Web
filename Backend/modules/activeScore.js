const { Lecture } = require('../models/subjects');

const increaseActiveScore = (lectureId, studentId) => {
    Lecture.findOne({ _id: lectureId }, (err, doc) => {
        if (err) return false;

        student = doc.students.find((student) => {
            if (student.student === studentId) return true;
        });

        student.activeScore++;

        doc.save((err, doc) => {
            if (err) return false;

            console.log(doc);
            return true;
        })
    })
}

module.exports = increaseActiveScore;