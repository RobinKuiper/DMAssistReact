import React, { Component } from 'react'
import { Dimmer, Loader, Modal } from 'semantic-ui-react'
import { Database } from './../Lib/firebase'

import SpellLayout from './SpellLayout'

export default class SpellModal extends Component {
  state = { spell: null }

  componentDidMount(){
    const ref = this.props.spell.custom ? 'custom_spells' : 'spell_data'
    Database.ref(ref).child(this.props.spell.key).on('value', snapshot => {
      let spell = snapshot.val()
      if(spell){
        spell.key = this.props.spell.key
        this.setState({ spell })
      } else this.setState({ spell: null })
    })
  }

  render() {
    return (
      <Modal 
        closeIcon 
        basic
        trigger={this.props.trigger}>
        <Modal.Content>
          <Dimmer active={!this.state.spell}>
            <Loader size='massive'></Loader>
          </Dimmer>

          { this.state.spell &&
            <SpellLayout spell={this.state.spell} backButton={false} />
          }
        </Modal.Content>
      </Modal>
    )
  }
}
