import styles from './TopHeader.module.css';
import comit from '../Images/ComitLogo.jpeg';

const TopHeader = () =>{

    return <div className={styles.header}>
        <img src={comit} width="72" height="72" style={{objectFit:'contain',margin:'0.5rem'}}/>
        <div className={styles.comit}>COMIT</div>
    </div>
}

export default TopHeader;