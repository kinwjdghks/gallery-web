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
import note_red2 from "../assets/Images/말풍선4.svg";
import note_green2 from "../assets/Images/말풍선5.svg";
import note_yellow2 from "../assets/Images/말풍선6.svg";

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
  const [noteStack, setNoteStack] = useState([]);
  const [notes, setNotes] = useState([]);

  const getNotes = async () => {
    let queryTemp;

    queryTemp = query(
      collection(db, "Notes"),
      orderBy("timestamp", "desc"),
      limit(10)
    );

    let dataSnapShot;
    try {
      dataSnapShot = await getDocs(queryTemp);
    } catch (error) {
      console.log(error);
    }

    const dataList = dataSnapShot.docs.map((doc) => doc.data());
    setNotes(dataList);
  };

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
  const showNotes = () => {
    for (let i = 0; i < notes.length; i++) {
      const randomInterval = 1000 + Math.random() * 2000;
      if (i === 0) setDelay(0, 0);
      else setDelay(i, randomInterval + (i - 1) * 2500);
    }
  };

  useEffect(() => {
    getNotes();
  }, []);
  useEffect(() => {
    showNotes();
  }, [notes]);

  return <div className={styles.screen}>{noteStack}</div>;
};

export default NoteDisplayPanel;
