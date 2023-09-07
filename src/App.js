import Gallery from "./Components/Gallery";
import Header from "./Components/Header";
import PhotoModal from "./Components/PhotoModal";
import NoteModal from "./Components/NoteModal";
import "./App.css";
import { useCallback, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import ActionBar from "./Components/ActionBar";

function App() {
  
  const PC = useMediaQuery({
    query : "(min-width:1024px)"
  });
  const TABLET = useMediaQuery({
    query : "(min-width:768px) and (max-width:1023px)"
  });
  const MOBILE = useMediaQuery({
    query : "(max-width:767px)"
  });
  const version = PC ? 'pc' : TABLET ? 'tablet' : 'mobile';
  const [modal, setModal] = useState("noModal"); //modal: 'noModal', 'photo', 'note'
  const modalHandler = useCallback((which) => setModal(which), []);

  return (
    <div className="App">
      {modal==='photo' && (
        <PhotoModal onCloseModal={()=>setModal('noModal')} version={version}/>)}
      {modal==='note' && (
        <NoteModal onCloseModal={()=>setModal('noModal')}/>)}

      <Header onModalHandler={(which)=>modalHandler(which)} version={version} />
      <Gallery modal={modal} modalHandler={modalHandler} version={version} />
      {MOBILE && <ActionBar onTakePhoto={()=>setModal('photo')} onWriteNote={()=>setModal('note')}/>}
    </div>
  );
}

export default App;
