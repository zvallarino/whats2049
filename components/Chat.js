import { Avatar } from '@mui/material'
import React from 'react'
import styled from "styled-components"
import getRecipientEmail from '../utils/getRecipientEmail'
import { auth, db } from "../firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { collection, query, where } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'
import { useRouter } from 'next/router'

function Chat({id, users}) {

  const [user] = useAuthState(auth);
  const router = useRouter();
  const collectRef = collection(db,'users')
  const queryRef = query(collectRef,where("email","==",getRecipientEmail(users,user)))
  const [recipientSnapshot] = useCollection(queryRef);
  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(users,user);

  const enterChat = () => {
    router.push(`/chat/${id}`)
  }

  return (
    <Container onClick = {enterChat}>
      {recipient? <UserAvatar src = {recipient?.photoURL}/>:<UserAvatar>{recipientEmail[0]}</UserAvatar>}
      <p>{recipientEmail}</p>
    </Container>
  )
}

export default Chat

const Container = styled.div`
display:flex;
align-items:center;
cursor:pointer;
padding: 15px;
word-break: break-word;

 :hover{
   background-color: #e9eaeb;
 }

`;

const UserAvatar = styled(Avatar)`
margin: 5px;
margin-right: 15px;
`;