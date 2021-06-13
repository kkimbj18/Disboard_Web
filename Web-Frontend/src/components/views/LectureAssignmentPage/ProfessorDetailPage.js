import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import styled from 'styled-components';
import moment from 'moment';
import ReactHtmlParser from 'react-html-parser';
import UpdatePage from "./UpdateAssignmentPage";
import ShowResponse from "../../utils/Comment/Index"
import { resolve } from 'dns';

const Container = styled.div`
width : 97%;
display: block;
justify-content: center;
align-items: center;
margin: 10px auto;
padding: 0 20px;
`
const Title = styled.div`
font-size : 30px;
border-bottom : 1px solid #F7F9FC;
height : 40px;
line-height : 40px;
font-style : italic;
`
const SubTitle = styled.div`
float: left;
margin-top: 3px;
margin-right: 20px;
color : #8b8b8b;
font-size : 13px;
font-weight: 400;
`
const WriteBtn = styled.button`
display: inline-block;
float: right;
font-size: 16px;
padding: 5px;
background-color: ${props => props.theme.color.blue};
color: white;
border-radius: 5px;
margin-right: 5px;
`
const ProblemContainer = styled.div`
background-color: white;
border-radius: 10px;
padding: 20px 15px;
margin: 0 auto;
margin-bottom: 50px;
width: 100%;
box-shadow: 0 5px 5px 0 #eeeeee;
`
const ProblemTitle = styled.div`
width: 100%;
font-size: 20px;
font-weight: 600;
`
const ProblemContent = styled.div`
width: 100%;
margin: 10px auto;
padding: 0 5px;
`
const ScoreInput = styled.input`
width: 30%;
border: 1px solid #d9d9d9;
padding : 10px;
display: inline-block;
`
const ScoreButton = styled.button`
width: 20%;
display: inline-block;
padding: 3px;
background-color: ${props => props.theme.color.blue};
color: white;
border-radius: 5px;
`
const CheckBtn = styled.button`
display: block;
margin: 10px auto;
font-size: 16px;
padding: 5px;
background-color: ${props => props.theme.color.blue};
color: white;
border-radius: 5px;
`


function StudentSubmit({studentList, changeScore, score}){
    const [studentScore, setStudentScore] = useState();

    const onChangeScore = (e) => {
        setStudentScore(e.target.value);
    }

    return(
        <div>
        <hr style={{width: "100%", margin: "10px 0px", display:"block", borderColor: '#ffffff'}}/>
        <ProblemTitle>학생 제출물</ProblemTitle>
        <table style={{width: "100%", margin: "10px auto", borderTop: "1px solid #D5D5D5", textAlign: "center", borderSpacing: "0px 10px", borderCollapse: "separate"}}>
                <thead style={{borderBottom: "1px solid #D5D5D5", fontStyle: "bold", fontWeight:"500", backgroundColor: "#f3f3f3"}}>
                    <tr>
                        <th style={{padding: "10px 0", width: "20%"}}>이름</th>
                        <th style={{padding: "10px 0", width: "30%"}}>내용</th>
                        <th style={{padding: "10px 0", width: "20%"}}>첨부파일</th>
                        <th style={{padding: "10px 0", width: "30%"}}>점수</th>
                    </tr>
                </thead>
                <tbody>
                    {studentList.map((student, index) => 
                    <tr style={{borderRadius: "5px", boxShadow: "0px 2px 2px 1px #eeeeee", cursor: "pointer"}}>
                        <td style={{padding: "10px 0", backgroundColor: "white", borderRadius: "5px 0 0 5px"}}>{student.name}</td>
                        <td style={{padding: "10px 0", backgroundColor: "white"}}>{student.answer}</td>
                        <td style={{padding: "10px 0", backgroundColor: "white"}}><a href={student.fileURL}>{student.name}</a></td>
                        <td style={{padding: "10px 0", backgroundColor: "white"}}>
                            <div style={{display: "flex", justifyContent: "space-between", margin: "0", padding: "0 5px"}}>
                                <div><ScoreInput onChange={onChangeScore} placeholder={student.score}/><span style={{width:"20%"}}> / {score} </span></div>
                                <ScoreButton onClick={(e) => changeScore(index, studentScore)}>저장</ScoreButton>
                            </div>
                        </td>
                    </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

function Index({match}) {
    const user = JSON.parse(window.sessionStorage.userInfo);
    const subjectId = String(match.params.subject);
    const subjectName = match.params.name;
    const problemId = String(match.params.id);

    const [problem, setProblem] = useState({id: 3, title: "과제 제목", score: 30, content: "내용", fileURL: "", startDate: "2021-05-01T00:00:00", endDate: "2021-05-15T23:59:59", checked: true, studentList: [2, 5, 3, 6, 7, 8, 9], comments: [], emotions: []});
    const [studentList, setStudentList] = useState([
        {id: 2, name: "홍길동", answer: "", fileURL: "", score: 0},
        {id: 2, name: "홍길동", answer: "", fileURL: "", score: 0},
        {id: 2, name: "홍길동", answer: "", fileURL: "", score: 0}
    ]);

    const [isLoading, setIsLoading] = useState(true);

    const getData = () => {
        return new Promise((resolve, reject) => {
            axios.get(`/api/assignment/get/` + problemId)
            .then((response)=>{
                const result = response.data;
                console.log(result);
                setProblem(result.assignment);
                setStudentList(result.assignment.students);
                resolve();
            })
            .catch((error)=>{
                console.log(error);
                reject(error);
            });
        })
    }

    const stateDisplay = (startDate, endDate) => {
        const today = moment();

        if(today.isBefore(startDate)){
            return(<div style={{color: "#BFBFBF", fontWeight: "700"}}>{moment(startDate).format('M월 D일 HH:mm')} - {moment(endDate).format('M월 D일 HH:mm')} (예정)</div>);
        }else if(today.isBefore(endDate)){
            return(<div style={{color: "#61C679", fontWeight: "700"}}>{moment(startDate).format('M월 D일 HH:mm')} - {moment(endDate).format('M월 D일 HH:mm')} (진행중)</div>);
        }else{
            return(<div style={{color: "#E24C4B", fontWeight: "700"}}>{moment(startDate).format('M월 D일 HH:mm')} - {moment(endDate).format('M월 D일 HH:mm')} (마감)</div>);
        }

    }

    const onClickUpdate = (e) => {
        e.preventDefault();
        return window.location.href = `/main/${subjectId}/${subjectName}/pf/assignment/${problemId}/update`;
    }

    const deleteAssignment = (e) => {
        e.preventDefault();
        const url = '/api/assignment/delete/' + problemId;
        axios.delete(url)
        .then((response)=>{
            const result = response.data;
            if(result.success){ 
                alert("해당 공지사항이 삭제되었습니다.");
                return window.location.href = `/main/${subjectId}/${subjectName}/pf/assignment/`;}
        })
        .catch((error)=>{
            console.log(error);
        });
        
    }

    const onChangeScore = (index, newScore) => {
        const updateData = {id: studentList[index].id, name: studentList[index].name, answer: studentList[index].answer, fileURL: studentList[index].fileURL, score: newScore}
        let newList = [];
        studentList.map((student, id)=> {
            if(id === index){newList.push(updateData)}
            else{newList.push(student)}
        })
        setStudentList(newList);
        axios.put('/api/assignment/update',{
            id: problemId,
            title: problem.title,
            content: problem.content,
            fileURL: problem.fileURL,
            date: problem.date,
            deadline: problem.deadline,
            score: problem.score,
            checked: problem.checked,
            students: newList
        })
        .then((response) => {
            console.log(response);
        })
        .catch((response) => {
            console.log('Error: ' + response);
        })
    }

    const updateScore = (e)=> {
        e.preventDefault();
        axios.put('/api/assignment/update',{
            id: problemId,
            title: problem.title,
            content: problem.content,
            fileURL: problem.fileURL,
            date: problem.date,
            deadline: problem.deadline,
            score: problem.score,
            checked: true,
            students: studentList
        })
        .then((response) => {
            console.log(response);
            return window.location.href=`/main/${subjectId}/${subjectName}/pf/assignment/${problemId}`;
        })
        .catch((response) => {
            console.log('Error: ' + response);
        })
    }

    const display = () => {
        return(
            <Container>
                <Title>Assignment</Title>
                <div style={{width: "100%", display: "block"}}>
                    <SubTitle>내 강의 / <a style={{color: "black"}} href={`/main/${subjectId}/${subjectName}/home`}>{subjectName}</a> / <a style={{color: "black"}} href={`/main/${subjectId}/${subjectName}/pf/assignment`}>과제</a> / {problem.title}</SubTitle>
                        <WriteBtn onClick={deleteAssignment} style={{display: "inline-block", float:"right", backgroundColor: "red"}}>삭제하기</WriteBtn>
                        <WriteBtn onClick={onClickUpdate} style={{display: "inline-block", float:"right"}}>수정하기</WriteBtn>
                </div>
                <hr style={{width: "100%", margin: "30px 0px", marginTop: "50px", display:"block", borderColor: '#ffffff'}}/>
                <ProblemContainer>
                    <ProblemTitle>{problem.title}</ProblemTitle>
                    <hr style={{width: "100%", margin: "10px 0px", display:"block", borderColor: '#ffffff'}}/>
                    <div style={{display: "flex", justifyContent: "space-between", margin: "0", padding: "0 5px", fontWeight: "700"}}>
                        <div>{stateDisplay(moment(problem.date), moment(problem.deadline))}</div>
                        <div>배점 {problem.score}</div>
                    </div>
                    <ProblemContent>
                        <a href={problem.fileURL}>{problem.title}</a>
                        {ReactHtmlParser(problem.content)}
                    </ProblemContent>
                    <hr style={{width: "100%", margin: "10px 0px", display:"block", borderColor: '#ffffff'}}/>
                    <ShowResponse commentList={problem.comments} emotionList={problem.emotions} postId={problem._id} subjectId={subjectId} subjectName={subjectName} userId={user._id} type={"assignment"}/>
                    <hr style={{width: "100%", margin: "10px 0px", display:"block", borderColor: '#ffffff'}}/>
                    <StudentSubmit studentList={studentList} changeScore={onChangeScore} score={problem.score}/>
                    <CheckBtn onClick={updateScore}>채점 완료</CheckBtn>
                </ProblemContainer>
            </Container>
        )
    }

    useEffect(() => {
        getData().then(()=>{
            setIsLoading(true);
        })
    },[])

    return(
        <Router>
            <Switch>
                <Route path="/main/:subject/:name/pf/assignment/:id/update" component={UpdatePage}/>
                <Route path="/">{isLoading && display()}</Route>
            </Switch>
        </Router>
    )

}

export default Index;