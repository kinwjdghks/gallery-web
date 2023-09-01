import styles from './Gallery.module.css';
import PhotoModal from './PhotoModal';
import Album from './Album';
import { useState, useEffect } from 'react';
import { db } from '../Utility/firebase';
import { collection, getDocs } from 'firebase/firestore/lite';


/* ������� �Կ��� �������� �ǽð����� ������ �����Ǵ� ����������.
�������� �԰��� 3���� (����:���ΰ� 1:1, 3:4, 4:3) �����Ƿ� �̸� ��� ȿ����/�������� ��ġ�� �� ���� �ʿ�
������ ���̿��� ƴƴ�� �� �׸��尡 �����ؾ� �ϰ�, �� ���� �� �׸��忡�� �ڹ� �ΰ� �� �ڹ� ������ �̹��� �Ǵ� ������ ������ ��
�ϳ��� �������� �ϳ��� Album ������Ʈ�� �����Ѵ�. ���� �̹������� ���� <Album> ���� map �ǵ���. */



const Gallery = ({takePhoto,onClick}) =>{
    
    const [photos,setPhotos] = useState([{
        imageurl:"",
        vidConfig:0
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
  ]); //db???? ???? ??????

  // const getPhotos =  async () =>{
  //     const dataSnapShot = await getDocs(collection(db,'Photos'));
  //     const dataList = dataSnapShot.docs.map(doc=> doc.data());
  //     setPhotos(dataList);
  // }
  // useEffect(()=>getPhotos(),[]);

    // const getPhotos =  async () =>{
    //     const dataSnapShot = await getDocs(collection(db,'Photos'));
    //     const dataList = dataSnapShot.docs.map(doc=> doc.data());
    //     setPhotos(dataList);
    // }
    // useEffect(()=>getPhotos(),[]);

    return(<> 
        {takePhoto && <PhotoModal photoList={photos} onClick={onClick}/>}
        <div className={styles.background}>
            <div className={styles.albumContainer}>
            {photos.map((data,index)=><Album key={index} data={data}/>)}
            </div>
        </div></>);
}

export default Gallery;
