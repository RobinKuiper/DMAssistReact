import React, { Component } from 'react'
import { Button, Dropdown, Grid, Item, List, Popup, Table } from 'semantic-ui-react'

import { formatTime } from './../../Lib/Common'
import { Auth, Database } from './../../Lib/firebase'

import Panel from './../UI/Panel'
import TurnorderTableItem from './TurnorderTableItem'
import TurnorderItem from './TurnorderItem'

import { Mobile, Default } from './../../Lib/Responsive'

export default class Turnorder extends Component {
  constructor(props) {
    super(props)

    this.state = {
      encounters: {},
      monsters: [],
      monsterOptions: [],
      encounterOptions: [],
      loadingMonsters: true,
      loadingEncounters: true
    }
  }

  render() {
    return (
      <div>
        <Mobile>
          <Panel title='Turn Order' content={this.mobileContent} closeable />
        </Mobile>
        
        <Default>
          <Panel title='Turn Order' content={this.content} closeable />
        </Default>
      </div>
    )
  }

  mobileContent = () => (
    <div>
      <Dropdown style={{marginBottom: 10}} placeholder='Add Monster' fluid search selection options={this.state.monsterOptions} onChange={this.addMonsterToTurnorder.bind(this)} loading={this.state.loadingMonsters} />
      <Dropdown style={{marginBottom: 10}} button color='green' fluid text='Add Encounter' options={this.state.encounterOptions} onChange={this.addEncounterToTurnorder.bind(this)} disabled={!this.state.encounterOptions || this.state.encounterOptions.length === 0} loading={this.state.loadingEncounters} />

      <List horizontal style={{borderBottom: '1px solid #f1f1f1', width: '100%'}}>
        <List.Item>Round: {this.props.campaign.round}</List.Item>
        <List.Item>Time: {formatTime(this.props.campaign.times.encounter)}</List.Item>
      </List>

      <Item.Group divided relaxed>
      { this.props.campaign.turnorder ? (
          Object.keys(this.props.campaign.turnorder).map(key => {this.props.campaign.turnorder[key].id = key; return this.props.campaign.turnorder[key]}).sort(this.compare).map((turnorder) => (
            <TurnorderItem key={turnorder.id} item={turnorder} campaign={this.props.campaign} setDone={() => this.setDone(turnorder.id)} />
          ))
        ) : (
          <Item>
            <Item.Content>
              <Item.Description>Add items to your turnorder.</Item.Description>
            </Item.Content>
          </Item>
        )
      }
      </Item.Group>

      <Button.Group style={{borderTop: '1px solid #f1f1f1', width: '100%', paddingTop: 20}}>
        <Popup content='Reset the turnorder' trigger={<Button color='red' icon='undo' content='Reset' onClick={this.resetTurnorder.bind(this)} />} />
      </Button.Group>
    </div>
  )

  content = () => {
    return (
      <div>
        <Grid columns={3} stackable>
          <Grid.Column width={10}>
            <Dropdown placeholder='Add Monster' fluid search selection options={this.state.monsterOptions} onChange={this.addMonsterToTurnorder.bind(this)} loading={this.state.loadingMonsters} />
          </Grid.Column>

          <Grid.Column width={2}>
            <List>
              <List.Item>Round: {this.props.campaign.round}</List.Item>
              <List.Item>Time: {formatTime(this.props.campaign.times.encounter)}</List.Item>
            </List>
          </Grid.Column>

          <Grid.Column width={4} textAlign='right'>
            <Dropdown button color='green' text='Add Encounter' options={this.state.encounterOptions} onChange={this.addEncounterToTurnorder.bind(this)} disabled={!this.state.encounterOptions || this.state.encounterOptions.length === 0} loading={this.state.loadingEncounters} />
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
                Object.keys(this.props.campaign.turnorder).map(key => {this.props.campaign.turnorder[key].id = key; return this.props.campaign.turnorder[key]}).sort(this.compare).map((turnorder) => (
                  <TurnorderTableItem key={turnorder.id} item={turnorder} campaign={this.props.campaign} setDone={() => this.setDone(turnorder.id)} />
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
                  <Popup content='Add an empty item to the turnorder.' trigger={<Button color='green' icon='plus' onClick={() => this.addToTurnorder(null)} />} />
                  <Popup content='Reset the turnorder' trigger={<Button color='red' icon='undo' content='Reset' onClick={this.resetTurnorder.bind(this)} />} />
                </Button.Group>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </div>
    )
  }

  setDone = (id) => {
    const campaign = this.props.campaign
    const turnorder = campaign.turnorder

    let done = true
    for(var key in turnorder){
      if(key === id) turnorder[key].done = true
      if(turnorder[key].done === false) done = false
    }

    if(!done) Database.ref('/campaigns/'+campaign.key).child('turnorder/'+id).update({ done: true })
    else this.nextRound(turnorder)
  }

  nextRound = (turnorder) => {
    const campaign = this.props.campaign
    const roundDuration = parseInt(campaign.settings.roundDuration, 10)

    const types = ['buffs', 'concentrations', 'conditions']

    for(var key in turnorder) {
      turnorder[key].done = false

      for(var i = 0; i < types.length; i++)
      if(turnorder[key][types[i]]){
        for(var bKey in turnorder[key][types[i]]){
          if(turnorder[key][types[i]][bKey].time) turnorder[key][types[i]][bKey].time -= roundDuration
          if(turnorder[key][types[i]][bKey].time <= 0) turnorder[key][types[i]][bKey] = null
        }
      }
    }

    const update = {
      round: campaign.round ? campaign.round + 1 : 1,
      times: {
        encounter: campaign.times.encounter + roundDuration,
        session: campaign.times.session + roundDuration,
        total: campaign.times.total + roundDuration
      },
      turnorder
    }
  
    Database.ref('/campaigns/'+campaign.key).update(update)
  }

  compare(a,b){
    // Set the right values (int, everything there, etc.)
    const iniA = parseInt(a.initiative, 10), iniB = parseInt(b.initiative, 10),
    doneA = (a.done === undefined) ? false : a.done, doneB = (b.done === undefined) ? false : b.done

    // Compare if item is done
    const done = doneA === doneB ? 0 : doneA ? 1 : -1
    // Compare initiatives
    const initiative = done === 0 ? iniA === iniB ? 0 : iniA < iniB ? 1 : -1 : done
    // Compare if monster
    const monster = initiative === 0 ? a.monster === b.monster ? 0 : a.monster ? 1 : -1 : initiative
    
    // Return last comparement
    return monster
  }

  /**
   * addToTurnorder (Array/Object item, Bool monster)
   */
  addToTurnorder = (item, monster=false) => {
    if(item === null) Database.ref('/campaigns/'+this.props.campaign.key).child('turnorder').push({ name: '', done: false })
    if(!Array.isArray(item)) item = [item]

    for(var i = 0; i < item.length; i++){

      item[i] = (item[i].name) ? item[i] : { name: '' }
      item[i].done = false
      item[i].hit_points = item[i].hit_points ? parseInt(item[i].hit_points, 10) : 0
      item[i].monster = monster

      Database.ref('/campaigns/'+this.props.campaign.key).child('turnorder').push(item[i])
    }
  }

  addMonsterToTurnorder = (e, { searchQuery, value }) => {
    let monster = this.state.monsters.find((monster) => { return monster.key === value })
    this.addToTurnorder(monster, true)
  }

  addEncounterToTurnorder = (e, {q, value}) => {
    Database.ref('encounters').child(value).on('value', snapshot => {
        let encounter = snapshot.val()
        if(encounter.monsters){
          for(var key in encounter.monsters){
            this.addToTurnorder(encounter.monsters[key], true)
          }
        }else alert('There are no monsters in this encounter.')
    })
  }

  resetTurnorder = () => {
    var campaign = this.props.campaign
    campaign.times.encounter = 0
    campaign.round = 0
    campaign.turnorder = null
    Database.ref('/campaigns/'+this.props.campaign.key).set(campaign)

    if(campaign.players) this.addToTurnorder(Object.keys(campaign.players).map(key => {
      let player = campaign.players[key]
      player.player = true
      return player
    }))
  }

  componentWillMount() {
    Database.ref('monsters').on('value', snapshot => {
      let monsters = [], monsterOptions = []
      snapshot.forEach(data => {
        let monster = data.val()
        monster.key = data.key
        monsters.push(monster)

        let option = {
          key: monster.key,
          value: monster.key,
          text: monster.name
        }
        monsterOptions.push(option)
      })
      this.setState({ monsters, monsterOptions, loadingMonsters: false })
    })
  }

  componentDidMount() {
      Auth.onAuthStateChanged((user) => {
          if (user){
              Database.ref('userdata/' + Auth.currentUser.uid + '/encounters/').on('value', snapshot => {
                  let encounters = [], encounterOptions = []
                  snapshot.forEach(data => {
                    let encounter = data.val()
                    encounter.key = data.key
                    encounters.push(encounter)

                    let option = {
                      key: encounter.key,
                      value: encounter.key,
                      text: encounter.name
                    }
                    encounterOptions.push(option)
                  })
                  this.setState({ encounters, encounterOptions, loadingEncounters: false })
              })
          }
      })
  }
}
