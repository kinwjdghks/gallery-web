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
      content: "방명록인데 근데 말이 존나 길면 어떡하지 이만큼 쓸수있음.",
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
    {
      content: "정정환 짱짱맨",
    },
    {
      content: "거의다 만들었다!!!",
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


  useEffect(() => {
    for (let i = 0; i < notes.length; i++) {
      const randomInterval = 1000 + Math.random() * 4000;
      if(i===0 ) setDelay(0,0);
      else setDelay(i, randomInterval + i*3000);
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
