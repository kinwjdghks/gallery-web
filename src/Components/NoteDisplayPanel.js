import styles from "./NoteDisplayPanel.module.css";
import { useState,useEffect,useRef } from "react";
import { db } from "../Utility/firebase";
import {
    collection,
    getDocs,
    query,
    limit,
    orderBy,
    startAfter,
  } from "firebase/firestore/lite";
import note_red from "../assets/Images/말풍선1.svg";
import note_green from "../assets/Images/말풍선2.svg";
import note_yellow from "../assets/Images/말풍선3.svg";

const backgrounds = [note_red,note_green,note_yellow];

export const Note = ({content}) =>{
    const randomCoor = (3+Math.random()*50) + 'vw';
    const randomBackground = backgrounds[Math.floor(Math.random()*3)];
    return <>
    
    <div 
    className={styles.note}
    style={{
        left: randomCoor
    }}>
        <div className={styles.text}>{content}</div> 
        <img className={styles.noteImg} src={randomBackground}/></div></>
}
const NoteDisplayPanel = () =>{
    

    let timeStamp = useRef(null);
    const [curNoteIdx,setCurNoteIdx] = useState(0); //마지막 읽은 노트 인덱스
    const [noteStack,setNoteStack] = useState([]);
    const [endOfData,setEndOfData] = useState(false);
    const [notes,setNotes] = useState([
        {
            id: 1,
            type: "note",
            timestamp: "1",
            content: "안녕하세요 이건 좀 긴 텍스트입니다.",
          },
        {
        id: 2,
        type: "note",
        timestamp: "2",
        content: "반가워요",
        },
        {
        id: 3,
        type: "note",
        timestamp: "3",
        content: "잘가세요",
        }
    ]);

    const getMoreNotes = async () => {
    
        let queryTemp;
        if (!timeStamp) {
          //first query
          queryTemp = query(
            collection(db, "Notes"),
            orderBy("timestamp", "desc"),
            limit(10)
          );
        } else {
          //first query
          queryTemp = query(
            collection(db, "Notes"),
            orderBy("timestamp", "desc"),
            startAfter(timeStamp),
            limit(10)
          );
        }
    
        // setIsLoading(true);
        let dataSnapShot;
        try {
          dataSnapShot = await getDocs(queryTemp);
        } catch (error) {
          console.log(error);
        }
    
        const dataList = dataSnapShot.docs.map((doc) => doc.data());
    
        const length = dataList.length;
        if (length) {
          timeStamp = dataSnapShot.docs[length - 1];
          setNotes((prev) => [...prev, ...dataList]);
        } else {
          setEndOfData(true);
        }
        // setIsLoading(false);
      };
    
    // const pushNote = () =>{
        

    //     const data = notes[curNoteIdx];
    //     setCurNote();

    // }
    // useEffect(()=>{
    //     showNote();
    // },[]);

    return <div className={styles.screen}>
        {<Note content="아아 마이크테스트"/>}
    </div>
}

export default NoteDisplayPanel;