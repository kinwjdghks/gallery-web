import styles from './Gallery.module.css';
import PhotoModal from './PhotoModal';
import BlankAlbum from './BlankAlbum';
import Album from './Album';
import { useState, useEffect,useRef } from 'react';
import { db } from '../Utility/firebase';
import { collection, getDocs, query, where,limit} from 'firebase/firestore/lite';

const Gallery = ({takePhoto,onClick}) =>{
    //이 Timestamp 이전의 사진들은 모두 로드됨.
    const [curTimeStamp,setCurTimeStamp] = useState(0);
    const [endOfData,setEndOfData] = useState(false);

    const pageEnd = useRef(null);
    useEffect(()=>{
        let observer;
        if(pageEnd.current && !endOfData){
            const onIntersect = async ([entry],observer)=>{
                if(entry.isIntersecting){
                    observer.unobserve(entry.target);
                    getMorePhotos();
                    observer.observe(entry.target);
                }
            }
            observer = new IntersectionObserver(onIntersect,{threshold:1});
            observer.observe(pageEnd.current);
        }
        return () => observer && observer.disconnect();
    },[pageEnd]);
    
//     const [photos,setPhotos] = useState([{
//         imageurl:"a",
//         vidConfig:0
//     },
//     {
//       imageurl: "a",
//       vidConfig: 1,
//     },
//     {
//         imageurl: 'blank',
//         vidConfig: 0,
//       },
//       {
//         imageurl: "a",
//         vidConfig: 0,
//       },
//       {
//         imageurl: 'blank',
//         vidConfig: 1,
//       },
//       {
//         imageurl: "a",
//         vidConfig: 2,
//       },
//       {
//         imageurl: "a",
//         vidConfig: 2,
//       },
//     {
//       imageurl: "a",
//       vidConfig: 2,
//     },
//     {
//       imageurl: 'blank',
//       vidConfig: 2,
//     },
//     {
//       imageurl: "a",
//       vidConfig: 2,
//     },
//     {
//         imageurl: 'blank',
//         vidConfig: 0,
//       },
//       {
//         imageurl: "a",
//         vidConfig: 1,
//       },
//       {
//         imageurl: 'blank',
//         vidConfig: 0,
//       },
//       {
//         imageurl: 'blank',
//         vidConfig: 1,
//       },
//       {
//         imageurl: 'a',
//         vidConfig: 2,
//       },
//       {
//         imageurl: 'blank',
//         vidConfig: 2,
//       },
//       {
//         imageurl: 'a',
//         vidConfig: 0,
//       },
//   ]); 

  const [photos,setPhotos] = useState([{
    imageurl:"a",
    vidConfig:0
},
{
  imageurl: "a",
  vidConfig: 1,
},
{
    imageurl: 'blank',
    vidConfig: 0,
  },
  {
    imageurl: "a",
    vidConfig: 0,
  },
  
  {
    imageurl: "a",
    vidConfig: 1,
  },
  
  {
    imageurl: 'a',
    vidConfig: 0,
  },
]); 
    const getMorePhotos = async()=>{ //10개씩 사진 가져오기.
        const queryTemp = query(collection(db,'Photos'),where('id','>',curTimeStamp),limit(10));
        const dataSnapShot = await getDocs(queryTemp);
        const length = dataSnapShot.length;
        const dataList = dataSnapShot.docs.map(doc=> doc.data());
        if(length){
            setCurTimeStamp(dataList[length-1].id);
            setPhotos((prev)=>[...prev,...dataList]);
        }
        else{
            setEndOfData(true);
        }
        setPhotos(dataList);
    } 

    //모두 가져오는 버전
    // const getPhotos =  async () =>{
    //     const dataSnapShot = await getDocs(collection(db,'Photos'));
    //     const dataList = dataSnapShot.docs.map(doc=> doc.data());
    //     setPhotos(dataList);
    // }
    // //모달 열리고 닫힐때만 사진 가져오기
    // useEffect(()=>{
    //     console.log('사진 가져오기');
    //     getPhotos();
    // }
    // ,[takePhoto]);




    return(<> 
        {takePhoto && <PhotoModal photoList={photos} onClick={onClick}/>}
        <div className={styles.background}>
            <div className={styles.albumContainer}>
            {photos.map((data,index)=>
            {if(data.imageurl==='blank'){
                return <BlankAlbum key={index}/>
            }
            else{
                return <Album key={index} data={data}/>}
            })}
            </div>
        </div>
            <div className={styles.pageEnd} ref={pageEnd}></div>
        </>);
}

export default Gallery;
