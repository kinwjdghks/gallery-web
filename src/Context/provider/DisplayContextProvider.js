import React, {useState} from 'react';
import DisplayContext from "../context/Display";

const DisplayProvider = ({children}) =>{
    const displayToggle = () => setDarkmode(prevState => {return {...prevState, darkmode: !prevState.darkmode}});
    
    const initialState = {
        darkmode: false,
        displayToggle: displayToggle
    }
    const [darkmode,setDarkmode] = useState(initialState);


    return <DisplayContext.Provider value={darkmode}>{children}</DisplayContext.Provider>
}

export default DisplayProvider;