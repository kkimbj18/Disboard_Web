import { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
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
width : 100%;
height : 100%;
display : inline-block;
`
const Title = styled.div`
font-size : 30px;
border-bottom : 1px solid #F7F9FC;
height : 80px;
line-height : 80px;
font-style : italic;
`
const SubTitle = styled.div`
float: left;
margin-right: 20px;
color : #233044;
font-size : 16px;
font-weight: 700;
`
const Box = styled.div`
display: block;
width: 100%;
margin : 10px 5px;
background : white;
border-radius: 5px;
padding: 10px;
box-shadow: 0px 3px #e0e0e0;
`
const NoteBox = styled.div`
display: block;
width: 100%;
margin: 0 auto;
padding: 10px;
`
const NoteTitle = styled.div`
float: left;
padding: 5px;
margin-right: 20px;
color : #233044;
font-size : 16px;
font-weight: 700;
`
const NoteContent = styled.div`
padding: 5px;
display: block;
font-size : 14px;
`
const WriteBtn = styled.a`
font-size: 16px;
padding: 5px;
background-color: ${props => props.theme.color.blue};
color: white;
border-radius: 5px;
`
const SmallBtn = styled.button`
display: inline-block;
font-size: 12px;
padding: 5px;
margin: 1px;
background-color: ${props => props.theme.color.blue};
color: white;
border-radius: 5px;
`


function Index({match}) {
    
    const user = JSON.parse(window.sessionStorage.userInfo);
    const subjectId = match.params.subject;
    const subjectName = match.params.name;
    
    const isProfessor = user.type === "professor" ? true : false;
    const [isLoading, setisLoading] = useState(false);
    const [isEmpty, setisEmpty] = useState(false);
    
    const [noteList, setNoteList] = useState([]);

    const getData = () => {
        const url = '/api/lectureNote/get/subject/' + subjectId;
        axios.get(url)
        .then((response)=>{
            const result = response.data.lectureNotes;
            console.log(result);
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
            console.log(result);
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
                {isEmpty ? "작성된 강의 노트가 없습니다." : noteList.map((value, index) => 
                <Box>
                    <NoteBox>
                        <NoteTitle>{value.title}</NoteTitle>
                        {isProfessor && <div style={{display: "inline-block", float:"right"}}>
                            <SmallBtn onClick={(e) => updateNote(value._id)}>수정</SmallBtn>
                            <SmallBtn onClick={(e) => deleteNote(value._id)}>삭제</SmallBtn>
                        </div>}
                        <NoteContent>
                            {value.date}
                            {ReactHtmlParser(value.content)}
                        </NoteContent>
                    </NoteBox>
                    <hr style={{width: "100%", margin: "10px 0px", display:"block"}}/>
                    <ShowResponse commentList={value.comments} emotionList={value.emotions} postId={value._id} subjectId={subjectId} subjectName={subjectName} userId={user._id} type={"lectureNote"}/>
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
                        <SubTitle>내 강의 / {subjectName} / 강의 노트</SubTitle>
                        {isProfessor && <WriteBtn href={`/main/${subjectId}/${subjectName}/lectureNote/write`} style={{display: "inline-block", float:"right"}}>작성하기</WriteBtn>}
                    </div>
                    <hr style={{width: "100%", margin: "10px 0px", marginTop: "40px",display:"block"}}/>
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