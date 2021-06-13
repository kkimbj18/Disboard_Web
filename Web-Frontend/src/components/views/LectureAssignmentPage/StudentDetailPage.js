import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import moment from 'moment';
import ReactHtmlParser from 'react-html-parser';
import ShowResponse from "../../utils/Comment/Index"

const Container = styled.div`
width : 100%;
display : inline-block;
margin: 10px auto;
padding: 0px 20px;
//overflow-y: auto;
//align-items : center;
//justify-content : center;
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
`
const ProblemContainer = styled.div`
background-color: white;
border-radius: 10px;
padding: 30px 15px;
margin: 0 auto;
width: 100%;
box-shadow: 0 5px 5px 0 #eeeeee;
`
const ProblemTitle = styled.div`
font-size: 20px;
font-weight: 600;
`
const ProblemContent = styled.div`
width: 100%;
margin: 10px auto;
padding: 0 5px;
`
const AnswerInput = styled.textarea`
height: 60px;
width: 100%;
resize: none;
border: 1px solid #d9d9d9;
&:focus{
    border: 1px solid #40a9ff;
    box-shadow: 0 0 0 2px #1890FF 20%;
    outline: 0;
}
`

function Index({match}) {
    const user = JSON.parse(window.sessionStorage.userInfo);
    const subjectId = match.params.subject;
    const subjectName = match.params.name;
    const problemId = match.params.id;

    const [problem, setProblem] = useState({id: 3, title: "과제 제목", score: 30, content: "내용", fileURL: "", startDate: "2021-05-01T00:00:00", endDate: "2021-05-15T23:59:59", checked: true, studentList: [2, 5, 3, 6, 7, 8, 9], comments: []});
    const [beforeAnswer, setBeforeAnswer] = useState({answer: "", fileURL: "", score: 0});
    const [studentAnswer, setStudentAnswer] = useState("");
    const [studentFile, setStudentFile] = useState("");
    const today = moment();

    const [isonGoing, setisonGoing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    function isSubmit(element){
        if(element._id === user._id){return true;}
    }

    const getData = () => {
        return new Promise((resolve, reject) => {
            axios.get(`/api/assignment/get/` + problemId)
            .then((response)=>{
                const result = response.data;
                console.log(result);
                setProblem(result.assignment);
                if(today.isBefore(result.assignment.deadline) && today.isAfter(result.assignment.date)){setisonGoing(true);}
                let submit = result.students.find(isSubmit);
                setBeforeAnswer({
                    answer: submit.answer,
                    fileURL: submit.fileURL,
                    score: submit.score
                })
                resolve();
            })
            .catch((error)=>{
                console.log(error);
                reject(error);
            });
        })
    }

    const stateDisplay = (startDate, endDate) => {

        if(today.isBefore(startDate)){
            return(<div style={{color: "#BFBFBF", fontWeight: "700"}}>{moment(startDate).format('M월 D일 HH:mm')} - {moment(endDate).format('M월 D일 HH:mm')} (예정)</div>);
        }else if(today.isBefore(endDate)){
            return(<div style={{color: "#61C679", fontWeight: "700"}}>{moment(startDate).format('M월 D일 HH:mm')} - {moment(endDate).format('M월 D일 HH:mm')} (진행중)</div>);
        }else{
            return(<div style={{color: "#E24C4B", fontWeight: "700"}}>{moment(startDate).format('M월 D일 HH:mm')} - {moment(endDate).format('M월 D일 HH:mm')} (마감)</div>);
        }

    }

    const onChangeAnswer = (e) => {
        setStudentAnswer(e.target.value);
    }

    const getFile = (e) => {
        console.log(e.target);
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        formData.append("fileName", e.target.files[0].name);

        const url = '/api/file/upload';
        axios.post(url, formData)
        .then((response) => {
            console.log(response.data)
            setStudentFile(response.data);
            axios.get('/api/file/read/' + response.data.fileId)
            .then((res)=>{
                setStudentFile(res.data.fileURL)
            })
            .catch((error)=>{
                console.log(error);  
            })

        })
        .catch((error)=>{
            console.log(error);  
        })
    }

    const submitHandler = (e) => {
        e.preventDefault();
        axios.put('/api/assignment/submit',{
            assignmentId: problemId,
            submission: {
                fileURL: studentFile,
                content : studentAnswer          
            }
        })
        .then((response) => {
            console.log(response);
            return window.location.href=`/main/${subjectId}/${subjectName}/st/assignment/${problemId}`;
        })
        .catch((response) => {
            console.log('Error: ' + response);
        })
    }
    
    const display = () => {
        return(<div>
            <Title>Assignment</Title>
            <div style={{width: "100%", display: "block"}}>
                <SubTitle>내 강의 / <a style={{color: "black"}} href={`/main/${subjectId}/${subjectName}/home`}>{subjectName}</a> / <a style={{color: "black"}} href={`/main/${subjectId}/${subjectName}/st/assignment`}>과제</a> / {problem.title}</SubTitle>
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
                {/* <ShowResponse commentList={problem.comments} emotionList={problem.emotions} postId={problem._id} subjectId={subjectId} subjectName={subjectName} userId={user._id} type={"assignment"}/> */}
            </ProblemContainer>
            <ProblemContainer style={{margin: "10px auto"}}>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    {isonGoing ? <ProblemTitle>과제 제출물 작성</ProblemTitle> : <ProblemTitle>제출물</ProblemTitle>}
                    {isonGoing && <WriteBtn onClick={submitHandler}>제출하기</WriteBtn>}
                </div>
                <hr style={{width: "100%", margin: "10px 0px", display:"block", borderColor: '#ffffff'}}/>
                {isonGoing ? 
                <div>
                    <AnswerInput placeholder={beforeAnswer.answer} onChange={onChangeAnswer}/>
                    <div style={{display: "flex", justifyContent: "space-between", margin: "5px 0"}}>
                        <div style={{paddingLeft: "5px", lineHeight: "41.6px"}}>파일 첨부</div> 
                        <input type="file" onChange={getFile} style={{height: "41.6px", padding: "5px"}}/>
                    </div>
                </div> : 
                <div>
                    <AnswerInput placeholder={beforeAnswer.answer} onChange={onChangeAnswer} readOnly/>
                    {problem.checked && <div> {beforeAnswer.score} / {problem.score}</div>}
                </div>
                }
            </ProblemContainer>
        </div>)
    }

    useEffect(() => {
        getData().then(()=>{
            setIsLoading(true);
        })
    },[])

    return(
        <Container>
            {isLoading && display()}
        </Container>
    )

}

export default Index;