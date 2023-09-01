import Gallery from './Components/Gallery';
import Header from './Components/Header';
import { useState } from 'react';
import './App.css';
import PhotoModal from './Components/PhotoModal';

function App() {
  const [takePhoto,setTakePhoto] = useState(false);
  const toggleModal = () => setTakePhoto((prev)=>!prev); //Modal 끄고 키기

  return (
  <>
    <Header onClick={toggleModal}/>
    <Gallery takePhoto={takePhoto} onClick={toggleModal}/>
    </>
  );
}

export default App;
