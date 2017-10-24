import React, { Component } from 'react'
import firebase, { Auth } from './../Lib/firebase'
import { LIMIT, calculateMod, formatTime, toSeconds } from './../Lib/Common'
import Dice from './../Lib/Dice'
import { Button, Dropdown, Grid, Icon, Input, List, Segment, Table } from 'semantic-ui-react'
import Panel from './Panel'
import MonsterModal from './../Components/MonsterModal'

export default class Campaign extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: null,
      campaign: null,
      turnorder: null,
      loaded: false,
      dropdownLoaded: false,
      monsterOptions: [],
      monsters: [],
      campaignRef: null,
      turnorderRef: null
    }

    this.rollInitiative = this.rollInitiative.bind(this)
    this.addTime = this.addTime.bind(this)
  }

  componentWillMount(){
    // Create reference to messages in firebase database
    let monstersRef = firebase.database().ref('monsters').orderByKey().limitToLast(LIMIT);
    monstersRef.on('child_added', snapshot => {
      // Update React state message is added to the firebase database
      let monster = snapshot.val()
      let option = {
        key: monster.slug,
        value: monster.slug,
        text: monster.name
      }
      var monsterOptions = [option].concat(this.state.monsterOptions);
      var monsters = [monster].concat(this.state.monsters)
      this.setState({ monsterOptions, monsters, dropdownLoaded: true  })
    })
  }

  render() {
    const campaign = this.state.campaign

    if(campaign){
      return (
        <main>
          <Grid columns={1}>
            <Grid.Row>
              <Grid.Column>
                <Panel title={campaign.name} content={this.content} loaded={this.state.loaded} loading={!this.state.loaded} />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column>
              <Segment raised>
                <Grid columns={2}>
                  <Grid.Column width={6}>
                    <Button.Group size='massive' color='blue' floated='left'>
                      <Button icon='undo' onClick={() => { this.state.campaignRef.child('/times/session').set(0) }}/>
                      <Button>{formatTime(campaign.times.session)}</Button>
                    </Button.Group>

                    <Button.Group size='mini' color='blue' floated='left' basic vertical>
                      <Button icon='plus' content='Short Rest' onClick={() => { this.addTime(campaign.settings.shortRest) }} />
                      <Button icon='plus' content='Long Rest' onClick={() => { this.addTime(campaign.settings.longRest) }} />
                    </Button.Group>
                  </Grid.Column>

                  <Grid.Column width={10}>
                    Public Link
                  </Grid.Column>
                </Grid>
              </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </main>
      )
    }

    return <div>Loading...</div>
  }

  addTime = (time) => {
    var time = toSeconds(time)
    var campaign = this.state.campaign
    campaign.times.total += time
    campaign.times.session += time
    this.state.campaignRef.set(campaign)
  }

  addToTurnorder = (item) => {
    item = (item.name) ? item : { name: '' }
    this.state.campaignRef.child('turnorder').push(item)
  }

  addMonsterToTurnorder = (e, { searchQuery, value }) => {
    let monster = this.state.monsters.find((monster) => { return monster.slug === value })
    monster.monster = true
    this.addToTurnorder(monster)
  }

  rollInitiative = (item) => {
    var dex = (item.dexterity) ? calculateMod(item.dexterity) : 0
    var roll = Dice.roll(1, 20)

    this.state.campaignRef.child('turnorder/'+item.id).update({ initiative: roll+dex })
  }

  resetTurnorder = () => {
    var campaign = this.state.campaign
    campaign.times.encounter = 0
    campaign.round = 0
    campaign.turnorder = (campaign.players) ? campaign.players : null
    this.state.campaignRef.set(campaign)
  }

  compare(a,b){
    var x = a.done === b.done ? 0 : a.done ? 1 : -1
    return x === 0 ? a.initiative < b.initiative : x
  }

  content = () => (
    <div>
      <Grid columns={3}>
        <Grid.Column width={10}>
          <Dropdown placeholder='Add Monster' fluid search selection options={this.state.monsterOptions} onChange={this.addMonsterToTurnorder.bind(this)} />
        </Grid.Column>

        <Grid.Column width={2}>
          <List>
            <List.Item>Round: {this.state.campaign.round}</List.Item>
            <List.Item>Time: {formatTime(this.state.campaign.times.encounter)}</List.Item>
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
          { this.state.turnorder ? (
              this.state.turnorder.sort(this.compare).map((turnorder) => (
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
                      <Button color='red' icon='minus' onClick={() => { this.state.campaignRef.child('turnorder/'+turnorder.id).update({ hit_points: turnorder.hit_points-1 }) }} />
                      <Button content={turnorder.hit_points} />
                      <Button color='green' icon='plus' onClick={() => { this.state.campaignRef.child('turnorder/'+turnorder.id).update({ hit_points: turnorder.hit_points+1 }) }} />
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
                      <Button color='blue' icon='checkmark' onClick={() => { this.state.campaignRef.child('turnorder/'+turnorder.id).update({ done: true }) }} />
                      <Button color='red' icon='remove' onClick={() => { this.state.campaignRef.child('turnorder/'+turnorder.id).remove() }} />
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
                <List.Item>Round: {this.state.campaign.round}</List.Item>
                <List.Item>Time: {formatTime(this.state.campaign.times.encounter)}</List.Item>
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

  componentDidMount() {
    const slug = this.props.match.params.campaignSlug
    Auth.onAuthStateChanged((user) => {
      if (user){
        this.setState({ user })
        var campaignRef = firebase.database().ref('userdata/'+user.uid+'/campaigns/'+slug);
        var turnorderRef = campaignRef.child('turnorder');
        campaignRef.on('value', snapshot => {
          var campaign = snapshot.val()

          if(campaign.turnorder){
            var turnorder = []
            var done = true
            Object.keys(campaign.turnorder).map(key => {
              var t = campaign.turnorder[key]
              t.id = key
              turnorder.push(t)

              if(!t.done){ done = false }
            })

            if(done){
              for (var i = 0; i < turnorder.length; i++) {
                turnorder[i].done = false
              }
              campaign.round = (campaign.round) ? campaign.round + 1 : 1
              campaign.times.encounter += parseInt(campaign.settings.roundDuration)
              campaign.times.session += parseInt(campaign.settings.roundDuration)
              campaign.times.total += parseInt(campaign.settings.roundDuration)
              campaign.turnorder = turnorder
              campaignRef.set(campaign)
            }
          }
          // Update React state when campaign is added to the firebase database
          this.setState({ campaign, campaignRef, turnorder, turnorderRef, loaded: true })
        });
      }
    })
  }
}
