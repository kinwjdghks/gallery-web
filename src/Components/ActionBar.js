//모바일 버전일 때 아래 나오는 버튼 바 (사진찍기, 방명록 버튼)
import styles from './ActionBar.module.css';

const ActionBar = ({onTakePhoto, onWriteNote}) =>{


    return <div className={styles.actionbar}>
        <button className={`${styles.btn} ${styles.takephoto}`}
        onClick={onTakePhoto}>사진찍기 ㄱㄱ</button>
        <button className={`${styles.btn} ${styles.writenote}`}
        onClick={onWriteNote}>방명록쓰기 ㄱㄱ</button>
    </div>
}

export default ActionBar;