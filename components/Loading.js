import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';


function Loading() {
  return (
    <center style={{display: 'grid', placeItems: "center",height:"100vh"}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
        <img
        src = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/479px-WhatsApp.svg.png"
        alt = ""
        style={{marginBottom:10}}
        height = {200}
        />
        <CircularProgress color ="success" />
      </div>
    </center>
  )
}

export default Loading