import React from 'react'
import { Container, Form, Header, Button, Divider, Dropdown, Modal, Popup } from 'semantic-ui-react'
import { Auth, FacebookProvider, GoogleProvider } from './../Lib/firebase'

const LoginDropdownMenu = ({text, inline, item}) => (
  <Dropdown inline={inline} item={item} text={text} closeOnChange={false} closeOnBlur={false}>
    <Dropdown.Menu>
      <Dropdown.Item>
        <Form>
          <Form.Input label='Email' type='email' />
          <Form.Input label='Password' type='password' />
          <Button type='submit'>Login</Button>
        </Form>
      </Dropdown.Item>
      <Dropdown.Divider />
      <Dropdown.Item onClick={() => {Auth.signInWithPopup(GoogleProvider)}}><Button fluid color='google plus' icon='google' content='Google Login' /></Dropdown.Item>
      <Dropdown.Item onClick={() => {Auth.signInWithPopup(FacebookProvider)}}><Button fluid color='facebook' icon='facebook' content='Facebook Login' /></Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>
)

export default LoginDropdownMenu
