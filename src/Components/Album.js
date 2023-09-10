
import styles from "./Album.module.css";
//images
import design1_square from "../assets/skins/design1_square.svg";
import design1_horizontal from "../assets/skins/design1_horizontal.svg";
import design1_vertical from "../assets/skins/design1_vertical.svg";
import design2_square from "../assets/skins/design2_square.svg";
import design2_horizontal from "../assets/skins/design2_horizontal.svg";
import design2_vertical from "../assets/skins/design2_vertical.svg";
import design3_square from "../assets/skins/design3_square.svg";
import design3_vertical from "../assets/skins/design3_vertical.svg";
import design3_horizontal from "../assets/skins/design3_horizontal.svg";
import design4_square from "../assets/skins/design4_square.svg";
import design4_vertical from "../assets/skins/design4_vertical.svg";
import design4_horizontal from "../assets/skins/design4_horizontal.svg";
import { useEffect, useRef,useState } from "react";


const Album = ({ data }) => {

  const skinList = [
    [design1_square, design1_vertical,design1_horizontal],
    [design2_square, design2_vertical,design2_horizontal],
    [design3_square, design3_vertical,design3_horizontal],
    [design4_square, design4_vertical,design4_horizontal]];
  const imageurl = data.url;
  const vidConfig = data.vidConfig;
  const skinNum = data.skin;

  const classNameBySkin =
    skinNum === 0
      ? styles.default
      : skinNum === 1
      ? styles.opt1
      : skinNum === 2
      ? styles.opt2
      : skinNum === 3
      ? styles.opt3
      : styles.opt4;
 
  const classNameByConfig =
    vidConfig === 0
      ? styles.square
      : vidConfig === 1
      ? styles.vertical
      : styles.horizontal;

    const image = skinList[skinNum-1][vidConfig];
    const imageRef = useRef(null);
    const [imgConfig,setImgConfig] = useState(null); //가로가 긴지 세로가 긴지
    const [made,setMade] = useState(false);
    useEffect(()=>{
      const temp_img = imageRef.current;
      if(temp_img){
        const {naturalWidth, naturalHeight} = temp_img;
        if(naturalWidth < naturalHeight){
          setImgConfig('vertical');
        }
        else{
          setImgConfig('horizontal');
        }
      }
      setMade(true);

    },[]);
    // useEffect(()=>{
    //   if(imgConfig!==null) setMade(true);
    // },[imgConfig]);


    const skinElement = (
      <img className={styles.skinElement} src={image} />
    );
  
  return (
    <>
    {made && <div className={`${styles.container} ${classNameBySkin}`}>
      {skinElement}
      <div className={`${styles.mask} ${classNameByConfig}`}>
        <img src={imageurl} alt="img" ref={imageRef} className={`${styles.img} ${imgConfig==='vertical' && styles.vertical} ${imgConfig==='horizontal' && styles.horizontal}`}/>
      </div>

    </div>}
    </>
  );
};

export default Album;
