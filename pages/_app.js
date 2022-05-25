import '../styles/globals.css'
import { useAuthState } from "react-firebase-hooks/auth"
import { auth,db } from '../firebase'
import Login from './login';
import Loading from "../components/Loading"
import { useEffect } from 'react';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';

function MyApp({ Component, pageProps }) {

  const [user,loading] = useAuthState(auth);

  useEffect(()=>{
    if(user){
      const stepOne = collection(db,"users");
      const stepTwo = doc(stepOne,user.uid);
      setDoc(stepTwo,{
        email:user.email,
        lastSeen:serverTimestamp(),
        photoURL:user.photoURL,
      },{merge:true})
      // db.collection("users").doc(user.uid).set({
      //   email:user.email,
      //   lastSeen:serverTimestamp(),
      // })
    }
  },[user])

  if(loading){return <Loading />}

  if (!user){return <Login />}

  return <Component {...pageProps} />
}

export default MyApp;

