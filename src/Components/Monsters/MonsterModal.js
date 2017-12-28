import React, { Component } from 'react'
import { Dimmer, Loader, Modal } from 'semantic-ui-react'
import { Database } from './../../Lib/firebase'

import MonsterLayout from './MonsterLayout'

export default class MonsterModal extends Component {
  state = { monster: null }

  componentDidMount(){
    const ref = this.props.monster.custom ? 'custom_monsters' : 'monster_data'
    Database.ref(ref).child(this.props.monster.key).on('value', snapshot => {
      let monster = snapshot.val()
      if(monster){
        monster.key = this.props.monster.key
        this.setState({ monster })
      } else this.setState({ monster: null })
      
    })
  }

  render() {
    return (
      <Modal 
        basic
        closeIcon 
        trigger={this.props.trigger}>
        <Modal.Content>
          <Dimmer active={!this.state.monster}>
            <Loader size='massive'></Loader>
          </Dimmer>

          { this.state.monster &&
            <MonsterLayout monster={this.state.monster} backButton={false} />
          }
        </Modal.Content>
      </Modal>
    )
  }
}
