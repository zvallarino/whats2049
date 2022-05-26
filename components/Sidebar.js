import React from 'react'
import Avatar from '@mui/material/Avatar';
import styled from 'styled-components';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatIcon from '@mui/icons-material/Chat';
import { Button, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import * as EmailValidator from "email-validator";
import { auth,db } from '../firebase';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { where } from 'firebase/firestore';
import { query } from 'firebase/firestore';
import Chat from './Chat';


function Sidebar() {
  const [user] = useAuthState(auth)
  const chatRef = collection(db,"chats")
  const userChatRef = query(chatRef, where("users","array-contains",user.email))
  const [chatSnapShot] = useCollection(userChatRef)


  const createChat = () => {
    const input = prompt(`
    Please enter an email address for the user you wish to chat with`);

    if(!input)return;

    if(
      EmailValidator.validate(input) && 
      !chatAlreadyExists(input) 
      &&input !== user.email){
      const stepOne = collection(db,"chats")
      addDoc(stepOne,
        {users:[
          user.email,
          input
        ]})

    }

  };

  const chatAlreadyExists = (secondEmail)=>{
    if(!!chatSnapShot){
      return chatSnapShot?.docs.find(chat =>
        chat.data().users.find(user => user === secondEmail)?.length > 0)
    }
  }

  console.log(user.photoURL)
  return (
    <Container>
      <Header>
        <UserAvatar src = {user.photoURL} onClick = {()=>auth.signOut()}/>

        <IconContainer>

          <IconButton>
            <ChatIcon />
          </IconButton>

          <IconButton>
            <MoreVertIcon />
          </IconButton>

        </IconContainer>
      </Header>

      <Search>
        <SearchIcon />
        <SearchInput placeholder='Search in chats'/>
      </Search>

      <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>


      {/* list of chats */}
      {chatSnapShot?.docs.map(chat => (
      <Chat key = {chat.id} id={chat.id} users={chat.data().users} />))}
      
    </Container>
  )
}

export default Sidebar;

const Container = styled.div`
`;

const Search = styled.div`
display:flex;
align-items:center;
padding:20px;
border-radius:2px;
`;

const SidebarButton = styled(Button)`
width:100%;

&&&{
border-top:1px solid whitesmoke;
border-bottom:1px solid whitesmoke;
}
`;

const SearchInput = styled.input`
outline-width:0;
border:none;
flex:1;
`;

const Header = styled.div`
display:flex;
position:sticky;
top: 0;
background-color:white;
z-index:1;
justify-content:space-between;
align-items:center;
padding:15px;
height:80px;
border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
margin:10px;
cursor:pointer;

:hover {
  opacity:0.8;
}
`;

const IconContainer = styled.div``;