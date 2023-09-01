import styles from "./Header.module.css";
import logo from "../assets/Images/Logo.svg";
import { useState, useEffect, useCallback } from "react";
const Header = ({ onClick }) => {
  const [fixHeader, setFixHeader] = useState(true);
  const [position, setPosition] = useState(window.pageYOffset);
  const [throttle,setThrottle] = useState(false);
//   const handleScroll = useCallback(
//     (e) =>{
//     console.log(e);
    // const diff = e.target.documentElement.scrollTop - position;
    // if(diff>0){ //내려가는 중
    //     console.log("내려가는 중");
    // }
    // else{ //올라가는 중
    //     console.log("올라가는 중");
    // }
    // setPosition(e.target.documentElement.scrollTop);
//   },[position]);

  const scrollDetectHandler = (e)=>{
//    console.log(e.target.documentElement.scrollTop);
    };

  useEffect(()=>{
      window.addEventListener('scroll',scrollDetectHandler,{capture:true});
      return ()=>window.removeEventListener('scroll',scrollDetectHandler);
  },[]);

  return (
    <div className={`${styles.header} ${fixHeader && styles.fixed}`}>
      <div className={styles.comitPhoto}>
        <p className={styles.comit}>COMIT</p>
        <p className={styles.photobooth}>Photo Booth</p>
      </div>
      <img width="60" src={logo} className={styles.logo} />
      <button className={styles.btn} onClick={onClick}>
        TAKE A PICTURE
      </button>
    </div>
  );
};

export default Header;
