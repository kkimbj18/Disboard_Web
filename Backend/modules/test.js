const subjects = {
    students: [{
        id: 0,
        attendance: 'X'
    }, {
        id: 1,
        attendance: 'X'
    }]
}

subjects.students.some((student) => {
    if (student.id === 0) {
        student.attendance = 'O';

        return true;
    }
})

console.log(subjects);