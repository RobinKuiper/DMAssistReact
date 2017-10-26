import React from 'react'
import { Auth, FacebookProvider, GoogleProvider } from './../Lib/firebase'
import { Button, Header, Segment } from 'semantic-ui-react'

const Login = ({ subHeader }) => (
  <Segment textAlign='center' verticalAlign='middle' fluid style={{ height: '100%' }}>
    <Header as='h1'>
      Sign In
      <Header.Subheader>{subHeader}</Header.Subheader>
    </Header>

    <Button size='massive' color='google plus' icon='google' content='Sign in with Google' onClick={() => {Auth.signInWithPopup(GoogleProvider)}} />
    <Button size='massive' color='facebook' icon='facebook' content='Sign in with Facebook' onClick={() => {Auth.signInWithPopup(FacebookProvider)}} />
  </Segment>
)

export default Login
