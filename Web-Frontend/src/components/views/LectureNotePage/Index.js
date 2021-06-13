import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import moment from 'moment';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';
import WritePage from './WriteNotePage';
import UpdatePage from './UpdateNotePage';
import ShowResponse from "../../utils/Comment/Index"

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
const Box = styled.div`
width: 100%;
display: block;
margin : 0px 5px 10px 0px;
padding : 10px;
background: white;
border-radius: 5px;
box-shadow: 0px 2px 3px 1px #e0e0e0;
position: relative;
`
const NoteBox = styled.div`
display: block;
width: 100%;
margin: 0 auto;
padding: 10px;
`
const NoteTitle = styled.div`
display: block;
margin: 10px 0px 0px 10px;
color : #233044;
font-size : 16px;
font-weight: 700;
`
const NoteContent = styled.div`
width : 78%;
display: block;
font-size : 14px;
margin: 0px 0px 10px 10px;
// border-bottom : 1px solid #BFBFBF;
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
const NoteMenuButton = styled.button`
position: absolute;
height: 30px;
width: 30px;
top: 10px;
right: 10px;
border-radius:75px;
&:hover{
    background-color : #f3f3f3;
}
`
const NoteMenuBox = styled.div`
position: absolute;
top: 40px;
right: 10px;
`
const SmallBtn = styled.button`
font-size: 12px;
padding: 5px;
margin: 1px;
background-color: #ECECEC;
color: #3E3E3E;
border-radius: 5px;
&:hover{
    background-color : #BFBFBF;
}
`


function Index({match}) {
    
    const user = JSON.parse(window.sessionStorage.userInfo);
    const subjectId = match.params.subject;
    const subjectName = match.params.name;
    
    const isProfessor = user.type === "professor" ? true : false;
    const [isLoading, setisLoading] = useState(false);
    const [isEmpty, setisEmpty] = useState(false);
    const [isShowing, setisShowing] = useState(false)
    
    const [noteList, setNoteList] = useState([]);

    const getData = () => {
        const url = '/api/lectureNote/get/subject/' + subjectId;
        axios.get(url)
        .then((response)=>{
            const result = response.data.lectureNotes;
            console.log(result)
            setisEmpty(result.length === 0 ? true : false);
            setNoteList(result);
            setisLoading(true);            
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    const deleteNote = (noteID) => {
        const url = '/api/lectureNote/delete/' + noteID;
        axios.delete(url)
        .then((response)=>{
            const result = response.data;
            if(result.success){ 
                alert("해당 강의노트가 삭제되었습니다.");
                return window.location.href = `/main/${subjectId}/${subjectName}/lectureNote`;}
        })
        .catch((error)=>{
            console.log(error);
        });
    }

    const updateNote = (noteID) => {
        return (window.location.href = `/main/${subjectId}/${subjectName}/lectureNote/update/${noteID}`);
    }

    const display = () => {
        return( 
            <div> 
                {isEmpty ? <div style={{textAlign:'center', marginTop:'300px', fontSize:'30px', fontStyle:'italic'}}>작성된 강의 노트가 없습니다.</div> : noteList.map((value, index) => 
                <Box>
                    <NoteBox>
                        <NoteTitle>{value.title}</NoteTitle>
                        {isProfessor && <NoteMenuButton type="button" onClick={()=>setisShowing(!isShowing)}><img style={{maxHeight: "15px", maxWidth: "15px"}} src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIiBjbGFzcz0iIj48Zz48Y2lyY2xlIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgY3g9IjEyIiBjeT0iMTIiIHI9IjMiIGZpbGw9IiM3NTc1NzUiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvY2lyY2xlPjxjaXJjbGUgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBjeD0iMTIiIGN5PSIzIiByPSIzIiBmaWxsPSIjNzU3NTc1IiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L2NpcmNsZT48Y2lyY2xlIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgY3g9IjEyIiBjeT0iMjEiIHI9IjMiIGZpbGw9IiM3NTc1NzUiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvY2lyY2xlPjwvZz48L3N2Zz4=" /></NoteMenuButton>}
                    {isShowing && <NoteMenuBox>
                            <SmallBtn onClick={(e) => updateNote(value.id)}>수정</SmallBtn>
                            <SmallBtn onClick={(e) => deleteNote(value.id)}>삭제</SmallBtn>
                    </NoteMenuBox>}
                        <NoteContent>
                            {moment(value.date).format('YYYY년 M월 D일 HH:mm')}<br/>
                            <a href={value.fileURL}>{value.title}</a>
                            {ReactHtmlParser(value.content)}
                        </NoteContent>
                    </NoteBox>
                    <hr style={{width: "100%", margin: "10px 0px", display:"block"}}/>
                    <ShowResponse commentList={value.comments} emotionList={value.emotions} postId={value.id} subjectId={subjectId} subjectName={subjectName} userId={user._id} type={"lectureNote"}/>
                </Box>                
                )}
            </div>
        )
    }

    useEffect(() => {
        getData();
    },[])

    return(
        <Router>
            <Switch>
                <Route path="/main/:subject/:name/lectureNote/write" component={WritePage}/>
                <Route path="/main/:subject/:name/lectureNote/update/:id" component={UpdatePage}/>
                <Route path="/">
                    <Container>
                    <Title>Lecture Note</Title>
                    <div style={{width: "100%", display: "block"}}>
                        <SubTitle>내 강의 / <a style={{color: "black"}} href={`/main/${subjectId}/${subjectName}/home`}>{subjectName}</a> / 강의 노트</SubTitle>
                        {isProfessor && <WriteBtn href={`/main/${subjectId}/${subjectName}/lectureNote/write`}>작성하기</WriteBtn>}
                    </div>
                    <hr style={{width: "100%", margin: "30px 0px", marginTop: "50px",display:"block", borderColor: '#ffffff'}}/>
                    <div>
                        {isLoading && display()}
                    </div>                    
                    </Container>
                </Route>
            </Switch>
        </Router>
    );
}

export default Index;