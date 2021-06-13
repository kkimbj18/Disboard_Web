import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import moment from 'moment';
import {DatePicker, Space} from 'antd';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const { RangePicker } = DatePicker;

const Container = styled.div`
width : 97%;
display: block;
justify-content: center;
align-items: center;
margin: 10px auto;
padding: 0 20px;
margin-bottom: 50px;
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
const SubmitBtn = styled.button`
display: inline-block;
float: right;
font-size: 16px;
padding: 5px;
background-color: ${props => props.theme.color.blue};
color: white;
border-radius: 5px;
`
const TitleInput = styled.input`
padding : 10px;
border: none;
border-bottom : 1px solid ${props => props.theme.color.gray4};
width : 100%;
margin : 10px 0px;
border-radius: 3px;
&:focus{
    border: 1px solid #40a9ff;
    box-shadow: 0 0 0 2px #1890FF 20%;
    outline: 0;
}
font-size: 20px;
`
const ScoreInput = styled.input`
margin : 5px 0px;
border-radius: 3px;
height: 31.6px;
border: 1px solid #d9d9d9;
padding: 0px 10px;
&:focus{
    border: 1px solid #40a9ff;
    box-shadow: 0 0 0 2px #1890FF 20%;
    outline: 0;
}
&::-webkit-outer-spin-button,
&::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
`
const ListContainer = styled.div`
background-color: white;
border-radius: 10px;
padding: 15px;
margin: 0 auto;
width: 80%;
box-shadow: 0 5px 5px 0 #eeeeee;
`

function Index({match}) {
    const user = JSON.parse(window.sessionStorage.userInfo);
    const subjectId = match.params.subject;
    const subjectName = match.params.name;

    const [title, setTitle] = useState("");
    const [descript, setDescript] = useState("");
    const [period, setPeriod] = useState("");
    const [score, setScore] = useState(0);
    const [fileURL, setFileURL] = useState();
    // const [lateSubmit, setlateSubmit] = useState(false);

    const onChangePeriod = (e, dateString) => {
        setPeriod({...period, 
            start: dateString[0],
            end: dateString[1]
        })
    }

    const submitHandler = (e) => {
        e.preventDefault();
        axios.post('/api/assignment/create',{
            subject : subjectId,
            title : title,
            content : descript,
            fileURL: fileURL,
            score: score,
            date: period.start,
            deadline: period.end

        })
        .then((response) => {
            console.log(response);
            return window.location.href=`/main/${subjectId}/${subjectName}/pf/assignment/`;
        })
        .catch((response) => {
            console.log('Error: ' + response);
        })
         
    }

    const getFile = (e) => {
        console.log(e.target);
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        formData.append("fileName", e.target.files[0].name);

        const url = '/api/file/upload';
        axios.post(url, formData)
        .then((response) => {
            console.log(response.data);
            // setFileURL(response.data);
            axios.get('/api/file/read/' + String(response.data.fileId))
            .then((res)=>{
                setFileURL(res.data.fileURL);
            })
            .catch((err)=>{
                console.log(err)
            })
        })
        .catch((error)=>{
            console.log(error);  
        })
    }

    return(
        <Container>
            <Title>Assignment</Title>
            <div style={{width: "100%", display: "block"}}>
                <SubTitle>내 강의 / <a style={{color: "black"}} href={`/main/${subjectId}/${subjectName}/home`}>{subjectName}</a> / <a style={{color: "black"}} href={`/main/${subjectId}/${subjectName}/pf/assignment`}>과제</a> / 과제 작성하기</SubTitle>
                <SubmitBtn onClick={submitHandler} style={{display: "inline-block", float:"right"}}>저장하기</SubmitBtn>
            </div>
            <hr style={{width: "100%", margin: "30px 0px", marginTop: "50px", display:"block", borderColor: '#ffffff'}}/>
            <ListContainer>
                <TitleInput type="text" name="title" onChange={(e)=> setTitle(e.target.value)} placeholder="과제 제목"/>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <div style={{paddingLeft: "5px", lineHeight: "31.6px"}}>과제 기한</div> 
                    <div><RangePicker showTime={{hideDisabledOptions: true, defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')]}} format="YYYY-MM-DD HH:mm:ss" onChange={onChangePeriod}/></div>
                </div>
                <div style={{display: "flex", justifyContent: "space-between", margin: "5px 0"}}>
                    <div style={{paddingLeft: "5px", lineHeight: "41.6px"}}>배점</div> 
                    <ScoreInput type="number" onChange={(e)=> setScore(e.target.value)}/>
                </div>
                <div style={{display: "flex", justifyContent: "space-between", margin: "5px 0"}}>
                    <div style={{paddingLeft: "5px", lineHeight: "41.6px"}}>파일 첨부</div> 
                    <input type="file" onChange={getFile} style={{height: "41.6px", padding: "5px"}}/>
                </div>

                <div style={{margin: "10px auto"}}>
                    <CKEditor editor={ ClassicEditor } data=""
                        onReady={ editor => {
                            console.log( 'Editor is ready to use!', editor );
                            editor.editing.view.change((writer) => {
                                writer.setStyle(
                                    "height",
                                    "300px",
                                    editor.editing.view.document.getRoot()
                                )
                            })
                        }}
                        onChange={ ( event, editor ) => {
                            const data = editor.getData();
                            setDescript(data);
                            console.log( { event, editor, data } );
                        } }
                        onBlur={ ( event, editor ) => {
                            console.log( 'Blur.', editor );
                        } }
                        onFocus={ ( event, editor ) => {
                            console.log( 'Focus.', editor );
                        } }/>
                </div>
            </ListContainer>
        </Container>
    );
}

export default Index;    