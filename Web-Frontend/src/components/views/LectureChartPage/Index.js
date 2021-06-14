import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled, {css} from 'styled-components';
import moment from 'moment';
import 'antd/dist/antd.css';
import { Select, Progress } from 'antd';
import { Line, Bar } from "react-chartjs-2";
import { resolve } from 'dns';

const {Option} = Select;

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
const BoxTitle = styled.div`
display: inline-block;
margin-right: 10px;
color : #233044;
font-size : 16px;
font-weight: 700;
`
const NumTitle = styled.div`
margin: 10px 0px;
color : #757575;
font-size : 30px;
font-weight: bold;
`
const RateBox = css`
text-align: center;
border-radius:5px;
padding : 5px;
font-size : 12px;
display : inline;
bottom : 0px;
`
const RateBoxRed = styled.div`
${RateBox}
color : #f44a4b;
background : #feeceb;
`
const RateBoxGreen = styled.div`
${RateBox}
color : #4caf54;
background : #edf7ed;
`
const InfoBox = styled.div`
margin-left : 5px;
font-size : 12px;
color : #757575;
display : inline;
`
const DayBox = styled.div`
background : #407AD6;
color : white;
//display : inline-block;
border-radius: 5px;
padding: 5px;
float: right;
top: 0;
`
const Box = styled.td`
background: white;
border-radius: 5px;
padding: 10px;
box-shadow: 5px 5px #f5f5f5;
margin: 10px;
`
const SelectCust = styled.select`
font-size: 16px;
width: 80px; /* 원하는 너비설정 */
margin-right: 5px;
padding: 3px; /* 여백으로 높이 설정 */
//font-family: inherit;  /* 폰트 상속 */
border-radius: 5px; /* iOS 둥근모서리 제거 */
-webkit-appearance: none; /* 네이티브 외형 감추기 */
-moz-appearance: none;
appearance: none;
`
function LineChart ({studentData, averageData, studentName, label}){

   console.log("label : " + label);
   console.log("average : " + averageData);
   console.log("student : " + studentData);

   // const labels = Utils.months({count: 7});
   const lineData = {
      labels: label,
      datasets: [
        {
         label: studentName,
         data: studentData,
         lineTension: 0.5,
         backgroundColor: "rgba(15, 107, 255, 0.1)",
         borderWidth: 1,
         borderColor: "#0f6bff",
         fill: false,
        },
        {
         label: "Average",
         data: averageData,
         lineTension: 0.5,
         backgroundColor: "rgba(242, 184, 113, 0.1)",
         borderWidth: 1,
         borderColor: "#f2b471",
         fill: false,
        },
      ],
     };
     
   const lineLegend = {
      display: true,
      labels: {
        fontColor: "black",
      },
      position: "bottom", //label를 넣어주지 않으면 position이 먹히지 않음
     };
   
   const lineOptions = {
      //responsive: true,
      //maintainAspectRatio: false,   
      //tooltips 사용시
      tooltips: {
        enabled: true,
        mode: "nearest",
        //position: "average",
        intersect: false,
      },
      scales: {
         xAxes: [{
            type: 'time',
            time: {
               unit: 'hour',
               unitStepSize: 0.25,
               round: 'hour',
               tooltipFormat: "h:mm:ss a",
               displayFormats: {hour: 'h:mm'}
            },
            //position: "top", //default는 bottom
            display: true,
            scaleLabel: {
               display: true,
               labelString: "Time",
               fontFamily: "Montserrat",
               fontColor: "black",
            }/* ,
            ticks: {
               beginAtZero: true,
               stepSize: 10,
               min: 0,
               max:100,
               //maxTicksLimit: 10 //x축에 표시할 최대 눈금 수
               callback: function (value) {
                  return value + "분";
               }
           }, */
         },
        ],
        yAxes: [
         {
           display: true,
           //   padding: 10,
           scaleLabel: {
            display: true,
            labelString: "Attention",
            fontFamily: "Montserrat",
            fontColor: "black",
           },
           ticks: {
            beginAtZero: true,
            stepSize: 20,
            min: 0,
            max: 100,
            //y축 scale 값에 % 붙이기 위해 사용
            callback: function (value) {
              return value + "%";
            },
           },
         },
        ],
      },
     };

   return(<Line data={lineData} legend={lineLegend} width={200} height={50} options={lineOptions}/>);
}

function BarChart ({modeIndex, dayList, goodList, badList, averList, scoreList, attendanceList}){
   const modeList = ["이해도", "참여점수", "출석"];

   let Color = ["#edf7ed", "#ECECEC", "#feeceb"];
   let borderColor = ["#4caf54", "#BFBFBF", "#f44a4b"];
   const barOptions = {
      legend: {
         display: false, // label 숨기기
      },
      title:{
         display: true,
         text: modeList[modeIndex]
      }/* ,
      scales: {
         yAxes: [{
            ticks: { 
               min: -50, // 스케일에 대한 최솟갓 설정, 0 부터 시작
               stepSize: 10, // 스케일에 대한 사용자 고정 정의 값
            }
         }]
      }, */
      //maintainAspectRatio: false // false로 설정 시 사용자 정의 크기에 따라 그래프 크기가 결정됨.
   }

   const barData = [{
      labels: dayList,
      datasets: [{
         backgroundColor: Color[0],
         borderColor: borderColor[0],
         borderWidth: 1,
         hoverBackgroundColor: Color[0],
         hoverBorderColor: Color[0],
         data: goodList,
         label: "이해 잘됨"
        },
        {
         backgroundColor: Color[1],
         borderColor: borderColor[1],
         borderWidth: 1,
         hoverBackgroundColor: Color[1],
         hoverBorderColor: Color[1],
         data: averList,
         label: "평균"
        },
        {
         backgroundColor: Color[2],
         borderColor: borderColor[2],
         borderWidth: 1,
         hoverBackgroundColor: Color[2],
         hoverBorderColor: Color[2],
         data: badList,
         label: "이해 안됨"
        }]
     },
     {
      labels: dayList,
      datasets: 
      [
        {
         backgroundColor: Color[0],
         borderColor: borderColor[0],
         borderWidth: 1,
         hoverBackgroundColor: Color[0],
         hoverBorderColor: Color[0],
         data: scoreList,
         label: "참여점수"
        }
      ]
     },
     {
      labels: dayList,
      datasets: [{
         backgroundColor: Color[0],
         borderColor: borderColor[0],
         borderWidth: 1,
         hoverBackgroundColor: Color[0],
         hoverBorderColor: Color[0],
         data: attendanceList.attend,
         label: "출석"
        },
        {
         backgroundColor: Color[1],
         borderColor: borderColor[1],
         borderWidth: 1,
         hoverBackgroundColor: Color[1],
         hoverBorderColor: Color[1],
         data: attendanceList.late,
         label: "지각"
        },
        {
         backgroundColor: Color[2],
         borderColor: borderColor[2],
         borderWidth: 1,
         hoverBackgroundColor: Color[2],
         hoverBorderColor: Color[2],
         data: attendanceList.absence,
         label: "결석"
        }]
     }
   ]
   return (<Bar data={barData[modeIndex]} width={200} height={50} options={barOptions}/>);
}

function Info ({title, day, data, rate, rateInfo, isStudentAttend}){
   console.log(title + " : " + data);
   var fixRate = rate.toFixed(0);
   return(
      <Box>
         <BoxTitle>{title}</BoxTitle>
         <DayBox>{day}</DayBox>
         <NumTitle>{data}</NumTitle>
         {isStudentAttend && <div>
            {fixRate > 0 ? <RateBoxGreen>{fixRate}%</RateBoxGreen>:<RateBoxRed>{fixRate}%</RateBoxRed>}
            <InfoBox>{rateInfo}</InfoBox>
         </div>}
      </Box>         
   )
}

function ShowStudentScoreList({day, studentList, isProfessor, userId, dayIndex, scoreList, studentScoreList}){

   function calcRate(dayIndex, studentIndex){
      let lastIndex = dayIndex - 1;
      let result = 0

      if(lastIndex >= 0){
         let change = studentScoreList[studentIndex][dayIndex] - studentScoreList[studentIndex][lastIndex];
         let lastLecture = studentScoreList[studentIndex][lastIndex] === 0 ? 1 : studentScoreList[studentIndex][lastIndex];
         result = (change / lastLecture) * 100;
      }

      if(result > 0){
         return(<RateBoxGreen>{result}%</RateBoxGreen>);
      }else{
         return(<RateBoxRed>{result}%</RateBoxRed>);
      }
   }

   return(
      <Box colSpan="2" style={{display: "table-cell", verticalAlign: "top"}}>
         <BoxTitle style={{}}>학생별 점수</BoxTitle>
         <DayBox>{day}</DayBox>
         <table style={{width: "100%", margin: "10px auto", borderTop: "1px solid #D5D5D5"}}>
            <thead style={{borderBottom: "1px solid #D5D5D5"}}><tr>
               <th style={{padding: "10px 0", width: "15%"}}>이름</th>
               <th style={{padding: "10px 0", width: "15%"}}>점수</th>
               <th style={{padding: "10px 0", width: "20%"}}>전 수업 대비</th>
               <th style={{padding: "10px 0", width: "50%"}}>%학생</th></tr></thead>
            <tbody>
               {studentList && studentList.map((value, stdInd) => 
                  <tr>
                     <td style={{padding: "5px 0", borderBottom: "1px solid #D5D5D5"}}>{isProfessor ? value.name : <>{value.id === userId ? value.name : "anonymous"}</>}</td>
                     <td style={{padding: "5px 0", borderBottom: "1px solid #D5D5D5"}}>{studentScoreList[stdInd][dayIndex]}</td>
                     <td style={{padding: "5px 0", borderBottom: "1px solid #D5D5D5"}}>{calcRate(dayIndex, stdInd)}</td>
                     <td style={{padding: "5px 0", borderBottom: "1px solid #D5D5D5"}}><Progress percent={(studentScoreList[stdInd][dayIndex] / scoreList[dayIndex])*100} status="active"/></td>
                  </tr>
               )}
            </tbody>
         </table>
      </Box>
   )

}


function Index({match}){
   const user = JSON.parse(window.sessionStorage.userInfo);
   const subjectId = match.params.subject;
   const subjectName = match.params.name;
    
   const isProfessor = user.type === "professor" ? true : false;
   const [isLoading, setisLoading] = useState();
   const [isLoadingLine, setisLoadingLine] = useState(false);
   const [isAllStudent, setisAllStudent] = useState(isProfessor);
   const [isEmpty, setisEmpty] = useState(false);

   const [lectureList, setLectureList] = useState([]);
   const [studentList, setStudentList] = useState([]);
   const [dayList, setDayList] = useState([]);
   const [rateInfo, setRateInfo] = useState("");
   
   const [understandingGoodList, setUnderstandingGoodList] = useState([]);
   const [understandingBadList, setUnderstandingBadList] = useState([]);
   const [understandingGoodRate, setUnderstandingGoodRate] = useState(0);
   const [understandingBadRate, setUnderstandingBadRate] = useState(0);
   const [understandingGood, setUnderstandingGood] = useState(0);
   const [understandingBad, setUnderstandingBad] = useState(0);

   const [barGood, setbarGood] = useState([]);
   const [barBad, setbarBad] = useState([]);
   const [barAver, setbarAver] = useState([]);
   const [barAttend, setbarAttend] = useState({
      attend: [],
      late: [],
      absence: []
   })

   const [lineLable, setlineLable] = useState([]);
   const [lineAver, setlineAver] = useState([]);
   const [lineStudent, setlineStudent] = useState([]);

   const [scoreList, setScoreList] = useState([]);
   const [scoreRate, setScoreRate] = useState(0);
   const [score, setScore] = useState(0);
   const [studentScoreList, setStudentScoreList] = useState([]);

   const [attendanceList, setAttendanceList] = useState([]);
   const [attendanceRate, setAttendanceRate] = useState(0);
   const [attendance, setAttendance] = useState(0);
   const [studentAttendList, setStudentAttendList] = useState([]);

   
   const [day, setDay] = useState();
   const [dayIndex, setDayIndex] = useState(0);
   const [studentIndex, setStudentIndex] = useState("all");
   const [mode, setMode] = useState(0);
   const modeList = ["이해도", "참여점수", "출석"];
   
   const getData = () => {
      return new Promise((resolve, reject) => {
         axios.get('/api/subject/info/'+ String(subjectId))
         .then((response)=>{
            const result = response.data.subject;
            console.log(result);
            setisEmpty(result.lectures.length === 0);
            if(result.students.length === 0){
               resolve();
            }
            else if(result.lectures.length === 0){
               result.students.map((value, index) => {
                  axios.get('/api/user/get/'+ String(value))
                  .then((output) => {
                     const student = {
                        id: output.data._id,
                        name: output.data.name,
                        good: [],
                        bad: []
                     }
                     studentList[index] = student;
                     if(index === (result.students.length - 1)){
                        setisLoading(true);
                        resolve();
                     }
                  })
                  .catch((error) => {
                     console.log(error);
                     reject(error);
                  })
               })
            }
            else{
                  result.students.map((std, stdIndex) => {
                  if(!isProfessor && std===user._id ){setStudentIndex(stdIndex)}
                  axios.get('/api/user/get/'+ String(std))
                  .then((output) => {
                     const student = {
                        id: output.data._id,
                        name: output.data.name,
                        good: [],
                        bad: []
                     }
                     studentList[stdIndex] = student;
                  })
                  .catch((error) => {
                     console.log(error);
                     reject(error);
                  })

                  axios.get('/api/lecture/get/subject/'+ String(subjectId))
                  .then((response) => {
                     const lecResult = response.data;
                     console.log(lecResult);
                     setLectureList(lecResult.lecture);
                     setDay(moment(lecResult.lectures[0].date).format('M월 D일'));
                     lecResult.lectures.map((value, index) => {
                        console.log(value);
                        dayList[index] = moment(value.date).format('M월 D일');
                        let totalScore = 0;
                        let attend = 0;
                        let late = 0;
                        let absence = 0;
                        value.students.map((student, stdInd)=>{
                           totalScore = student.activeScore + totalScore;
                           if(student.attendance === 'O'){attend = attend + 1;}
                           else if(student.attendance === 'x'){late = late + 1}
                           else{absence = absence + 1}

                           studentAttendList.push(student.attendance);
                           studentScoreList.push(student.activeScore);
                        })

                        attendanceList.push({attend: attend, late: late, absence: absence});
                        scoreList.push(totalScore);

                        axios.get('/api/understanding/get/lecture/' + String(value._id))
                        .then((understand)=>{
                           console.log(understand.data);
                           if(Object.keys(understand.data.countResponse).length === 0){
                              console.log("111");
                              understandingGoodList[index] = [];
                              understandingBadList[index] = [];
                           }
                           else{
                              console.log("222");
                              let responseGood = understand.data.countResponse.O;
                              understandingGoodList.push(responseGood);
            
                              let responseBad = understand.data.countResponse.X;
                              understandingBadList.push(responseBad);
                              console.log(understandingBadList);
                           }
                           if(index === (lecResult.lectures.length - 1)) {resolve();}
                        })
                        .catch((error)=>{
                           console.log(error);
                           reject(error);
                        });
                     })
                  })
                  .catch((error) => {
                     console.log(error);
                     reject(error);
                  })

               })
            }
         })
         .catch((error) => {
            console.log(error);
            reject(error);
         })

      })
   }

   const setLineData = () => {
      dayList.map((day, dayIndex) => {
         let TimeList = [];
         let AverList = [];
         understandingGoodList[dayIndex] && understandingGoodList[dayIndex].map((response, index) => {
            // TimeList.push(moment(response.minutes)._i)
            TimeList.push(response.minutes)
         })

         understandingBadList[dayIndex] && understandingBadList[dayIndex].map((response, index) => {
            // TimeList.push(moment(response.minutes)._i);
            TimeList.push(response.minutes)
         })
         TimeList = TimeList.sort(function(a, b){
            return a - b;
         });
         TimeList = new Set(TimeList);
         lineLable[dayIndex] = Array.from(TimeList);
         lineLable[dayIndex].map((value, index) => {
            let cnt = 0;
            understandingGoodList[dayIndex] && understandingGoodList[dayIndex].map((response) => {
               if(response.minutes === value){
                  cnt = cnt + 1;
               }
            })
            understandingBadList[dayIndex] && understandingBadList[dayIndex].map((response) => {
               if(response.minutes === value){
                  cnt = cnt - 1;
               }
            })
            AverList.push(cnt);
         })
         lineAver[dayIndex] = AverList;
      })

      studentList && studentList.map((student, studentIndex) => {
         let temp = [];
         dayList.map((day, dayIndex) => {
            let StudList = [];
            const label = lineLable[dayIndex];
            lineLable[dayIndex].map((value, index) => {
               let cnt = 0;
               student.good[dayIndex].map((response) => {
                  if(response.minutes === value){
                     cnt = cnt + 1;
                  }
               })
               student.bad[dayIndex].map((response) => {
                  if(response.minutes === value){
                     cnt = cnt - 1;
                  }
               })
               StudList.push(cnt);
            })
            temp.push(StudList);
         })
         lineStudent[studentIndex] = temp;
      })
      setisLoadingLine(true);
      console.log(lineLable);
      console.log(lineAver);
      console.log(lineStudent);
   }

   const setDefaultStudentData = (dayList, studentList) => {
      // studentList.push(student);
      studentList.map((student) => {
         dayList.map((day, index) => {
            let good = [];
            console.log(understandingGoodList[index]);
            understandingGoodList[index] && understandingGoodList[index].map((value) => {
               if(value.student._id === student.id){
                  good.push(value);
               }
            })
            let bad = [];
            console.log(understandingBadList);
            understandingBadList[index] && understandingBadList[index].map((value) => {
               if(value.student._id === student.id){
                  bad.push(value);
               }               
            })
         });
      })
   }

   const setRate = (dayIndex, studentIndex, isAllStudent) => {
      let lastIndex = dayIndex - 1;
      if(lastIndex < 0){
         setRateInfo("지난 강의가 없습니다.");
         setUnderstandingGoodRate(0);
         setUnderstandingBadRate(0);
         setScoreRate(0);
         setAttendanceRate(0);
      }
      else{
         setRateInfo("Since last class");
         if(isAllStudent){
            let change = understandingGoodList[dayIndex].length - understandingGoodList[lastIndex].length;
            let lastLecture = understandingGoodList[lastIndex].length === 0 ? 1 : understandingGoodList[lastIndex].length;
            setUnderstandingGoodRate((change/ lastLecture) * 100);

            change = understandingBadList[dayIndex].length - understandingBadList[lastIndex].length;
            lastLecture = understandingBadList[lastIndex].length === 0 ? 1 : understandingBadList[lastIndex].length; 
            setUnderstandingBadRate((change / lastLecture) * 100);

            change = attendanceList[dayIndex].attend - attendanceList[lastIndex].attend;
            lastLecture = attendanceList[lastIndex].attend === 0 ? 1 : attendanceList[lastIndex].attend;
            setAttendanceRate((change / lastLecture) * 100);

            change = scoreList[dayIndex] - scoreList[lastIndex];
            lastLecture = scoreList[lastIndex] === 0 ? 1 : scoreList[lastIndex];
            setScoreRate((change / lastLecture) * 100);

         }else {
            let change = studentList[studentIndex].good[dayIndex].length - studentList[studentIndex].good[lastIndex].length;
            let lastLecture = studentList[studentIndex].good[lastIndex].length === 0 ? 1 : studentList[studentIndex].good[lastIndex].length; 
            setUnderstandingGoodRate((change / lastLecture) * 100);

            change = studentList[studentIndex].bad[dayIndex].length - studentList[studentIndex].bad[lastIndex].length;
            lastLecture = studentList[studentIndex].bad[lastIndex].length === 0 ? 1 : studentList[studentIndex].bad[lastIndex].length;
            setUnderstandingBadRate((change / lastLecture) * 100)

            change = studentScoreList[studentIndex][dayIndex] - studentScoreList[studentIndex][lastIndex];
            lastLecture = studentScoreList[studentIndex][dayIndex] === 0 ? 1 : studentScoreList[studentIndex][lastIndex];
            setScoreRate((change / lastLecture) * 100)
         }
         
      }
   }

   const onChangeData = (dayIndex, isAllStudent, studentIndex) => {
      if(dayList.length !== 0){
         if(isAllStudent){
            setUnderstandingGood(understandingGoodList[dayIndex].length);
            setUnderstandingBad(understandingBadList[dayIndex].length);
            understandingGoodList.map((value, index) => {
               barGood[index] = value.length;
               barAver[index] = value.length - understandingBadList[index].length;
            })
            understandingBadList.map((value, index) => {
               barBad[index] = value.length;
            })
   
         }else{
            console.log(studentList[studentIndex]);
            setUnderstandingGood(studentList[studentIndex].good[dayIndex].length);
            setUnderstandingBad(studentList[studentIndex].bad[dayIndex].length);
            dayList.map((day, index) => {
               barGood[index] = studentList[studentIndex].good[index].length;
               barBad[index] = studentList[studentIndex].bad[index].length;
               barAver[index] = studentList[studentIndex].good[index].length - studentList[studentIndex].bad[index].length
            })
         }
         setRate(dayIndex, studentIndex, isAllStudent);
      }
   }

   const onChangeMode = (e) => {
      const change = e.target.value;
      setMode(change);
   }

   const onChangeDay = (e) => {
      const change = e.target.value;
      setDayIndex(change);
      setDay(dayList[change]);
      onChangeData(change, isAllStudent, studentIndex);
   }

   const onChangeStudent = (e) => {
      const change = e.target.value;
      change === "all" ? setisAllStudent(true) : setisAllStudent(false);
      setStudentIndex(change);
      onChangeData(dayIndex, change, change === "all");
   }

   const selectOption = () => {
      return(
         <div style={{display: "inline-block", float:"right"}}>
            <SelectCust style={{border: "1px solid #e0e0e0", background: "#e0e0e0"}} onChange={onChangeStudent}>
               {isProfessor ? <option value={"all"}>전체</option> : <option>{user.name}</option>}
               {isProfessor && studentList.map((value, index) => <option value={index}>{value.name}</option> )}
            </SelectCust>
            <SelectCust style={{border: "1px solid #407AD6", background: "#407AD6", color: "white"}} onChange={onChangeDay}>
               {dayList.map((value, index) => <option value={index}>{value}</option>)}
            </SelectCust>
            <SelectCust style={{border: "1px solid #e0e0e0", background: "#e0e0e0"}} onChange={onChangeMode}>
               <option value={0}>{modeList[0]}</option>
               <option value={1}>{modeList[1]}</option>
               {isProfessor && isAllStudent && <option value={2}>{modeList[2]}</option>}
            </SelectCust>
         </div>
      )
   }

   const display = () => {
      return(<>
      {isEmpty ? 
      <div style={{textAlign:'center', marginTop:'300px', fontSize:'30px', fontStyle:'italic'}}> 진행된 강의가 없습니다.</div> : 
      <table style={{width: "100%", borderSpacing: "10px", borderCollapse: "separate", margin: "0px auto", marginBottom: "20px"}}>
         <tbody>
            <tr>
               <Info title={"이해가 잘돼요"} day={day} data={understandingGood} rate={understandingGoodRate} rateInfo={rateInfo} isStudentAttend={true}/>
               <Info title={"이해가 안돼요"} day={day} data={understandingBad} rate={understandingBadRate} rateInfo={rateInfo} isStudentAttend={true}/>
               <Box rowSpan="2" colSpan="2">
                  <BoxTitle>시간별 보기</BoxTitle>
                  <DayBox>{day}</DayBox>
                  {isLoadingLine && <LineChart studentName={isAllStudent ? "전체" : studentList[studentIndex].name} averageData={lineAver[dayIndex]} studentData={isAllStudent ? lineAver[dayIndex] : lineStudent[studentIndex][dayIndex]} label={lineLable[dayIndex]}/>}
               </Box>
            </tr>
            <tr>
               <Info title={"참여 점수"} day={day} data={score} rate={scoreRate} rateInfo={rateInfo} isStudentAttend={true}/>
               <Info title={"출석 비율"} day={day} data={attendance} rate={attendanceRate} rateInfo={rateInfo} isAllStudent={isAllStudent} isStudentAttend={isAllStudent}/>
            </tr>
            <tr>
               <ShowStudentScoreList day={day} scoreList={studentList} isProfessor={isProfessor} userId={user._id} dayIndex={dayIndex} scoreList={scoreList} studentScoreList={studentScoreList}/>
               <Box colSpan="2">
                  <BoxTitle>날짜별 보기</BoxTitle>
                  {/* <DayBox>{moment(day).format('M월 DD일')}</DayBox> */}
                  <BarChart dayList={dayList} modeIndex={mode} goodList={barGood} badList={barBad} averList={barAver} scoreList={isAllStudent? scoreList : studentScoreList[studentIndex]} attendanceList={barAttend}/>
               </Box>
            </tr>
         </tbody>
      </table>}
      </>);
   }

     useEffect(() => {
      console.log("This is chart page");
      getData().then(()=>{
         if(studentList.length == 0){
            setisEmpty(true);
            setisLoading(true);
         }
         else if(dayList.length !== 0){
            setRate(0);
            setDefaultStudentData(dayList, studentList);
            setLineData();
            if(isProfessor && understandingGoodList[dayIndex] && understandingBadList[dayIndex]){
               setUnderstandingGood(understandingGoodList[dayIndex].length);
               setUnderstandingBad(understandingBadList[dayIndex].length);
               let attend = ((attendanceList[dayIndex].attend / studentList.length) * 100).toFixed(0);
               setAttendance(`${attend}% (${attendanceList[dayIndex].attend}/${studentList.length})`);
               setScore(scoreList[dayIndex])
               console.log(understandingGoodList);
               console.log(understandingBadList);
               understandingGoodList.map((value, index) => {
                  barGood[index] = value && value.length;
                  barAver[index] = value && value.length - understandingBadList[index].length;
               })
               understandingBadList.map((value, index) => {
                  barBad[index] = value.length;
               })
               attendanceList.map((value, index)=>{
                  barAttend.attend.push(value.attend);
                  barAttend.late.push(value.late);
                  barAttend.absence.push(value.absence);
               })
               setisLoading(true);
            }else{
               setUnderstandingGood(studentList[studentIndex].good[dayIndex].length);
               setUnderstandingBad(studentList[studentIndex].bad[dayIndex].length);
               switch (studentAttendList[studentIndex][dayIndex]) {
                  case "O":
                     setAttendance("출석");
                     break;
                  case "X":
                     setAttendance("지각");
                     break;
                  default:
                     setAttendance("결석");
                     break;
               }
               setScore(studentScoreList[studentIndex][dayIndex]);
               dayList.map((day, index) => {
                  barGood[index] = studentList[studentIndex].good[index].length;
                  barBad[index] = studentList[studentIndex].bad[index].length;
                  barAver[index] = studentList[studentIndex].good[index].length - studentList[studentIndex].bad[index].length
               })
               setisLoading(true);
            }
         }
      })
      
    },[])

   return (
      <Container>
         <Title>Lecture Chart</Title>
         <div style={{width: "100%", display: "block"}}>
            <SubTitle>내 강의 / <a style={{color: "black"}} href={`/main/${subjectId}/${subjectName}/home`}>{subjectName}</a> / 학습 분석 차트</SubTitle>
            {isLoading && selectOption()}
         </div>
         <hr style={{width: "100%", margin: "30px 0px", marginTop: "50px", display:"block", borderColor: '#ffffff'}}/>
         {isLoading && display()}
      </Container>
   )
}

export default Index;