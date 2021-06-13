import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Avater from '../../../images/avatar/avater.jpeg'
import {ReactComponent as LikeImg} from '../../../images/utils/heart.svg';
import {ReactComponent as CommentImg} from '../../../images/utils/comment.svg';

const SmallBtn = styled.button`
display: inline-block;
font-size: 12px;
padding: 5px;
margin: 1px;
background-color: ${props => props.theme.color.blue};
color: white;
border-radius: 5px;
`
const ReactBtn = styled.button`
display: inline-block;
width: 40%;
margin: 5px;
`
const CommentBtn = styled.button`
display: inline-block;
background-color: #BFBFBF;
color: #3E3E3E;
position: absolute;
width: 10%;
height: 40px;
border: solid 1px #ababab;
cursor: pointer;
border-radius: 0 5px 5px 0;
`
const CommentInputBox = styled.textarea`
display: inline-block;
width : 90%;
height: 40px;
padding : 10px;
resize: none;
border : 1px solid ${props => props.theme.color.gray4};
`
const Profile = styled.div`
width: 30px;
height: 30px;
background-image: url(${Avater});
border-radius: 50%;
background-position: center center;
background-size: cover;
display : inline-block;
margin : 5px;
`
function ShowComment ({value, index, postId, subjectId, subjectName, userId, type, url}){
    
    const [isEditing, setisEditing] = useState(false);
    const [comment, setComment] = useState('');
    

    const editComment = (e, commenetId) => {
        axios.put('/api/comment/edit', {
            postType : type,
            postId : postId,
            commentIndex : commenetId,
            content : comment
        })
        .then((response)=>{
            const result = response.data;
            console.log(result);
            if(result.success){
                setComment('');
                alert("댓글 수정을 완료했습니다.");
                return window.location.href = url;
            }
        })
        .catch((error)=>{
            console.log(error);
        });

    }

    const deleteComment = (e, commenetId) => {
        axios.put('/api/comment/delete', {
            postType : type, 
            postId : postId,
            commentIndex : commenetId
        })
        .then((response)=>{
            const result = response.data;
            console.log(result);
            if(result.success){
                alert("댓글 삭제를 완료했습니다.");
                return window.location.href = url;                
            }
        })
        .catch((error)=>{
            console.log(error);
        });
    }

    return(
        <>
        {isEditing ? 
            <div style={{position: "relative"}}>
                <CommentInputBox onChange={(e) => setComment(e.target.value)} style={{resize : "none"}} placeholder={value.content}/>
                <CommentBtn onClick={(e) => editComment(e, index)}>수정</CommentBtn>
            </div>:
            <div style={{width: "100%", height: "40px", position: "relative"}}>
                <div style={{display: "inline-block", height: "40px"}}><Profile style={{backgroundImage: `url(${value.user.photourl})`}}/>
                <div style={{position: "absolute", left: "40px", top: "10px"}}>{value.user.name} : {value.content}</div></div>
                {value.user._id == userId && <div style={{float:"right", marginRight: "5px"}}>
                    <SmallBtn onClick={(e) => {setisEditing(!isEditing); setComment(value.content)}}>수정</SmallBtn>
                    <SmallBtn onClick={(e) => deleteComment(e, index)}>삭제</SmallBtn></div>}                               
            </div>}
        </>
    )
}

function Index({commentList, emotionList, postId, subjectId, subjectName, userId, type}){
    const user = JSON.parse(window.sessionStorage.userInfo);
    const userType = user.type === "professor" ? "pf":"st";
    const isAssignment = type === "assignment";
    const url = isAssignment ? `/main/${subjectId}/${subjectName}/${userType}/${type}/${postId}` : `/main/${subjectId}/${subjectName}/${type}`;

    const [isShowing, setisShowing] = useState(false);
    const [comment, setComment] = useState('');
    const [isRed, setisRed] = useState(false);
    const [emotionsLength, setEmotionsLength] = useState(emotionList.length);

    const checkEmotion = () => {
        if(emotionList.length === 0) {setisRed(false);}
        else{
            emotionList.forEach(element => {
            if(element.user == userId) {setisRed(true);}});
        }
        return setisRed;
    }

    const addEmotion = (e) => {
        axios.put('/api/emotion/add',{
            postType : type,
            postId : postId,
            emotion : "heart"
        })
        .then((response)=>{
            const result = response.data.success;
            console.log(result);
            if(result){
                setisRed(true);
                setEmotionsLength(emotionsLength + 1);
                //alert("좋아요를 눌렀습니다.");
                //return window.location.href = `/main/${subject.id}/${subject.name}/notice`;
            }
        })
        .catch((error)=>{
            console.log(error);
        });
    }

    const deleteEmotion = () => {
        axios.put('/api/emotion/delete', {
            postType : type, 
            postId : postId
        })
        .then((response)=>{
            const result = response.data;
            console.log(result);
            if(result.success){
                setisRed(false);
                setEmotionsLength(emotionsLength - 1);
                //alert("좋아요를 취소했습니다.");
                //return window.location.href = `/main/${subject.id}/${subject.name}/notice`;                
            }
        })
        .catch((error)=>{
            console.log(error);
        });
    }

    const submitComment = (e) => {
        console.log(comment);
        axios.put('/api/comment/add',{
            postType : type,
            postId : postId,
            content : comment
        })
        .then((response)=>{
            const result = response.data.success;
            console.log(result);
            if(result){
                setComment('');
                alert("댓글 작성을 완료했습니다.");
                return window.location.href = url;
            }
        })
        .catch((error)=>{
            console.log(error);
        });
    }

    useEffect(() => {
        checkEmotion();
    },[])

    return(
    <div style={{width: "100%"}}>
        <div style={{display: "flex", justifyContent: "space-between", margin: "0", padding: "0 5px", fontWeight: "700"}}>
            <ReactBtn onClick={(e) => setisShowing(!isShowing)}><CommentImg width="14px" height="14px"/> 댓글({commentList.length})</ReactBtn>
            <ReactBtn onClick={(e)=> (isRed ? deleteEmotion() : addEmotion())}><LikeImg width="12px" height="12px" fill={isRed ? "red":"gray"}/> 좋아요({emotionsLength})</ReactBtn>
        </div>
        <div style={{width: "100%", display:"block"}}>
            {isShowing && commentList.map((value, index) => 
            <div style={{display: "block", width: "100%", margin: "10px auto"}}>
                <ShowComment url={url} value={value} index ={index} postId={postId} subjectId={subjectId} subjectName={subjectName} userId={userId} type={type}/>
            </div>)
            }
        </div>
        {isShowing && <div style={{width: "100%", display:"block", margin: "0 auto", position: "relative"}}>
            <CommentInputBox onChange={(e) => setComment(e.target.value)} rows={2} style={{resize : "none"}}/>
            <CommentBtn onClick={(e) => submitComment()}>등록</CommentBtn>
        </div>}

    </div>
                        
    )
}

export default Index;