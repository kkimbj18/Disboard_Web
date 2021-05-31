import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import moment from 'moment';
import {DatePicker, Space} from 'antd';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const { RangePicker } = DatePicker;

const Container = styled.div`
width : 97%;
height : 100%;
display : inline-block;
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
const WriteBtn = styled.a`
display: inline-block;
float: right;
font-size: 16px;
padding: 5px;
background-color: ${props => props.theme.color.blue};
color: white;
border-radius: 5px;
`
const Box = styled.button`
text-align: center;
height: 100px;
font-size: 20px;
font-weight: 800;
display: inline-block;
background: white;
border-radius: 5px;
padding: 10px;
box-shadow: 0 5px 5px 0 #eeeeee;
&:hover{
    background: ${props => props.theme.color.blue};
    color: white;
}
`
const TitleInput = styled.input`
padding : 5px;
border : 1px solid ${props => props.theme.color.gray4};
width : 100%;
margin : 10px 0px;
`
function Problem({problem, index, onRemove}){
    console.log(problem)
    switch (problem.type) {
        case "short":
            return(
                <div>
                    <div>과제 설명</div>
                    <div>{problem.describe}</div>
                    <div>정답 : {problem.answer}</div>
                    <button onClick={() => onRemove(index)}>삭제</button>
                </div>
            )
        case "num":
            return(
                <div>
                    <div>과제 설명</div>
                    <div>{problem.describe}</div>
                    <div>정답 : {problem.answer}</div>
                    <button onClick={() => onRemove(index)}>삭제</button>
                </div>
            )
        default:
            return(
                <div>
                    <div>과제 설명</div>
                    <div>{problem.describe}</div>
                    <div>정답 : {problem.answer}</div>
                    <button onClick={() => onRemove(index)}>삭제</button>
                </div>
            )
    }
}
function ProblemList({problemList, onRemove}){
    console.log(problemList);
    return (<div>{problemList.map((problem, index) => (<Problem problem={problem} onRemove={onRemove} index={index}/>))}</div>);
}




function Index({match}) {
    const user = JSON.parse(window.sessionStorage.userInfo);
    const subjectId = match.params.subject;
    const subjectName = match.params.name;
    
    const [isClicked, setisClicked] = useState(true);

    const [title, setTitle] = useState("");
    const [lateSubmit, setlateSubmit] = useState(false);
    const [problemList, setProblemList] = useState([]);
    const [period, setPeriod] = useState();

    const onChangePeriod = (e, dateString) => {
        setPeriod({...period, 
            start: dateString[0],
            end: dateString[1]
        })
    }

    const add = useCallback((e) => {
        setisClicked(true);
    },[isClicked])

    const addProblem = (e, type) => {
        setisClicked(false);
        
    }
    
    const addLong = (e) => {
        console.log("서술형");
        let problem = {
            type: "long",
            describe: ""
        }
        problemList.push(problem);
        setisClicked(false);
    }

    const addShort = (e) => {
        console.log("단답형");
        let problem = {
            type: "short",
            describe: "",
            answer: ""
        }
        problemList.push(problem);
        setisClicked(false);
    }

    const addNum = (e) => {
        console.log("객관식");
        let problem = {
            type: "num",
            describe: "", 
            answer: 0,
            distractor:[]
        }
        problemList.push(problem);
        setisClicked(false);
    }

    const showProblem = (problem, index) => {
        switch (problem.type) {
            case "short":
                return(
                    <div>
                        <div>과제 설명</div>
                        <div><CKEditor editor={ ClassicEditor } data=""
                            onReady={ editor => {
                                console.log( 'Editor is ready to use!', editor );
                            } }
                            onChange={ ( event, editor ) => {
                                const data = editor.getData();
                                problem.describe = data;
                                console.log( { event, editor, data } );
                            } }
                            onBlur={ ( event, editor ) => {
                                console.log( 'Blur.', editor );
                            } }
                            onFocus={ ( event, editor ) => {
                                console.log( 'Focus.', editor );
                            } }/>
                        </div>
                        <div>정답 : {problem.answer}</div>
                        <button onClick={() => onRemove(index)}>삭제</button>
                    </div>
                )
            case "num":
                return(
                    <div>
                        <div>과제 설명</div>
                        <div>{problem.describe}</div>
                        <div>정답 : {problem.answer}</div>
                        <button onClick={() => onRemove(index)}>삭제</button>
                    </div>
                )
            default:
                return(
                    <div>
                        <div>과제 설명</div>
                        <div>{problem.describe}</div>
                        <button onClick={() => onRemove(index)}>삭제</button>
                    </div>
                )
        }
    }

    const onRemove = useCallback((id) => {
        setProblemList(problemList.filter((problem, index) => index !== id));
    },[problemList]);

    useEffect(() => {
    },[])

    return(
        <Container style={{marginLeft: "20px", marginTop: '10px'}}>
            <Title>Assignment</Title>
            <div style={{width: "100%", display: "block"}}>
                <SubTitle>내 강의 / <a style={{color: "black"}} href={`/main/${subjectId}/${subjectName}/home`}>{subjectName}</a> / <a style={{color: "black"}} href={`/main/${subjectId}/${subjectName}/pf/assignment`}>과제</a> / 과제 작성하기</SubTitle>
                <WriteBtn href={`/main/${subjectId}/${subjectName}/pf/assignment/write`} style={{display: "inline-block", float:"right"}}>저장하기</WriteBtn>
            </div>
            <hr style={{width: "100%", margin: "30px 0px", marginTop: "50px", display:"block", borderColor: '#ffffff'}}/>
            <div>
                <TitleInput type="text" name="title" onChange={(e)=> setTitle(e.target.value)} placeholder="제목"/>
                <div>과제 기한 : <RangePicker showTime={{hideDisabledOptions: true, defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}} format="YYYY-MM-DD HH:mm:ss" onChange={onChangePeriod}/></div>
                {/* <ProblemList problemList={problemList} onRemove={onRemove}/> */}
                {problemList.map((problem, index) => {showProblem(problem, index)})}
            </div>

            <div style={{display: "block", width: "100%", position:"relative"}}>
                <hr style={{width: "100%", borderColor: '#ffffff', position: "absolute", top: "35px"}}/>
                <button type="button" onClick={e=>add(e)} style={{position: "absolute", top: "10px", left: "50%", transform: "translateX(-50%)"}}><img style={{maxHeight: "50px"}} src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnPjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZD0ibTI1NiAwYy0xNDEuMTY0MDYyIDAtMjU2IDExNC44MzU5MzgtMjU2IDI1NnMxMTQuODM1OTM4IDI1NiAyNTYgMjU2IDI1Ni0xMTQuODM1OTM4IDI1Ni0yNTYtMTE0LjgzNTkzOC0yNTYtMjU2LTI1NnptMCAwIiBmaWxsPSIjNDA3YWQ2IiBkYXRhLW9yaWdpbmFsPSIjMjE5NmYzIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+PHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkPSJtMzY4IDI3Ny4zMzIwMzFoLTkwLjY2Nzk2OXY5MC42Njc5NjljMCAxMS43NzczNDQtOS41NTQ2ODcgMjEuMzMyMDMxLTIxLjMzMjAzMSAyMS4zMzIwMzFzLTIxLjMzMjAzMS05LjU1NDY4Ny0yMS4zMzIwMzEtMjEuMzMyMDMxdi05MC42Njc5NjloLTkwLjY2Nzk2OWMtMTEuNzc3MzQ0IDAtMjEuMzMyMDMxLTkuNTU0Njg3LTIxLjMzMjAzMS0yMS4zMzIwMzFzOS41NTQ2ODctMjEuMzMyMDMxIDIxLjMzMjAzMS0yMS4zMzIwMzFoOTAuNjY3OTY5di05MC42Njc5NjljMC0xMS43NzczNDQgOS41NTQ2ODctMjEuMzMyMDMxIDIxLjMzMjAzMS0yMS4zMzIwMzFzMjEuMzMyMDMxIDkuNTU0Njg3IDIxLjMzMjAzMSAyMS4zMzIwMzF2OTAuNjY3OTY5aDkwLjY2Nzk2OWMxMS43NzczNDQgMCAyMS4zMzIwMzEgOS41NTQ2ODcgMjEuMzMyMDMxIDIxLjMzMjAzMXMtOS41NTQ2ODcgMjEuMzMyMDMxLTIxLjMzMjAzMSAyMS4zMzIwMzF6bTAgMCIgZmlsbD0iI2ZhZmFmYSIgZGF0YS1vcmlnaW5hbD0iI2ZhZmFmYSIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjwvZz48L3N2Zz4=" /></button>
                {isClicked && <div style={{textAlign: 'center', position: "absolute", top: "70px", width: "100%"}}>
                    <Box style={{width: "30%"}} onClick={addLong}>서술형<br/>문제</Box>
                    <Box style={{width: "30%", margin: "0 10px"}} onClick={addShort}>단답형<br/>문제</Box>
                    <Box style={{width: "30%"}} onClick={addNum}>객관식<br/>문제</Box>
                </div>}
            </div>
        </Container>
    );
}

export default Index;    