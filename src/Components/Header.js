//css
import styles from "./Header.module.css";
//images
import logo from "../assets/Images/Logo.svg";
//imports
import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
const Header = ({ onClick }) => {
  const [position, setPosition] = useState(window.pageYOffset);
  const [tempTop, setTempTop] = useState(0);
  const headerRef = useRef(null);
  const throttleRef = useRef(null);

  //   const scrollDetectHandler = useCallback((e) => {
  //         const scrollTop = e.target.documentElement.scrollTop;
  //         // console.log("scrollTop: "+scrollTop);
  //         if (throttleRef.current) {
  //         clearTimeout(throttleRef.current);
  //         }

  //         throttleRef.current = setTimeout(() => {
  //             const diff = scrollTop - position;
  //             // console.log('diff: '+diff);
  //             console.log('position: '+position);
  //             if(diff>0){ //내려가는 중
  //                 const newTop = Math.max(-165,-scrollTop);
  //                 headerRef.current.style.top= newTop+'px';
  //                 setTempTop(scrollTop);
  //             }
  //             else{ //올라가는 중
  //                 const newTop = Math.min(0,tempTop-scrollTop);
  //                 // console.log(newTop);
  //                 headerRef.current.style.top= newTop+'px';
  //             }
  //             setPosition(scrollTop);
  //             console.log('tempTop: '+tempTop);

  //             throttleRef.current = null; // Reset the reference after the timer expires
  //             }, 10);

  //     }, [position,tempTop]);

  //   useEffect(()=>{
  //       window.addEventListener('scroll',scrollDetectHandler,{capture:true});
  //       return ()=>window.removeEventListener('scroll',scrollDetectHandler);
  //   },[]);

  return (
    <div className={styles.header}>
      <div className={styles.comitPhoto}>
        <p className={styles.comit}>COMIT</p>
        <p className={styles.photobooth}>Photo Booth</p>
      </div>

      <img width="122" src={logo} className={styles.logo} />
      <motion.button
        className={styles.btn}
        onClick={onClick}
        animate={{
          y: [-10, 10, -10],
        }}
        transition={{
          duration: 4,
          ease: "easeOut",
          repeat: Infinity,
        }}
      >
        TAKE A PICTURE
      </motion.button>
    </div>
  );
};
export default Header;
