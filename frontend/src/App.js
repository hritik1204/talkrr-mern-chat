import './App.css';
// import { useEffect, useState } from 'react';
// import { ChatContext } from './Context/ChatProvider';
// import { useNavigate } from 'react-router-dom';
import {Route , Routes} from "react-router-dom";
import Homepage from './Pages/Homepage';
import ChatPage from './Pages/ChatPage';

function App() {
  // const [user, setUser] = useState();
  // const history = useNavigate();

  // useEffect(() => {
  //   const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  //   setUser(userInfo)
  
    
  // }, [history])
  
  return (
    <div className="App">
    <Routes>
      <Route path='/' element={<Homepage/>}/>
      <Route path='/chats' element={<ChatPage/>}/>
    </Routes>
    </div>
  );
}

export default App;

// <ChatContext.Provider value={{user, setUser}}>
// </ChatContext.Provider>