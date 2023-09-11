//css
import styles from "./Header.module.css";
//images
import { ReactComponent as Logo } from "../assets/Images/Logo.svg";
import { ReactComponent as DarkIcon } from "../assets/Images/dark_mode.svg";
import { ReactComponent as LightIcon } from "../assets/Images/light_mode.svg";
//imports
import { useState } from "react";
import { useContext } from "react";
import DisplayContext from "../Context/context/Display";
import Button from "../common/Button";
const Header = ({ onModalHandler, version }) => {
  const mobile = version === "mobile";
  const darkmode = useContext(DisplayContext).darkmode;
  const toggleDarkmode = useContext(DisplayContext).displayToggle;
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const hoverHandler = (bool) => {
    setIsBtnHovered(bool);
    console.log("Encountered");
  };
  return (
    <div className={styles.header}
    style={{backgroundColor: darkmode?"#484848":'#e0e0e0'}}>
      <div className={styles.comitPhoto}>
        <div style={{display:'flex', alignItems:'center'}}>
        <p className={styles.comit}
        style={{
          color: darkmode?"#C9B3EF":'#603ebb',
          transition:'all 0.6s',
          textShadow: darkmode?"3px 5px 1px black":"none"}}>
          COMIT
        </p>
        <Logo className={styles.logo} />
        </div>
        <p className={styles.photobooth} style={{color: darkmode? "white" : "black"}}>
          Photo Booth
        </p>
      </div>
      

      {!mobile && (
        <Button
          children={!isBtnHovered ? "사진찍으러 ㄱㄱ" : "스마일~"}
          width="380px"
          height="80px"
          classes="popup header"
          onClick={() => onModalHandler("photo")}
          // onMouseHover={hoverHandler}
        />
      )}
      <DarkIcon
        className={`${styles.togglebtn} ${
          darkmode ? styles.appear : styles.disappear
        }`}
        onClick={toggleDarkmode}
      />
      <LightIcon
        className={`${styles.togglebtn} ${
          darkmode ? styles.disappear : styles.appear
        }`}
        onClick={toggleDarkmode}
      />
    </div>
  );
};
export default Header;
