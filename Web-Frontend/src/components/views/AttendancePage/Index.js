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
// height : 100%;
display : inline-block;
margin-left : 20px;
margin-top : 10px; 
justify-content: center;
align-items: center;
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

function ShowAttendance ({attendanceList, dayList}){
    const showState = (state) => {
        switch(state){
            case 0: 
                return(<BoxText style={{color: "#0E7ED1"}}><Icon src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQ1NS4xMTEgNDU1LjExMSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGc+CjxjaXJjbGUgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHlsZT0iIiBjeD0iMjI3LjU1NiIgY3k9IjIyNy41NTYiIHI9IjIyNy41NTYiIGZpbGw9IiMxNzgyZDIiIGRhdGEtb3JpZ2luYWw9IiNlMjRjNGIiIGNsYXNzPSIiPjwvY2lyY2xlPgo8cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHN0eWxlPSIiIGQ9Ik00NTUuMTExLDIyNy41NTZjMCwxMjUuMTU2LTEwMi40LDIyNy41NTYtMjI3LjU1NiwyMjcuNTU2Yy03Mi41MzMsMC0xMzYuNTMzLTMyLjcxMS0xNzcuNzc4LTg1LjMzMyAgYzM4LjQsMzEuMjg5LDg4LjE3OCw0OS43NzgsMTQyLjIyMiw0OS43NzhjMTI1LjE1NiwwLDIyNy41NTYtMTAyLjQsMjI3LjU1Ni0yMjcuNTU2YzAtNTQuMDQ0LTE4LjQ4OS0xMDMuODIyLTQ5Ljc3OC0xNDIuMjIyICBDNDIyLjQsOTEuMDIyLDQ1NS4xMTEsMTU1LjAyMiw0NTUuMTExLDIyNy41NTZ6IiBmaWxsPSIjMWU3OGJiIiBkYXRhLW9yaWdpbmFsPSIjZDE0MDNmIiBjbGFzcz0iIj48L3BhdGg+CjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3R5bGU9IiIgZD0iTTM1MS4yODksMTYyLjEzM0wyMDMuMzc4LDMyNC4yNjdjLTkuOTU2LDExLjM3OC0yNy4wMjIsMTEuMzc4LTM2Ljk3OCwwbC02Mi41NzgtNjkuNjg5ICBjLTguNTMzLTkuOTU2LTguNTMzLTI1LjYsMS40MjItMzUuNTU2YzkuOTU2LTguNTMzLDI1LjYtOC41MzMsMzUuNTU2LDEuNDIybDQ0LjA4OSw0OS43NzhsMTI5LjQyMi0xNDAuOCAgYzkuOTU2LTkuOTU2LDI1LjYtMTEuMzc4LDM1LjU1Ni0xLjQyMkMzNTkuODIyLDEzNi41MzMsMzU5LjgyMiwxNTMuNiwzNTEuMjg5LDE2Mi4xMzN6IiBmaWxsPSIjZmZmZmZmIiBkYXRhLW9yaWdpbmFsPSIjZmZmZmZmIiBjbGFzcz0iIj48L3BhdGg+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjwvZz48L3N2Zz4=" /> 출석</BoxText>);
            case 1:
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
                    <td style={{padding: "10px 0", borderBottom: "1px solid #D5D5D5"}}>{moment(dayList[index]).format('YYYY.MM.DD')}</td>
                    <td style={{padding: "10px 0", borderBottom: "1px solid #D5D5D5"}}>{attendanceList.name}</td>
                    <td style={{padding: "10px 0", borderBottom: "1px solid #D5D5D5"}}>{moment(attendanceList.time).format('hh:mm ~ hh:mm')}</td>
                    <td style={{padding: "10px 0", borderBottom: "1px solid #D5D5D5"}}>{showState(value)}</td>
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
                <td style={{padding: "10px 0", borderBottom: "1px solid #D5D5D5"}}>{moment(value.time).format('hh:mm ~ hh:mm')}</td>
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
    /* 임시 데이터 */
    const tempData = [
    {
        name: "김민건",
        id: 0,
        state: [0, 1, 1, 0, 2]
    },
    {
        name: "김수민",
        id: 1,
        state: [0, 2, 1, 0, 2]
    },
    {
        name: "노민도",
        id: 2,
        state: [0, 0, 1, 0, 0]
    },
    {
        name: "윤다연",
        id: 3,
        state: [0, 1, 1, 0, 2]
    },
    {
        name: "최민우",
        id: 4,
        state: [0, 2, 0, 0, 1]
    },
    ]


    const user = JSON.parse(window.sessionStorage.userInfo);
    const [subjectId, setSubejctId] = useState(match.params.subject);
    const [subjectName, setSubjectName] = useState(match.params.name);
    
    const isProfessor = user.type === "professor";
    const isAll = String(subjectId) === "all";
    const [isAllStudent, setisAllStudent] = useState(true);
    const [isLoading, setisLoading] = useState(false);
    const [dayList, setDayList] = useState(["2021-05-16", "2021-05-20", "2021-05-25", "2021-06-01", "2021-06-02"]);

    const [allAttend, setAllAttend] = useState([]);
    const [subjectList, setSubjectList] = useState([]);
    const [lectureList, setLectureList] = useState([]);
    const [studentList, setStudentList] = useState([]);
    
    const [studentIndex, setStudentIndex] = useState(0);

    const [currentWeek, setCurrentWeek] = useState(5);
    const [allWeek, setAllWeek] = useState(17);
    const [startDay, setStartDay] = useState(1);
    const [endDay, setEndDay] = useState(1);

    const [attendance, setAttendance] = useState({
        all : 0,
        month : 0,
        week : 0
    });
    const [absence, setAbsence] = useState({
        all : 0,
        month : 0,
        week : 0
    });
    const [late, setLate] = useState({
        all : 0,
        month : 0,
        week : 0
    });

    const getData = () => {
        return new Promise((resolve, reject) => {
        if(isAll){
            axios.get('/api/subject/get/mySubjects')
            .then((response)=>{
                const result = response.data;
                console.log(result);
                setSubjectList(result.subjects);
                setSubejctId(result.subjects[0]._id);
                setSubjectName(result.subjects[0].name);
            })
            .catch((error)=>{
                console.log(error);
                reject(error);
            })
        }

        axios.get('/api/lecture/get/subject/'+ String(subjectId))
        .then((response)=>{
            const result = response.data;
            console.log(result);
            setLectureList(result.lecture);
            resolve();
        })
        .catch((error)=>{
            console.log(error);
            reject(error);
        })

        /* axios.get('/api/subject/info/' + String(subjectId))
        .then((response)=>{
            const result = response.data.subject;
            console.log(result);
            setStartDay(result.start_period);
            setEndDay(result.end_period);
            setDayTime(result.days.length);
            setAllWeek(parseInt((endDay - startDay) / 7) + 1);
            setCurrentWeek(parseFloat((lectureList[lectureList.length - 1].date - startDay) / 7) + 1);
            const students = result.students;
            students.map((value, index) => {
                axios.get('/api/user/get/'+ String(value._id))
                .then((student)=>{
                    setStudentList({
                        index: studentList.concat({
                            id: student._id,
                            name: student.name
                        })
                    })
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
        }) */
    })
    }

    const setDayData = () => {
        dayList.map((value, index) => {
            let attend = 0;
            let late = 0;
            let absence = 0;
            tempData.map((student) => {
                switch (student.state[index]) {
                    case 0:
                        attend = attend + 1;
                        break;
                    case 1: 
                        late = late + 1;
                        break;
                    default:
                        absence = absence + 1;
                        break;
                }
            })
            let day = {
                date: value,
                time: "",
                attend: attend,
                late: late,
                absence: absence
            }
            allAttend[index] = day;
        })
    }
 
    const onChangeSubject = (e) => {
        setisLoading(false);
        const change = e.target.value;
        setSubejctId(change.id);
        setSubjectName(change.name);
        axios.get('/api/lecture/get/subject/'+ String(subjectId))
        .then((response)=>{
            const result = response.data;
            console.log(result);
            setLectureList(result.lecture);
        })
        .catch((error)=>{
            console.log(error);
        })

        axios.get('/api/subject/info/' + String(subjectId))
        .then((response)=>{
            const result = response.data.subject;
            console.log(result);
            const students = result.students;
            students.forEach(element => {
                axios.get('/api/user/get/'+ String(element._id))
                .then((student)=>{
                    setStudentList(
                        studentList.concat({
                            id: student._id,
                            name: student.name
                        })
                    )
                })
                .catch((error)=>{
                    console.log(error);
                })                
            });
            setisLoading(true);
        })
        .catch((error)=>{
            console.log(error);
        })
    }

    const onChangeStudent = (e) => {
        const change = e.target.value;
        if(change === "all"){
            setisAllStudent(true);
        }else{
            setisAllStudent(false);
            setStudentIndex(change);
            onChangeData(change);
        }
    }

    const onChangeData = (studentIndex) => {
        let attendCnt = 0;
        let lateCnt = 0;
        let absenceCnt = 0;
        tempData[studentIndex].state.map((state) => {
            if(state === 0){attendCnt = attendCnt + 1}
            else if(state === 1){lateCnt = lateCnt + 1}
            else{absenceCnt = absenceCnt + 1}
        })
        attendance.all = attendCnt;
        late.all = lateCnt;
        absence.all = absenceCnt;
    }

    const [headers, setHeaders] = useState([{label: "학생이름 / 날짜", key: "studentName"}]);
    const [data, setData] = useState([]);

    const ExtractExcel = () => {
        dayList.map((day, dayIndex) => {
            let label = {label: day, key: `${dayIndex}`}
            headers.push(label);
        })
        tempData.map((student) => {
            let attendState = {studentName: student.name}
            student.state.map((state, index) => {
                if (state===0){
                    attendState[`${index}`] = "출석";
                }else if(state === 1){
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
            <Title>Lecture Chart</Title>
            {isAll ?
            <div style={{width: "100%", display: "block"}}>
            <SubTitle>출결 관리</SubTitle>
            <div style={{display: "inline-block", float:"right"}}>
                <SelectCust style={{border: "1px solid #407AD6", background: "#407AD6", color: "white"}} onChange={onChangeSubject}>
                    {subjectList.map((value, Index) => <option value={{id: value._id, name: value.name}}>{value.name}</option>)}
                </SelectCust>
                {isProfessor && <div>
                    <SelectCust style={{border: "1px solid #e0e0e0", background: "#e0e0e0"}} onChange={onChangeStudent}>
                        <option value="all">전체</option>
                        {tempData.map((value, index) => <option value={index}>{value.name}</option> )}
                    </SelectCust>
                    <CSVLink headers={headers} data={data} filename={`${subjectName} 출결.csv`}><WriteBtn>엑셀 추출</WriteBtn></CSVLink>
                </div>}
            </div>
            </div> : 
            <div style={{width: "100%", display: "block"}}>
                <SubTitle>내 강의 / <a style={{color: "inherit"}} href={`/main/${subjectId}/${subjectName}/home`}>{subjectName}</a> / 출석</SubTitle>
                <div style={{display: "inline-block", float:"right"}}>
                    {isProfessor && <div>
                        <SelectCust style={{border: "1px solid #e0e0e0", background: "#e0e0e0"}} onChange={onChangeStudent}>
                            <option value="all">전체</option>
                            {tempData.map((value, index) => <option value={index}>{value.name}</option> )}
                        </SelectCust>
                        <CSVLink headers={headers} data={data} filename={`${subjectName} 출결.csv`}><WriteBtn>엑셀 추출</WriteBtn></CSVLink>
                    </div>}
                </div>
            </div>
            }
            <hr style={{width: "100%", margin: "30px 0px", marginTop: "50px",display:"block", borderColor: '#ffffff'}}/>
            <table style={{width: "100%", borderSpacing: "10px", borderCollapse: "separate", margin: "0px auto"}}>
                <tr>
                <Box style={{width: "50%"}}>
                    <BoxTitle>출결 현황</BoxTitle>
                    <div style={{padding: "10px", display:"flex", justifyContent: "center", alignItems: "center"}}>
                        <Progress type="circle" percent={(currentWeek / allWeek) * 100} format={percent => `${currentWeek}/${allWeek} 주`} style={{marginRight: "30px"}}/>
                        <div style={{width: "50%", margin: "5px", display: 'inline-block', marginLeft: "30px"}}>
                            <div style={{borderBottom: "1px dotted black", padding: "3px", display:"flex", justifyContent: "space-between", alignItems: "center"}}>
                                <BoxText><Icon src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQ1NS4xMTEgNDU1LjExMSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGc+CjxjaXJjbGUgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHlsZT0iIiBjeD0iMjI3LjU1NiIgY3k9IjIyNy41NTYiIHI9IjIyNy41NTYiIGZpbGw9IiMxNzgyZDIiIGRhdGEtb3JpZ2luYWw9IiNlMjRjNGIiIGNsYXNzPSIiPjwvY2lyY2xlPgo8cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHN0eWxlPSIiIGQ9Ik00NTUuMTExLDIyNy41NTZjMCwxMjUuMTU2LTEwMi40LDIyNy41NTYtMjI3LjU1NiwyMjcuNTU2Yy03Mi41MzMsMC0xMzYuNTMzLTMyLjcxMS0xNzcuNzc4LTg1LjMzMyAgYzM4LjQsMzEuMjg5LDg4LjE3OCw0OS43NzgsMTQyLjIyMiw0OS43NzhjMTI1LjE1NiwwLDIyNy41NTYtMTAyLjQsMjI3LjU1Ni0yMjcuNTU2YzAtNTQuMDQ0LTE4LjQ4OS0xMDMuODIyLTQ5Ljc3OC0xNDIuMjIyICBDNDIyLjQsOTEuMDIyLDQ1NS4xMTEsMTU1LjAyMiw0NTUuMTExLDIyNy41NTZ6IiBmaWxsPSIjMWU3OGJiIiBkYXRhLW9yaWdpbmFsPSIjZDE0MDNmIiBjbGFzcz0iIj48L3BhdGg+CjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3R5bGU9IiIgZD0iTTM1MS4yODksMTYyLjEzM0wyMDMuMzc4LDMyNC4yNjdjLTkuOTU2LDExLjM3OC0yNy4wMjIsMTEuMzc4LTM2Ljk3OCwwbC02Mi41NzgtNjkuNjg5ICBjLTguNTMzLTkuOTU2LTguNTMzLTI1LjYsMS40MjItMzUuNTU2YzkuOTU2LTguNTMzLDI1LjYtOC41MzMsMzUuNTU2LDEuNDIybDQ0LjA4OSw0OS43NzhsMTI5LjQyMi0xNDAuOCAgYzkuOTU2LTkuOTU2LDI1LjYtMTEuMzc4LDM1LjU1Ni0xLjQyMkMzNTkuODIyLDEzNi41MzMsMzU5LjgyMiwxNTMuNiwzNTEuMjg5LDE2Mi4xMzN6IiBmaWxsPSIjZmZmZmZmIiBkYXRhLW9yaWdpbmFsPSIjZmZmZmZmIiBjbGFzcz0iIj48L3BhdGg+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjwvZz48L3N2Zz4=" /> 출석</BoxText>
                                <NumText>{attendance.all} <BoxText>건</BoxText></NumText>
                            </div>
                            <div style={{borderBottom: "1px dotted black", padding: "3px", display:"flex", justifyContent: "space-between", alignItems: "center"}}>
                                <BoxText><Icon src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuY29tL3N2Z2pzIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgeD0iMCIgeT0iMCIgdmlld0JveD0iMCAwIDQ1NS4xMTEgNDU1LjExMSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNTEyIDUxMiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgY2xhc3M9IiI+PGc+CjxjaXJjbGUgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHlsZT0iIiBjeD0iMjI3LjU1NiIgY3k9IjIyNy41NTYiIHI9IjIyNy41NTYiIGZpbGw9IiM1NWMyNmYiIGRhdGEtb3JpZ2luYWw9IiNlMjRjNGIiIGNsYXNzPSIiPjwvY2lyY2xlPgo8cGF0aCB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHN0eWxlPSIiIGQ9Ik00NTUuMTExLDIyNy41NTZjMCwxMjUuMTU2LTEwMi40LDIyNy41NTYtMjI3LjU1NiwyMjcuNTU2Yy03Mi41MzMsMC0xMzYuNTMzLTMyLjcxMS0xNzcuNzc4LTg1LjMzMyAgYzM4LjQsMzEuMjg5LDg4LjE3OCw0OS43NzgsMTQyLjIyMiw0OS43NzhjMTI1LjE1NiwwLDIyNy41NTYtMTAyLjQsMjI3LjU1Ni0yMjcuNTU2YzAtNTQuMDQ0LTE4LjQ4OS0xMDMuODIyLTQ5Ljc3OC0xNDIuMjIyICBDNDIyLjQsOTEuMDIyLDQ1NS4xMTEsMTU1LjAyMiw0NTUuMTExLDIyNy41NTZ6IiBmaWxsPSIjNDlhYjYxIiBkYXRhLW9yaWdpbmFsPSIjZDE0MDNmIiBjbGFzcz0iIj48L3BhdGg+CjxwYXRoIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3R5bGU9IiIgZD0iTTM1MS4yODksMTYyLjEzM0wyMDMuMzc4LDMyNC4yNjdjLTkuOTU2LDExLjM3OC0yNy4wMjIsMTEuMzc4LTM2Ljk3OCwwbC02Mi41NzgtNjkuNjg5ICBjLTguNTMzLTkuOTU2LTguNTMzLTI1LjYsMS40MjItMzUuNTU2YzkuOTU2LTguNTMzLDI1LjYtOC41MzMsMzUuNTU2LDEuNDIybDQ0LjA4OSw0OS43NzhsMTI5LjQyMi0xNDAuOCAgYzkuOTU2LTkuOTU2LDI1LjYtMTEuMzc4LDM1LjU1Ni0xLjQyMkMzNTkuODIyLDEzNi41MzMsMzU5LjgyMiwxNTMuNiwzNTEuMjg5LDE2Mi4xMzN6IiBmaWxsPSIjZmZmZmZmIiBkYXRhLW9yaWdpbmFsPSIjZmZmZmZmIiBjbGFzcz0iIj48L3BhdGg+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjxnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjwvZz4KPGcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPC9nPgo8ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8L2c+CjwvZz48L3N2Zz4=" /> 지각</BoxText>
                                <NumText>{late.all} <BoxText>건</BoxText></NumText>
                            </div>
                            <div style={{padding: "3px", display:"flex", justifyContent: "space-between", alignItems: "center"}}>
                                <BoxText style={{width: "50px", textAlign: "left"}}><Icon src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNDU1LjExMSA0NTUuMTExIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0NTUuMTExIDQ1NS4xMTE7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxjaXJjbGUgc3R5bGU9ImZpbGw6I0UyNEM0QjsiIGN4PSIyMjcuNTU2IiBjeT0iMjI3LjU1NiIgcj0iMjI3LjU1NiIvPg0KPHBhdGggc3R5bGU9ImZpbGw6I0QxNDAzRjsiIGQ9Ik00NTUuMTExLDIyNy41NTZjMCwxMjUuMTU2LTEwMi40LDIyNy41NTYtMjI3LjU1NiwyMjcuNTU2Yy03Mi41MzMsMC0xMzYuNTMzLTMyLjcxMS0xNzcuNzc4LTg1LjMzMw0KCWMzOC40LDMxLjI4OSw4OC4xNzgsNDkuNzc4LDE0Mi4yMjIsNDkuNzc4YzEyNS4xNTYsMCwyMjcuNTU2LTEwMi40LDIyNy41NTYtMjI3LjU1NmMwLTU0LjA0NC0xOC40ODktMTAzLjgyMi00OS43NzgtMTQyLjIyMg0KCUM0MjIuNCw5MS4wMjIsNDU1LjExMSwxNTUuMDIyLDQ1NS4xMTEsMjI3LjU1NnoiLz4NCjxwYXRoIHN0eWxlPSJmaWxsOiNGRkZGRkY7IiBkPSJNMzMxLjM3OCwzMzEuMzc4Yy04LjUzMyw4LjUzMy0yMi43NTYsOC41MzMtMzEuMjg5LDBsLTcyLjUzMy03Mi41MzNsLTcyLjUzMyw3Mi41MzMNCgljLTguNTMzLDguNTMzLTIyLjc1Niw4LjUzMy0zMS4yODksMGMtOC41MzMtOC41MzMtOC41MzMtMjIuNzU2LDAtMzEuMjg5bDcyLjUzMy03Mi41MzNsLTcyLjUzMy03Mi41MzMNCgljLTguNTMzLTguNTMzLTguNTMzLTIyLjc1NiwwLTMxLjI4OWM4LjUzMy04LjUzMywyMi43NTYtOC41MzMsMzEuMjg5LDBsNzIuNTMzLDcyLjUzM2w3Mi41MzMtNzIuNTMzDQoJYzguNTMzLTguNTMzLDIyLjc1Ni04LjUzMywzMS4yODksMGM4LjUzMyw4LjUzMyw4LjUzMywyMi43NTYsMCwzMS4yODlsLTcyLjUzMyw3Mi41MzNsNzIuNTMzLDcyLjUzMw0KCUMzMzkuOTExLDMwOC42MjIsMzM5LjkxMSwzMjIuODQ0LDMzMS4zNzgsMzMxLjM3OHoiLz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K"/> 결석</BoxText>
                                <NumText>{absence.all} <BoxText>건</BoxText></NumText>
                            </div>
                        </div>
                    </div>
                </Box>
                <Box>
                    <BoxTitle>이번달 출결 현황</BoxTitle>
                    <AttendBox>
                        <BoxText style={{width: "30%", borderRight: "1px solid #BFBFBF", paddingLeft: "10px"}}>출석 <NumText style={{margin: "0 15px 0 5px"}}>{attendance.month}</NumText></BoxText>
                        <BoxText style={{width: "30%", borderRight: "1px solid #BFBFBF", paddingLeft: "10px"}}>지각 <NumText style={{margin: "0 15px 0 5px"}}>{late.month}</NumText></BoxText>
                        <BoxText style={{width: "30%", paddingLeft: "10px"}}>결석 <NumText style={{margin: "0 15px 0 5px"}}>{absence.month}</NumText></BoxText>
                    </AttendBox>
                    <BoxTitle>이번주 출결 현황</BoxTitle>
                    <AttendBox>
                        <BoxText style={{width: "30%", borderRight: "1px solid #BFBFBF", paddingLeft: "10px"}}>출석 <NumText style={{margin: "0 15px 0 5px"}}>{attendance.week}</NumText></BoxText>
                        <BoxText style={{width: "30%", borderRight: "1px solid #BFBFBF", paddingLeft: "10px"}}>지각 <NumText style={{margin: "0 15px 0 5px"}}>{late.week}</NumText></BoxText>
                        <BoxText style={{width: "30%", paddingLeft: "10px"}}>결석 <NumText style={{margin: "0 15px 0 5px"}}>{absence.week}</NumText></BoxText>
                    </AttendBox>
                </Box>
                </tr>
                <tr>
                    <Box style={{width: "100%", marginLeft: "5px"}} colSpan="2">
                        <BoxTitle>출결 상태</BoxTitle>
                        {!isAllStudent && <BoxText style={{display: "block", float: 'right'}}>출석 <NumText style={{color: "#0E7ED1"}}> {attendance.all}</NumText>회 / 지각 <NumText style={{color: "#61C679"}}> {late.all}</NumText>회 / 결석 <NumText style={{color: "#E24C4B"}}> {absence.all}</NumText>회</BoxText>}
                        {isAllStudent ? <ShowAllAttendance attendList={allAttend}/> : <ShowAttendance attendanceList={tempData[studentIndex]} dayList={dayList}/>}
                    </Box>
                </tr>
            </table>
        </div>
        );
    }

    useEffect(() => {
        getData().then(()=>{
            setDayData();
            ExtractExcel();
            onChangeData(studentIndex);
            setisLoading(true)
        })
    },[])

    return(
        <Container>
            {isLoading && display()}
        </Container>                
    );
}

export default Index;