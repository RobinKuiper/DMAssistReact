import React, { Component } from 'react'
import firebase, { Auth } from './../Lib/firebase'
import { LIMIT } from './../Lib/Common'
import { Button, Dropdown, Grid, Icon, Input, List, Segment, Table } from 'semantic-ui-react'
import Panel from './Panel'

export default class Campaign extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: null,
      campaign: null,
      loaded: false,
      dropdownLoaded: false,
      monsterOptions: [],
      monsters: []
    }
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
                      <Button icon='undo' />
                      <Button>00:00</Button>
                    </Button.Group>

                    <Button.Group size='mini' color='blue' floated='left' basic vertical>
                      <Button icon='plus' content='Short Rest' />
                      <Button icon='plus' content='Long Rest' />
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

  addToTurnorder = (e, { searchQuery, value }) => {
    var turnorder = (this.state.campaign.turnorder) ? this.state.campaign.turnorder : [];
    turnorder.push(this.state.monsters.find((monster) => { return monster.slug === value }))
    firebase.database().ref('userdata/'+this.state.user.uid+'/campaigns/'+this.state.campaign.slug+'/turnorder').set(turnorder)
  }

  content = () => (
    <div>
      <Grid columns={3}>
        <Grid.Column width={10}>
          <Dropdown placeholder='Add Monster' fluid search selection options={this.state.monsterOptions} onChange={this.addToTurnorder.bind(this)} />
        </Grid.Column>

        <Grid.Column width={2}>
          Round Info
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
              <Button size='mini' color='blue' icon='undo' inverted />
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
          { this.state.campaign.turnorder ? (
              this.state.campaign.turnorder.map((item, i) => (
                <Table.Row key={i}>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>
                  { item.initiative ? (
                    item.initiative
                  ) : (
                    <div>
                      <Input placeholder='Initiative' type='number' transparent />
                      <Button size='mini' color='blue' icon='undo' inverted />
                    </div>
                  )}
                  </Table.Cell>
                  <Table.Cell>{item.level}</Table.Cell>
                  <Table.Cell>
                  { item.hit_points ? (
                    <Button.Group size='mini'>
                      <Button color='red' icon='minus' />
                      <Button content={item.hit_points} />
                      <Button color='green' icon='plus' />
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
                      <Button color='blue' icon='checkmark' />
                      <Button color='red' icon='remove' />
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
                <List.Item>Round: 0</List.Item>
                <List.Item>Time: 00:00</List.Item>
              </List>
            </Table.HeaderCell>

            <Table.HeaderCell colSpan={4}>
              <Button.Group size='mini' floated='right'>
                <Button color='green' icon='plus' />
                <Button color='red' icon='undo' content='Reset' />
              </Button.Group>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </div>
  )

  componentDidMount() {
    const slug = this.props.match.params.campaignSlug
    Auth.onAuthStateChanged((user) => {
      if (user){
        this.setState({ user })
        firebase.database().ref('userdata/'+user.uid+'/campaigns/'+slug)
          .on('value', snapshot => {
            // Update React state when campaign is added to the firebase database
            this.setState({ campaign: snapshot.val(), loaded: true })
          })
      }
    })
  }
}
