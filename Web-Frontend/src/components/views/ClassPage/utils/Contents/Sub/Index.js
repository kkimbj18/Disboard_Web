import { Socket } from 'dgram';
import { REFUSED } from 'dns';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import './style.css'

const SubCnt = styled.div`
width : 100%;
height : 100%;
display : flex;
flex-direction : column;
align-items : center;
`

const SubContentCnt = styled.div`
width : 100%;
height : 30vh;
overflow-y : scroll;
::-webkit-scrollbar {
    display: none;
}
`

const SubInputCnt = styled.div`
width : 100%;
height : 5vh;
display : flex;
justify-content : space-between;
align-items : center;
`

const SubInput = styled.input`
padding: 0 0.5rem;
height : 80%;
width: 80%;
border: 1px solid #D4D4D4; 
border-radius: 5px;
`

const SubSubmitBtn = styled.button`
font-size: 0.8rem;
width : 20%;
text-align : center;
font-weight : bold;
color : #A6C5F3;
`

const SubFlexBox = styled.div`
width : 100%;
height : fit-content;
display : flex;
flex-direction : column;
min-height : 30vh;
`

function Index(props) {
    const socket = props.socket;

    const [flexRef, setflexRef] = useState(React.createRef());
    const [inputRef, setinputRef] = useState(React.createRef());
    const [subContent, setsubContent] = useState("");

    function addSub(str) {
        console.log("added!");
        const box = document.createElement('div');
        const timeStamp = document.createElement('span');
        const content = document.createElement('span');
        box.setAttribute('class', 'subBox');
        box.setAttribute('id', inputRef.current.num);
        timeStamp.innerHTML = '00:00';
        content.innerHTML = str;
        content.setAttribute('class', "subContents");
        content.setAttribute('id', inputRef.current.num++);
        box.appendChild(timeStamp);
        box.appendChild(content);
        console.log(flexRef.current);
        flexRef.current.appendChild(box);
        box.scrollIntoView({
            behavior: 'smooth', block: 'nearest'
        });
    }

    useEffect(() => {
        inputRef.current.num = 0;
        /* inputRef.current.total = "다음은 이해 여부 전달 및 확인 시나리오입니다. 먼저 학생들이 현재 자신의 이해 여부에 대해 익명으로 교수님께 전달할 수 있습니다. 그러면 교수님은 학생들의 이해 정도를 그래프와 색으로 파악할 수 있습니다. 그래프를 보시면 x축은 시간을 나타내고 y축은 이해도를 나타냅니다. 또한, 초록색 선이 이해가 잘돼요, 빨간색 선이 이해가 안돼요를 나타내고, 회색 선이 평균값을 나타냅니다. 교수는 이 그래프를 통해서 1초마다 학생들의 이해 정도를 파악할 수 있고 총 1분동안의 정보를 알 수 있습니다. 또한, 총 1분동안의 이해 정도가 높으면 이해도 창의 색깔을 초록색으로, 낮으면 빨간색으로 변경하여 교수가 학생들의 이해 정도를 한 눈에 파악할 수 있도록 하였습니다. ";
        inputRef.current.arr = ["다음은 이해 여부 전달 및 확인 시나리오입니다.", "먼저 학생들이 현재 자신의 이해 여부에 대해 익명으로 교수님께 전달할 수 있습니다.", "그러면 교수님은 학생들의 이해 정도를 그래프와 색으로 파악할 수 있습니다.", "그래프를 보시면 x축은 시간을 나타내고 y축은 이해도를 나타냅니다.", "또한, 초록색 선이 이해가 잘돼요, 빨간색 선이 이해가 안돼요를 나타내고, 회색 선이 평균값을 나타냅니다.", "교수는 이 그래프를 통해서 1초마다 학생들의 이해 정도를 파악할 수 있고 총 1분동안의 정보를 알 수 있습니다.", "또한, 총 1분동안의 이해 정도가 높으면 이해도 창의 색깔을 초록색으로, 낮으면 빨간색으로 변경하여 교수가 학생들의 이해 정도를 한 눈에 파악할 수 있도록 하였습니다."]; */
                inputRef.current.total = "";
                inputRef.current.arr = [];
        socket.on('sendSubtitle', function (data) {
            addSub(data.content);
            inputRef.current.total = inputRef.current.total.concat(" " + data.content);
            inputRef.current.arr.push(" " + data.content);
        })
    }, [])

    function findAnswer() {
        const payload = {
            context: inputRef.current.total,
            question: inputRef.current.value
        }
        axios.post(`http://3.37.36.54:5000/mrc_post`, payload).then(response => {
            console.log(response.data[0].answer);
            const arr = inputRef.current.arr;
            const answer = response.data[0].answer;
            const start = response.data[0].start;
            const end = response.data[0].end;
            arr.forEach((sentence, idx) => {
                if (sentence.includes(answer)) {
                    let start = sentence.indexOf(answer);
                    const target = document.querySelectorAll(`.subContents`);
                    const tmp = target[idx].innerHTML;
                    target[idx].innerHTML = '';
                    target[idx].append(sentence.substring(0, start));
                    const newSpan = document.createElement('span');
                    newSpan.style.backgroundColor = 'yellow';
                    newSpan.innerHTML = answer;
                    target[idx].append(newSpan);
                    if (start + answer.length + 1 <= sentence.length)
                        target[idx].append(sentence.substring(start + answer.length + 1, sentence.length));
                    target[idx].scrollIntoView({
                        behavior: 'smooth', block: 'nearest'
                    });
                    setTimeout(() => {
                        while (target[idx].hasChildNodes()) {
                            target[idx].removeChild(target[idx].firstChild);
                        }
                        target[idx].innerHTML = tmp;
                    }, 30000);
                }
            })
        })
        inputRef.current.value = '';
    }

    return (
        <SubCnt>
            <SubContentCnt id="chatContentContainer">
                <SubFlexBox ref={flexRef}>

                </SubFlexBox>
            </SubContentCnt>
            <SubInputCnt>
                <SubInput ref={inputRef} id="chatInput" type="TextArea" placeholder="질문을 입력해주세요!" />
                <SubSubmitBtn onClick={findAnswer}>내전송</SubSubmitBtn>
            </SubInputCnt>
        </SubCnt>
    )
}

export default Index
