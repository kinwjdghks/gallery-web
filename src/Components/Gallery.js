import styles from './Gallery.module.css';
import PhotoModal from './PhotoModal';
import Album from './Album';
import { useState, useEffect } from 'react';
import { db } from '../Utility/firebase';
import { collection, getDocs } from 'firebase/firestore/lite';


/* 사람들이 촬영한 사진들이 실시간으로 무제한 나열되는 메인페이지.
사진들의 규격이 3가지 (가로:세로가 1:1, 3:4, 4:3) 있으므로 이를 어떻게 효율적/미적으로 배치할 지 논의 필요
사진들 사이에는 틈틈이 빈 그리드가 존재해야 하고, 몇 개의 빈 그리드에는 코밋 로고 등 코밋 관련한 이미지 또는 문구가 들어갔으면 함
하나의 사진에는 하나의 Album 컴포넌트가 대응한다. 따라서 이미지들이 전부 <Album> 으로 map 되도록. */



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
