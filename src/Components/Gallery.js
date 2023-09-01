import styles from './Gallery.module.css';
import PhotoModal from './PhotoModal';
import BlankAlbum from './BlankAlbum';
import Album from './Album';
import { useState, useEffect } from 'react';
import { db } from '../Utility/firebase';
import { collection, getDocs } from 'firebase/firestore/lite';

const Gallery = ({takePhoto,onClick}) =>{
    
    const [photos,setPhotos] = useState([{
        imageurl:"a",
        vidConfig:0
    },
    {
      imageurl: "a",
      vidConfig: 1,
    },
    {
        imageurl: "",
        vidConfig: 0,
      },
      {
        imageurl: "a",
        vidConfig: 0,
      },
      {
        imageurl: "",
        vidConfig: 1,
      },
      {
        imageurl: "a",
        vidConfig: 2,
      },
      {
        imageurl: "a",
        vidConfig: 2,
      },
    {
      imageurl: "a",
      vidConfig: 2,
    },
    {
      imageurl: "",
      vidConfig: 2,
    },
    {
      imageurl: "a",
      vidConfig: 2,
    },
    {
        imageurl: "",
        vidConfig: 0,
      },
      {
        imageurl: "a",
        vidConfig: 1,
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
            {photos.map((data,index)=>
            {if(!data.imageurl){
                return <BlankAlbum version={ Math.floor(Math.random()*3)+1} key={index}/>
            }
            else{
                return <Album key={index} data={data}/>}
            })}
            </div>
        </div></>);
}

export default Gallery;
