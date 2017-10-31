import React, { Component } from 'react'
import { Button, Input, Popup, Table } from 'semantic-ui-react'
import MonsterModal from './../MonsterModal'
import { calculateMod } from './../../Lib/Common'
import Dice from './../../Lib/Dice'

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
    this.setState({ tempHP: this.state.increaseHP ? this.state.tempHP+1 : this.state.tempHP-1 })
    this.t = setTimeout(this.repeat, this.start)
    this.start = this.start / 1.01
  }

  increaseHP = () => {
    this.setState({ increaseHP: true })
    this.repeat()
  }

  decreaseHP = () => {
    this.setState({ increaseHP: false })
    this.repeat()
  }

  onMouseUp = () => {
      clearTimeout(this.t)
      this.start = 100
      this.props.campaignRef.child('turnorder/'+this.props.item.id).update({ hit_points: parseInt(this.state.tempHP, 10) })
  }

  render() {
    var item = this.props.item

    return (
      <Table.Row key={item.id}>
        <Table.Cell className={item.done ? 'strikethrough' : ''}>
          {this.renderName(item)}
        </Table.Cell>
        <Table.Cell>
        { item.initiative ? (
          item.initiative
        ) : (
          <div>
            <Input placeholder='Initiative' type='number' transparent />
            <Popup content={'Roll initiative for ' + item.name} trigger={<Button size='mini' color='blue' icon='undo' inverted onClick={() => {this.rollInitiative(item) }} />} />
          </div>
        )}
        </Table.Cell>
        <Table.Cell>{item.level}</Table.Cell>
        <Table.Cell>
        { item.hit_points ? (
          <Button.Group size='mini'>
            <Popup content='Decrease Hit Points' trigger={<Button color='red' icon='minus' onMouseDown={this.decreaseHP.bind(this)} onMouseUp={this.onMouseUp} />} />{/*onClick={() => { this.props.campaignRef.child('turnorder/'+item.id).update({ hit_points: parseInt(item.hit_points, 10)-1 }) }}*/}
            <Popup position='center top' trigger={<Button content={this.state.tempHP || item.hit_points} />} on='click' hoverable content={<Input placeholder='5, -6, etc' type='number' onKeyDown={(e) => {if(e.keyCode === 13) {
              var newHP = parseInt(item.hit_points, 10)+parseInt(e.target.value, 10)
              this.setState({ tempHP: newHP })
              this.props.campaignRef.child('turnorder/'+item.id).update({ hit_points: newHP })
            }} } />} />
            <Popup content='Increase Hit Points' trigger={<Button color='green' icon='plus' onMouseDown={this.increaseHP.bind(this)} onMouseUp={this.onMouseUp} />} />
          </Button.Group>
        ) : (
          <Input placeholder='Hit points' type='number' transparent />
        )}
        </Table.Cell>
        <Table.Cell>{item.armor_class}</Table.Cell>
        <Table.Cell></Table.Cell>
        <Table.Cell></Table.Cell>
        <Table.Cell></Table.Cell>
        <Table.Cell>
          <Button.Group size='mini'>
            <Popup content={'Done, ' + item.name + '\'s turn is over.'} trigger={<Button color='blue' icon='checkmark' onClick={() => { this.props.campaignRef.child('turnorder/'+item.id).update({ done: true }) }} />} />
            <Popup content={'Remove ' + item.name + ' from the item.'} trigger={<Button color='red' icon='remove' onClick={() => { this.props.campaignRef.child('turnorder/'+item.id).remove() }} />} />
          </Button.Group>
        </Table.Cell>
      </Table.Row>
    )
  }

  renderName = (item) => {
    if(item.name){
      if(item.monster){
        return <MonsterModal monster={item} trigger={<span style={{textDecoration: 'underline', cursor: 'pointer'}}>{item.name}</span>} />
      }else{
        return item.name
      }
    }else{
      return <Input placeholder='Name' type='number' transparent />
    }
  }

  rollInitiative = (item) => {
    var dex = (item.dexterity) ? calculateMod(item.dexterity).mod : 0
    var roll = Dice.roll(1, 20)

    this.props.campaignRef.child('turnorder/'+item.id).update({ initiative: roll+dex })
  }
}
