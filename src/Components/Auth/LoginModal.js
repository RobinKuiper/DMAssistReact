import React from 'react'
import { Form, Header, Button, Divider, Message, Modal } from 'semantic-ui-react'
import { Auth, Providers, FacebookProvider, GoogleProvider } from './../../Lib/firebase'

export default class LoginModal extends React.Component {
  constructor(props){
    super(props)

    this.signInWithProvider = this.signInWithProvider.bind(this)

    this.state = {
      email: '',
      password: '',
      loading: false,
      error: null
    }
  }

  render() {
    return (
      <Modal trigger={this.props.trigger} dimmer='blurring' basic >
        <div>
          <Header dividing inverted>Sign In!</Header>
          { this.state.error && ( <Message error content={this.state.error} />) }
          <Form loading={this.state.loading} inverted={!this.state.loading}>
            <Form.Input label='Email' type='email' value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} />
            <Form.Input label='Password' type='password' value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })} />
            <Button.Group>
              <Button onClick={this.signIn.bind(this)} positive>Sign In</Button>
              <Button.Or />
              <Button onClick={this.signUp.bind(this)} color='blue'>Sign Up</Button>
            </Button.Group>
          </Form>

          <Divider />


            <Button color='google plus' icon='google' content='Google Login' onClick={() => { this.signInWithProvider(GoogleProvider) }} loading={this.state.loading} />
            <Button color='facebook' icon='facebook' content='Facebook Login' onClick={() => { this.signInWithProvider(FacebookProvider) }} loading={this.state.loading} />
            <Button color='twitter' icon='twitter' content='Twitter Login' onClick={() => { this.signInWithProvider(Providers.Twitter) }} loading={this.state.loading} />
            <Button icon='github' content='Github Login' onClick={() => { this.signInWithProvider(Providers.Github) }} loading={this.state.loading} />

        </div>
      </Modal>
    )
  }

  signUp() {
    var self = this
    this.setState({ loading: true, error: null })

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
