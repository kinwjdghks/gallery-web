//방명록 쓰는 Modal
import ReactDOM from "react-dom";
import styles from './NoteModal.module.css';
import Button from "../common/Button";
import { useRef, useState, useEffect } from "react";
import { db } from "../Utility/firebase";
import { collection, doc, setDoc } from "firebase/firestore/lite";
import { serverTimestamp } from "firebase/firestore/lite";
import logo from "../assets/Images/Logo.svg";


const BackDrop = () => {
    return <div className={styles.backdrop}></div>;
  };

const Modal =({onCloseModal}) => {
    const containerRef = useRef(null);
    useEffect(()=>{
        if(containerRef){
            containerRef.current.style.top = '15vh';
        }
    },[]);
    const closeModalHandler = () =>{
        containerRef.current.style.top = '100vh';
        setTimeout(()=>{
            onCloseModal();
        },500);
    }
    const contentRef = useRef(null);
    const [message,setMessage] = useState("");

    const submitNote = async () =>{
        if(!contentRef) return;

        const content = contentRef.current.value.toString().trim();
        if(content.length < 10) {
            setMessage(<div className={styles.message}>10글자는 써죠잉 ㅜㅜ</div>);
            return;
        };
        let id = new Date().getTime() % 100000000;
        const timestamp = serverTimestamp();

        const newNote = {
            id: +id,
            type: 'note',
            timestamp: timestamp,
            content: content
        };
        try {
        const notes = collection(db, "Notes");
        await setDoc(doc(notes, `${id}`), newNote);
        } catch (error) {
        console.log(error);
        return;
        }
    };
    
    return <div className={styles.container} ref={containerRef}>
        <div className={styles.title}>기깔나는 방명록을 작성해보아요</div>
        <textarea autoFocus onFocus={()=>setMessage(null)} className={`${styles.noteinput} ${message && styles.error}`} ref={contentRef}/>
        {message}
        <div className={styles.actions}>
            <Button width='32vw' height='12vw' onClick={closeModalHandler}>취소하기</Button>
            <Button width='32vw' height='12vw' onClick={submitNote}>작성하기</Button>
        </div>
        <img style={{position:'absolute', bottom:'15vw'}} src={logo} width='35vw' alt='comit'/>
    </div>
}

const NoteModal = ({onCloseModal}) =>{

    return (
        <>
          {ReactDOM.createPortal(
            <BackDrop />,
            document.getElementById("backdrop-root")
          )}
          {ReactDOM.createPortal(
            <Modal
              onCloseModal={onCloseModal}
            />,
            document.getElementById("modal-root")
          )}
        </>
      );
}

export default NoteModal;