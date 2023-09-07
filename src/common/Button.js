//css
import styles from "./Button.module.css";
//imports

const Button = ({
  children,
  width,
  height,
  onClick,
  classes,
  onMouseHover,
}) => {
  const getStyleByClassName = (className) => {
    return styles[className];
  };
  let styleNames = classes.split(" ");
  let combinedStyles = "";
  styleNames.forEach((className) => {
    const style = getStyleByClassName(className) + " ";
    combinedStyles += style;
  });
  const fontSize = (parseInt(width) + parseInt(height)) / 12;
  return (
    <>
      <button
        className={`${styles.btn} ${combinedStyles}`}
        style={{ width: width, height: height, fontSize: fontSize }}
        onClick={onClick}
        // onMouseEnter={() => onMouseHover(true)}
        // onMouseLeave={() => onMouseHover(false)}
      >
        {children}
      </button>
    </>
  );
};
export default Button;
