import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

const ListBoxCSS = css`
#part_listbox::-webkit-scrollbar {
    display: none;
}
`

const ListBox = styled.ul`
width : 100%;
overflow-y : scroll;
padding :0;
background-color : #F9F9F9;
::-webkit-scrollbar {
    display: none;
}
max-height : 32vh;
margin-bottom : 0;
`

const Row = styled.li`
display :grid;
grid-template-columns: repeat(4, 1fr);
color : #818181;
text-align : center;
font-size :1rem;
margin-bottom : 1vh;
height : 3vh;
`

interface parProps{
    socket : any
}

function Index(props : parProps) {

    const [pars, setpars] = useState<Array<any>>([]);
    let ccc = false;
    //render participants
    function renderPtcs(): any {
        const names = ['김민건', '최민우', '노민도', '윤다연', '김수민'];
        const interests = ['10', '60', '30', '90', '75'];
        const scores = ['-', '-', '-', '-', '-'];
        const result = names.map((value, index) =>
        (
            <Row style={{ color: 'black' }}>
                <div>{value}</div>
                <div>{interests[index]}</div>
                <div>{scores[index]}</div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><input type="checkbox" checked disabled={ccc} /></div>
            </Row>
        ))
        return result;
    }

    useEffect(() => {
        props.socket.on('newUser', (data:any)=>{
            console.log('newUser', data);
            addPar(data.message.name, "-", "-", data.message.email);
        })
        props.socket.on('disConnected', (data:any)=>{
            console.log("disconneected", data);
/*             const toDelete = document.querySelector(`#${data.message.email}`) as HTMLElement;
            toDelete.remove(); */
        })
    }, [pars])


    function addPar(name: any, interest: any, score: any, email:any) {
        setpars(pars.concat([<Row className = "participantsclass" id = {email} style={{ color: 'black' }}>
            <div>{name}</div>
            <div>{interest}</div>
            <div>{score}</div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><input type="checkbox" checked disabled={ccc} /></div>
        </Row>]))
    }

    return (
        <>
            <Row style={{ color: 'black' }}>
                <div>name</div>
                <div>interest</div>
                <div>score</div>
                <div>attendance</div>
            </Row>
            <ListBox id="part_listbox">
                {renderPtcs()}
                {pars}
            </ListBox>
        </>
    )
}

export default Index
