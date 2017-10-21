import React, { Component } from 'react'
import { Container } from 'semantic-ui-react'
import firebase from './../Lib/firebase'

export default class Dashboard extends Component {
  constructor(props){
    super(props)

    this.state = {
      messages: []
    }
  }

  componentWillMount(){
    // Create reference to messages in firebase database
    let messagesRef = firebase.database().ref('messages').orderByKey().limitToLast(100);
    messagesRef.on('child_added', snapshot => {
      // Update React state when message is added to the firebase database
      let message = { text: snapshot.val(), id: snapshot.key }
      this.setState({ messages: [message].concat(this.state.messages) })
    })
  }

  render() {
    return (
      <Container id="main">
        <form onSubmit={this.addMessage.bind(this)}>
          <input type='text' ref={ el => this.inputEl = el } />
          <input type='submit' />
          <ul>
            {
              // Render messages
              this.state.messages.map( message => <li key={message.id}>{message.text}</li>)
            }
          </ul>
        </form>
      </Container>
    )
  }

  addMessage(e) {
    e.preventDefault();

    // Send message to firebase
    firebase.database().ref('messages').push( this.inputEl.value )
    this.inputEl.value = '';
  }
}
