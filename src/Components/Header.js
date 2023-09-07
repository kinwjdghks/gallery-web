//css
import styles from "./Header.module.css";
//images
import logo from "../assets/Images/Logo.svg";
//imports
import { useState } from "react";
import { useContext } from "react";
import DisplayContext from "../Context/context/Display";
import Button from "../common/Button";
const Header = ({ onModalHandler, version }) => {
  const darkmode = useContext(DisplayContext).darkmode;
  const toggleDarkmode = useContext(DisplayContext).displayToggle;
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const hoverHandler = (bool) => {
    setIsBtnHovered(bool);
    console.log("Encountered");
  };
  return (
    <div className={`${styles.header} ${darkmode && styles.darkmode}`}>
      <div className={styles.comitPhoto}>
        <p className={`${styles.comit} ${darkmode && styles.darkmode}`}>
          COMIT
        </p>
        <p className={`${styles.photobooth} ${darkmode && styles.darkmode}`}>
          Photo Booth
        </p>
      </div>

      <img src={logo} className={styles.logo} onClick={toggleDarkmode} />
      {version !== "mobile" && (
        <Button
          children={!isBtnHovered ? "사진찍으러 ㄱㄱ" : "스마일~"}
          width="380px"
          height="80px"
          classes=""
          onClick={() => onModalHandler("photo")}
          onMouseHover={hoverHandler}
        />
      )}
    </div>
  );
};
export default Header;
