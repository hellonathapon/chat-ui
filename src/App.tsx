import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import * as S from "./styled"
import { Header, Chat } from './components'

export interface Message {
  text: string,
  timeStamp: Date,
  owner: boolean
}

function App(): JSX.Element {

  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState<Array<Message>>([]);
  const [chatMessage, setChatMessage] = useState<Array<Message>>([])

  useEffect(() => {
    const newSocket: Socket = io("http://localhost:5000")
    setSocket(newSocket);
    newSocket.on("connection", (data: Message) => {
      setMessage(prev => [...prev, data])
    })
    newSocket.on("disconnection", (data: Message) => {
      setMessage(prev => [...prev, data])
    })
    newSocket.on("chat message", (data: Message) => {
      console.log(data)
      setMessage(prev => [...prev, data])
    })

    return () => {
      newSocket.close()
    }
  }, [setSocket])

  return (
    <S.App>
        <Header/>
        <Chat message={message} socket={socket!}/>
    </S.App>
  );
}

export default App;
