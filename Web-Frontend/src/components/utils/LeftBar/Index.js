import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import logo_mark from '../../../images/logo/logo_mark.png'
import logo_word from '../../../images/logo/logo_word.png'
import lecture from '../../../images/logo/lecture.png'
import mylecture from '../../../images/logo/mylecture.png'
import account from '../../../images/logo/account.png'
import bottom_arrow from '../../../images/logo/bottom_arrow.png'
import right_arrow from '../../../images/logo/right_arrow.png'
import Avater from '../../../images/avatar/avater.jpeg'
import axios from 'axios'

const Container = styled.div`
width : ${props => props.theme.margin.leftBar};
height : 100%;
overflow-y: scroll;
-ms-overflow-style: none;
scrollbar-width: none;
&::-webkit-scrollbar{
    display: none;
};
background-color: ${props => props.theme.color.main};
position : absolute;
left : 0;

`

const Content = styled.div`
margin-bottom: 65px;
`

const SubjectMenu = styled.ul`
display : none;
padding-left : 30px;
padding-bottom : 10px;
padding-top : 10px;
background-color : #1E2A38;
color : white;
font-size : 15px;
list-style-type : none;
`

const SubjectMenuCom = styled.a`
color : white;
`

const Menu = styled.button`
width : 90%;
padding-bottom : 7px;
padding-top : 10px;
margin-left : 12px;
padding-left : 10px;
display : block;
color : white;
font-size :15px;
text-align : left;
`
const SubMenu = styled.a`
color : white;
padding-left : 50px;
padding-bottom : 7px;
padding-top : 7px;
display : block;
font-size : 15px;
&:hover{
    background-color : #1E2A38;
    ${SubjectMenu}{
        display: block;
        padding-bottom : 7px;
        padding-top : 10px;
    }
}
&:active{
    background-color : #1E2A38;
}
/* &.active{

} */
`
const Footer = styled.div`
width : 260px;
position : fixed;
padding : 10px;
background-color : #1E2A38;
bottom : 0;
height : 60px;
display : flex;
align-items : center;
`

const FooterAvater = styled.div`
width: 50px;
height: 50px;
background-image: url(${Avater});
border-radius: 50%;
background-position: center center;
background-size: cover;
display : inline-block;
`

const FooterRight = styled.div`
color : white;
display : inline-block;
margin-left: 10px;
`


function Index() {

    const [isStudent, setisStudent] = useState(false)
    const [isProfessor, setisProfessor] = useState(false);
    const [subjectList, setSubjectList] = useState([]);
    const user = JSON.parse(window.sessionStorage.userInfo);

    useEffect(() => {
        if(user.type === "student"){
            setisStudent(true);
        }else{
            setisProfessor(true);
        }
        axios.get('/api/subject/get/mySubjects')
        .then((response)=>{
            console.log(response.data);
            setSubjectList(response.data.subjects);
        })
        .catch((error)=>{
            console.log(error);
            alert("세션이 만료되었습니다.");
            return window.location.href = '/';
        })
    }, [])

    const [ShowMenu1, setShowMenu1] = useState(true);
    const [ShowMenu2, setShowMenu2] = useState(true);
    const [ShowMenu3, setShowMenu3] = useState(true);

    const toggle1 = (e) => {
        if (ShowMenu1 === false) setShowMenu1(true);
        else setShowMenu1(false);
    }

    const toggle2 = (e) => {
        if (ShowMenu2 === false) setShowMenu2(true);
        else setShowMenu2(false);
    }
    const toggle3 = (e) => {
        if (ShowMenu3 === false) setShowMenu3(true);
        else setShowMenu3(false);
    }

    const onLogout = useCallback((e)=>{
        axios.get('/api/auth/logout')
        .then((response)=>{
            const result = response.data.success;
            console.log(result);
            sessionStorage.removeItem("userInfo");
            alert("로그아웃 되었습니다.");
            return window.location.href = '/';
        })
        .catch((error)=>{
            console.log(error);
        })
    });

    const onSignout = useCallback((e)=>{
        axios.delete('/api/user/delete')
        .then((response)=>{
            const result = response.data.success;
            console.log(result);
            sessionStorage.removeItem("userInfo");
            alert("회원 탈퇴가 완료되었습니다.");
            return window.location.href = '/';
        })
        .catch((error)=>{
            console.log(error);
        })
    });

    const confirmSignout = () => {
        if(window.confirm("정말로 회원 탈퇴하시겠습니까?")){
            onSignout();
        }
    }



    return (
        <Container>
            <a style={{ display: 'inline-block', margin: "25px 20px" }} href="/main">
                <img style={{ maxHeight: '40px', height:"40px", width:"40px"}} src={logo_mark} alt="logo_mark" />
                <img style={{ maxHeight: '40px', height:"30px"}} src={logo_word} alt="logo_word" />
            </a>
            <Content>
                <Menu onClick={toggle1}>
                    <img style={{ height:"30px", paddingRight:'5px',paddingLeft:'2px'}} src={lecture} alt="lecture" />
                    강의
                    {!ShowMenu1 && <img style={{ height:"15px", marginTop:'7px', float: 'right'}} src={right_arrow} alt="right_arrow" />}
                    {ShowMenu1 && <img style={{ height:"15px", marginTop:'7px', float: 'right'}} src={bottom_arrow} alt="bottom_arrow" />} 
                </Menu>
                
                {ShowMenu1 && <div  style={{marginBottom:"10px"}}>
                    {isProfessor && <SubMenu href="/main/uploadLecture"><span># 강의 개설</span></SubMenu>}
                    {isStudent && <SubMenu href="/main/enterLecture">#  강의 참여</SubMenu>}
                    <SubMenu href="/test/aaa">#  zoom test</SubMenu>
                    <SubMenu href="/main/all/all/notice">#  공지사항</SubMenu>
                    <SubMenu href="/main/all/all/attendence">#  출결관리</SubMenu>
                    <SubMenu href="/"># 진도 관리</SubMenu>
                </div>}
                <Menu onClick={toggle2}>  
                    <img style={{ height:"33px", paddingRight:'5px', paddingBottom:'3px'}} src={mylecture} alt="mylecture" />
                    내 강의
                    {!ShowMenu2 && <img style={{ height:"15px", marginTop:'7px', float: 'right'}} src={right_arrow} alt="right_arrow" />}
                    {ShowMenu2 && <img style={{ height:"15px", marginTop:'7px', float: 'right'}} src={bottom_arrow} alt="bottom_arrow" />} 
                </Menu>
                {ShowMenu2 && <div style={{marginBottom:"10px"}}>
                    {subjectList.map((subject) => 
                    <SubMenu>{'# '}{subject.name}
                        <SubjectMenu>
                            {isStudent && <li style={{marginBottom:"12px"}}><SubjectMenuCom href={`/class/st/${subject._id}/${subject.code}`}>실시간 강의 참여</SubjectMenuCom></li>}
                            {isProfessor && <li style={{marginBottom:"12px"}}><SubjectMenuCom href={`/class/pf/${subject._id}/${subject.code}`}>실시간 강의 시작</SubjectMenuCom></li>}
                            <li style={{marginBottom:"12px"}}><SubjectMenuCom href={`/main/${subject._id}/info`}>강의 정보</SubjectMenuCom></li>
                            <li style={{marginBottom:"12px"}}><SubjectMenuCom href={`/main/${subject._id}/${subject.name}/notice`}>공지 사항</SubjectMenuCom></li>
                            <li style={{marginBottom:"12px"}}><SubjectMenuCom href={`/main/${subject._id}/${subject.name}/lectureNote`}>강의 노트</SubjectMenuCom></li>
                            {isProfessor && <li style={{marginBottom:"12px"}}><SubjectMenuCom href={`/main/${subject._id}/${subject.name}/pf/assignment`}>과제</SubjectMenuCom></li>}
                            {!isProfessor && <li style={{marginBottom:"12px"}}><SubjectMenuCom href={`/main/${subject._id}/${subject.name}/st/assignment`}>과제</SubjectMenuCom></li>}
                            <li style={{marginBottom:"12px"}}><SubjectMenuCom href={`/main/${subject._id}/${subject.name}/chart`}>학습 분석 차트</SubjectMenuCom></li>
                            <li style={{marginBottom:"12px"}}><SubjectMenuCom href={`/main/${subject._id}/${subject.name}/attendence`}>출석</SubjectMenuCom></li>
                            <li><SubjectMenuCom href={`/main/${subject._id}/replay`}>강의 다시 보기</SubjectMenuCom></li>
                        </SubjectMenu>
                    </SubMenu>)}
                </div>
                }
                
                <Menu onClick={toggle3}>
                    <img style={{ height:"26px", paddingLeft:'5px', paddingRight:'10px', paddingBottom:'3px'}} src={account} alt="account" />
                    계정
                    {!ShowMenu3 && <img style={{ height:"15px", marginTop:'7px', float: 'right'}} src={right_arrow} alt="right_arrow" />}
                    {ShowMenu3 && <img style={{ height:"15px", marginTop:'7px', float: 'right'}} src={bottom_arrow} alt="bottom_arrow" />} 
                </Menu>
                {ShowMenu3 && <div  style={{marginBottom:"10px"}}>
                    <SubMenu href="/main/account/mypage">#  내 정보</SubMenu>
                    <SubMenu href="#" onClick={onLogout}>#  로그아웃</SubMenu>
                    <SubMenu href="#" onClick={confirmSignout}>#  회원탈퇴</SubMenu>
                </div>}
            </Content>
            <Footer>
                <FooterAvater style={{backgroundImage: `url(${user.photourl})`}}/>
                <FooterRight>
                    <div>
                        <div style={{ fontSize: '17px' }}>{user.name}({user.identityID})</div>
                        <div style={{ fontSize: '13px' }}>{user.major}</div>
                    </div>
                </FooterRight>
            </Footer>
        </Container>
    )
}

export default Index
