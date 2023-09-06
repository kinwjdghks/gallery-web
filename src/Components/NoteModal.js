//방명록 쓰는 Modal
import ReactDOM from "react-dom";
import styles from './NoteModal.module.css';

const BackDrop = () => {
    return <div className={styles.backdrop}></div>;
  };

const Modal =() => {
    return <div className={styles.container}>

    </div>
}

const NoteModal = () =>{

    return (
        <>
          {ReactDOM.createPortal(
            <BackDrop />,
            document.getElementById("backdrop-root")
          )}
          {ReactDOM.createPortal(
            <Modal
              
            />,
            document.getElementById("modal-root")
          )}
        </>
      );
}

export default NoteModal;