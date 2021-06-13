import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import moment from 'moment';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import { resolve } from 'dns';
import WritePage from "./WritePFPage"
import DetailPage from "./ProfessorDetailPage"

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
const WriteBtn = styled.a`
display: inline-block;
float: right;
font-size: 16px;
padding: 5px;
background-color: ${props => props.theme.color.blue};
color: white;
border-radius: 5px;
`
const StateColorCircle = styled.div`
width: 20px;
height: 20px;
display: inline-block;
float: right;
border-radius: 75px;
`
const StateDescript = styled.div`
height: 20px;
display: inline-block;
float: right;
font-size: 14px;
margin-left: 5px;
margin-right: 10px;
`
const StateBox = styled.div`
justify-content : center;
margin: 0px auto;
display: block;
border-radius: 50px;
padding: 10px;
width 50%;
`

function Index({match}) {
    const subjectId = String(match.params.subject);
    const subjectName = match.params.name;

    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setisEmpty] = useState(false);
    const [assignmentList, setAssignmentList] = useState([]);
    const [studentNum, setStudentNum] = useState(0);
    
    /* const assignmentList = [
        {id: 0, title: "과제 제목2", content: "내용", fileURL: "", score: 20, startDate: "2021-06-01T00:00:00", endDate: "2021-06-25T23:59:59", checked: false, studentList: []},
        {id: 1, title: "과제 제목1", content: "내용", fileURL: "", score: 40,startDate: "2021-05-15T00:00:00", endDate: "2021-06-05T23:00:00", checked: false, studentList: [5, 2]},
        {id: 2, title: "과제 제목", content: "내용", fileURL: "", score: 10, startDate: "2021-05-01T00:00:00", endDate: "2021-05-15T23:59:59", checked: false, studentList: [2, 5, 3, 6, 7, 8, 9]},
        {id: 3, title: "과제 제목", content: "내용", fileURL: "", score: 30, startDate: "2021-05-01T00:00:00", endDate: "2021-05-15T23:59:59", checked: true, studentList: [2, 5, 3, 6, 7, 8, 9]}
    ] */

    const getData = () => {
        return new Promise((resolve, reject) => {
            axios.get('/api/subject/info/'+ subjectId)
            .then((response)=>{
                const result = response.data.subject;
                setStudentNum(result.students.length);
            })
            .catch((error)=>{
                console.log(error);
                reject(error);
            });

            axios.get(`/api/assignment/get/subject/` + subjectId)
            .then((response)=>{
                const result = response.data;
                console.log(result);
                setisEmpty(result.assignments.length == 0 ? true : false);
                setAssignmentList(result.assignments);
                resolve();
            })
            .catch((error)=>{
                console.log(error);
                reject(error);
            });
        })
    }

    const stateDisplay = (startDate, endDate, studentList) => {
        const today = moment();
        if(today.isBefore(startDate)){
            return(<StateBox style={{backgroundColor: "#BFBFBF"}}>0 / {studentNum}</StateBox>);
        }else if(today.isBefore(endDate)){
            return(<StateBox style={{backgroundColor: "#ffcc36"}}>{studentList.length} / {studentNum}</StateBox>);
        }else{
            return(<StateBox style={{backgroundColor: "#E24C4B"}}>{studentList.length} / {studentNum}</StateBox>);
        }

    }

    const goDetail = useCallback((id, e) => {
        e.preventDefault();                
        return window.location.href=`/main/${subjectId}/${subjectName}/pf/assignment/${id}`
    },[])

    const display = () => {
        return(
            <div>
                {isEmpty ? <div style={{textAlign:'center', marginTop:'300px', fontSize:'30px', fontStyle:'italic'}}>과제가 없습니다.</div> : 

                <table style={{width: "100%", margin: "10px auto", borderTop: "1px solid #D5D5D5", textAlign: "center", borderSpacing: "0px 10px", borderCollapse: "separate"}}>
                    <thead style={{borderBottom: "1px solid #D5D5D5", fontStyle: "bold", fontWeight:"500", backgroundColor: "#f3f3f3"}}>
                        <tr>
                            <th style={{padding: "10px 0", width: "30%"}}>과제 내용</th>
                            <th style={{padding: "10px 0", width: "30%"}}>과제 기간</th>
                            <th style={{padding: "10px 0", width: "20%"}}>진행 상태</th>
                            <th style={{padding: "10px 0", width: "20%"}}>채점 상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignmentList.map((value, index) => 
                        <tr style={{borderRadius: "5px", boxShadow: "0px 2px 2px 1px #eeeeee", cursor: "pointer"}} onClick={(e) => goDetail(value._id, e)}>
                            <td style={{padding: "10px 0", backgroundColor: "white", borderRadius: "5px 0 0 5px"}}>
                                <div style={{fontSize: "20px", fontWeight: "700", color: "#3E3E3E", display: "block"}}>{value.title}</div>
                                {/* <div style={{fontSize: "12px", color: "#949494", height: "18.4px"}}>{value.content}</div> */}
                            </td>
                            <td style={{padding: "10px 0", backgroundColor: "white"}}>{moment(value.date).format('M월 D일 HH:mm')} - {moment(value.deadline).format('M월 D일 HH:mm')}</td>
                            <td style={{padding: "10px 0", backgroundColor: "white", alignItems: "center", alignContent: "center"}}>{stateDisplay(moment(value.date), moment(value.deadline), value.students)}</td>
                            <td style={{padding: "10px 0", backgroundColor: "white", borderRadius: "0 5px 5px 0"}}>{value.checked ? "채점 완료" : "채점 전"}</td>
                        </tr>
                        )}
                    </tbody>
                </table>
                }
            </div>
        );
    }

    useEffect(() => {
        getData().then(()=>{
            setIsLoading(true);
        })
    },[])

    return(
        <Router>
            <Switch>
                <Route path="/main/:subject/:name/pf/assignment/write" component={WritePage}/>
                <Route path="/main/:subject/:name/pf/assignment/:id" component={DetailPage}/>
                <Route path="/">
                    <Container>
                        <Title>Assignment</Title>
                        <div style={{width: "100%", display: "block"}}>
                            <SubTitle>내 강의 / <a style={{color: "black"}} href={`/main/${subjectId}/${subjectName}/home`}>{subjectName}</a> / 과제</SubTitle>
                            <WriteBtn href={`/main/${subjectId}/${subjectName}/pf/assignment/write`} style={{display: "inline-block", float:"right"}}>작성하기</WriteBtn>
                        </div>
                        <hr style={{width: "100%", margin: "30px 0px", marginTop: "50px", display:"block", borderColor: '#ffffff'}}/>
                        <div style={{width: "100%", display: "block", height: "20px"}}>
                            <StateDescript>마감</StateDescript> <StateColorCircle style={{backgroundColor: "#E24C4B"}}/> 
                            <StateDescript>진행 중</StateDescript> <StateColorCircle style={{backgroundColor: "#ffcc36"}}/>
                            <StateDescript>출제 전</StateDescript> <StateColorCircle style={{backgroundColor: "#BFBFBF"}}/>
                        </div>
                        {isLoading && display()}
                    </Container>
                </Route>
                
            </Switch>
        </Router>
    );
}

export default Index;          