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
        addSub('다음이 실시간 수업 화면입니다. ');
        addSub('왼쪽 화면에서 마이크와 캠을 킬 수 있고, 화면 공유를 통해 자신의 화면을 공유할 수 있습니다. 또한 공유화면과 내 화면을 번갈아가며 볼 수 있습니다.');
        addSub('오른쪽 화면에는 상호작용을 위한 기능들이 있습니다');
        addSub('상호작용 기능중 하나로 학생들은 교수님께 자신의 이해 여부를 전달할 수 있습니다. ');
        addSub('학생이 이해여부를 보내면 교수님은 학생들의 이해도를 그래프와 색으로 확인 가능합니다. ');
        addSub('초록색 선은 이해가 잘되요 , 빨간색선은 이해가 안되요를 나타내고 회색선은 평균값을 나타냅니다.');
        addSub('또한 이 그래프는 총 1분동안의 이해도를 보여주는데, 이동안 학생들의 이해정도가 높으면 이해도 창의 색을 초록색으로, 낮으면 빨간색으로 표시하여 한눈에 학생들의 이해정도를 파악할 수 있습니다.')
        inputRef.current.num = 0;
        inputRef.current.total = "다음이 실시간 수업 화면입니다. 왼쪽 화면에서 마이크와 캠을 킬 수 있고, 화면 공유를 통해 자신의 화면을 공유할 수 있습니다. 또한 공유화면과 내 화면을 번갈아가며 볼 수 있습니다. 오른쪽 화면에는 상호작용을 위한 기능들이 있습니다. 상호작용 기능중 하나로 학생들은 교수님께 자신의 이해 여부를 전달할 수 있습니다. 학생이 이해여부를 보내면 교수님은 학생들의 이해도를 그래프와 색으로 확인 가능합니다. 초록색 선은 이해가 잘되요 , 빨간색선은 이해가 안되요를 나타내고 회색선은 평균값을 나타냅니다. 또한 이 그래프는 총 1분동안의 이해도를 보여주는데, 이동안 학생들의 이해정도가 높으면 이해도 창의 색을 초록색으로, 낮으면 빨간색으로 표시하여 한눈에 학생들의 이해정도를 파악할 수 있습니다. ";
        inputRef.current.arr = ["다음이 실시간 수업 화면입니다.", "왼쪽 화면에서 마이크와 캠을 킬 수 있고, 화면 공유를 통해 자신의 화면을 공유할 수 있습니다. 또한 공유화면과 내 화면을 번갈아가며 볼 수 있습니다.", "오른쪽 화면에는 상호작용을 위한 기능들이 있습니다", "상호작용 기능중 하나로 학생들은 교수님께 자신의 이해 여부를 전달할 수 있습니다.", "학생이 이해여부를 보내면 교수님은 학생들의 이해도를 그래프와 색으로 확인 가능합니다.", "초록색 선은 이해가 잘되요 , 빨간색선은 이해가 안되요를 나타내고 회색선은 평균값을 나타냅니다.", "또한 이 그래프는 총 1분동안의 이해도를 보여주는데, 이동안 학생들의 이해정도가 높으면 이해도 창의 색을 초록색으로, 낮으면 빨간색으로 표시하여 한눈에 학생들의 이해정도를 파악할 수 있습니다."]
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
