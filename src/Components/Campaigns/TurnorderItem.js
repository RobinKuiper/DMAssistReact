import React, { Component } from 'react'
import { Button, Icon, Input, Item, Label, List, Popup } from 'semantic-ui-react'
import MonsterModal from './../Monsters/MonsterModal'
import { calculateMod, formatTime } from './../../Lib/Common'
import Dice from './../../Lib/Dice'
import AddModal from './AddModal'
import { Database } from './../../Lib/firebase'

export default class TurnorderItem extends Component {
  constructor(props) {
    super(props)

    this.rollInitiative = this.rollInitiative.bind(this)

    this.state = {
      tempHP: props.item.hit_points
    }

    this.t = undefined
    this.start = 100
  }

  repeat = (increase) => {
    this.setState({ tempHP: increase ? this.state.tempHP+1 : this.state.tempHP-1 })
    this.t = setTimeout(() => {
      this.repeat(increase)
    }, this.start)
    this.start = this.start / 1.01
  }

  increaseHP = () => {
    //this.setState({ increaseHP: true })
    this.repeat(true)
  }

  decreaseHP = () => {
    //this.setState({ increaseHP: false })
    this.repeat(false)
  }

  onMouseUp = () => {
      clearTimeout(this.t)
      this.start = 100
      Database.ref('/campaigns/'+this.props.campaign.key).child('turnorder/'+this.props.item.id).update({ hit_points: parseInt(this.state.tempHP, 10) })
  }

  handleInput = (e) => {
    var { name, value } = e.target

    if(e.keyCode === 13 || e.type === 'blur'){
      if(name === 'hit_points'){
        value = parseInt(value, 10)
        this.setState({ tempHP: value })
      }
      if(value !== null || value !== '') Database.ref('/campaigns/'+this.props.campaign.key).child('turnorder/'+this.props.item.id).update({ [name]: value })
    }
  }

  render() {
    var item = this.props.item

    return (
      <Item key={item.key}>
        <Item.Content>
          <Item.Header className={item.done && 'strikethrough'}>
            {this.renderName(item)}
          </Item.Header>
          <Item.Meta>INI {item.initiative} AC {item.armor_class}</Item.Meta>
          <Item.Description>
          </Item.Description>
          <Item.Extra>
            <Button.Group>
              <Popup content='Decrease Hit Points' trigger={<Button color='red' icon='minus' onMouseDown={this.decreaseHP.bind(this)} onMouseUp={this.onMouseUp} onMouseLeave={this.onMouseUp} />} />{/*onClick={() => { this.props.campaignRef.child('turnorder/'+item.id).update({ hit_points: parseInt(item.hit_points, 10)-1 }) }}*/}
              <Popup position='top center' trigger={<Button content={this.state.tempHP || item.hit_points} />} on='click' hoverable content={<Input placeholder='5, -6, etc' type='number' onKeyDown={(e) => {if(e.keyCode === 13) {
                var newHP = parseInt(item.hit_points, 10)+parseInt(e.target.value, 10)
                this.setState({ tempHP: newHP })
                Database.ref('/campaigns/'+this.props.campaign.key).child('turnorder/'+item.id).update({ hit_points: newHP })
              }} } />} />
              <Popup content='Increase Hit Points' trigger={<Button color='green' icon='plus' onMouseDown={this.increaseHP.bind(this)} onMouseUp={this.onMouseUp} onMouseLeave={this.onMouseUp} />} />
            </Button.Group>

            <Button.Group floated='right'>
              <Popup content={'Done, ' + item.name + '\'s turn is over.'} trigger={<Button color='blue' icon='checkmark' onClick={this.props.setDone} />} />
              <Popup content={'Remove ' + item.name + ' from the item.'} trigger={<Button color='red' icon='remove' onClick={() => { Database.ref('/campaigns/'+this.props.campaign.key).child('turnorder/'+item.id).remove() }} />} />
            </Button.Group>
          </Item.Extra>
        </Item.Content>
      </Item>
    )
  }

  remove = (type, key) => {
    Database.ref('/campaigns/'+this.props.campaign.key).child('turnorder/'+this.props.item.id+'/'+type+'/'+key).remove()
  }

  renderName = (item) => {
    if(item.name){
      if(item.monster){
        return <MonsterModal monster={item} trigger={<span style={{textDecoration: 'underline', cursor: 'pointer'}}>{item.name}</span>} />
      }else{
        return item.name
      }
    }else{
      return <Input placeholder='Name' type='text' name='name' onBlur={this.handleInput} onKeyDown={this.handleInput} transparent />
    }
  }

  rollInitiative = (item) => {
    var dex = (item.dexterity) ? calculateMod(item.dexterity).mod : 0
    var roll = Dice.roll(1, 20)

    Database.ref('/campaigns/'+this.props.campaign.key).child('turnorder/'+item.id).update({ initiative: roll+dex })
  }
}
