//css
import styles from "../Button.module.css";
//imports

const Button = ({ text, width, height, onClick }) => {
  return (
    <>
      <button
        className={styles.btn}
        style={{ width: width, height: height }}
        onClick={onClick}
      >
        {text}
      </button>
    </>
  );
};
export default Button;
