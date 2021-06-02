import React from 'react'
import styled from 'styled-components'
import Up from '../../../../../../images/utils/up.png'
import Down from '../../../../../../images/utils/down.png'

const CompupContainer = styled.div`
width : 100%;
display : flex;
justify-content : center;
align-items : center;
`

const Compbtn1 = styled.button`
height : 6.5vh;
width : 70%;
background-size: contain;                      
background-repeat: no-repeat;
background-position: center center;
/* background-color : ${props => props.theme.color.blue}; */
`

const Compbtn2 = styled.button`
height : 6.5vh;
width : 70%;
background-size: contain;                      
background-repeat: no-repeat;
background-position: center center;
/* background-color : ${props => props.theme.color.blue}; */
`

interface CompProps {
    socket: any
}

function Index(props: CompProps) {
    const socket = props.socket;

    function upBtnHandler() {
        console.log("hi");
        socket.emit("understandingStu", {
            type: 'up',
            time: '00:00'
        })
    }

    function downBtnHandler() {
        socket.emit("understandingStu", {
            type: 'down',
            time: '00:00'
        })
    }

    return (
        <CompupContainer style={{ height: '35vh' }}>
            <div style={{ height: '15vh', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                <Compbtn1 style={{ backgroundImage: `url(${Up})` }} onClick={upBtnHandler}></Compbtn1>
                <Compbtn2 style={{ backgroundImage: `url(${Down})` }} onClick={downBtnHandler}></Compbtn2>
            </div>
        </CompupContainer>
    )
}

export default Index
