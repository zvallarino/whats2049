import Head from 'next/head';
import React from 'react'
import styled from "styled-components"
import Sidebar from '../../components/Sidebar';
import ChatScreen from '../../components/ChatScreen';
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import getRecipientEmail from '../../utils/getRecipientEmail';


function Chat({chat, messages}) {

  const [user] = useAuthState(auth)


  return (
    <Container>
      <Head>
        <title>Chat with {getRecipientEmail(chat.users,user)}</title>
      </Head>
      

      <Sidebar />

      
      <ChatContainer>
        <ChatScreen chat ={chat} messages = {messages}/>
      </ChatContainer>


      </Container>
  )
}

export default Chat

export async function getServerSideProps(context){
  const stepOne = collection(db,"chats")
  const collectionZ = doc(stepOne,context.query.id)
  const messageRef = query(collection(collectionZ, "messages"), orderBy("timestamp", "asc"));
  const documents = await getDocs(messageRef)
  const messages = documents.docs.map((doc)=>({id:doc.id,...doc.data(),})).map((messages)=>({...messages,timestamp:messages.timestamp.toDate().getTime()}))
  const chatRef = await getDoc(collectionZ)

  const chat = {
    id: chatRef.id,
    ...chatRef.data() 
  }

  return {
    props:{
     messages:JSON.stringify(messages),
     chat: chat
    }
  }
}

const Container = styled.div`
display:flex;
`;

const ChatContainer = styled.div`
flex:1;
overflow: scroll;
height: 100vh;

::-webkit-scrollbar {
  display:none;
}

-ms-overflow-stype: none;
scrollbar-width:none;
`;