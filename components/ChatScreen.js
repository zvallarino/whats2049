import { Avatar, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useRef, useState,useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components'
import { auth, db } from '../firebase';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useCollection } from 'react-firebase-hooks/firestore'
import { addDoc, collection, doc, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import Message from './Message'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import getRecipientEmail from '../utils/getRecipientEmail';
import TimeAgo from 'timeago-react';


function ChatScreen({chat,messages}) {
  
  const [user] = useAuthState(auth)
  const [input, setInput] = useState("");
  const endOfMessagesRef = useRef(null)
  const router = useRouter();

  const stepOne = collection(db,"chats");
  const stepTwo = doc(stepOne,router.query.id)
  const stepThree = collection(stepTwo,"messages")
  const stepFour = query(stepThree, orderBy("timestamp", "asc"));
  const [messagesSnapshot] = useCollection(stepFour);

  const step1 = collection(db,"users")
  const queriedInfo = query(step1,where("email","==",getRecipientEmail(chat.users,user)))
  const [recipientSnapshot] = useCollection(queriedInfo)

  useEffect(() => {
    console.log(messages.length)
  if(messages.length > 2){
    scrollToBottom()
  }
   
    
  }, [])
  
 
  const showMessages = () => {
    if(messagesSnapshot){
      return messagesSnapshot.docs.map(message => (
        <Message
        key = {message.id}
        user = {message.data().user}
        message= {{
          ...message.data(),
          timestamp: message.data().timestamp?.toDate().getTime(),
        }}
        />
        )
        )
    } else {
      return JSON.parse(messages).map(message => (<Message key={message.id} message={message} />))
    }
     
  }

  const scrollToBottom = () => {
    console.log(endOfMessagesRef.current)
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth", 
      block: "start", 

    })
  }

  const sendMessage = (e) => {
    e.preventDefault();

    const stepOne = collection(db,"users")
    const stepTwo = doc(stepOne,user.uid)
    const stepThree = setDoc(stepTwo, {
      lastSeen: serverTimestamp(),
    },{merge: true})

    const stepFour = collection(db,"chats");
    const stepFive = doc(stepFour, router.query.id)
    const stepSix = collection(stepFive,"messages")
    const stepSeven = addDoc(stepSix,{
      timestamp: serverTimestamp(),
      message:input,
      user:user.email, 
      photoURL:user.photoURL,
    })

    scrollToBottom()
    setInput("")
  
  }


  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail =getRecipientEmail(chat.users,user)

  return (
    <Container>
      <Header>
      {recipient? (
        <Avatar src = {recipient?.photoURL}/>
      ):(<Avatar>{recipientEmail[0]}</Avatar>)}
      <HeaderInfo>
        <h3>{recipientEmail}</h3>
        {recipientSnapshot? (
        <p>Last active:{' '}
        {recipient?.lastSeen?.toDate() ? (
          <TimeAgo datetime={recipient?.lastSeen?.toDate()}/>
        ):"Unavailable"}</p>
        ):(
          <p>Loading last active</p>
        )}
      </HeaderInfo>

      <HeaderIcons>

        <IconButton>
          <AttachFileIcon />
        </IconButton>

        <IconButton>
          <MoreVertIcon />
        </IconButton>
       
      </HeaderIcons>
      </Header>


      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref = {endOfMessagesRef}/>
      </MessageContainer>
      
      <InputContainer>
        <InsertEmoticonIcon />
        <Input value = {input} onChange = {e => setInput(e.target.value)} />
        <button hidden disabled ={!input} type="submit" onClick ={sendMessage}>Send Message</button>
        <MicIcon />
      </InputContainer>
    </Container>
  )
}

export default ChatScreen;

const Container = styled.div``;

const Input = styled.input`
flex: 1;
outline:0;
border: none;
border-radius: 10px;
background-color:whitesmoke;
padding:20px;
margin-left: 15px;
margin-right: 15px;`;

const InputContainer = styled.form`
display:flex;
align-items: center;
padding: 10px;
position:sticky;
bottom: 0;
background-color: white;
z-index:100;
`;

const Header = styled.div`
position:sticky;
background-color: white;
z-index:100;
top: 0;
display:flex;
padding:11px;
height: 80px;
align-items:center;
border-bottom: 1px solid whitesmoke;
`;

const HeaderInfo = styled.div`
margin-left:15px;
flex:1;

> h3 {
  margin-bottom: 3px;
}

> p {
  font-size: 14px;
  color:gray;
}
`;

const HeaderIcons = styled.div``;

const EndOfMessage = styled.div`
margin-bottom:100px;`;

const MessageContainer = styled.div`
padding:30px;
background-color:#e5ded8;
min-height:90vh;
`;

