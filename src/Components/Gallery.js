import styles from './Gallery.module.css';
import PhotoModal from './PhotoModal';
import Album from './Album';
import { useState, useEffect } from 'react';
import { db } from '../Utility/firebase';
import { collection, getDocs } from 'firebase/firestore/lite';
import logo from '../Images/Logo.svg';

/* ������� �Կ��� �������� �ǽð����� ������ �����Ǵ� ����������.
�������� �԰��� 3���� (����:���ΰ� 1:1, 3:4, 4:3) �����Ƿ� �̸� ��� ȿ����/�������� ��ġ�� �� ���� �ʿ�
������ ���̿��� ƴƴ�� �� �׸��尡 �����ؾ� �ϰ�, �� ���� �� �׸��忡�� �ڹ� �ΰ� �� �ڹ� ������ �̹��� �Ǵ� ������ ������ ��
�ϳ��� �������� �ϳ��� Album ������Ʈ�� �����Ѵ�. ���� �̹������� ���� <Album> ���� map �ǵ���. */

const Gallery = () => {
  const [takePhoto, setTakePhoto] = useState(false);
  const toggleModal = () => setTakePhoto((prev) => !prev); //Modal ���� Ű��
  const [photos, setPhotos] = useState([
    {
      imageurl: "",
      vidConfig: 0,
    },
    {
      imageurl: "",
      vidConfig: 1,
    },
    {
      imageurl: "",
      vidConfig: 2,
    },
    {
      imageurl: "",
      vidConfig: 2,
    },
    {
      imageurl: "",
      vidConfig: 2,
    },

    ]); //db���� �޾ƿ� ������

    // const getPhotos =  async () =>{
    //     const dataSnapShot = await getDocs(collection(db,'Photos'));
    //     const dataList = dataSnapShot.docs.map(doc=> doc.data());
    //     setPhotos(dataList);
    // }
    // useEffect(()=>getPhotos(),[]);

    return(<> 
        {takePhoto && <PhotoModal photoList={photos} onClick={toggleModal}/>}
        <div className={styles.header}>
            <div className={styles.comitPhoto}>
                <p className={styles.comit}>COMIT</p>
                <p className={styles.photobooth}>Photo Booth</p>
            </div>
            <img width='60' src={logo} className={styles.logo}/>
            <button className={styles.btn} onClick={toggleModal}>TAKE A PICTURE</button>
        </div>

export default Gallery;
