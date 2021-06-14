import React, {useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Progress } from 'antd';
import moment from 'moment';
import {CSVLink} from 'react-csv';
import { resolve } from 'dns';
import { rejects } from 'assert';

const Container = styled.div`
width : 97%;
display: block;
justify-content: center;
align-items: center;
margin: 10px auto;
padding: 0 20px;
`
const Title = styled.div`
font-size: 30px;
border-bottom : 1px solid #F7F9FC;
height : 40px;
line-height : 40px;
font-style : italic;
text-alignment: left;
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
background-color: ${props => props.theme.color.blue};
color: white;
font-size: 16px;
width: 80px; /* 원하는 너비설정 */
margin-right: 5px;
padding: 5px; /* 여백으로 높이 설정 */
border-radius: 5px;
`
const SelectCust = styled.select`
font-size: 16px;
width: 80px; /* 원하는 너비설정 */
margin-right: 5px;
padding: 5px; /* 여백으로 높이 설정 */
//font-family: inherit;  /* 폰트 상속 */
border-radius: 5px;
-webkit-appearance: none; /* 네이티브 외형 감추기 */
-moz-appearance: none;
appearance: none;
`
const Box = styled.td`
background: white;
border-radius: 10px;
padding: 20px;
box-shadow: 3px 5px 5px 3px #f5f5f5;
`
const BoxTitle = styled.div`
font-size: 16px;
font-weight: 700;
display: block;
margin-bottom: 5px;
text-align: left;
`
const Icon = styled.img`
max-height: 14px;
max-width: 14px;
`
const BoxText = styled.div`
display: inline-block;
font-size: 14px;
font-weight: normal;
`
const NumText = styled.div`
display: inline-block;
font-size: 24px;
font-weight: 700;
`
const AttendBox = styled.div`
width: 100%;
margin-bottom: 10px;
border-radius: 20px;
padding: 5px;
padding-left: 10px;
display: block;
background-color: #f3f3f3;
`
const TabletrColor = styled.tr`
&:nth-child(even){
    background: #F7F9FC;
}
`

function ShowAttendance ({attendanceList}){
    const showState = (state) => {
        switch(state){
            case 'O': 
                return(<BoxText style={{color: "#0E7ED1"}}><Icon src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQ1NS4xMTEgNDU1LjExMSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGc+CjxjaXJjbGUgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHlsZT0iIiBjeD0iMjI3LjU1NiIgY3k9IjIyNy41NTYiIHI9IjIyNy41NTYiIGZpbGw9IiMxNzgyZDIiIGRhdGEtb3JpZ2luYWw9IiNlMjRjNGIiIGNsYXNzPSIiPjwvY2lyY2xlPgo8cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHN0eWxlPSIiIGQ9Ik00NTUuMTExLDIyNy41NTZjMCwxMjUuMTU2LTEwMi40LDIyNy41NTYtMjI3LjU1NiwyMjcuNTU2Yy03Mi41MzMsMC0xMzYuNTMzLTMyLjcxMS0xNzcuNzc4LTg1LjMzMyAgYzM4LjQsMzEuMjg5LDg4LjE3OCw0OS43NzgsMTQyLjIyMiw0OS43NzhjMTI1LjE1NiwwLDIyNy41NTYtMTAyLjQsMjI3LjU1Ni0yMjcuNTU2YzAtNTQuMDQ0LTE4LjQ4OS0xMDMuODIyLTQ5Ljc3OC0xNDIuMjIyICBDNDIyLjQsOTEuMDIyLDQ1NS4xMTEsMTU1LjAyMiw0NTUuMTExLDIyNy41NTZ6IiBmaWxsPSIjMWU3OGJiIiBkYXRhLW9yaWdpbmFsPSIjZDE0MDNmIiBjbGFzcz0iIj48L3BhdGg+CjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3R5bGU9IiIgZD0iTTM1MS4yODksMTYyLjEzM0wyMDMuMzc4LDMyNC4yNjdjLTkuOTU2LDExLjM3OC0yNy4wMjIsMTEuMzc4LTM2Ljk3OCwwbC02Mi41NzgtNjkuNjg5ICBjLTguNTMzLTkuOTU2LTguNTMzLTI1LjYsMS40MjItMzUuNTU2YzkuOTU2LTguNTMzLDI1LjYtOC41MzMsMzUuNTU2LDEuNDIybDQ0LjA4OSw0OS43NzhsMTI5LjQyMi0xNDAuOCAgYzkuOTU2LTkuOTU2LDI1LjYtMTEuMzc4LDM1LjU1Ni0xLjQyMkMzNTkuODIyLDEzNi41MzMsMzU5LjgyMiwxNTMuNiwzNTEuMjg5LDE2Mi4xMzN6IiBmaWxsPSIjZmZmZmZmIiBkYXRhLW9yaWdpbmFsPSIjZmZmZmZmIiBjbGFzcz0iIj48L3BhdGg+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjwvZz48L3N2Zz4=" /> 출석</BoxText>);
            case 'X':
                return(<BoxText style={{color: "#61C679"}}><Icon src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQ1NS4xMTEgNDU1LjExMSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGc+CjxjaXJjbGUgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHlsZT0iIiBjeD0iMjI3LjU1NiIgY3k9IjIyNy41NTYiIHI9IjIyNy41NTYiIGZpbGw9IiM1NWMyNmYiIGRhdGEtb3JpZ2luYWw9IiNlMjRjNGIiIGNsYXNzPSIiPjwvY2lyY2xlPgo8cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHN0eWxlPSIiIGQ9Ik00NTUuMTExLDIyNy41NTZjMCwxMjUuMTU2LTEwMi40LDIyNy41NTYtMjI3LjU1NiwyMjcuNTU2Yy03Mi41MzMsMC0xMzYuNTMzLTMyLjcxMS0xNzcuNzc4LTg1LjMzMyAgYzM4LjQsMzEuMjg5LDg4LjE3OCw0OS43NzgsMTQyLjIyMiw0OS43NzhjMTI1LjE1NiwwLDIyNy41NTYtMTAyLjQsMjI3LjU1Ni0yMjcuNTU2YzAtNTQuMDQ0LTE4LjQ4OS0xMDMuODIyLTQ5Ljc3OC0xNDIuMjIyICBDNDIyLjQsOTEuMDIyLDQ1NS4xMTEsMTU1LjAyMiw0NTUuMTExLDIyNy41NTZ6IiBmaWxsPSIjNDlhYjYxIiBkYXRhLW9yaWdpbmFsPSIjZDE0MDNmIiBjbGFzcz0iIj48L3BhdGg+CjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3R5bGU9IiIgZD0iTTM1MS4yODksMTYyLjEzM0wyMDMuMzc4LDMyNC4yNjdjLTkuOTU2LDExLjM3OC0yNy4wMjIsMTEuMzc4LTM2Ljk3OCwwbC02Mi41NzgtNjkuNjg5ICBjLTguNTMzLTkuOTU2LTguNTMzLTI1LjYsMS40MjItMzUuNTU2YzkuOTU2LTguNTMzLDI1LjYtOC41MzMsMzUuNTU2LDEuNDIybDQ0LjA4OSw0OS43NzhsMTI5LjQyMi0xNDAuOCAgYzkuOTU2LTkuOTU2LDI1LjYtMTEuMzc4LDM1LjU1Ni0xLjQyMkMzNTkuODIyLDEzNi41MzMsMzU5LjgyMiwxNTMuNiwzNTEuMjg5LDE2Mi4xMzN6IiBmaWxsPSIjZmZmZmZmIiBkYXRhLW9yaWdpbmFsPSIjZmZmZmZmIiBjbGFzcz0iIj48L3BhdGg+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjwvZz48L3N2Zz4=" /> 지각</BoxText>);
            default:
                return(<BoxText style={{width: "50px", textAlign: "left", color: "#E24C4B"}}><Icon src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNDU1LjExMSA0NTUuMTExIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0NTUuMTExIDQ1NS4xMTE7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxjaXJjbGUgc3R5bGU9ImZpbGw6I0UyNEM0QjsiIGN4PSIyMjcuNTU2IiBjeT0iMjI3LjU1NiIgcj0iMjI3LjU1NiIvPg0KPHBhdGggc3R5bGU9ImZpbGw6I0QxNDAzRjsiIGQ9Ik00NTUuMTExLDIyNy41NTZjMCwxMjUuMTU2LTEwMi40LDIyNy41NTYtMjI3LjU1NiwyMjcuNTU2Yy03Mi41MzMsMC0xMzYuNTMzLTMyLjcxMS0xNzcuNzc4LTg1LjMzMw0KCWMzOC40LDMxLjI4OSw4OC4xNzgsNDkuNzc4LDE0Mi4yMjIsNDkuNzc4YzEyNS4xNTYsMCwyMjcuNTU2LTEwMi40LDIyNy41NTYtMjI3LjU1NmMwLTU0LjA0NC0xOC40ODktMTAzLjgyMi00OS43NzgtMTQyLjIyMg0KCUM0MjIuNCw5MS4wMjIsNDU1LjExMSwxNTUuMDIyLDQ1NS4xMTEsMjI3LjU1NnoiLz4NCjxwYXRoIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBkPSJNMzMxLjM3OCwzMzEuMzc4Yy04LjUzMyw4LjUzMy0yMi43NTYsOC41MzMtMzEuMjg5LDBsLTcyLjUzMy03Mi41MzNsLTcyLjUzMyw3Mi41MzMNCgljLTguNTMzLDguNTMzLTIyLjc1Niw4LjUzMy0zMS4yODksMGMtOC41MzMtOC41MzMtOC41MzMtMjIuNzU2LDAtMzEuMjg5bDcyLjUzMy03Mi41MzNsLTcyLjUzMy03Mi41MzMNCgljLTguNTMzLTguNTMzLTguNTMzLTIyLjc1NiwwLTMxLjI4OWM4LjUzMy04LjUzMywyMi43NTYtOC41MzMsMzEuMjg5LDBsNzIuNTMzLDcyLjUzM2w3Mi41MzMtNzIuNTMzDQoJYzguNTMzLTguNTMzLDIyLjc1Ni04LjUzMywzMS4yODksMGM4LjUzMyw4LjUzMyw4LjUzMywyMi43NTYsMCwzMS4yODlsLTcyLjUzMyw3Mi41MzNsNzIuNTMzLDcyLjUzMw0KCUMzMzkuOTExLDMwOC42MjIsMzM5LjkxMSwzMjIuODQ0LDMzMS4zNzgsMzMxLjM3OHoiLz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K"/> 결석</BoxText>);
        }

    }

    return(
        <table style={{width: "100%", margin: "10px auto", borderTop: "1px solid #D5D5D5", textAlign: "center"}}>
            <thead style={{borderBottom: "1px solid #D5D5D5", fontStyle: "bold", fontWeight:"500", backgroundColor: "#f3f3f3"}}>
                <tr>
                    <th style={{padding: "10px 0", width: "25%"}}>날짜</th>
                    <th style={{padding: "10px 0", width: "30%"}}>학생 이름</th>
                    <th style={{padding: "10px 0", width: "25%"}}>강의 시간</th>
                    <th style={{padding: "10px 0", width: "20%"}}>출결 상태</th>
                </tr>
            </thead>
            <tbody>
                {attendanceList.state.map((value, index) => 
                <TabletrColor>
                    <td style={{padding: "10px 0", borderBottom: "1px solid #D5D5D5"}}>{moment(value.date).format('YYYY.MM.DD')}</td>
                    <td style={{padding: "10px 0", borderBottom: "1px solid #D5D5D5"}}>{attendanceList.name}</td>
                    <td style={{padding: "10px 0", borderBottom: "1px solid #D5D5D5"}}>{moment(value.time).format('hh:mm')}</td>
                    <td style={{padding: "10px 0", borderBottom: "1px solid #D5D5D5"}}>{showState(value.state)}</td>
                </TabletrColor>
                )}
            </tbody>
        </table>
    )
}

function ShowAllAttendance ({attendList}){
    return(
        <table style={{width: "100%", margin: "10px auto", borderTop: "1px solid #D5D5D5", textAlign: "center"}}>
        <thead style={{borderBottom: "1px solid #D5D5D5", fontStyle: "bold", fontWeight:"500", backgroundColor: "#f3f3f3"}}>
            <tr>
                <th style={{padding: "10px 0", width: "25%"}}>날짜</th>
                <th style={{padding: "10px 0", width: "25%"}}>강의 시간</th>
                <th style={{padding: "10px 0", width: "50%"}}>출결 상태</th>
            </tr>
        </thead>
        <tbody>
            {attendList.map((value, index) => 
            <TabletrColor>
                <td style={{padding: "10px 0", borderBottom: "1px solid #D5D5D5"}}>{moment(value.date).format('YYYY.MM.DD')}</td>
                <td style={{padding: "10px 0", borderBottom: "1px solid #D5D5D5"}}>{moment(value.time).format('hh:mm')}</td>
                <td style={{padding: "10px 0", borderBottom: "1px solid #D5D5D5"}}>
                <BoxText>출석 <NumText style={{color: "#0E7ED1"}}> {value.attend}</NumText>회 / 지각 <NumText style={{color: "#61C679"}}> {value.late}</NumText>회 / 결석 <NumText style={{color: "#E24C4B"}}> {value.absence}</NumText>회</BoxText>
                </td>
            </TabletrColor>
            )}
        </tbody>
    </table>        
    )
}

function Index({match}) {
    const user = JSON.parse(window.sessionStorage.userInfo);
    const [subjectId, setSubejctId] = useState(match.params.subject);
    const [subjectName, setSubjectName] = useState(match.params.name);
    
    const isProfessor = user.type === "professor";
    const isAll = String(subjectId) === "all";

    const [isAllStudent, setisAllStudent] = useState(isProfessor);
    const [isLoading, setisLoading] = useState(false);
    const [isEmpty, setisEmpty] = useState(true);
    
    const [allAttend, setAllAttend] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const [subjectList, setSubjectList] = useState([]);
    
    const [studentIndex, setStudentIndex] = useState('all');
    const [subjectIndex, setSubjectIndex] = useState(0);

    const thisWeek = moment().isoWeek();
    const [currentWeek, setCurrentWeek] = useState([]);
    const [allWeek, setAllWeek] = useState([]);

    const [count, setCount] = useState({
        attend: [],
        late: [],
        absence: []
    })

    const getData = () => {
        return new Promise((resolve, reject) => {
        if(isAll){
            axios.get('/api/subject/get/mySubjects')
            .then((response)=>{
                const result = response.data;
                console.log(result);
                setSubjectName(result.subjects[0].name);
                setSubjectList(result.subjects);

                result.subjects.map((subject, subInd)=>{
                    setisEmpty(subject.lectures.length === 0);
                    let all = moment(subject.end_period).isoWeek() - moment(subject.start_period).isoWeek() + 1;
                    let curr = thisWeek - moment(subject.start_period).isoWeek() + 1;
                    allWeek.push(all);
                    currentWeek.push(curr)
                    let stdList = [];

                    subject.students.map((stdId, index)=>{
                        if(subInd === 0 && stdId === user._id){setStudentIndex(index)}
                        axios.get('/api/user/get/' + String(stdId))
                        .then((stdRes) => {
                            let student = {
                                index: index,
                                id: stdRes.data._id,
                                name: stdRes.data.name,
                                state: []
                            }
                            stdList.push(student);
                        })
                        .catch((error)=>{
                            console.log(error);
                            reject(error);
                        })
                    })

                    axios.get('/api/lecture/get/subject/'+ String(subject._id))
                    .then((responseLec)=>{
                        let sub = []; 
                        const lectureRes = responseLec.data;
                        console.log(lectureRes);
                        lectureRes.lectures.map((lecture)=>{
                            let lec = {
                                date: lecture.date,
                                time: lecture.start_time,
                                attend: 0,
                                late: 0,
                                absence: 0
                            }

                            lecture.students.map((student, stdInd)=>{
                                if(student.attendance === 'O'){lec.attend = lec.attend + 1}
                                else if(student.attendance === 'x'){lec.late = lec.late + 1}
                                else{lec.absence = lec.absence + 1}
                                let std = {
                                    date: lecture.date,
                                    time: lecture.start_time,
                                    state: student.attendance
                                }
                                stdList[stdInd].state.push(std);
                            })
                            sub.push(lec);
                        })
                        allAttend.push(sub);
                        console.log(stdList)
                        // studentList[subInd] = stdList;
                        studentList.push(stdList)
                        if(subInd === (result.subjects.length - 1)){
                            resolve();
                        }
                    })
                    .catch((error)=>{
                        console.log(error);
                        reject(error);
                    })
                })

            })
            .catch((error)=>{
                console.log(error);
                reject(error);
            })
        }
        else{
            axios.get('/api/subject/info/' + String(subjectId))
            .then((subRes) => {
                setisEmpty(subRes.data.subject.lectures.length === 0);
                let all = moment(subRes.data.subject.end_period).isoWeek() - moment(subRes.data.subject.start_period).isoWeek() + 1;
                let curr = thisWeek - moment(subRes.data.subject.start_period).isoWeek() + 1;
                allWeek.push(all);
                currentWeek.push(curr)
                let stdList = [];
                subRes.data.subject.students.map((stdId, index)=>{
                    if(!isProfessor && stdId === user._id){setStudentIndex(index)}
                    axios.get('/api/user/get/' + String(stdId))
                    .then((stdRes) => {
                        let student = {
                            index: index,
                            id: stdRes.data._id,
                            name: stdRes.data.name,
                            state: []
                        }
                        stdList.push(student);
                    })
                    .catch((error)=>{
                        console.log(error);
                        reject(error);
                    })
                })

                axios.get('/api/lecture/get/subject/'+ String(subjectId))
                .then((response)=>{
                    const result = response.data;
                    console.log(result);
                    let sub = [];
                    result.lectures.map((lecture, lecInd)=>{
                        let lec = {
                            date: lecture.date,
                            time: lecture.start_time,
                            attend: 0,
                            late: 0,
                            absence: 0
                        }

                        lecture.students.map((student, stdInd)=>{
                            if(student.attendance === 'O'){lec.attend = lec.attend + 1}
                            else if(student.attendance === 'x'){lec.late = lec.late + 1}
                            else{lec.absence = lec.absence + 1}
                            let std = {
                                date: lecture.date,
                                time: lecture.start_time,
                                state: student.attendance
                            }
                            stdList[stdInd].state.push(std);
                        })

                        sub.push(lec);
                    })
                    studentList[0] = stdList;
                    allAttend.push(sub);
                    resolve();
                })
                .catch((error)=>{
                    console.log(error);
                    reject(error);
                })


            })
            .catch((error)=>{
                console.log(error);
                reject(error);
            })
        }      
    })}
 
    function isSubmit(element){
        if(element.id === user._id){return true;}
    }

    const onChangeSubject = (e) => {
        const change = e.target.value;
        setSubjectIndex(change);
        setSubjectName(subjectList[change].name);
        if(subjectList[change].lectures.length !== 0){ExtractExcel(change)};
        if(!isProfessor){
            setStudentIndex(studentList[change].find(isSubmit).index)
        }else{
            setStudentIndex("all");
            setisAllStudent(true);
        }
    }

    const onChangeStudent = (e) => {
        const change = e.target.value;
        setStudentIndex(change);
        if(change === "all"){
            setisAllStudent(true);
        }else{
            setisAllStudent(false);
            onChangeCount(subjectIndex, change);
        }
    }

    const onChangeCount = (subInd, stdInd) => {
        let allAttend = 0;
        let allLate = 0;
        let allAbsence = 0;

        let monthAttend = 0;
        let monthLate = 0;
        let monthAbsence = 0;

        let weekAttend = 0;
        let weekLate = 0;
        let weekAbsence = 0;
        studentList[subInd][stdInd].state.map((day, dayIndex)=> {
            switch (day.state) {
                case "O":
                    allAttend = allAttend + 1;
                    if(moment().format("M") === moment(day.date).format("M")){monthAttend = monthAttend + 1;}
                    if(thisWeek === moment(day.date).isoWeek()){weekAttend = weekAttend + 1;}
                    break;
                case "X":
                    allLate = allLate + 1;
                    if(moment().format("M") === moment(day.date).format("M")){monthLate = monthLate + 1;}
                    if(thisWeek === moment(day.date).isoWeek()){weekLate = weekLate + 1;}
                default:
                    allAbsence = allAbsence + 1;
                    if(moment().format("M") === moment(day.date).format("M")){monthAbsence = monthAbsence + 1;}
                    if(thisWeek === moment(day.date).isoWeek()){weekAbsence = weekAbsence + 1;}
                    break;
            }
        })
        setCount({
            attend: [allAttend, monthAttend, weekAttend],
            late: [allLate, monthLate, weekLate],
            absence: [allAbsence, monthAbsence, weekAbsence]
        })
    }

    const [headers, setHeaders] = useState([{label: "학생이름 / 날짜", key: "studentName"}]);
    const [data, setData] = useState([]);

    const ExtractExcel = (subjectIndex) => {
        setHeaders([{label: "학생이름 / 날짜", key: "studentName"}]);
        setData([]);
        allAttend[subjectIndex].map((lec, lecIndex) => {
            let label = {label: moment(lec.date).format("YYYY-MM-DD") , key: `${lecIndex}`}
            headers.push(label);
        })
        studentList[subjectIndex].map((student) => {
            let attendState = {studentName: student.name}
            student.state.map((state, index) => {
                if (state.state==="O"){
                    attendState[`${index}`] = "출석";
                }else if(state.state === "X"){
                    attendState[`${index}`] = "지각";
                }else{
                    attendState[`${index}`] = "결석";
                }
            })
            data.push(attendState);
        })
    }

    const display = () => {
        return(
        <div style={{marginBottom: "60px"}}>
            <Title>Attendance</Title>
            {isAll ?
            <div style={{width: "100%", display: "block"}}>
                <SubTitle>출결 관리</SubTitle>
                {isProfessor ? 
                    <div style={{display: "inline-block", float:"right"}}>
                        <SelectCust style={{border: "1px solid #407AD6", background: "#407AD6", color: "white", width: "125px"}} onChange={onChangeSubject}>
                            {subjectList.map((value, subIndex) => <option value={subIndex}>{value.name}</option>)}
                        </SelectCust>
                        <SelectCust style={{border: "1px solid #e0e0e0", background: "#e0e0e0"}} onChange={onChangeStudent}>
                            <option value="all">전체</option>
                            {studentList[subjectIndex].map((value, index) => <option value={index}>{value.name}</option> )}
                        </SelectCust>
                        <CSVLink headers={headers} data={data} filename={`${subjectName} 출결.csv`}><WriteBtn>엑셀 추출</WriteBtn></CSVLink>
                    </div>
                :
                    <div style={{display: "inline-block", float:"right"}}>
                        <SelectCust style={{border: "1px solid #407AD6", background: "#407AD6", color: "white", width: "125px"}} onChange={onChangeSubject}>
                            {subjectList.map((value, subIndex) => <option value={subIndex}>{value.name}</option>)}
                        </SelectCust>
                    </div>
                }
                
            </div> : 
            <div style={{width: "100%", display: "block"}}>
                <SubTitle>내 강의 / <a style={{color: "black"}} href={`/main/${subjectId}/${subjectName}/home`}>{subjectName}</a> / 출석</SubTitle>
                <div style={{display: "inline-block", float:"right"}}>
                    {isProfessor && <div>
                        <SelectCust style={{border: "1px solid #e0e0e0", background: "#e0e0e0"}} onChange={onChangeStudent}>
                            <option value="all">전체</option>
                            {studentList[subjectIndex].map((value, index) => <option value={index}>{value.name}</option> )}
                        </SelectCust>
                        <CSVLink headers={headers} data={data} filename={`${subjectName} 출결.csv`}><WriteBtn>엑셀 추출</WriteBtn></CSVLink>
                    </div>}
                </div>
            </div>
            }
            <hr style={{width: "100%", margin: "30px 0px", marginTop: "50px",display:"block", borderColor: '#ffffff'}}/>
            <table style={{width: "100%", borderSpacing: "10px", borderCollapse: "separate", margin: "0px auto"}}>
                {!isAllStudent && <tr>
                <Box style={{width: "50%"}}>
                    <BoxTitle>출결 현황</BoxTitle>
                    <div style={{padding: "10px", display:"flex", justifyContent: "center", alignItems: "center"}}>
                        <Progress type="circle" percent={(currentWeek[subjectIndex] / allWeek[subjectIndex]) * 100} format={percent => `${currentWeek[subjectIndex]}/${allWeek[subjectIndex]} 주`} style={{marginRight: "30px"}}/>
                        <div style={{width: "50%", margin: "5px", display: 'inline-block', marginLeft: "30px"}}>
                            <div style={{borderBottom: "1px dotted black", padding: "3px", display:"flex", justifyContent: "space-between", alignItems: "center"}}>
                                <BoxText><Icon src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQ1NS4xMTEgNDU1LjExMSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGc+CjxjaXJjbGUgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHlsZT0iIiBjeD0iMjI3LjU1NiIgY3k9IjIyNy41NTYiIHI9IjIyNy41NTYiIGZpbGw9IiMxNzgyZDIiIGRhdGEtb3JpZ2luYWw9IiNlMjRjNGIiIGNsYXNzPSIiPjwvY2lyY2xlPgo8cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHN0eWxlPSIiIGQ9Ik00NTUuMTExLDIyNy41NTZjMCwxMjUuMTU2LTEwMi40LDIyNy41NTYtMjI3LjU1NiwyMjcuNTU2Yy03Mi41MzMsMC0xMzYuNTMzLTMyLjcxMS0xNzcuNzc4LTg1LjMzMyAgYzM4LjQsMzEuMjg5LDg4LjE3OCw0OS43NzgsMTQyLjIyMiw0OS43NzhjMTI1LjE1NiwwLDIyNy41NTYtMTAyLjQsMjI3LjU1Ni0yMjcuNTU2YzAtNTQuMDQ0LTE4LjQ4OS0xMDMuODIyLTQ5Ljc3OC0xNDIuMjIyICBDNDIyLjQsOTEuMDIyLDQ1NS4xMTEsMTU1LjAyMiw0NTUuMTExLDIyNy41NTZ6IiBmaWxsPSIjMWU3OGJiIiBkYXRhLW9yaWdpbmFsPSIjZDE0MDNmIiBjbGFzcz0iIj48L3BhdGg+CjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3R5bGU9IiIgZD0iTTM1MS4yODksMTYyLjEzM0wyMDMuMzc4LDMyNC4yNjdjLTkuOTU2LDExLjM3OC0yNy4wMjIsMTEuMzc4LTM2Ljk3OCwwbC02Mi41NzgtNjkuNjg5ICBjLTguNTMzLTkuOTU2LTguNTMzLTI1LjYsMS40MjItMzUuNTU2YzkuOTU2LTguNTMzLDI1LjYtOC41MzMsMzUuNTU2LDEuNDIybDQ0LjA4OSw0OS43NzhsMTI5LjQyMi0xNDAuOCAgYzkuOTU2LTkuOTU2LDI1LjYtMTEuMzc4LDM1LjU1Ni0xLjQyMkMzNTkuODIyLDEzNi41MzMsMzU5LjgyMiwxNTMuNiwzNTEuMjg5LDE2Mi4xMzN6IiBmaWxsPSIjZmZmZmZmIiBkYXRhLW9yaWdpbmFsPSIjZmZmZmZmIiBjbGFzcz0iIj48L3BhdGg+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjwvZz48L3N2Zz4=" /> 출석</BoxText>
                                <NumText>{count.attend[0]} <BoxText>건</BoxText></NumText>
                            </div>
                            <div style={{borderBottom: "1px dotted black", padding: "3px", display:"flex", justifyContent: "space-between", alignItems: "center"}}>
                                <BoxText><Icon src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQ1NS4xMTEgNDU1LjExMSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGc+CjxjaXJjbGUgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHlsZT0iIiBjeD0iMjI3LjU1NiIgY3k9IjIyNy41NTYiIHI9IjIyNy41NTYiIGZpbGw9IiM1NWMyNmYiIGRhdGEtb3JpZ2luYWw9IiNlMjRjNGIiIGNsYXNzPSIiPjwvY2lyY2xlPgo8cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHN0eWxlPSIiIGQ9Ik00NTUuMTExLDIyNy41NTZjMCwxMjUuMTU2LTEwMi40LDIyNy41NTYtMjI3LjU1NiwyMjcuNTU2Yy03Mi41MzMsMC0xMzYuNTMzLTMyLjcxMS0xNzcuNzc4LTg1LjMzMyAgYzM4LjQsMzEuMjg5LDg4LjE3OCw0OS43NzgsMTQyLjIyMiw0OS43NzhjMTI1LjE1NiwwLDIyNy41NTYtMTAyLjQsMjI3LjU1Ni0yMjcuNTU2YzAtNTQuMDQ0LTE4LjQ4OS0xMDMuODIyLTQ5Ljc3OC0xNDIuMjIyICBDNDIyLjQsOTEuMDIyLDQ1NS4xMTEsMTU1LjAyMiw0NTUuMTExLDIyNy41NTZ6IiBmaWxsPSIjNDlhYjYxIiBkYXRhLW9yaWdpbmFsPSIjZDE0MDNmIiBjbGFzcz0iIj48L3BhdGg+CjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3R5bGU9IiIgZD0iTTM1MS4yODksMTYyLjEzM0wyMDMuMzc4LDMyNC4yNjdjLTkuOTU2LDExLjM3OC0yNy4wMjIsMTEuMzc4LTM2Ljk3OCwwbC02Mi41NzgtNjkuNjg5ICBjLTguNTMzLTkuOTU2LTguNTMzLTI1LjYsMS40MjItMzUuNTU2YzkuOTU2LTguNTMzLDI1LjYtOC41MzMsMzUuNTU2LDEuNDIybDQ0LjA4OSw0OS43NzhsMTI5LjQyMi0xNDAuOCAgYzkuOTU2LTkuOTU2LDI1LjYtMTEuMzc4LDM1LjU1Ni0xLjQyMkMzNTkuODIyLDEzNi41MzMsMzU5LjgyMiwxNTMuNiwzNTEuMjg5LDE2Mi4xMzN6IiBmaWxsPSIjZmZmZmZmIiBkYXRhLW9yaWdpbmFsPSIjZmZmZmZmIiBjbGFzcz0iIj48L3BhdGg+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjwvZz48L3N2Zz4=" /> 지각</BoxText>
                                <NumText>{count.late[0]} <BoxText>건</BoxText></NumText>
                            </div>
                            <div style={{padding: "3px", display:"flex", justifyContent: "space-between", alignItems: "center"}}>
                                <BoxText style={{width: "50px", textAlign: "left"}}><Icon src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNDU1LjExMSA0NTUuMTExIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0NTUuMTExIDQ1NS4xMTE7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxjaXJjbGUgc3R5bGU9ImZpbGw6I0UyNEM0QjsiIGN4PSIyMjcuNTU2IiBjeT0iMjI3LjU1NiIgcj0iMjI3LjU1NiIvPg0KPHBhdGggc3R5bGU9ImZpbGw6I0QxNDAzRjsiIGQ9Ik00NTUuMTExLDIyNy41NTZjMCwxMjUuMTU2LTEwMi40LDIyNy41NTYtMjI3LjU1NiwyMjcuNTU2Yy03Mi41MzMsMC0xMzYuNTMzLTMyLjcxMS0xNzcuNzc4LTg1LjMzMw0KCWMzOC40LDMxLjI4OSw4OC4xNzgsNDkuNzc4LDE0Mi4yMjIsNDkuNzc4YzEyNS4xNTYsMCwyMjcuNTU2LTEwMi40LDIyNy41NTYtMjI3LjU1NmMwLTU0LjA0NC0xOC40ODktMTAzLjgyMi00OS43NzgtMTQyLjIyMg0KCUM0MjIuNCw5MS4wMjIsNDU1LjExMSwxNTUuMDIyLDQ1NS4xMTEsMjI3LjU1NnoiLz4NCjxwYXRoIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBkPSJNMzMxLjM3OCwzMzEuMzc4Yy04LjUzMyw4LjUzMy0yMi43NTYsOC41MzMtMzEuMjg5LDBsLTcyLjUzMy03Mi41MzNsLTcyLjUzMyw3Mi41MzMNCgljLTguNTMzLDguNTMzLTIyLjc1Niw4LjUzMy0zMS4yODksMGMtOC41MzMtOC41MzMtOC41MzMtMjIuNzU2LDAtMzEuMjg5bDcyLjUzMy03Mi41MzNsLTcyLjUzMy03Mi41MzMNCgljLTguNTMzLTguNTMzLTguNTMzLTIyLjc1NiwwLTMxLjI4OWM4LjUzMy04LjUzMywyMi43NTYtOC41MzMsMzEuMjg5LDBsNzIuNTMzLDcyLjUzM2w3Mi41MzMtNzIuNTMzDQoJYzguNTMzLTguNTMzLDIyLjc1Ni04LjUzMywzMS4yODksMGM4LjUzMyw4LjUzMyw4LjUzMywyMi43NTYsMCwzMS4yODlsLTcyLjUzMyw3Mi41MzNsNzIuNTMzLDcyLjUzMw0KCUMzMzkuOTExLDMwOC42MjIsMzM5LjkxMSwzMjIuODQ0LDMzMS4zNzgsMzMxLjM3OHoiLz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K"/> 결석</BoxText>
                                <NumText>{count.absence[0]} <BoxText>건</BoxText></NumText>
                            </div>
                        </div>
                    </div>
                </Box>
                <Box>
                    <BoxTitle>이번달 출결 현황</BoxTitle>
                    <AttendBox>
                        <BoxText style={{width: "30%", borderRight: "1px solid #BFBFBF", paddingLeft: "10px"}}>출석 <NumText style={{margin: "0 15px 0 5px"}}>{count.attend[1]}</NumText></BoxText>
                        <BoxText style={{width: "30%", borderRight: "1px solid #BFBFBF", paddingLeft: "10px"}}>지각 <NumText style={{margin: "0 15px 0 5px"}}>{count.late[1]}</NumText></BoxText>
                        <BoxText style={{width: "30%", paddingLeft: "10px"}}>결석 <NumText style={{margin: "0 15px 0 5px"}}>{count.absence[1]}</NumText></BoxText>
                    </AttendBox>
                    <BoxTitle>이번주 출결 현황</BoxTitle>
                    <AttendBox>
                        <BoxText style={{width: "30%", borderRight: "1px solid #BFBFBF", paddingLeft: "10px"}}>출석 <NumText style={{margin: "0 15px 0 5px"}}>{count.attend[2]}</NumText></BoxText>
                        <BoxText style={{width: "30%", borderRight: "1px solid #BFBFBF", paddingLeft: "10px"}}>지각 <NumText style={{margin: "0 15px 0 5px"}}>{count.late[2]}</NumText></BoxText>
                        <BoxText style={{width: "30%", paddingLeft: "10px"}}>결석 <NumText style={{margin: "0 15px 0 5px"}}>{count.absence[2]}</NumText></BoxText>
                    </AttendBox>
                </Box>
                </tr>}
                <tr>
                    <Box style={{width: "100%", marginLeft: "5px"}} colSpan="2">
                        <BoxTitle>출결 상태</BoxTitle>
                        {isProfessor && (studentList.length !== 0)? <div>
                            {isAllStudent ? <ShowAllAttendance attendList={allAttend[subjectIndex]}/> : 
                            <div>
                                <BoxText style={{display: "block", float: 'right'}}>출석 <NumText style={{color: "#0E7ED1"}}> {count.attend[0]}</NumText>회 / 지각 <NumText style={{color: "#61C679"}}> {count.late[0]}</NumText>회 / 결석 <NumText style={{color: "#E24C4B"}}> {count.absence[0]}</NumText>회</BoxText>
                                <ShowAttendance attendanceList={studentList[subjectIndex][studentIndex]}/>
                            </div>
                            }
                        </div>:
                            <ShowAttendance attendanceList={studentList[subjectIndex][studentIndex]}/>
                        }
                    </Box>
                </tr>
            </table>
        </div>
        );
    }

    useEffect(() => {
        getData().then(()=>{
            if(!isEmpty){ExtractExcel(0);}
            if(!isProfessor){
                studentList[subjectIndex].map((student, index)=>{if(student.id === user._id){onChangeCount(0, index)}})
            }
            setisLoading(true);
        })
    },[])

    return(
        <Container>
            {isLoading && display()}
        </Container>                
    );
}

export default Index;