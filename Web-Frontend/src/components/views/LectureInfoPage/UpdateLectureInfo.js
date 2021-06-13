import React, {useEffect, useState, component} from 'react'
import styled, { css } from 'styled-components'
import theme from '../../../styles/Theme'
import { DatePicker, TimePicker } from 'antd';
import 'antd/dist/antd.css';
import axios from 'axios';
import moment from 'moment';

const { RangePicker } = DatePicker;

const Container = styled.div`
width : 100%;
height : 100%;
display : inline-block;
margin: 10px auto;
padding: 0px 20px;
justify-content: center;
align-items: center;
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
const GrayBox = styled.td`
padding: 10px;
border: 1px soild ${props => props.theme.color.blue};
background: ${props => props.theme.color.light_gray};
`
const WhiteBox = styled.td`
padding: 10px;
border: 1px soild ${props => props.theme.color.blue};
background: white;
`
const SubmitBtn = styled.button`
display: inline-block;
float: right;
font-size: 16px;
padding: 5px;
background-color: ${props => props.theme.color.blue};
color: white;
border-radius: 5px;
margin-right: 5px;
`
const NameInput = styled.input`
padding : 5px;
border : none;
border-bottom : 1px solid ${props => props.theme.color.gray4};
color : ${props => props.theme.color.blue};
`
const Day = styled.div`
width : 50px;
height : 50px;
border-radius : 10px;
text-align : center;
line-height : 50px;
border : 1px solid ${props => props.theme.color.gray1};
margin : 0 5px;
&.active{
    background-color : ${props => props.theme.color.blue};
    color : white;
    border : none;
}
`
const DayContainer = styled.div`
display : flex;
justify-items :center;
align-items :center;
margin-bottom : 20px;
`

function Index({match}){
    const [loading, setLoading] = useState(false);
    const [isEmpty, setisEmpty] = useState(true);

    const subjectId = String(match.params.subject);
    const [defaultName, setDefaultName] = useState('');
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [startPeriod, setStartPeriod] = useState('');
    const [endPeriod, setEndPeriod] = useState('');
    const [startTime, setStartTime] = useState([0]);
    const [endTime, setEndTime] = useState([]);
    const [dayList, setDayList] = useState([]);
    const [introURL, setIntroURL] = useState();

    const week = ["월", "화", "수", "목", "금", "토", "일"];
    
    const getData = () => {
        const url = '/api/subject/info/'+ subjectId;
        axios.get(url)
        .then((response)=>{
            const result = response.data.subject;
            setName(result.name);
            setDefaultName(result.name);
            setCode(result.code);
            setStartPeriod(moment(result.start_period).format('YYYY-MM-DD'));
            setEndPeriod(moment(result.end_period).format('YYYY-MM-DD'));
            setStartTime(result.start_time);
            setEndTime(result.end_time);
            setDayList(result.days);
            setIntroURL(result.introURL);
                        
            setLoading(true);
            setisEmpty(true);
        })
        .catch((error)=>{
            console.log(error);
        })
    }
    
    const onChangeName = (e) => {
        setName(e.target.value);
    }

    const onChangeRange = (value, dateString) => {
        setStartPeriod(dateString[0]);
        setEndPeriod(dateString[1]);
    }

    const selectDayHandler = (e, value) => {
        const elm = e.target;
        if (elm.classList.value.includes('active')){
            elm.classList.remove('active');
            const i = dayList.indexOf(value);
            console.log(i)
            setDayList(dayList.filter((e)=>(e !== value)));
            startTime.splice(i,1);
            endTime.splice(i,1);
        }
        else {
            elm.classList.add('active');
            setDayList([
                ...dayList,
                value
            ]);
        }
    }

    const onChangeTime = (i, dateString) => {
        startTime[i]=dateString[0];
        endTime[i]=dateString[1];
    }

    const onChangeFile = (e) => {
        console.log(e.target);
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        formData.append("fileName", e.target.files[0].name);

        const url = '/api/file/upload';
        axios.post(url, formData)
        .then((response) => {
            console.log(response.data)
            setIntroURL(response.data);
            axios.get('/api/file/read/' + response.data.fileId)
            .then((res)=>{
                setIntroURL(res.data.fileURL)
            })
            .catch((error)=>{
                console.log(error);  
            })

        })
        .catch((error)=>{
            console.log(error);  
        })
    }

    const submitHandler = () => {
        console.log(introURL)
        const url = '/api/subject/info/update/'+ subjectId;
        axios.put(url, { 
            name: name,
            start_period: startPeriod,
            end_period: endPeriod,
            start_time: startTime,
            end_time: endTime,
            days: dayList,
            introURL: introURL
         })
         .then((response)=>{
             return window.location.href = `/main/${subjectId}/info`;
         })
         .catch((response)=>{
             console.log('Error: ' + response);
         });
    }



    const display = () => {
        return(
            <Container>
            <Title>Lecture Info</Title>
            <div style={{width: "100%", display: "block"}}>
                <SubTitle>내 강의 / <a style={{color: "black"}} href={`/main/${subjectId}/${defaultName}/home`}>{defaultName}</a> / <a style={{color: "black"}} href={`/main/${subjectId}/info`}>강의 정보</a> / 강의 정보 수정</SubTitle>                
                <SubmitBtn onClick={submitHandler} style={{display: "inline-block", float:"right"}}>저장하기</SubmitBtn>
            </div>
            <hr style={{width: "100%", margin: "30px 0px", marginTop: "50px", display:"block", borderColor: '#ffffff'}}/>
            <table style={{width: "100%", margin: "1px auto", borderSpacing: "1px", borderCollapse: "separate"}}>
                <tbody>
                    <tr>
                        <GrayBox>강의명</GrayBox>
                        <WhiteBox><NameInput type="text" name="name" placeholder={name} onChange={onChangeName}></NameInput></WhiteBox>
                    </tr>
                    <tr>
                        <GrayBox>강의 코드</GrayBox>
                        <WhiteBox>{code}</WhiteBox>
                    </tr>
                    <tr>
                        <GrayBox>강의 기간</GrayBox>
                        <WhiteBox>
                            <RangePicker defaultValue={[moment(startPeriod, 'YYYY-MM-DD'), moment(endPeriod, 'YYYY-MM-DD')]} 
                            size="large" name='date' format="YYYY-MM-DD" onChange={onChangeRange}/>
                        </WhiteBox>
                    </tr>
                    <tr>
                        <GrayBox>강의 시간</GrayBox>
                        <WhiteBox>
                            <DayContainer>
                                <button onClick={(e) => selectDayHandler(e, 1)}><Day className={dayList.map((value) => value === 1 ? 'active':'')}>월</Day></button>
                                <button onClick={(e) => selectDayHandler(e, 2)}><Day className={dayList.map((value) => value === 2 ? 'active':'')}>화</Day></button>
                                <button onClick={(e) => selectDayHandler(e, 3)}><Day className={dayList.map((value) => value === 3 ? 'active':'')}>수</Day></button>
                                <button onClick={(e) => selectDayHandler(e, 4)}><Day className={dayList.map((value) => value === 4 ? 'active':'')}>목</Day></button>
                                <button onClick={(e) => selectDayHandler(e, 5)}><Day className={dayList.map((value) => value === 5 ? 'active':'')}>금</Day></button>
                                <button onClick={(e) => selectDayHandler(e, 6)}><Day className={dayList.map((value) => value === 6 ? 'active':'')}>토</Day></button>
                                <button onClick={(e) => selectDayHandler(e, 7)}><Day className={dayList.map((value) => value === 7 ? 'active':'')}>일</Day></button>
                            </DayContainer>
                            {dayList.map((value, index) => 
                                <li>{week[value-1]} : <TimePicker.RangePicker defaultValue={isEmpty ? ([moment(startTime[index], 'HH:mm'), moment(endTime[index], 'HH:mm')]) : ([""],[""])} format="HH:mm" onChange={(value, dateString)=>onChangeTime(index, dateString)}/></li>)}
                        </WhiteBox>
                    </tr>
                    <tr>
                        <GrayBox>강의 계획서</GrayBox>
                        <WhiteBox>
                            <input type="file" onChange={onChangeFile}/>
                        </WhiteBox>                        
                    </tr>
                </tbody>
            </table>
            </Container>
        );
    }


    useEffect(() => {
        getData();
    },[]);

    useEffect(()=>{
        if(startTime.length > 0){
            setisEmpty(true);
        }else{
            setisEmpty(false);
        }
        
    },[startTime.length])

    return (
        <div>{loading && display()}</div>          
    )
}

export default Index