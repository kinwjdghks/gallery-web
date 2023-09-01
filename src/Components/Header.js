import styles from './Header.module.css';
import logo from '../Images/Logo.svg';
import { useState,useEffect } from 'react';
const Header = ({onClick}) =>{
    const [fixHeader,setFixHeader] = useState(true);
    const [position, setPosition] = useState(window.pageYOffset);




    return (
        <div className={`${styles.header} ${fixHeader && styles.fixed}`}>
            <div className={styles.comitPhoto}>
                <p className={styles.comit}>COMIT</p>
                <p className={styles.photobooth}>Photo Booth</p>
            </div>
            <img width='60' src={logo} className={styles.logo}/>
            <button className={styles.btn} onClick={onClick}>TAKE A PICTURE</button>
        </div>);
}

export default Header;