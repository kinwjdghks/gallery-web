//방명록 쓰는 Modal
import ReactDOM from "react-dom";
import styles from "./NoteModal.module.css";
import Button from "../common/Button";
import { useRef, useState, useEffect } from "react";
import { db } from "../Utility/firebase";
import { collection, doc, setDoc } from "firebase/firestore/lite";
import { serverTimestamp } from "firebase/firestore/lite";
import smile명륜 from "../assets/Images/smile명륜.svg";
import loading from "../assets/Images/loading.svg";

const BackDrop = () => {
  return <div className={styles.backdrop}></div>;
};

const Modal = ({ onCloseModal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => {
    if (containerRef) {
      setTimeout(() => {
        containerRef.current.style.bottom = "0";
      }, 100);
    }
  }, []);
  const closeModalHandler = () => {
    containerRef.current.style.bottom = "-100%";
    setTimeout(() => {
      onCloseModal();
    }, 500);
  };

  const contentRef = useRef(null);
  const [message, setMessage] = useState("");

  const saveToFireStore = async (content) => {
    setIsLoading(true);
    
    let id = new Date().getTime() % 100000000;
    const timestamp = serverTimestamp();

    const newNote = {
      id: +id,
      type: "note",
      timestamp: timestamp,
      content: content,
    };
    try {
      const notes = collection(db, "Notes");
      await setDoc(doc(notes, `${id}`), newNote);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      return;
    }
    
  };
  const saveNote = async () => {
    if (!contentRef) return;

    const content = contentRef.current.value.toString().trim();
    if (content.length <1) {
      setMessage(<div className={styles.message}>뭐라도 써죠잉 ㅜㅜ</div>);
      return;
    }
    await saveToFireStore(content);
    closeModalHandler();
    window.location.reload();
  };
  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.grid}>
      <div className={styles.title}>기깔나는 방명록을 남겨보아요!</div>
      <img src={smile명륜} style={{
        width: "40%",
        gridArea: "title",
        alignSelf:"flex-end",
        justifySelf: "flex-end"
         }}/>
      <textarea
        // autoFocus
        onFocus={() => setMessage(null)}
        className={`${styles.noteinput} ${message && styles.error}`}
        ref={contentRef}
        placeholder="타인에게 불편을 주는 말은 삼가주세요."
      />

      {message}

      {/* <div className={styles.actions}> */}
      <Button
        width="80%"
        height="60px"
        onClick={closeModalHandler}
        classes="mobile cancel note"
      >
        취소하기
      </Button>
      <Button
        width="80%"
        height="60px"
        onClick={saveNote}
        classes="mobile save note"
      >
        {isLoading ? (
              <img width="50" src={loading} className={styles.loading} />
            ) : 
              "저장하기"}
          </Button>
      </div>
      {/* </div> */}
      {/* <img
        style={{ position: "absolute", bottom: "15vw" }}
        src={logo}
        width="35vw"
        alt="comit"
      /> */}
    </div>
  );
};

const NoteModal = ({ onCloseModal }) => {
  return (
    <>
      {ReactDOM.createPortal(
        <BackDrop/>,
        document.getElementById("backdrop-root")
      )}
      {ReactDOM.createPortal(
        <Modal onCloseModal={onCloseModal} />,
        document.getElementById("modal-root")
      )}
    </>
  );
};

export default NoteModal;
