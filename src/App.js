import Gallery from "./Components/Gallery";
import Header from "./Components/Header";
import "./App.css";
import PhotoModal from "./Components/PhotoModal";
import { useState } from "react";

function App() {
  const [takePhoto, setTakePhoto] = useState(false);
  const toggleModal = () => setTakePhoto((prev) => !prev);
  return (
    <>
      <Header onClick={toggleModal} />
      <Gallery takePhoto={takePhoto} onClick={toggleModal} />
    </>
  );
}

export default App;
