import React from 'react'
import { Form, Grid, Header, Button, Divider, Message, Modal, Segment } from 'semantic-ui-react'
import { Auth, FacebookProvider, GoogleProvider } from './../Lib/firebase'

export default class LoginModal extends React.Component {
  constructor(props){
    super(props)

    this.signInWithProvider = this.signInWithProvider.bind(this)

    this.state = {
      email: '',
      password: '',
      passwordC: '',
      loading: false,
      error: null,
      signup: false
    }
  }

  render() {
    return (
      <Modal trigger={this.props.trigger} basic size='mini' >
        <Grid textAlign='center'>
          <Grid.Column>
            <Header as='h2' color='teal'>Sign in to your account</Header>

            { this.state.error && ( <Message error content={this.state.error} />) }

            <Form loading={this.state.loading}>
              <Segment stacked>
                <Form.Input icon='mail' iconPosition='left' type='email' placeholder='E-mail Address' value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} />
                <Form.Input icon='lock' iconPosition='left' type='password' placeholder='Password' value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })} />
                { this.state.signup && <Form.Input icon='lock' iconPosition='left' type='password' placeholder='Password Confirmation' value={this.state.passwordC} onChange={(e) => this.setState({ passwordC: e.target.value })} />}
                <Button content={this.state.signup ? 'Sign Up' : 'Sign In'} color='teal' size='large' fluid onClick={this.state.signup ? this.signUp.bind(this) : this.signIn.bind(this)} />
              </Segment>
            </Form>

            { this.state.signup ? 
              <Message>Have an account? <Header.Subheader as='a' style={{cursor: 'pointer', display: 'inline-block'}} onClick={() => this.setState({ signup: false }) }>Sign In!</Header.Subheader></Message>
              : <Message>New here? <Header.Subheader as='a' style={{cursor: 'pointer', display: 'inline-block'}} onClick={() => this.setState({ signup: true }) }>Sign Up!</Header.Subheader></Message> }

            <Divider />
            
            <Button.Group>
              <Button color='google plus' icon='google' content='Google Login' onClick={() => { this.signInWithProvider(GoogleProvider) }} loading={this.state.loading} />
              <Button.Or />
              <Button color='facebook' icon='facebook' content='Facebook Login' onClick={() => { this.signInWithProvider(FacebookProvider) }} loading={this.state.loading} />
            </Button.Group>
          </Grid.Column>
        </Grid>
      </Modal>
    )
  }

  signUp() {
    var self = this
    this.setState({ loading: true, error: null })

    if(this.state.password !== this.state.passwordC){
      this.setState({ loading: false, error: 'Passwords don\'t match'})
      return;
    }

    Auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
      .catch(error => self.setState({ error: error.message, loading: false }))
  }

  signIn() {
    var self = this
    this.setState({ loading: true, error: null })

    Auth.signInWithEmailAndPassword(this.state.email, this.state.password)
      .catch(error => { self.setState({ error: error.message, loading: false })})
  }

  signInWithProvider(provider) {
    var self = this
    this.setState({ loading: true, error: null })

    Auth.signInWithPopup(provider)
      .catch(error => self.setState({ error: error.message, loading: false }))
  }
}
