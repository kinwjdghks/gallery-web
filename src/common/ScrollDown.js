import styles from './ScrollDown.module.css';
import arrow from '../assets/Images/arrow.svg';
import arrow_white from '../assets/Images/arrow_white.svg';
import { useContext } from 'react';
import DisplayContext from '../Context/context/Display';
const ScrollDown = ({top_}) =>{
    const darkmode = useContext(DisplayContext).darkmode;

    return <div className={styles.container} style={{top:top_}}>
    <img src={darkmode ? arrow_white : arrow} height='45' alt='arrow' style={{transform:'rotate(90deg)'}}/>
    <div className={styles.scrolldown} style={{color:darkmode ? 'white' : 'black'}}>Scroll Down</div>
    </div>
}

export default ScrollDown;