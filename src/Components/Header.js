//css
import styles from "./Header.module.css";
//images
import logo from "../assets/Images/Logo.svg";
//imports
import { useState } from "react";
import { useContext } from "react";
import DisplayContext from "../Context/context/Display";
const Header = ({ onClick, version }) => {
  const darkmode = useContext(DisplayContext).darkmode;
  const toggleDarkmode = useContext(DisplayContext).displayToggle;
  const [isBtnHovered, setIsBtnHovered] = useState(false);
 

  return (
    <div className={`${styles.header} ${darkmode && styles.darkmode}`}>
      <div className={styles.comitPhoto}>
        <p className={`${styles.comit} ${darkmode && styles.darkmode}`}>COMIT</p>
        <p className={`${styles.photobooth} ${darkmode && styles.darkmode}`}>Photo Booth</p>
      </div>

      <img width="122" src={logo} className={styles.logo} onClick={toggleDarkmode} />
      {version!=='mobile' && <button className={styles.btn} onClick={onClick}
       onMouseEnter={()=>setIsBtnHovered(true)}
      onMouseLeave={()=>setIsBtnHovered(false)}>
      {!isBtnHovered ? "사진찍으러 ㄱㄱ" : "스마일~"}
      </button>}
    </div>
  );
};
export default Header;
