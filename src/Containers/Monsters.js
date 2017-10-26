import React, { Component } from 'react'

import { pageLimits, formatCR, CRtoEXP } from './../Lib/Common'

import Panel from './Panel'
import MonsterModal from './../Components/MonsterModal'

import { Button, Grid, Header, Input, Dropdown, Table } from 'semantic-ui-react'

export default class Monsters extends Component {
  constructor(props){
    super(props)

    this.changeSortBy = this.changeSortBy.bind(this);
    this.changePage = this.changePage.bind(this);

    this.state = {
      searchQuery: '',
      filteredMonsters: [],
      sortBy: 'name',
      sortOrder: 'ascending',
      limit: 10,
      page: 0,
      loaded: true
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

  render() {
    return (
      <main>
        <Grid columns={1}>
          <Grid.Column>
            <Panel title={'Monsters'} content={this.renderContent} footer={this.renderFooter} loaded={this.state.loaded} />
          </Grid.Column>
        </Grid>
      </main>
    )
  }

  renderFooter = () => {
    var monsters = (this.state.filteredMonsters.length === 0) ? this.props.monsters : this.state.filteredMonsters
    return (
      <div>
        <Button.Group size='tiny'>
          <Button icon='chevron left' onClick={() => { this.changePage(-1) }} disabled={this.state.page === 0} />
          <Button>{this.state.page+1} / {Math.ceil(monsters.length/this.state.limit)}</Button>
          <Button icon='chevron right' onClick={() => { this.changePage(1) }} disabled={this.state.page + 1 >= monsters.length / this.state.limit } />
        </Button.Group>
        <span style={{float: 'right'}}>Total Monsters: {monsters.length}</span>
      </div>
    )
  }

  renderContent = () => {
    var monsters = (this.state.filteredMonsters.length === 0) ? this.props.monsters : this.state.filteredMonsters
    return (
      <div>
        <Grid columns={4}>
          <Grid.Column>
            <Button.Group size='tiny'>
              <Button icon='chevron left' onClick={() => { this.changePage(-1) }} disabled={this.state.page === 0} />
              <Button>{this.state.page+1} / {Math.ceil(monsters.length/this.state.limit)}</Button>
              <Button icon='chevron right' onClick={() => { this.changePage(1) }} disabled={this.state.page + 1 >= monsters.length / this.state.limit } />
            </Button.Group>
          </Grid.Column>
          <Grid.Column textAlign='center'>
            <Input fluid icon='search' placeholder='Search...' value={this.state.searchQuery} onChange={this.search.bind(this)} />
          </Grid.Column>
          <Grid.Column textAlign='right'>
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
            </Table.Row>
          </Table.Header>

          <Table.Body>
            { monsters.length > 0 ?
                monsters.sort(this.compare.bind(this)).slice(this.state.page*this.state.limit, this.state.limit*(this.state.page+1)).map(monster => (
                  <Table.Row key={monster.slug}>
                    <Table.Cell>{formatCR(monster.challenge_rating)}</Table.Cell>
                    <Table.Cell>
                      <MonsterModal monster={monster} trigger={<Header sub style={{cursor: 'pointer'}}>{monster.name}</Header>} />
                      <span style={{fontSize: '8pt'}}>{monster.alignment} - {monster.size} {monster.type}</span>
                    </Table.Cell>
                    <Table.Cell>{monster.hit_points}</Table.Cell>
                    <Table.Cell>{monster.armor_class}</Table.Cell>
                    <Table.Cell>{CRtoEXP(monster.challenge_rating)} XP</Table.Cell>
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
      </div>
    )
  }

  changePage = (direction) => this.setState({ page: this.state.page + direction })
  changeLimit = (e, { value }) => this.setState({ limit: value })

  search(e){
    this.setState({ searchQuery: e.target.value })

    if(e.target.value === ''){
      this.setState({ filteredMonsters: this.props.monsters })
      return;
    }else{
      var monsters = this.props.monsters.filter((monster) => monster.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        monster.type.toLowerCase().includes(e.target.value.toLowerCase()) ||
        monster.alignment.toLowerCase().includes(e.target.value.toLowerCase()) ||
        monster.size.toLowerCase().includes(e.target.value.toLowerCase())
      )

      this.setState({ filteredMonsters: monsters })
    }
  }
}
