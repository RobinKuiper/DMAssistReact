import React, { Component } from 'react'

import { pageLimits, formatCR, CRtoEXP } from './../Lib/Common'
import { Auth, Database } from './../Lib/firebase'

import AdSense from 'react-adsense'

import Panel from './../Components/UI/Panel'
import MonsterModal from './../Components/MonsterModal'
import Encounters from './../Components/Encounters'

import { Button, Dropdown, Grid, Header, Input, Popup } from 'semantic-ui-react'
import Table from './../Components/UI/Table'


import { PaginatorButtons } from './../Components/Paginator'

import CreateMonster from './../Components/CreateMonster'

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

  render() {
    return (
      <main>
      { !this.state.isCreatingMonster ? (
        <Grid columns={2} stackable>
          <Grid.Column width={11}>
            <Panel title={'Monsters'} content={this.renderContent} footer={this.renderFooter} />
          </Grid.Column>

          <Grid.Column width={5}>
            <Encounters ref={instance => { this.encounters = instance }} encounters={this.props.encounters} setEncounter={(encounterActive) => this.setState({ encounterActive }) } />
          </Grid.Column>
        </Grid>
      ) : <CreateMonster /> }
      </main>
    )
  }

  toggleCustom = () => {
    //this.setState({ custom: checked, filteredMonsters: (checked) ? this.state.custom_monsters : this.props.monsters })
    const custom = !this.state.custom
    const filteredMonsters = (custom) ? this.state.custom_monsters : this.props.monsters
    this.setState({ custom, filteredMonsters })
  }

  renderContent = () => {
    var monsters = (this.state.filteredMonsters.length === 0) ? this.props.monsters : this.state.filteredMonsters

    const tableConfig = {
      headerCells: [
        { content: 'CR', sortName: 'challenge_rating' },
        { content: 'Name', sortName: 'name' },
        { content: 'HP', sortName: 'hit_points' },
        { content: 'AC', sortName: 'armor_class' },
        { content: 'Exp', sortName: 'challenge_rating' },
        { content: '' }
      ],
      bodyRows: []
    }

    tableConfig.bodyRows = monsters.sort(this.compare.bind(this)).slice(this.state.page*this.state.limit, this.state.limit*(this.state.page+1)).map(monster => {
      return {
        key: monster.slug,
        cells: [
          { content: formatCR(monster.challenge_rating) },
          { content: (<div>
            <MonsterModal monster={monster} trigger={<Header sub style={{cursor: 'pointer'}}>{monster.name}</Header>} />
            <span style={{fontSize: '8pt'}}>{monster.alignment} - {monster.size} {monster.type}</span>
          </div>) },
          { content: monster.hit_points },
          { content: monster.armor_class },
          { content: CRtoEXP(monster.challenge_rating) + ' XP' },
          { content: Auth.currentUser && this.state.encounterActive && (<Popup content='Add to encounter' trigger={<Button icon='plus' size='mini' onClick={() => this.encounters.addMonster(monster) } />} />) }
        ]
      }
    })

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

        <Table color='purple' headerCells={tableConfig.headerCells} bodyRows={tableConfig.bodyRows} />

        { process.env.NODE_ENV !== "development" &&
          <AdSense.Google client='ca-pub-2044382203546332' slot='7541388493' style={{marginTop: 40, width: 728, height: 90}} />
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
