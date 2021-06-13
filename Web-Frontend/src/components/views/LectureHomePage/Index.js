import React, {useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import moment from 'moment';

const Container = styled.div`
width : 97%;
height : 100%;
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
const MenuTitle = styled.div`
position: absolute;
top: 10px;
left: 10px;
display: inline-block;
font-weight: 700;
color: ${props => props.theme.color.font_dark_gray};
`
const Img = styled.img`
max-width: 20%;
//max-height: 26%;
position: absolute;
bottom: 6%;
right: 6%;
`
const MenuBox = styled.td`
background: white;
border-radius: 5px;
padding: 10px;
box-shadow: 5px 5px #f5f5f5;
margin: 10px;
height: 100px;
width: 25%;
position: relative;
align-items: center;
&:hover{
    background: ${props => props.theme.color.blue};
    ${MenuTitle}{
        color: white;
    }
}
`
const NoticeBox = styled.td`
display: table-cell;
vertical-align: top;
box-shadow: 5px 5px #f5f5f5;
border-radius: 5px;
padding: 10px;
width: 50%;
background: white;
`
const NoticeButton = styled.a`
width: 100%;
height: 40px;
font-weight: 700;
color: ${props => props.theme.color.font_dark_gray};
margin: 10px auto;
`
const NoticeTitle = styled.div`
width: 100%;
display: block;
font-weight: 700;
color: ${props => props.theme.color.font_dark_gray};
`

function Index({match}){
    const user = JSON.parse(window.sessionStorage.userInfo);
    const subjectId = match.params.subject;
    const subjectName = match.params.name;

    const isProfessor = user.type === "professor" ? true : false;
    const [isLoading, setisLoading] = useState(false);
    const [isEmpty, setisEmpty] = useState(false);

    const [noticeList, setNoticeList] = useState([]);

    const getData = () => {
        const url = '/api/notice/get/subject/' + String(subjectId);
        axios.get(url)
        .then((response)=>{
            const result = response.data.notices;
            setisEmpty(result.length == 0 ? true : false);
            setNoticeList(result);
            setisLoading(true);
            console.log(result);
        })
        .catch((error)=>{
            console.log(error);
        });

    }

    const showNoticeList = () => {
        return(
            <>{isEmpty ? "등록된 공지사항이 없습니다." : noticeList.map((value, index) => 
            <NoticeTitle> - {value.title}
                <div style={{float:"right"}}>{moment(value.date).format('YYYY/MM/DD HH:mm')}</div>
            </NoticeTitle>)}</>
        )
    }

    useEffect(() => {
        getData();
    },[])

    return(
        <Container>
            <Title>{subjectName}</Title>
            <div style={{width: "100%", display: "block"}}>
                <SubTitle>내 강의 / <a style={{color: "black"}} href={`/main/${subjectId}/${subjectName}/home`}>{subjectName}</a></SubTitle>
            </div>
            <hr style={{width: "100%", margin: "30px 0px", marginTop: "50px",display:"block", borderColor: '#ffffff'}}/>
            <table style={{width: "100%", borderSpacing: "10px", borderCollapse: "separate", margin: "0px auto"}}>
                <tbody><tr>
                    <NoticeBox rowSpan="2" colSpan="2">
                        <NoticeButton href={`/main/${subjectId}/${subjectName}/notice`}>
                            <img style={{maxHeight: "30px", maxWidth: "30px", margin: "5px"}} src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQ2OS4zMzMgNDY5LjMzMyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGc+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8cGF0aCBkPSJNNDEyLjkxNywzMzguMTc3QzQwMC43MDgsMzE5Ljk1OCwzODQsMjk1LjAxLDM4NCwyMjR2LTMyYzAtNjcuNTEyLTQ1LjA2Ni0xMjQuNjMtMTA2LjY2Ny0xNDMuMDQzdi02LjI5ICAgIEMyNzcuMzMzLDE5LjEzNSwyNTguMTg4LDAsMjM0LjY2NywwUzE5MiwxOS4xMzUsMTkyLDQyLjY2N3Y2LjI5QzEzMC40MDEsNjcuMzcsODUuMzMzLDEyNC40ODgsODUuMzMzLDE5MnYzMiAgICBjMCw3MS4wMS0xNi43MDgsOTUuOTU4LTI4LjkxNywxMTQuMTc3Yy03LjA2MywxMC41NTItMTMuNzUsMjAuNTIxLTEzLjc1LDM1LjE1NmMwLDM0Ljc3NSw3Mi40OTUsNDYuOTc4LDEzMS4yNzEsNTEuMTgxICAgIGM4LjI0MSwyNi4zODMsMzIuNDMyLDQ0LjgxOSw2MC43MjksNDQuODE5czUyLjQ4OC0xOC40MzYsNjAuNzI5LTQ0LjgxOWM1OC43NzYtNC4yMDMsMTMxLjI3MS0xNi40MDYsMTMxLjI3MS01MS4xODEgICAgQzQyNi42NjcsMzU4LjY5OCw0MTkuOTc5LDM0OC43MjksNDEyLjkxNywzMzguMTc3eiBNMjEzLjMzMyw0Mi42NjdjMC0xMS43Niw5LjU2My0yMS4zMzMsMjEuMzMzLTIxLjMzM1MyNTYsMzAuOTA2LDI1Niw0Mi42NjcgICAgdjEuNzA0Yy02Ljk4Ny0xLjAwNi0xNC4wNzItMS43MDQtMjEuMzMzLTEuNzA0cy0xNC4zNDYsMC42OTgtMjEuMzMzLDEuNzA0VjQyLjY2N3ogTTIzNC42NjcsNDQ4ICAgIGMtMTUuOTQ0LDAtMjkuOTQ3LTguNzk5LTM3LjIyMS0yMi4xNDdjMTUuMTE1LDAuNjM4LDI4LjI0LDAuODE0LDM3LjIyMSwwLjgxNGM4Ljk4MywwLDIyLjEwNy0wLjE3NiwzNy4yMjMtMC44MTQgICAgQzI2NC42MTUsNDM5LjIwMSwyNTAuNjExLDQ0OCwyMzQuNjY3LDQ0OHogTTIzNC42NjcsNDA1LjMzM2MtOTcuNjg4LDAtMTcwLjY2Ny0xNi44OTYtMTcwLjY2Ny0zMiAgICBjMC03LjgwMiwzLjI5Mi0xMy4wNjMsMTAuMTQ2LTIzLjI4MUM4Ny4wODMsMzMwLjcxOSwxMDYuNjY3LDMwMS41LDEwNi42NjcsMjI0di0zMmMwLTcwLjU4Myw1Ny40MTctMTI4LDEyOC0xMjggICAgczEyOCw1Ny40MTcsMTI4LDEyOHYzMmMwLDc3LjUsMTkuNTgzLDEwNi43MTksMzIuNTIxLDEyNi4wNTJjNi44NTQsMTAuMjE5LDEwLjE0NiwxNS40NzksMTAuMTQ2LDIzLjI4MSAgICBDNDA1LjMzMywzODguNDM4LDMzMi4zNTQsNDA1LjMzMywyMzQuNjY3LDQwNS4zMzN6IiBmaWxsPSIjM2UzZTNlIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+Cgk8L2c+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPC9nPjwvc3ZnPg==" />
                            공지사항
                            <img style={{maxHeight: "20px", maxWidth: "30px", float: "right", margin: "10px 0"}} src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDc5Mi4wMzMgNzkyLjAzMyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGc+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8ZyBpZD0iX3gzOF8iPgoJCTxnPgoJCQk8cGF0aCBkPSJNNjE3Ljg1OCwzNzAuODk2TDIyMS41MTMsOS43MDVjLTEzLjAwNi0xMi45NC0zNC4wOTktMTIuOTQtNDcuMTA1LDBjLTEzLjAwNiwxMi45MzktMTMuMDA2LDMzLjkzNCwwLDQ2Ljg3NCAgICAgbDM3Mi40NDcsMzM5LjQzOEwxNzQuNDQxLDczNS40NTRjLTEzLjAwNiwxMi45NC0xMy4wMDYsMzMuOTM1LDAsNDYuODc0czM0LjA5OSwxMi45MzksNDcuMTA0LDBsMzk2LjM0Ni0zNjEuMTkxICAgICBjNi45MzItNi44OTgsOS45MDQtMTYuMDQzLDkuNDQxLTI1LjA4N0M2MjcuNzYzLDM4Ni45NzIsNjI0Ljc5MiwzNzcuODI4LDYxNy44NTgsMzcwLjg5NnoiIGZpbGw9IiMzZTNlM2UiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD4KCQk8L2c+Cgk8L2c+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPC9nPjwvc3ZnPg==" />
                        </NoticeButton>
                        <div style={{width: "100%", backgroundColor: "white", padding: "10px", borderTop: "1px solid #BFBFBF"}}>
                            {isLoading && showNoticeList()}
                        </div>
                        <div style={{width: "100%", backgroundColor: "white", height: "30px", borderRadius: "0 0 5px 5px", marginTop: "1px"}}/>
                    </NoticeBox>
                    <MenuBox>
                        {isProfessor ? 
                        <><a href={`/class/pf/${subjectId}`}>
                        <MenuTitle>실시간<br/>강의 시작</MenuTitle>
                        <Img style={{maxWidth: "30%", bottom: "-5px", right: "5px"}} src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTExNCA4Mi4yNWgtNC45MTd2LTQ0Ljc1YTguNiA4LjYgMCAwIDAgLTguNTg3LTguNTg3aC03Mi45OTZhOC42IDguNiAwIDAgMCAtOC41ODMgOC41ODd2NDQuNzVoLTQuOTE3YTEuNzUxIDEuNzUxIDAgMCAwIC0xLjc1IDEuNzV2Ni41YTguNiA4LjYgMCAwIDAgOC41ODggOC41ODdoODYuMzI0YTguNiA4LjYgMCAwIDAgOC41ODgtOC41ODd2LTYuNWExLjc1MSAxLjc1MSAwIDAgMCAtMS43NS0xLjc1em0tOTEuNTgzLTQ0Ljc1YTUuMDkzIDUuMDkzIDAgMCAxIDUuMDgzLTUuMDgzaDczYTUuMDkzIDUuMDkzIDAgMCAxIDUuMDg3IDUuMDg3djQ0Ljc0NmgtMy4xNjZ2LTQ0LjkxN2ExLjc1MSAxLjc1MSAwIDAgMCAtMS43NS0xLjc1aC03My4zMzhhMS43NTEgMS43NTEgMCAwIDAgLTEuNzUgMS43NXY0NC45MTdoLTMuMTY2em01My4yNSA0NC43NWgtNDYuNTg0di00My4xNjdoNjkuODM0djQzLjE2N3ptLTIuMDY3IDMuNWE0LjkyNSA0LjkyNSAwIDAgMSAtNC42IDMuMTY3aC0xMGE0LjkyNSA0LjkyNSAwIDAgMSAtNC41OTUtMy4xNjd6bTM4LjY1IDQuNzVhNS4wOTMgNS4wOTMgMCAwIDEgLTUuMDg4IDUuMDg3aC04Ni4zMjRhNS4wOTMgNS4wOTMgMCAwIDEgLTUuMDg4LTUuMDg3di00Ljc1aDM1LjAxOWE4LjQyOSA4LjQyOSAwIDAgMCA4LjIzMSA2LjY2N2gxMGE4LjQyOSA4LjQyOSAwIDAgMCA4LjIzMS02LjY2N2gzNS4wMTl6IiBmaWxsPSIjM2UzZTNlIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIj48L3BhdGg+PHBhdGggZD0ibTgxLjMxNiA1NS43MDgtMTYuNjY2LTYuNjY2YTEuNzQ5IDEuNzQ5IDAgMCAwIC0xLjMgMGwtMTYuNjY2IDYuNjY2YTEuNzUgMS43NSAwIDAgMCAwIDMuMjVsNy4yMzMgMi44OTR2OC44MTVhMS43NSAxLjc1IDAgMCAwIDEuNzUgMS43NWgxNi42NjZhMS43NSAxLjc1IDAgMCAwIDEuNzUtMS43NXYtOC44MTVsNy4yMzMtMi44OTRhMS43NSAxLjc1IDAgMCAwIDAtMy4yNXptLTEwLjczMyAxMy4yMDloLTEzLjE2NnYtNS42NjVsNS45MzMgMi4zNzNhMS43NDkgMS43NDkgMCAwIDAgMS4zIDBsNS45MzMtMi4zNzN6bTEuMS05Ljg3Ni03LjY4MyAzLjA3NC03LjY4NC0zLjA3My00LjI2OS0xLjcwOCAxMS45NTMtNC43ODMgMTEuOTU1IDQuNzgyeiIgZmlsbD0iIzNlM2UzZSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+" />
                        </a></>:
                        <><a href={`/class/st/${subjectId}`}>
                        <MenuTitle>실시간<br/>강의 참여</MenuTitle>
                        <Img style={{maxWidth: "30%", bottom: "-5px", right: "5px"}} src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTExNCA4Mi4yNWgtNC45MTd2LTQ0Ljc1YTguNiA4LjYgMCAwIDAgLTguNTg3LTguNTg3aC03Mi45OTZhOC42IDguNiAwIDAgMCAtOC41ODMgOC41ODd2NDQuNzVoLTQuOTE3YTEuNzUxIDEuNzUxIDAgMCAwIC0xLjc1IDEuNzV2Ni41YTguNiA4LjYgMCAwIDAgOC41ODggOC41ODdoODYuMzI0YTguNiA4LjYgMCAwIDAgOC41ODgtOC41ODd2LTYuNWExLjc1MSAxLjc1MSAwIDAgMCAtMS43NS0xLjc1em0tOTEuNTgzLTQ0Ljc1YTUuMDkzIDUuMDkzIDAgMCAxIDUuMDgzLTUuMDgzaDczYTUuMDkzIDUuMDkzIDAgMCAxIDUuMDg3IDUuMDg3djQ0Ljc0NmgtMy4xNjZ2LTQ0LjkxN2ExLjc1MSAxLjc1MSAwIDAgMCAtMS43NS0xLjc1aC03My4zMzhhMS43NTEgMS43NTEgMCAwIDAgLTEuNzUgMS43NXY0NC45MTdoLTMuMTY2em01My4yNSA0NC43NWgtNDYuNTg0di00My4xNjdoNjkuODM0djQzLjE2N3ptLTIuMDY3IDMuNWE0LjkyNSA0LjkyNSAwIDAgMSAtNC42IDMuMTY3aC0xMGE0LjkyNSA0LjkyNSAwIDAgMSAtNC41OTUtMy4xNjd6bTM4LjY1IDQuNzVhNS4wOTMgNS4wOTMgMCAwIDEgLTUuMDg4IDUuMDg3aC04Ni4zMjRhNS4wOTMgNS4wOTMgMCAwIDEgLTUuMDg4LTUuMDg3di00Ljc1aDM1LjAxOWE4LjQyOSA4LjQyOSAwIDAgMCA4LjIzMSA2LjY2N2gxMGE4LjQyOSA4LjQyOSAwIDAgMCA4LjIzMS02LjY2N2gzNS4wMTl6IiBmaWxsPSIjM2UzZTNlIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIj48L3BhdGg+PHBhdGggZD0ibTgxLjMxNiA1NS43MDgtMTYuNjY2LTYuNjY2YTEuNzQ5IDEuNzQ5IDAgMCAwIC0xLjMgMGwtMTYuNjY2IDYuNjY2YTEuNzUgMS43NSAwIDAgMCAwIDMuMjVsNy4yMzMgMi44OTR2OC44MTVhMS43NSAxLjc1IDAgMCAwIDEuNzUgMS43NWgxNi42NjZhMS43NSAxLjc1IDAgMCAwIDEuNzUtMS43NXYtOC44MTVsNy4yMzMtMi44OTRhMS43NSAxLjc1IDAgMCAwIDAtMy4yNXptLTEwLjczMyAxMy4yMDloLTEzLjE2NnYtNS42NjVsNS45MzMgMi4zNzNhMS43NDkgMS43NDkgMCAwIDAgMS4zIDBsNS45MzMtMi4zNzN6bTEuMS05Ljg3Ni03LjY4MyAzLjA3NC03LjY4NC0zLjA3My00LjI2OS0xLjcwOCAxMS45NTMtNC43ODMgMTEuOTU1IDQuNzgyeiIgZmlsbD0iIzNlM2UzZSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+" />
                        </a></>
                        }
                    </MenuBox>
                    <MenuBox><a href={isProfessor? `/main/${subjectId}/${subjectName}/pf/assignment`: `/main/${subjectId}/${subjectName}/st/assignment`}>
                        <MenuTitle>과제</MenuTitle>
                        <Img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIiBjbGFzcz0iIj48Zz48cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGQ9Im0yLjUgMTkuMDJjLS4yNzYgMC0uNS0uMjI0LS41LS41di04Ljg1YzAtLjI3Ni4yMjQtLjUuNS0uNXMuNS4yMjQuNS41djguODVjMCAuMjc2LS4yMjQuNS0uNS41eiIgZmlsbD0iIzNlM2UzZSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZD0ibTIxLjUgMS4wNDVjLS4wNTggMC0uMTE0LS4wMDktLjE2Ni0uMDI1aC0xMy42NDRjLS4yNzYgMC0uNS0uMjI0LS41LS41cy4yMjQtLjUuNS0uNWgxMy44MWMuMjc2IDAgLjUuMjI0LjUuNXMtLjIyNC41MjUtLjUuNTI1eiIgZmlsbD0iIzNlM2UzZSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZD0ibTIzLjUgNS4wMjFoLTVjLS4yNzYgMC0uNS0uMjI0LS41LS41di0xLjVjMC0xLjY1NCAxLjM0Ni0zIDMtM3MzIDEuMzQ2IDMgM3YxLjVjMCAuMjc2LS4yMjQuNS0uNS41em0tNC41LTFoNHYtMWMwLTEuMTAzLS44OTctMi0yLTJzLTIgLjg5Ny0yIDJ6IiBmaWxsPSIjM2UzZTNlIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+PHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkPSJtMTYgMjMuOTc5aC0xMy41Yy0xLjM3OCAwLTIuNS0xLjEyMS0yLjUtMi41di0yLjk1OWMwLS4yNzYuMjI0LS41LjUtLjVoMTNjLjI3NiAwIC41LjIyNC41LjV2Mi40NTljMCAxLjEwMy44OTcgMiAyIDJzMi0uODk3IDItMnYtMTYuNDU4YzAtLjI3Ni4yMjQtLjUuNS0uNXMuNS4yMjQuNS41djE2LjQ1OWMwIDEuNjU0LTEuMzQ2IDIuOTk5LTMgMi45OTl6bS0xNS00Ljk1OHYyLjQ1OWMwIC44MjcuNjczIDEuNSAxLjUgMS41aDExLjI2NmMtLjQ3Ni0uNTMxLS43NjYtMS4yMzItLjc2Ni0ydi0xLjk1OXoiIGZpbGw9IiMzZTNlM2UiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD48cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGQ9Im0xMi41IDEzYy0uMDMzIDAtLjA2NS0uMDAzLS4wOTgtLjAxbC0zLjY1NS0uNzMxYy0uMDk3LS4wMi0uMTg2LS4wNjYtLjI1NS0uMTM3bC04LjA0My04LjA0MWMtLjU5OC0uNTk5LS41OTgtMS41NzEgMC0yLjE3bDEuNDYzLTEuNDYyYy41OTgtLjU5OCAxLjU3LS41OTggMi4xNjkgMGw4LjA0MiA4LjA0MmMuMDcuMDY5LjExNy4xNTguMTM3LjI1NmwuNzMxIDMuNjU1Yy4wMzMuMTYzLS4wMTkuMzMzLS4xMzcuNDUxLS4wOTUuMDk1LS4yMjMuMTQ3LS4zNTQuMTQ3em0tMy40MDktMS42OTIgMi43NzEuNTU1LS41NTQtMi43NzEtNy45MzQtNy45MzZjLS4yMDgtLjIwNy0uNTQ3LS4yMDctLjc1NSAwbC0xLjQ2MyAxLjQ2MmMtLjIwOC4yMDgtLjIwOC41NDggMCAuNzU2eiIgZmlsbD0iIzNlM2UzZSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiIgY2xhc3M9IiI+PC9wYXRoPjwvZz48L3N2Zz4=" />
                    </a></MenuBox>
                </tr>
                <tr>
                    <MenuBox><a href={`/main/${subjectId}/${subjectName}/lectureNote`}>
                        <MenuTitle>강의노트</MenuTitle>
                        <Img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIiBjbGFzcz0iIj48Zz48cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGQ9Im0xOC41IDI0aC0xNGMtMS4zNzggMC0yLjUtMS4xMjItMi41LTIuNXYtMTdjMC0xLjM3OCAxLjEyMi0yLjUgMi41LTIuNWgxNGMxLjM3OCAwIDIuNSAxLjEyMiAyLjUgMi41djE3YzAgMS4zNzgtMS4xMjIgMi41LTIuNSAyLjV6bS0xNC0yMWMtLjgyNyAwLTEuNS42NzMtMS41IDEuNXYxN2MwIC44MjcuNjczIDEuNSAxLjUgMS41aDE0Yy44MjcgMCAxLjUtLjY3MyAxLjUtMS41di0xN2MwLS44MjctLjY3My0xLjUtMS41LTEuNXoiIGZpbGw9IiMzZTNlM2UiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD48cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGQ9Im02LjUgNWMtLjI3NiAwLS41LS4yMjQtLjUtLjV2LTRjMC0uMjc2LjIyNC0uNS41LS41cy41LjIyNC41LjV2NGMwIC4yNzYtLjIyNC41LS41LjV6IiBmaWxsPSIjM2UzZTNlIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+PHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkPSJtMTIgNWMtLjI3NiAwLS41LS4yMjQtLjUtLjV2LTRjMC0uMjc2LjIyNC0uNS41LS41cy41LjIyNC41LjV2NGMwIC4yNzYtLjIyNC41LS41LjV6IiBmaWxsPSIjM2UzZTNlIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+PHBhdGggeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBkPSJtMTYuNSA1Yy0uMjc2IDAtLjUtLjIyNC0uNS0uNXYtNGMwLS4yNzYuMjI0LS41LjUtLjVzLjUuMjI0LjUuNXY0YzAgLjI3Ni0uMjI0LjUtLjUuNXoiIGZpbGw9IiMzZTNlM2UiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD48cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGQ9Im0xNy41IDE4aC0xMWMtLjI3NiAwLS41LS4yMjQtLjUtLjVzLjIyNC0uNS41LS41aDExYy4yNzYgMCAuNS4yMjQuNS41cy0uMjI0LjUtLjUuNXoiIGZpbGw9IiMzZTNlM2UiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD48cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGQ9Im0xNy41IDE0aC0xMWMtLjI3NiAwLS41LS4yMjQtLjUtLjVzLjIyNC0uNS41LS41aDExYy4yNzYgMCAuNS4yMjQuNS41cy0uMjI0LjUtLjUuNXoiIGZpbGw9IiMzZTNlM2UiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiIGNsYXNzPSIiPjwvcGF0aD48cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGQ9Im0xMi41IDEwaC02Yy0uMjc2IDAtLjUtLjIyNC0uNS0uNXMuMjI0LS41LjUtLjVoNmMuMjc2IDAgLjUuMjI0LjUuNXMtLjIyNC41LS41LjV6IiBmaWxsPSIjM2UzZTNlIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIiBjbGFzcz0iIj48L3BhdGg+PC9nPjwvc3ZnPg==" />
                    </a></MenuBox>
                    <MenuBox><a href={`/main/${subjectId}/${subjectName}/chart`}>
                        <MenuTitle>학습분석차트</MenuTitle>
                            <Img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTIiIHhtbDpzcGFjZT0icHJlc2VydmUiIGNsYXNzPSIiPjxnPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPHBhdGggZD0iTTUwMS4zMzMsNDkwLjY2N0gxMC42NjdDNC43NzksNDkwLjY2NywwLDQ5NS40NDUsMCw1MDEuMzMzQzAsNTA3LjIyMSw0Ljc3OSw1MTIsMTAuNjY3LDUxMmg0OTAuNjY3ICAgIGM1Ljg4OCwwLDEwLjY2Ny00Ljc3OSwxMC42NjctMTAuNjY3QzUxMiw0OTUuNDQ1LDUwNy4yMjEsNDkwLjY2Nyw1MDEuMzMzLDQ5MC42Njd6IiBmaWxsPSIjM2UzZTNlIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIj48L3BhdGg+Cgk8L2c+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCTxnPgoJCTxwYXRoIGQ9Ik05NiwzNjIuNjY3SDMyYy01Ljg4OCwwLTEwLjY2Nyw0Ljc3OS0xMC42NjcsMTAuNjY3djEyOEMyMS4zMzMsNTA3LjIyMSwyNi4xMTIsNTEyLDMyLDUxMmg2NCAgICBjNS44ODgsMCwxMC42NjctNC43NzksMTAuNjY3LTEwLjY2N3YtMTI4QzEwNi42NjcsMzY3LjQ0NSwxMDEuODg4LDM2Mi42NjcsOTYsMzYyLjY2N3ogTTg1LjMzMyw0OTAuNjY3SDQyLjY2N1YzODRoNDIuNjY3ICAgIFY0OTAuNjY3eiIgZmlsbD0iIzNlM2UzZSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiI+PC9wYXRoPgoJPC9nPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8cGF0aCBkPSJNMjI0LDI1NmgtNjRjLTUuODg4LDAtMTAuNjY3LDQuNzc5LTEwLjY2NywxMC42Njd2MjM0LjY2N2MwLDUuODg4LDQuNzc5LDEwLjY2NywxMC42NjcsMTAuNjY3aDY0ICAgIGM1Ljg4OCwwLDEwLjY2Ny00Ljc3OSwxMC42NjctMTAuNjY3VjI2Ni42NjdDMjM0LjY2NywyNjAuNzc5LDIyOS44ODgsMjU2LDIyNCwyNTZ6IE0yMTMuMzMzLDQ5MC42NjdoLTQyLjY2N1YyNzcuMzMzaDQyLjY2NyAgICBWNDkwLjY2N3oiIGZpbGw9IiMzZTNlM2UiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiPjwvcGF0aD4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPHBhdGggZD0iTTM1MiwyOTguNjY3aC02NGMtNS44ODgsMC0xMC42NjcsNC43NzktMTAuNjY3LDEwLjY2N3YxOTJjMCw1Ljg4OCw0Ljc3OSwxMC42NjcsMTAuNjY3LDEwLjY2N2g2NCAgICBjNS44ODgsMCwxMC42NjctNC43NzksMTAuNjY3LTEwLjY2N3YtMTkyQzM2Mi42NjcsMzAzLjQ0NSwzNTcuODg4LDI5OC42NjcsMzUyLDI5OC42Njd6IE0zNDEuMzMzLDQ5MC42NjdoLTQyLjY2N1YzMjBoNDIuNjY3ICAgIFY0OTAuNjY3eiIgZmlsbD0iIzNlM2UzZSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiI+PC9wYXRoPgoJPC9nPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8Zz4KCQk8cGF0aCBkPSJNNDgwLDE3MC42NjdoLTY0Yy01Ljg4OCwwLTEwLjY2Nyw0Ljc3OS0xMC42NjcsMTAuNjY3djMyMGMwLDUuODg4LDQuNzc5LDEwLjY2NywxMC42NjcsMTAuNjY3aDY0ICAgIGM1Ljg4OCwwLDEwLjY2Ny00Ljc3OSwxMC42NjctMTAuNjY3di0zMjBDNDkwLjY2NywxNzUuNDQ1LDQ4NS44ODgsMTcwLjY2Nyw0ODAsMTcwLjY2N3ogTTQ2OS4zMzMsNDkwLjY2N2gtNDIuNjY3VjE5Mmg0Mi42NjcgICAgVjQ5MC42Njd6IiBmaWxsPSIjM2UzZTNlIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIj48L3BhdGg+Cgk8L2c+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCTxnPgoJCTxwYXRoIGQ9Ik02NCwxOTJjLTIzLjUzMSwwLTQyLjY2NywxOS4xMzYtNDIuNjY3LDQyLjY2N2MwLDIzLjUzMSwxOS4xMzYsNDIuNjY3LDQyLjY2Nyw0Mi42NjcgICAgYzIzLjUzMSwwLDQyLjY2Ny0xOS4xMzYsNDIuNjY3LTQyLjY2N0MxMDYuNjY3LDIxMS4xMzYsODcuNTMxLDE5Miw2NCwxOTJ6IE02NCwyNTZjLTExLjc3NiwwLTIxLjMzMy05LjU3OS0yMS4zMzMtMjEuMzMzICAgIGMwLTExLjc1NSw5LjU1Ny0yMS4zMzMsMjEuMzMzLTIxLjMzM3MyMS4zMzMsOS41NzksMjEuMzMzLDIxLjMzM0M4NS4zMzMsMjQ2LjQyMSw3NS43NzYsMjU2LDY0LDI1NnoiIGZpbGw9IiMzZTNlM2UiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiPjwvcGF0aD4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPHBhdGggZD0iTTE5Miw4NS4zMzNjLTIzLjUzMSwwLTQyLjY2NywxOS4xMzYtNDIuNjY3LDQyLjY2N2MwLDIzLjUzMSwxOS4xMzYsNDIuNjY3LDQyLjY2Nyw0Mi42NjdzNDIuNjY3LTE5LjEzNiw0Mi42NjctNDIuNjY3ICAgIEMyMzQuNjY3LDEwNC40NjksMjE1LjUzMSw4NS4zMzMsMTkyLDg1LjMzM3ogTTE5MiwxNDkuMzMzYy0xMS43NzYsMC0yMS4zMzMtOS41NzktMjEuMzMzLTIxLjMzMyAgICBjMC0xMS43NTUsOS41NTctMjEuMzMzLDIxLjMzMy0yMS4zMzNzMjEuMzMzLDkuNTc5LDIxLjMzMywyMS4zMzNDMjEzLjMzMywxMzkuNzU1LDIwMy43NzYsMTQ5LjMzMywxOTIsMTQ5LjMzM3oiIGZpbGw9IiMzZTNlM2UiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiPjwvcGF0aD4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPHBhdGggZD0iTTMyMCwxMjhjLTIzLjUzMSwwLTQyLjY2NywxOS4xMzYtNDIuNjY3LDQyLjY2N2MwLDIzLjUzMSwxOS4xMzYsNDIuNjY3LDQyLjY2Nyw0Mi42NjcgICAgYzIzLjUzMSwwLDQyLjY2Ny0xOS4xMzYsNDIuNjY3LTQyLjY2N0MzNjIuNjY3LDE0Ny4xMzYsMzQzLjUzMSwxMjgsMzIwLDEyOHogTTMyMCwxOTJjLTExLjc3NiwwLTIxLjMzMy05LjU3OS0yMS4zMzMtMjEuMzMzICAgIGMwLTExLjc1NSw5LjU1Ny0yMS4zMzMsMjEuMzMzLTIxLjMzM3MyMS4zMzMsOS41NzksMjEuMzMzLDIxLjMzM0MzNDEuMzMzLDE4Mi40MjEsMzMxLjc3NiwxOTIsMzIwLDE5MnoiIGZpbGw9IiMzZTNlM2UiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiPjwvcGF0aD4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPHBhdGggZD0iTTQ0OCwwYy0yMy41MzEsMC00Mi42NjcsMTkuMTM2LTQyLjY2Nyw0Mi42NjdjMCwyMy41MzEsMTkuMTM2LDQyLjY2Nyw0Mi42NjcsNDIuNjY3ICAgIGMyMy41MzEsMCw0Mi42NjctMTkuMTM2LDQyLjY2Ny00Mi42NjdDNDkwLjY2NywxOS4xMzYsNDcxLjUzMSwwLDQ0OCwweiBNNDQ4LDY0Yy0xMS43NzYsMC0yMS4zMzMtOS41NzktMjEuMzMzLTIxLjMzMyAgICBjMC0xMS43NTUsOS41NTctMjEuMzMzLDIxLjMzMy0yMS4zMzNzMjEuMzMzLDkuNTc5LDIxLjMzMywyMS4zMzNDNDY5LjMzMyw1NC40MjEsNDU5Ljc3Niw2NCw0NDgsNjR6IiBmaWxsPSIjM2UzZTNlIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIj48L3BhdGg+Cgk8L2c+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCTxnPgoJCTxwYXRoIGQ9Ik00MzIuOTM5LDU3LjcyOGMtNC4xNi00LjE2LTEwLjkyMy00LjE2LTE1LjA4MywwbC04Mi43NzMsODIuNzczYy00LjE2LDQuMTYtNC4xNiwxMC45MjMsMCwxNS4wODMgICAgYzIuMDkxLDIuMDY5LDQuODIxLDMuMTE1LDcuNTUyLDMuMTE1YzIuNzA5LDAsNS40NC0xLjAyNCw3LjUzMS0zLjExNWw4Mi43NzMtODIuNzczICAgIEM0MzcuMDk5LDY4LjY1MSw0MzcuMDk5LDYxLjg4OCw0MzIuOTM5LDU3LjcyOHoiIGZpbGw9IiMzZTNlM2UiIGRhdGEtb3JpZ2luYWw9IiMwMDAwMDAiIHN0eWxlPSIiPjwvcGF0aD4KCTwvZz4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgoJPGc+CgkJPHBhdGggZD0iTTI5NC4yMDgsMTQ2LjA0OGwtNjguNTIzLTE5LjU0MWMtNS43MzktMS42NjQtMTEuNTYzLDEuNjY0LTEzLjE2Myw3LjMzOWMtMS42MjEsNS42NzUsMS42NjQsMTEuNTYzLDcuMzE3LDEzLjE4NCAgICBsNjguNTIzLDE5LjU0MWMwLjk4MSwwLjI3NywxLjk2MywwLjQwNSwyLjkyMywwLjQwNWM0LjY1MSwwLDguOTE3LTMuMDUxLDEwLjI2MS03Ljc0NCAgICBDMzAzLjE2OCwxNTMuNTc5LDI5OS44ODMsMTQ3LjY2OSwyOTQuMjA4LDE0Ni4wNDh6IiBmaWxsPSIjM2UzZTNlIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBzdHlsZT0iIj48L3BhdGg+Cgk8L2c+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCTxnPgoJCTxwYXRoIGQ9Ik0xNzUuMzYsMTQxLjI5MWMtMy42NjktNC42MDgtMTAuMzY4LTUuMzU1LTE0Ljk3Ni0xLjcwN2wtODAuNDI3LDY0LjEyOGMtNC42MDgsMy42OTEtNS4zNzYsMTAuMzg5LTEuNjg1LDE0Ljk5NyAgICBjMi4xMTIsMi42NDUsNS4yMjcsNC4wMTEsOC4zNDEsNC4wMTFjMi4zMjUsMCw0LjY3Mi0wLjc2OCw2LjYzNS0yLjMwNGw4MC40MjctNjQuMTI4ICAgIEMxNzguMjgzLDE1Mi41OTcsMTc5LjA1MSwxNDUuODk5LDE3NS4zNiwxNDEuMjkxeiIgZmlsbD0iIzNlM2UzZSIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgc3R5bGU9IiI+PC9wYXRoPgoJPC9nPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjwvZz48L3N2Zz4=" />
                    </a></MenuBox>
                </tr></tbody>
            </table>
        </Container>
    );
}

export default Index