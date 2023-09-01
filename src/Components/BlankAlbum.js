import styles from './BlankAlbum.module.css';
const BlankAlbum = () =>{
    const version = Math.floor(Math.random()*4);
    const pos = Math.floor(Math.random()*4);
    const posclassName =
    pos === 0 ? styles.ur :
    pos === 1 ? styles.ul :
    pos === 2 ? styles.dr :
    styles.dl;
    
    const content =
    version === 0? 'COMIT Forever' :
    version === 1? 'Let me code it':
    version === 2? "개발동아리 코밋":
    "모각코 할사람";

    const lang =
    version === 2 || version === 3 ? 'kor' : 'eng';

    return(<div className={`${styles.container} ${posclassName}`}>
        <div className={`${styles.design} ${lang==='kor' && styles.kor}`}>
            {content}
        </div>
        </div>);
}
export default BlankAlbum;