import styles from "./NoteDisplayPanel.module.css";
import { useState, useEffect } from "react";
import { db } from "../Utility/firebase";
import {
  collection,
  getDocs,
  query,
  limit,
  orderBy,
} from "firebase/firestore/lite";
import note_red from "../assets/Images/말풍선1.svg";
import note_green from "../assets/Images/말풍선2.svg";
import note_yellow from "../assets/Images/말풍선3.svg";

const backgrounds = [note_red, note_green, note_yellow];

export const Note = ({ content }) => {
  //랜덤 좌표
  const randomCoor = 3 + Math.random() * 50 + "vw";
  const randomBackground = backgrounds[Math.floor(Math.random() * 3)];
  return (
    <>
      <div
        className={styles.note}
        style={{
          left: randomCoor,
        }}
      >
        <div className={styles.text}>{content}</div>
        <img className={styles.noteImg} src={randomBackground} />
      </div>
    </>
  );
};
const NoteDisplayPanel = () => {
  // let timeStamp = useRef(null);
  // const [curNoteIdx,setCurNoteIdx] = useState(0); //마지막 읽은 노트 인덱스
  const [noteStack, setNoteStack] = useState([]);
  const [notes, setNotes] = useState([
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
    },
    {
      content: "정정환 천재",
    },
    {
      content: "김지호 바보",
    },
    {
      content: "홍민재 잼민이",
    },
  ]);

  const getNotes = async () => {
    let queryTemp;

    queryTemp = query(
      collection(db, "Notes"),
      orderBy("timestamp", "desc"),
      limit(10)
    );

    // setIsLoading(true);
    let dataSnapShot;
    try {
      dataSnapShot = await getDocs(queryTemp);
    } catch (error) {
      console.log("Error occured");
      console.log(error);
    }

    const dataList = dataSnapShot.docs.map((doc) => doc.data());
    setNotes(dataList);

    // setIsLoading(false);
  };

  // const pushNote = (idx, content) => {
  //   const newNote = <Note key={idx} content={content} />;
  //   const newNoteStack = [...noteStack, newNote];
  //   setNoteStack(newNoteStack);
  //   return;
  // };

  // await getNotes();
  // useEffect(async () => {
  //   let idx = 0;
  //   while (idx < notes.length) {
  //     console.log("idx: " + idx);
  //     const randomInterval = 2000 + Math.random() * 3000; //2초 ~ 5초
  //     const data = notes[idx].content;
  //     if (idx === 0) {
  //       pushNote(data);
  //       idx++;
  //       continue;
  //     }
  //     const timer = setTimeout(() => {
  //       pushNote(data);
  //       idx++;
  //     }, randomInterval);
  //   }
  // }, []);

  // useEffect(async() => {
  //   let idx = 0;
  //   while (idx < notes.length) {
  //     console.log("idx: " + idx);
  //     const data = notes[idx].content;
  //     if (idx === 0) {
  //       pushNote(idx, data);
  //       idx++;
  //       continue;
  //     }
  //     const randomInterval = 2000 + Math.random() * 3000; //2초 ~ 5초
  //     const delay = setInterval(() => {
  //       pushNote(idx, data);
  //       idx++;
  //     }, randomInterval);
  //     return () => clearInterval(delay);
  //   }
  // }, []);

  // const [randomInterval, setRandomInterval] = useState(0.1);
  // useEffect(() => {
  //   let idx = 0;
  //   const interval = setInterval(() => {
  //     if (idx < notes.length) {
  //       console.log(idx);
  //       const data = notes[idx].content;
  //       setNoteStack((prevStack) => [
  //         ...prevStack,
  //         <Note key={idx} content={data} />,
  //       ]);
  //       idx++;
  //     } else {
  //       clearInterval(interval);
  //     }
  //   }, [randomInterval]);

  //   return () => clearInterval(interval);
  // }, []);

  // useEffect(() => {
  //   let idx = 0;
  //   let randomInterval = 0.1;
  //   while (idx < notes.length) {
  //     console.log(idx);
  //     const data = notes[idx].content;
  //     setNoteStack((prevStack) => [
  //       ...prevStack,
  //       <Note key={idx} content={data} />,
  //     ]);

  //     const interval = setTimeout(() => {
  //       if (idx !== 0) randomInterval = 2000 + Math.random() * 3000;
  //       clearTimeout(interval);
  //     }, [5000]);
  //     idx++;
  //   }
  // }, []);
  useEffect(() => {
    for (let i = 0; i < notes.length; i++) {
      const randomInterval = 2000 + Math.random() * 3000;
      console.log(randomInterval / 1000);
      setDelay(i, randomInterval);
    }
  }, []);
  const setDelay = (idx, randomInterval) => {
    const interval = setTimeout(() => {
      const data = notes[idx].content;
      setNoteStack((prevStack) => [
        ...prevStack,
        <Note key={idx} content={data} />,
      ]);
      clearTimeout(interval);
    }, [randomInterval]);
  };
  return <div className={styles.screen}>{noteStack}</div>;
};

export default NoteDisplayPanel;
