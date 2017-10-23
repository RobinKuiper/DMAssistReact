import React, { Component } from 'react'

import { pageLimits } from './../Lib/Common'
import firebase from './../Lib/firebase'

import Panel from './Panel'
import SpellModal from './../Components/SpellModal'

import { Button, Grid, Header, Input, Segment, Dropdown, Table } from 'semantic-ui-react'

export default class Spells extends Component {
  constructor(props){
    super(props)

    this.changeSortBy = this.changeSortBy.bind(this);
    this.changePage = this.changePage.bind(this);

    this.state = {
      searchQuery: '',
      filteredSpells: [],
      sortBy: 'name',
      sortOrder: 'ascending',
      limit: 10,
      page: 0,
      spells: [],
      loaded: false
    }
  }

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

  componentWillMount(){
    // Create reference to messages in firebase database
    let spellsRef = firebase.database().ref('spells').orderByKey();
    spellsRef.on('child_added', snapshot => {
      // Update React state message is added to the firebase database
      let spell = snapshot.val()
      spell.id = snapshot.key
      var spells = [spell].concat(this.state.spells);
      this.setState({ spells: spells, filteredSpells: spells, loaded: true  })
    })
  }

  render() {
    return (
      <main>
        <Grid columns={1}>
          <Grid.Column>
            <Panel title={'Spells'} content={this.renderContent.bind(this)} footer={this.renderFooter} loaded={this.state.loaded} />
          </Grid.Column>
        </Grid>
      </main>
    )
  }

  renderFooter = () => (
    <div>
      <Button.Group size='tiny'>
        <Button icon='chevron left' onClick={() => { this.changePage(-1) }} disabled={this.state.page === 0} />
        <Button>{this.state.page+1} / {Math.ceil(this.state.filteredSpells.length/this.state.limit)}</Button>
        <Button icon='chevron right' onClick={() => { this.changePage(1) }} disabled={this.state.page + 1 >= this.state.filteredSpells.length / this.state.limit } />
      </Button.Group>
      <span style={{float: 'right'}}>Total Spells: {this.state.filteredSpells.length}</span>
    </div>
  )

  renderContent = () => (
    <div>
      <Grid columns={4}>
        <Grid.Column>
          <Button.Group size='tiny'>
            <Button icon='chevron left' onClick={() => { this.changePage(-1) }} disabled={this.state.page === 0} />
            <Button>{this.state.page+1} / {Math.ceil(this.state.filteredSpells.length/this.state.limit)}</Button>
            <Button icon='chevron right' onClick={() => { this.changePage(1) }} disabled={this.state.page + 1 >= this.state.filteredSpells.length / this.state.limit } />
          </Button.Group>
        </Grid.Column>
        <Grid.Column textAlign='center'>
          <Input fluid icon='search' placeholder='Search...' value={this.state.searchQuery} onChange={this.search.bind(this)} />
        </Grid.Column>
        <Grid.Column textAlign='right'>
          <Dropdown compact selection options={pageLimits} defaultValue={this.state.limit} onChange={this.changeLimit.bind(this)} />
        </Grid.Column>
      </Grid>

      <Table color='purple' sortable unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell sorted={this.state.sortBy === 'name' ? this.state.sortOrder : null} onClick={() => { this.changeSortBy('name') }}>
              Name
            </Table.HeaderCell>
            <Table.HeaderCell sorted={this.state.sortBy === 'school' ? this.state.sortOrder : null} onClick={() => { this.changeSortBy('armor_class') }}>
              School
            </Table.HeaderCell>
            <Table.HeaderCell sorted={this.state.sortBy === 'castingTime' ? this.state.sortOrder : null} onClick={() => { this.changeSortBy('challenge_rating') }}>
              Casting Time
            </Table.HeaderCell>
            <Table.HeaderCell sorted={this.state.sortBy === 'duration' ? this.state.sortOrder : null} onClick={() => { this.changeSortBy('hit_points') }}>
              Duration
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {
            this.state.filteredSpells.sort(this.compare.bind(this)).slice(this.state.page*this.state.limit, this.state.limit*(this.state.page+1)).map(spell => (
              <Table.Row>
                <Table.Cell>
                  <SpellModal spell={spell} />
                  <span style={{fontSize: '8pt'}}>{spell.school}</span>
                </Table.Cell>
                <Table.Cell>{spell.school}</Table.Cell>
                <Table.Cell>{spell.castingTime}</Table.Cell>
                <Table.Cell>{spell.duration}</Table.Cell>
              </Table.Row>
            ))
          }
        </Table.Body>
      </Table>
    </div>
  )

  changePage = (direction) => this.setState({ page: this.state.page + direction })
  changeLimit = (e, { value }) => this.setState({ limit: value })

  search(e){
    this.setState({ searchQuery: e.target.value })

    if(e.target.value === ''){
      this.setState({ filteredSpells: this.state.spells })
      return;
    }else{
      var spells = [];

      this.state.spells.find((spell) => {
        if(spell.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          spell.school.toLowerCase().includes(e.target.value.toLowerCase()) ||
          spell.duration.toLowerCase().includes(e.target.value.toLowerCase()) ||
          spell.castingTime.toLowerCase().includes(e.target.value.toLowerCase())){
          spells.push(spell);
        }
      })

      this.setState({ filteredSpells: spells })
    }
  }
}
