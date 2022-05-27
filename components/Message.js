import React from 'react'
import styled from 'styled-components';

function Message({user, message}) {
  return (
    <Container>
      <div>{message}</div>
    </Container>
  )
}

export default Message;

const Container = styled.div``;