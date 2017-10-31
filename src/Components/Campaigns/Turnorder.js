import React, { Component } from 'react'
import { Button, Dropdown, Grid, List, Popup, Table } from 'semantic-ui-react'

import { formatTime } from './../../Lib/Common'

import Panel from './../UI/Panel'
import TurnorderItem from './TurnorderItem'

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
  }

  render() {
    return <Panel title='Turn Order' content={this.content} closeable />
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

    var encounterOptions = this.props.encounters.map(encounter => {
      return {
        key: encounter.id,
        value: encounter.id,
        text: encounter.name
      }
    })

    return (
      <div>
        <Grid columns={3} stackable>
          <Grid.Column width={10}>
            <Dropdown placeholder='Add Monster' fluid search selection options={this.state.monsterOptions} onChange={this.addMonsterToTurnorder.bind(this)} />
          </Grid.Column>

          <Grid.Column width={2}>
            <List>
              <List.Item>Round: {this.props.campaign.round}</List.Item>
              <List.Item>Time: {formatTime(this.props.campaign.times.encounter)}</List.Item>
            </List>
          </Grid.Column>

          <Grid.Column width={4} textAlign='right'>
            <Dropdown button color='green' text='Add Encounter' options={encounterOptions} onChange={this.addEncounterToTurnorder.bind(this)} />
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
                  <TurnorderItem key={turnorder.id} item={turnorder} campaignRef={this.props.campaignRef} />
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
                  <Popup content='Add empty item to the turnorder.' trigger={<Button color='green' icon='plus' onClick={this.addToTurnorder.bind(this)} />} />
                  <Popup content='Reset the turnorder' trigger={<Button color='red' icon='undo' content='Reset' onClick={this.resetTurnorder.bind(this)} />} />
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

  addEncounterToTurnorder = (e, {q, value}) => {
    let encounter = this.props.encounters.find(encounter => encounter.id === value)
    if(encounter.monsters){
      for(var key in encounter.monsters){
        encounter.monsters[key].monster = true
        this.addToTurnorder(encounter.monsters[key])
      }
    }else alert('There are no monsters in this encounter.')
  }

  resetTurnorder = () => {
    var campaign = this.props.campaign
    campaign.times.encounter = 0
    campaign.round = 0
    campaign.turnorder = (campaign.players) ? campaign.players : null
    this.props.campaignRef.set(campaign)
  }
}
