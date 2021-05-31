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
height : 100%;
display : inline-block;
margin-left : 20px;
margin-top : 10px; 
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

function BarChart ({modeIndex, dayList, goodList, badList, averList}){
   const modeList = ["이해도", "참여점수", "몰입", "출석"];

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

   const barData = {
      labels: dayList,
      datasets: 
      [
        {
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
        }

      ]
     }; 
   return (<Bar data={barData} width={200} height={50} options={barOptions}/>);
}

function Info ({title, day, data, rate, rateInfo}){
   console.log(title + " : " + data);
   return(
      <Box>
         <BoxTitle>{title}</BoxTitle>
         <DayBox>{day}</DayBox>
         <NumTitle>{data}</NumTitle>
         {rate > 0 ? <RateBoxGreen>{rate}%</RateBoxGreen>:<RateBoxRed>{rate}%</RateBoxRed>}
         <InfoBox>{rateInfo}</InfoBox>
      </Box>         
   )
}

function ShowStudentScoreList({day, scoreList, isProfessor, userName}){
   return(
      <Box colSpan="2" style={{display: "table-cell", verticalAlign: "top"}}>
         <BoxTitle style={{}}>학생별 점수</BoxTitle>
         <DayBox>{day}</DayBox>
         <table style={{width: "100%", margin: "10px auto", borderTop: "1px solid #D5D5D5"}}>
            <thead style={{borderBottom: "1px solid #D5D5D5"}}><tr>
               <th style={{padding: "10px 0", width: "15%"}}>이름</th>
               <th style={{padding: "10px 0", width: "15%"}}>점수</th>
               <th style={{padding: "10px 0", width: "20%"}}>전날 대비</th>
               <th style={{padding: "10px 0", width: "50%"}}>%학생</th></tr></thead>
            <tbody>
               {/* {scoreList.map((value) => <ShowStudentScore value={value} />)} */}
            </tbody>
         </table>
      </Box>
   )

}

function ShowStudentScore({value, userName, isProfessor}){
   const [rate, setRate] = useState(0);

   return(
      <tr>
         <td style={{padding: "5px 0", borderBottom: "1px solid #D5D5D5"}}>{isProfessor ? value.name : <>{value.name === userName ? value.name : "anonymous"}</>}</td>
         <td style={{padding: "5px 0", borderBottom: "1px solid #D5D5D5"}}>{value.score}</td>
         <td style={{padding: "5px 0", borderBottom: "1px solid #D5D5D5"}}>{rate > 0 ? <RateBoxGreen>{rate}%</RateBoxGreen>:<RateBoxRed>{rate}%</RateBoxRed>}</td>
         <td style={{padding: "5px 0", borderBottom: "1px solid #D5D5D5"}}><Progress percent={50} status="active"/></td>
      </tr>

   )
}

function Index({match}){
   const user = JSON.parse(window.sessionStorage.userInfo);
   const subjectId = match.params.subject;
   const subjectName = match.params.name;
    
   const isProfessor = user.type === "professor" ? true : false;
   const [isLoading, setisLoading] = useState(false);
   const [isLoadingLine, setisLoadingLine] = useState(false);
   const [isAllStudent, setisAllStudent] = useState(true);
   const [isEmpty, setisEmpty] = useState(false);

   // const [lectureList, setLectureList] = useState([]);
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

   const [lineLable, setlineLable] = useState([]);
   const [lineAver, setlineAver] = useState([]);
   const [lineStudent, setlineStudent] = useState([]);

   const [scoreList, setScoreList] = useState([]);
   const [scoreRate, setScoreRate] = useState(0);
   const [score, setScore] = useState(0);

   const [attendanceList, setAttendanceList] = useState([]);
   const [attendanceRate, setAttendanceRate] = useState(0);
   const [attendance, setAttendance] = useState(0);
   
   const [day, setDay] = useState('');
   const [dayIndex, setDayIndex] = useState(0);
   const [studentIndex, setStudentIndex] = useState("all");
   const [mode, setMode] = useState(0);
   const modeList = ["이해도", "참여점수", "몰입", "출석"];
   
   const getData = () => {
      return new Promise((resolve, reject) => {
         axios.get('/api/subject/info/'+ String(subjectId))
         .then((response)=>{
            const result = response.data.subject;
            console.log(result);
            console.log(result.lectures.length === 0)
            setisEmpty(result.lectures.length === 0);
            if(result.lectures.length === 0){
               setisLoading(true);
               resolve();
            }
            else{
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
                  })
                  .catch((error) => {
                     console.log(error);
                     reject(error);
                  })
               })

               axios.get('/api/lecture/get/subject/'+ String(subjectId))
               .then((response) => {
                  const result = response.data;
                  console.log(result);
                  // setLectureList(result.lecture);
                  setDay(moment(result.lectures[0].date).format('M월 DD일'));
                  result.lectures.map((value, index) => {
                     dayList[index] = moment(value.date).format('M월 DD일');
                     axios.get('/api/understanding/get/lecture/' + String(value._id))
                     .then((understand)=>{
                        if(Object.keys(understand.data.countResponse).length === 0){
                           understandingGoodList[index] = [];
                           understandingBadList[index] = [];
                        }
                        else{
                           let responseGood = understand.data.countResponse.O;
                           understandingGoodList[index] = responseGood;
         
                           let responseBad = understand.data.countResponse.X;
                           understandingBadList[index] = responseBad;
                        }
                        if(index === (result.lectures.length - 1)) {resolve();}
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

            }
         })
         .catch((error) => {
            console.log(error);
            reject(error);
         })

/*          if(!isEmpty){
         } */
      })
   }



   const setLineData = () => {
      dayList.map((day, dayIndex) => {
         let TimeList = [];
         let AverList = [];
         understandingGoodList[dayIndex].map((response, index) => {
            // TimeList.push(moment(response.minutes)._i)
            TimeList.push(response.minutes)
         })

         understandingBadList[dayIndex].map((response, index) => {
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
            understandingGoodList[dayIndex].map((response) => {
               if(response.minutes === value){
                  cnt = cnt + 1;
               }
            })
            understandingBadList[dayIndex].map((response) => {
               if(response.minutes === value){
                  cnt = cnt - 1;
               }
            })
            AverList.push(cnt);
         })
         lineAver[dayIndex] = AverList;
      })

      studentList.map((student, studentIndex) => {
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
            understandingGoodList[index].map((value) => {
               if(value.student._id === student.id){
                  good.push(value);
               }
            })
            let bad = [];
            understandingBadList[index].map((value) => {
               if(value.student._id === student.id){
                  bad.push(value);
               }               
            })
            student.good[index] = good;
            student.bad[index] = bad;
         })
      });
      setisLoading(true);
      // setLineData();
   }

   const setRate = (dayIndex, studentIndex) => {
      let lastIndex = dayIndex - 1;
      if(lastIndex < 0){
         setRateInfo("지난 강의가 없습니다.");
         setUnderstandingGoodRate(0);
         setUnderstandingBadRate(0);
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
         }else {
            let change = studentList[studentIndex].good[dayIndex].length - studentList[studentIndex].good[lastIndex].length;
            let lastLecture = studentList[studentIndex].good[lastIndex].length === 0 ? 1 : studentList[studentIndex].good[lastIndex].length; 
            setUnderstandingGoodRate((change / lastLecture) * 100);

            change = studentList[studentIndex].bad[dayIndex].length - studentList[studentIndex].bad[lastIndex].length;
            lastLecture = studentList[studentIndex].bad[lastIndex].length === 0 ? 1 : studentList[studentIndex].bad[lastIndex].length;
            setUnderstandingBadRate((change / lastLecture) * 100)
         }
         
      }
   }

   const onChangeData = (dayIndex, isAllStudent, studentIndex) => {
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
      setRate(dayIndex, studentIndex);
   }

   const onChangeMode = (e) => {
      const change = e.target.value;
      setMode(change);
   }

   const onChangeDay = (e) => {
      const change = e.target.value;
      setDayIndex(change);
      // setDay(lectureList[dayIndex].date);
      setDay(dayList[change]);
      onChangeData(change, isAllStudent, studentIndex);
   }

   const onChangeStudent = (e) => {
      const change = e.target.value;
      change === "all" ? setisAllStudent(true) : setisAllStudent(false);
      setStudentIndex(change);
      onChangeData(dayIndex, change === "all", change);
   }

   const selectOption = () => {
      return(
         <div style={{display: "inline-block", float:"right"}}>
            <SelectCust style={{border: "1px solid #e0e0e0", background: "#e0e0e0"}} onChange={onChangeStudent}>
               {isProfessor ? <option value={"all"}>전체</option> : <option>{user.name}</option>}
               {isProfessor && studentList.map((value, index) => <option value={index}>{value.name}</option> )}
            </SelectCust>
            <SelectCust style={{border: "1px solid #407AD6", background: "#407AD6", color: "white"}} onChange={onChangeDay}>
               {/* {lectureList.map((value, index) => <option value={index}>{moment(value.date).format('M월 DD일')}</option>)} */}
               {dayList.map((value, index) => <option value={index}>{value}</option>)}
            </SelectCust>
            <SelectCust style={{border: "1px solid #e0e0e0", background: "#e0e0e0"}} onChange={onChangeMode}>
               {modeList.map((value, index) => <option value={index}>{value}</option>)}
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
               <Info title={"이해가 잘돼요"} day={day} data={understandingGood} rate={understandingGoodRate} rateInfo={rateInfo}/>
               <Info title={"이해가 안돼요"} day={day} data={understandingBad} rate={understandingBadRate} rateInfo={rateInfo}/>
               <Box rowSpan="2" colSpan="2">
                  <BoxTitle>시간별 보기</BoxTitle>
                  <DayBox>{day}</DayBox>
                  {isLoadingLine && <LineChart studentName={isAllStudent ? "전체" : studentList[studentIndex].name} averageData={lineAver[dayIndex]} studentData={isAllStudent ? lineAver[dayIndex] : lineStudent[studentIndex][dayIndex]} label={lineLable[dayIndex]}/>}
               </Box>
            </tr>
            <tr>
               <Info title={"참여 점수"} day={day} data={score} rate={scoreRate} rateInfo={rateInfo}/>
               <Info title={"출석 비율"} day={day} data={attendance} rate={attendanceRate} rateInfo={rateInfo}/>
            </tr>
            <tr>
               <ShowStudentScoreList day={day}/>
               <Box colSpan="2">
                  <BoxTitle>날짜별 보기</BoxTitle>
                  {/* <DayBox>{moment(day).format('M월 DD일')}</DayBox> */}
                  <BarChart dayList={dayList} modeIndex={mode} goodList={barGood} badList={barBad} averList = {barAver}/>
               </Box>
            </tr>
         </tbody>
      </table>}
      </>);
   }

     useEffect(() => {
      console.log("This is chart page");
      getData().then(()=>{
         if(dayList.length != 0){
            setUnderstandingGood(understandingGoodList[dayIndex].length);
            setUnderstandingBad(understandingBadList[dayIndex].length);
            setRate(0);
             understandingGoodList.map((value, index) => {
                barGood[index] = value.length;
                barAver[index] = value.length - understandingBadList[index].length;
             })
             understandingBadList.map((value, index) => {
                barBad[index] = value.length;
             })
            setDefaultStudentData(dayList, studentList);
            setLineData();
            setisLoading(true);
         }
      })
      
    },[])

   return (
      <Container>
         <Title>Lecture Chart</Title>
         <div style={{width: "100%", display: "block"}}>
            <SubTitle>내 강의 / <a style={{color: "inherit"}} href={`/main/${subjectId}/${subjectName}/home`}>{subjectName}</a> / 학습 분석 차트</SubTitle>
            {isLoading && selectOption()}
         </div>
         <hr style={{width: "100%", margin: "30px 0px", marginTop: "50px", display:"block", borderColor: '#ffffff'}}/>
         {isLoading && display()}
      </Container>
   )
}

export default Index;