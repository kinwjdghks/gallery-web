//css
import styles from "./Button.module.css";
//imports

const Button = ({ children, width, height, onClick, classes }) => {
  return (
    <>
      <button
        className={`${styles.{classes}} ${styles.btn} `}
        style={{ width: width, height: height }}
        onClick={onClick}
      >
        {children}
      </button>
    </>
  );
};
export default Button;
