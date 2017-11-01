import React, { Component } from 'react'

import { pageLimits, formatCR, CRtoEXP } from './../Lib/Common'
import { Auth, Database } from './../Lib/firebase'

import Adsense from './../Components/Adsense'

import Panel from './../Components/UI/Panel'
import MonsterModal from './../Components/MonsterModal'
import Encounters from './../Components/Encounters'

import { Button, Dropdown, Grid, Header, Icon, Input, Popup, Table } from 'semantic-ui-react'

import { PaginatorButtons } from './../Components/Paginator'

import CreateMonster from './../Components/CreateMonster'

import AlertContainer from 'react-alert'

export default class Monsters extends Component {
  constructor(props){
    super(props)

    this.changeSortBy = this.changeSortBy.bind(this);

    this.state = {
      searchQuery: '',
      filteredMonsters: [],
      custom_monsters: [],
      sortBy: 'name',
      sortOrder: 'ascending',
      limit: 10,
      page: 0,
      toEncounterMonster: null,
      encounterActive: false,
      isCreatingMonster: false //false
    }
  }

  alertOptions = {
    offset: 14,
    position: 'top left',
    theme: 'dark',
    time: 5000,
    transition: 'scale'
  }

  showAlert = (message, type, icon, time = 5000) => {
      this.msg.show(message, {
          time,
          type,
          icon: <Icon name={icon} />
      })
  }

  render() {
    return (
      <main>
      <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      { !this.state.isCreatingMonster ? (
        <Grid columns={2} stackable>
          <Grid.Column width={11}>
            <Panel title={'Monsters'} content={this.renderContent} footer={this.renderFooter} />
          </Grid.Column>

          <Grid.Column width={5}>
            <Encounters ref={instance => { this.encounters = instance }} encounters={this.props.encounters} setEncounter={(encounterActive) => this.setState({ encounterActive }) } />
          </Grid.Column>
        </Grid>
      ) : (
        <CreateMonster onSuccess={() => {
          this.toggleCustom('show')
          this.setState({ isCreatingMonster: false })
          this.showAlert('Your monster is saved!', 'success', 'checkmark')
        }} />
      )}
      </main>
    )
  }

  toggleCustom = (type) => {
    //this.setState({ custom: checked, filteredMonsters: (checked) ? this.state.custom_monsters : this.props.monsters })
    const custom = type === 'show' ? true : type === 'hide' ? false : !this.state.custom
    const filteredMonsters = (custom) ? this.state.custom_monsters : this.props.monsters
    this.setState({ custom, filteredMonsters })
  }

  renderContent = () => {
    var monsters = (this.state.filteredMonsters.length === 0) ? this.props.monsters : this.state.filteredMonsters

    return (
      <div>
        <Grid columns={5}>
          <Grid.Column width={3}>
            <PaginatorButtons page={this.state.page} totalPages={Math.ceil(monsters.length/this.state.limit)} handlePageChange={(page) => { this.setState({page}) }}/>
            {/*<Popup content='Show your custom monsters' trigger={<Checkbox toggle label='Custom' name='custom' checked={this.state.custom} onChange={this.toggleCustom} />} />*/}
          </Grid.Column>
          <Grid.Column width={5}>
            <Input fluid icon='search' placeholder='Search name, alignment, size, type, etc.' value={this.state.searchQuery} onChange={this.search.bind(this)} />
          </Grid.Column>
          <Grid.Column textAlign='right' width={3}>
            <Popup content='Show your custom monsters' trigger={<Button content={this.state.custom ? 'Custom: On' : 'Custom: Off'} color='blue' name='custom' active={this.state.custom} onClick={this.toggleCustom} />} />
          </Grid.Column>
          <Grid.Column textAlign='right' width={3}>
            <Popup content='Create a new custom monster.' trigger={<Button icon='plus' color='green' content='Create' onClick={() => this.setState({ isCreatingMonster: true })} />} />
          </Grid.Column>
          <Grid.Column textAlign='right' width={2}>
            <Dropdown compact selection options={pageLimits} defaultValue={this.state.limit} onChange={this.changeLimit.bind(this)} />
          </Grid.Column>
        </Grid>

        <Table color='purple' selectable sortable unstackable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell sorted={this.state.sortBy === 'challenge_rating' ? this.state.sortOrder : null} onClick={() => { this.changeSortBy('challenge_rating') }}>
                CR
              </Table.HeaderCell>
              <Table.HeaderCell sorted={this.state.sortBy === 'name' ? this.state.sortOrder : null} onClick={() => { this.changeSortBy('name') }}>
                Name
              </Table.HeaderCell>
              <Table.HeaderCell sorted={this.state.sortBy === 'hit_points' ? this.state.sortOrder : null} onClick={() => { this.changeSortBy('hit_points') }}>
                HP
              </Table.HeaderCell>
              <Table.HeaderCell sorted={this.state.sortBy === 'armor_class' ? this.state.sortOrder : null} onClick={() => { this.changeSortBy('armor_class') }}>
                AC
              </Table.HeaderCell>
              <Table.HeaderCell sorted={this.state.sortBy === 'challenge_rating' ? this.state.sortOrder : null} onClick={() => { this.changeSortBy('challenge_rating') }}>
                Exp
              </Table.HeaderCell>
              { Auth.currentUser && this.state.encounterActive &&
                <Table.HeaderCell></Table.HeaderCell>
              }
            </Table.Row>
          </Table.Header>

          <Table.Body>
            { monsters.length > 0 ?
                monsters.sort(this.compare.bind(this)).slice(this.state.page*this.state.limit, this.state.limit*(this.state.page+1)).map(monster => (
                  <Table.Row key={monster.slug}>
                    <Table.Cell>{formatCR(monster.challenge_rating)}</Table.Cell>
                    <Table.Cell>
                      <div>
                        <MonsterModal monster={monster} trigger={<Header sub style={{cursor: 'pointer'}}>{monster.name}</Header>} />
                        <span style={{fontSize: '8pt'}}>{monster.alignment} - {monster.size} {monster.type}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>{monster.hit_points}</Table.Cell>
                    <Table.Cell>{monster.armor_class}</Table.Cell>
                    <Table.Cell>{CRtoEXP(monster.challenge_rating) + ' XP'}</Table.Cell>
                    { Auth.currentUser && this.state.encounterActive &&
                      <Table.Cell>{(<Popup content='Add to encounter' trigger={<Button icon='plus' size='mini' onClick={() => this.encounters.addMonster(monster) } />} />)}</Table.Cell>
                    }
                  </Table.Row>
                ))
              : (
                <Table.Row>
                  <Table.Cell colSpan={5}>No monsters found.</Table.Cell>
                </Table.Row>
              )
            }
          </Table.Body>
        </Table>

        { process.env.NODE_ENV !== "development" &&
          <Adsense client='ca-pub-2044382203546332' slot='7541388493' style={{marginTop: 40, width: 728, height: 90}} />
        }
      </div>
    )
  }

  renderFooter = () => {
    var monsters = (this.state.filteredMonsters.length === 0) ? this.props.monsters : this.state.filteredMonsters
    return (
      <div>
        <PaginatorButtons page={this.state.page} totalPages={Math.ceil(monsters.length/this.state.limit)} handlePageChange={(page) => { this.setState({page}) }}/>
        <span style={{float: 'right'}}>Total Monsters: {monsters.length}</span>
      </div>
    )
  }

  changeLimit = (e, { value }) => this.setState({ page: 0, limit: value })

  changeSortBy(to){
    if(to === this.state.sortBy){
      this.setState({ sortOrder: (this.state.sortOrder === 'ascending') ? 'descending' : 'ascending' })
    }else{
      this.setState({ sortBy: to })
    }
  }

  compare(a,b){
    var A = a[this.state.sortBy];
    var B = b[this.state.sortBy];

    A = (typeof A === "string") ? A.toUpperCase() : A;
    B = (typeof B === "string") ? B.toUpperCase() : B;

    let comparison = 0;
    if(A > B){
      comparison = 1;
    }else if (A < B){
      comparison = -1;
    }

    comparison *= (this.state.sortOrder === 'ascending') ? 1 : -1

    return comparison;
  }


  search(e){
    this.setState({ searchQuery: e.target.value })
    const m = (this.state.custom) ? this.state.custom_monsters : this.props.monsters

    if(e.target.value === ''){
      this.setState({ filteredMonsters: m })
      return;
    }else{
      var monsters = m.filter((monster) => monster.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        monster.type.toLowerCase().includes(e.target.value.toLowerCase()) ||
        monster.alignment.toLowerCase().includes(e.target.value.toLowerCase()) ||
        monster.size.toLowerCase().includes(e.target.value.toLowerCase())
      )

      this.setState({ filteredMonsters: monsters })
    }
  }

  componentDidMount = () => {
    Auth.onAuthStateChanged((user) => {
      if (user){
        const cmRef = Database.ref('userdata/'+user.uid+'/monsters/')
        cmRef.on('child_added', snapshot => {
          snapshot.val().id = snapshot.key
          this.setState({ custom_monsters: [snapshot.val()].concat(this.state.custom_monsters) })
        })
      }
    })
  }
}
