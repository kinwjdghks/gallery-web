import styles from './BlankAlbum.module.css';
const BlankAlbum = ({version}) =>{
    const content =
    version === 1? 'COMIT Forever' :
    version === 2? 'Let me code it':
    '개발동아리 코밋';

    const lang =
    version === 3 ? 'kor' : 'eng';

    return(<div className={styles.container}>
        <div className={`${styles.design} ${lang==='kor' && styles.kor}`}>
            {content}
        </div>
        </div>);
}
export default BlankAlbum;