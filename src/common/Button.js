//css
import styles from "./Button.module.css";
//imports

const Button = ({ children, width, height, onClick, classes }) => {
  const getStyleByClassName = (className) => {
    return styles[className+''];
  };
  let styleNames = classes.split(" ");
  let combinedStyles = "";
  styleNames.forEach((className) => {
    const style = getStyleByClassName(className) + " ";
    combinedStyles += style;
  });

  return (
    <>
      <button
        className={`${styles.btn} ${combinedStyles}`}
        style={{ width: width, height: height }}
        onClick={onClick}
      >
        {children}
      </button>
    </>
  );
};
export default Button;
