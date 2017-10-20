import React, { Component } from 'react';
import fbApp from './Lib/firebase'

import { Container, Sidebar, Segment, Menu, Icon, Header } from 'semantic-ui-react'

import './App.css';

class App extends Component {
  constructor(props){
    super(props)

    this.state = {
      messages: []
    }
  }

  componentWillMount(){
    // Create reference to messages in firebase database
    let messagesRef = fbApp.database().ref('messages').orderByKey().limitToLast(100);
    messagesRef.on('child_added', snapshot => {
      // Update React state when message is added to the firebase database
      let message = { text: snapshot.val(), id: snapshot.key }
      this.setState({ messages: [message].concat(this.state.messages) })
    })
  }

  addMessage(e) {
    e.preventDefault();

    // Send message to firebase
    fbApp.database().ref('messages').push( this.inputEl.value )
    this.inputEl.value = '';
  }

  render() {
    return (
      <div id='outer-container'>
        <Sidebar.Pushable as={Segment} style={{backgroundColor: '#D1D5D6'}}>
          <Sidebar as={Menu} animation='push' width='thin' visible={true} vertical inverted style={{color: '#fff'}}>
            <Menu.Header textAlign={'left'} onClick={() => alert('blaat')} style={{fontSize: '14pt', textAlign: 'left', padding: 20}}>
              DM <span style={{color: 'purple'}}>Assist</span>
              <Header.Subheader style={{fontSize: '7pt', fontWeight: 'lighter', marginLeft: 9}}>
                Making life of evil easier.
              </Header.Subheader>
            </Menu.Header>

            <Menu.Item name='dashboard' onClick={() => alert('blaat')}>
              <Icon name='home' />
              Home
            </Menu.Item>
            <Menu.Item name='monsters' onClick={() => alert('blaat')}>
              <Icon name='spy' />
              Monsters
            </Menu.Item>
            <Menu.Item name='campaigns' onClick={() => alert('blaat')}>
              <Icon name='newspaper' />
              Campaigns
            </Menu.Item>
            <Menu.Item name='treasure' onClick={() => alert('blaat')}>
              <Icon name='diamond' />
              Campaigns
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher>
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
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

export default App;
