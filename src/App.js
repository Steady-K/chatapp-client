import { useEffect, useState } from "react";
import "./App.css";
import socket from "./server";
import InputField from "./components/InputField/InputField";
import MessageContainer from "./components/MessageContainer/MessageContainer";
import { use } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  const [rooms, setRooms] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  console.log("message List", messageList);
  useEffect(() => {
    socket.on("message", (message) => {
      setMessageList((prevState) => prevState.concat(message));
    });
    askUserName();
    socket.on("rooms", (res) => {
      setRooms(res);
      console.log("rooms data from server:", res);
    });
  }, []);

  const askUserName = () => {
    const userName = prompt("당신의 이름을 입력하세요.");
    console.log("uuu", userName);

    socket.emit("login", userName, (res) => {
      if (res?.ok) {
        setUser(res.data);
      }
    });
  };
  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("sendMessage", message, (res) => {
      console.log("sendMessage res", res);
    });
  };

  return (
    // <div>
    //   <div className="App">
    //     <MessageContainer messageList={messageList} user={user} />
    //     <InputField
    //       message={message}
    //       setMessage={setMessage}
    //       sendMessage={sendMessage}
    //     />
    //   </div>
    // </div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoomListPage rooms={rooms} />} />
        <Route path="/room/:id" element={<ChatPage user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
