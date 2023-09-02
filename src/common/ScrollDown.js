import styles from './ScrollDown.module.css';
import arrow from '../assets/Images/arrow.svg';
const ScrollDown = ({top_}) =>{
    return <div className={styles.container} style={{top:top_}}>
    <img src={arrow} height='45' alt='arrow' style={{transform:'rotate(90deg)'}}/>
    <div className={styles.scrolldown}>Scroll Down</div>
    </div>
}

export default ScrollDown;