import { useState } from "react";
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
import triangle from "../assets/Images/triangle.svg";
import camera from "../assets/Images/camera.png";

const Album = ({ data }) => {
  // const [skinElement,setSkinElement] = useState(null);
  let skinElement;
  const imageurl = data.url;
  const vidConfig = data.vidConfig;
  const skinNum = data.skin;
  console.log(vidConfig + " " + skinNum);
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
  console.log("ClassNameBySkin :");
  console.log(classNameBySkin);
  const classNameByConfig =
    vidConfig === 0
      ? styles.square
      : vidConfig === 1
      ? styles.vertical
      : styles.horizontal;

  if (skinNum === 1) {
    const image =
      vidConfig === 0
        ? design1_square
        : vidConfig === 1
        ? design1_vertical
        : design1_horizontal;
    skinElement = (
      <img className={styles.skinElement} src={image} width="350" />
    );
  } else if (skinNum === 2) {
    const image =
      vidConfig === 0
        ? design2_square
        : vidConfig === 1
        ? design2_vertical
        : design2_horizontal;

    skinElement = (
      <>
        {vidConfig === 1 && (
          <div className={styles.skkucomit}>
            <p className={styles.skku}>SKKU</p>
            <p className={styles.comit}>COMIT</p>
          </div>
        )}
        <img className={styles.skinElement} src={image} width="350" />
      </>
    );
  } else if (skinNum === 3) {
    const image =
      vidConfig === 0
        ? design3_square
        : vidConfig === 1
        ? design3_vertical
        : design3_horizontal;
    const width_ = vidConfig === 0 ? 360 : vidConfig === 1 ? 439 : 337;
    skinElement = (
      <>
        {vidConfig === 1 && (
          <div>
            <div className={styles.skkucomit}>
              <p className={`${styles.skku} ${styles.design3}`}>SKKU</p>
              <p className={styles.comit}>COMIT</p>
            </div>
          </div>
        )}
        <img
          className={`${styles.skinElement} ${styles.design3} ${classNameByConfig}`}
          src={image}
          width={width_}
        />
      </>
    );
  } else if (skinNum === 4) {
    skinElement = (
      <> 
          <div className={styles.borderText}>
            <p className={styles.up}>COMIT FILM</p>
            <p className={`${styles.right} ${classNameByConfig}`}>TAKE YOUR MEMORY</p>
            <div className={styles.left}>
              <p style={{display:'inline'}}>11</p>
              <img width='20' src={triangle} />
            </div>
            <p className={`${styles.down} ${classNameByConfig}`}>29</p>
            {vidConfig !== 0 &&
            <img className={`${styles.camera} ${classNameByConfig}`} src={camera} width='75'/>}
          </div>

      </>
    );
  }

  return (
    <div className={`${styles.container} ${classNameBySkin}`}>
      {skinElement}
      <div className={`${styles.mask} ${classNameByConfig}`}>
        <img src={imageurl} alt="img"/>
      </div>
    </div>
  );
};

export default Album;
