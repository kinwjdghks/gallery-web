//모바일 버전일 때 아래 나오는 버튼 바 (사진찍기, 방명록 버튼)
import styles from "./ActionBar.module.css";
import Button from "../common/Button";
const ActionBar = ({ onTakePhoto, onWriteNote }) => {
  return (
    <div className={styles.actionbar}>
      <Button width="45vw" onClick={onTakePhoto} classes="mobile">
        사진찍기 ㄱㄱ
      </Button>
      <Button width="45vw" onClick={onWriteNote} classes="mobile">
        방명록쓰기 ㄱㄱ
      </Button>
    </div>
  );
};

export default ActionBar;
