import React from 'react'
import { Button, Dropdown } from 'semantic-ui-react'
import { Auth, FacebookProvider, GoogleProvider } from './../Lib/firebase'

const LoginDropdownMenu = ({text, inline, item}) => (
  <Dropdown inline={inline} item={item} text={text}>
    <Dropdown.Menu>
      <Dropdown.Item onClick={() => {Auth.signInWithPopup(GoogleProvider)}}><Button fluid color='google plus' icon='google' content='Google Login' /></Dropdown.Item>
      <Dropdown.Item onClick={() => {Auth.signInWithPopup(FacebookProvider)}}><Button color='facebook' icon='facebook' content='Facebook Login' /></Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
)

export default LoginDropdownMenu
