import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import moment from 'moment';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';
import ShowResponse from "../../utils/Comment/Index"

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
const Box = styled.div`
display: block;
width: 100%;
margin : 0px 5px 10px 0px;
background : white;
border-radius: 5px;
padding: 10px;
box-shadow: 5px 5px #e0e0e0;
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

    const [isLoading, setIsLoading] = useState(false);
    const [isEmpty, setisEmpty] = useState(false);
    const [assignmentList, setAssignmentList] = useState([]);
    
    const getData = () => {
        // axios.get(url)
        // .then((response)=>{
        //     const result = response.data;
        //     setisEmpty(result.length == 0 ? true : false);
        //     console.log(result);
        // })
        // .catch((error)=>{
        //     console.log(error);
        // });
    }

    const display = () => {
        return(
            <div>
            </div>
        );
    }

    useEffect(() => {
        getData();
        
    },[])
    
    return(
        <Router>
            <Switch>
                <Route path="/">
                    <Container style={{marginLeft: "20px", marginTop: '10px'}}>
                        <Title>Assignment</Title>
                        <div style={{width: "100%", display: "block"}}>
                            <SubTitle>내 강의 / {subjectName} / 과제</SubTitle>
                        </div>
                        <hr style={{width: "100%", margin: "30px 0px", marginTop: "50px",display:"block", borderColor: '#ffffff'}}/>
                        {isLoading && display()}
                    </Container>
                </Route>
            </Switch>
        </Router>
    );
}

export default Index;