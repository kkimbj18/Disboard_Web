import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const Container = styled.div`
width : 97%;
height : 100%;
display : inline-block;
margin-left: 20px;
margin-top: 10px;
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
const SubmitBtn = styled.button`
font-size: 16px;
padding: 5px;
background-color: ${props => props.theme.color.blue};
color: white;
border-radius: 5px;
`
const TitleInput = styled.input`
padding : 5px;
border : 1px solid ${props => props.theme.color.gray4};
width : 100%;
margin : 10px 0px;
`

function Index({match}){
    const subjectId = String(match.params.subject);
    const subjectName = String(match.params.name);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState();
    const [fileURL, setFileURL] = useState("");
    // const [fileURL, setFileURL] = useState();

    const getTitle = (e) => {
        setTitle(e.target.value);
        console.log(title);
    }

    const getFile = (e) => {
        console.log(e.target)
        if(e.target.files !== null){
            const fileData = new FormData();
            
        }
        const result = e.target.files[0];
        console.log(result);
        // setFileURL(result);
        fileURL.append(result);
    }

    const submitBtn = () => {
        console.log("title: " + title);
        console.log("content: " + content);

        axios.post('/api/lectureNote/create',{
            subject : subjectId,
            title : title,
            content : content,
            fileURL : fileURL
        })
        .then((response) => {
            console.log(response);
            return window.location.href=`/main/${subjectId}/${subjectName}/note/`;
        })
        .catch((response) => {
            console.log('Error: ' + response);
        })
    }

    return(
        <Container>
            <Title>Lecture Note</Title>
            <div style={{width: "100%", display: "block"}}>
                <SubTitle>내 강의 / <a style={{color: "black"}} href={`/main/${subjectId}/${subjectName}/home`}>{subjectName}</a> / <a style={{color: "black"}} href={`/main/${subjectId}/${subjectName}/lectureNote`}>강의 노트</a> / 강의 노트 작성</SubTitle>
                <SubmitBtn type="submit" onClick={submitBtn} style={{display: "inline-block", float:"right"}}>저장하기</SubmitBtn>
            </div>
            <hr style={{width: "100%", margin: "30px 0px", marginTop: "50px",display:"block", borderColor: '#ffffff'}}/>
            <form>
                <TitleInput type="text" name="title" onChange={getTitle} placeholder="제목"/>
                <CKEditor editor={ ClassicEditor } data=""
                onReady={ editor => {
                    console.log( 'Editor is ready to use!', editor );
                } }
                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    setContent(data);
                    console.log( { event, editor, data } );
                } }
                onBlur={ ( event, editor ) => {
                    console.log( 'Blur.', editor );
                } }
                onFocus={ ( event, editor ) => {
                    console.log( 'Focus.', editor );
                } }/>
                <input type="file" onChange={getFile}/>
            </form>
        </Container>
    );
}

export default Index;