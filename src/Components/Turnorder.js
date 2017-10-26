import React, { Component } from 'react'
import { Button, Dropdown, Grid, Input, List, Table } from 'semantic-ui-react'

import { formatTime, calculateMod } from './../Lib/Common'
import Dice from './../Lib/Dice'

import Panel from './../Containers/Panel'
import MonsterModal from './MonsterModal'

export default class Turnorder extends Component {
  constructor(props) {
    super(props)

    this.state = {
      monsterOptions: props.monsters.map(monster => {
        return {
          key: monster.slug,
          value: monster.slug,
          text: monster.name
        }
      })
    }

    this.rollInitiative = this.rollInitiative.bind(this)
  }

  render() {
    return <Panel title={this.props.campaign.name} content={this.content} loaded={true} />
  }

  content = () => {
    /*const tableConfig = {
      headerCells: [
        { content: 'Name', sortName: 'name' },
        { content: 'Initiative', sortName: 'initiative' },
        { content: 'Level', sortName: 'level' },
        { content: 'HP', sortName: 'hit_points' },
        { content: 'AC', sortName: 'armor_class' },
        { content: 'Buffs', sortName: 'buffs' },
        { content: 'Conditions', sortName: 'conditions' },
        { content: 'Concentration', sortName: 'concentration' },
        { content: '' },
      ],
      bodyRows: []
    }

    this.props.campaign.turnorder.sort(this.compare.bind(this)).map(item => {
      tableConfig.bodyRows.push({
        key: item.id,
        cells: [
          { content: this.renderName(item) },
          { content: item.initiative },
          { content: item.level },
          { content: item.hit_points },
          { content: item.armor_class },
          { content: '' },
          { content: '' },
          { content: '' },
          { content: '' },
        ]
      })
    });*/

    return (
      <div>
        <Grid columns={3}>
          <Grid.Column width={10}>
            <Dropdown placeholder='Add Monster' fluid search selection options={this.state.monsterOptions} onChange={this.addMonsterToTurnorder.bind(this)} />
          </Grid.Column>

          <Grid.Column width={2}>
            <List>
              <List.Item>Round: {this.props.campaign.round}</List.Item>
              <List.Item>Time: {formatTime(this.props.campaign.times.encounter)}</List.Item>
            </List>
          </Grid.Column>

          <Grid.Column width={4}>
            EncounterDropdown
          </Grid.Column>
        </Grid>

        <Table color='black' compact size='small'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>
                Initiative
                {/*<Button size='mini' color='blue' icon='undo' inverted />*/}
              </Table.HeaderCell>
              <Table.HeaderCell>Level</Table.HeaderCell>
              <Table.HeaderCell>HP</Table.HeaderCell>
              <Table.HeaderCell>AC</Table.HeaderCell>
              <Table.HeaderCell>Buffs</Table.HeaderCell>
              <Table.HeaderCell>Conditions</Table.HeaderCell>
              <Table.HeaderCell>Concentration</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            { this.props.campaign.turnorder ? (
                Object.keys(this.props.campaign.turnorder).map(key => this.props.campaign.turnorder[key]).sort(this.compare).map((turnorder) => (
                  <Table.Row key={turnorder.id}>
                    <Table.Cell className={turnorder.done ? 'strikethrough' : ''}>
                      {this.renderName(turnorder)}
                    </Table.Cell>
                    <Table.Cell>
                    { turnorder.initiative ? (
                      turnorder.initiative
                    ) : (
                      <div>
                        <Input placeholder='Initiative' type='number' transparent />
                        <Button size='mini' color='blue' icon='undo' inverted onClick={() => {this.rollInitiative(turnorder) }} />
                      </div>
                    )}
                    </Table.Cell>
                    <Table.Cell>{turnorder.level}</Table.Cell>
                    <Table.Cell>
                    { turnorder.hit_points ? (
                      <Button.Group size='mini'>
                        <Button color='red' icon='minus' onClick={() => { this.props.campaignRef.child('turnorder/'+turnorder.id).update({ hit_points: parseInt(turnorder.hit_points)-1 }) }} />
                        <Button content={turnorder.hit_points} />
                        <Button color='green' icon='plus' onClick={() => { this.props.campaignRef.child('turnorder/'+turnorder.id).update({ hit_points: parseInt(turnorder.hit_points)+1 }) }} />
                      </Button.Group>
                    ) : (
                      <Input placeholder='Hit points' type='number' transparent />
                    )}
                    </Table.Cell>
                    <Table.Cell>{turnorder.armor_class}</Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell>
                      <Button.Group size='mini'>
                        <Button color='blue' icon='checkmark' onClick={() => { this.props.campaignRef.child('turnorder/'+turnorder.id).update({ done: true }) }} />
                        <Button color='red' icon='remove' onClick={() => { this.props.campaignRef.child('turnorder/'+turnorder.id).remove() }} />
                      </Button.Group>
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={9}>Add items to your turnorder.</Table.Cell>
                </Table.Row>
              )
            }
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan={5}>
                <List horizontal>
                  <List.Item>Round: {this.props.campaign.round}</List.Item>
                  <List.Item>Time: {formatTime(this.props.campaign.times.encounter)}</List.Item>
                </List>
              </Table.HeaderCell>

              <Table.HeaderCell colSpan={4}>
                <Button.Group size='mini' floated='right'>
                  <Button color='green' icon='plus' onClick={this.addToTurnorder.bind(this)} />
                  <Button color='red' icon='undo' content='Reset' onClick={this.resetTurnorder.bind(this)} />
                </Button.Group>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </div>
    )
  }

  compare(a,b){
    var x = a.done === b.done ? 0 : a.done ? 1 : -1
    return x === 0 ? a.initiative < b.initiative : x
  }

  addToTurnorder = (item) => {
    item = (item.name) ? item : { name: '' }
    this.props.campaignRef.child('turnorder').push(item)
  }

  addMonsterToTurnorder = (e, { searchQuery, value }) => {
    let monster = this.props.monsters.find((monster) => { return monster.slug === value })
    monster.monster = true
    this.addToTurnorder(monster)
  }

  resetTurnorder = () => {
    var campaign = this.props.campaign
    campaign.times.encounter = 0
    campaign.round = 0
    campaign.turnorder = (campaign.players) ? campaign.players : null
    this.props.campaignRef.set(campaign)
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
