//css
import { useEffect, useRef } from "react";
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
    return styles[className + ""];
  };
  let styleNames = classes.split(" ");
  let combinedStyles = "";
  styleNames.forEach((className) => {
    const style = getStyleByClassName(className) + " ";
    combinedStyles += style;
  });
  const buttonRef = useRef(null);
  useEffect(() => {
    if (buttonRef) {
      buttonRef.current.style.fontSize = buttonRef.current.style.height * 0.35;
    }
  }, []);

  //   if (height.indexOf("px") !== -1) {
  //     fontSize = parseInt(height) * 0.35;
  //   } else if (height.indexOf("vw") !== -1) {
  //     fontSize = ((window.innerWidth * parseInt(height)) / 100) * 0.35;
  //   } else if (height.indexOf("vh") !== -1) {
  //     fontSize = ((window.innerHeight * parseInt(height)) / 100) * 0.35;
  //   }

  return (
    <>
      <button
        className={`${styles.btn} ${combinedStyles}`}
        style={{
          width: width,
          height: height,
          //   width: currentWidth,
          //   height: currentHeight,
          //   fontSize: fontSize,
        }}
        onClick={onClick}
        ref={buttonRef}
        // onMouseEnter={() => onMouseHover(true)}
        // onMouseLeave={() => onMouseHover(false)}
      >
        {children}
      </button>
    </>
  );
};
export default Button;
