import React, { Component } from 'react'

import { pageLimits } from './../Lib/Common'

import Panel from './Panel'
import SpellModal from './../Components/SpellModal'

import { Button, Grid, Header, Input, Dropdown, Table } from 'semantic-ui-react'

export default class Spells extends Component {
  constructor(props){
    super(props)

    this.changeSortBy = this.changeSortBy.bind(this);
    this.changePage = this.changePage.bind(this);

    this.state = {
      searchQuery: '',
      filteredSpells: this.props.spells,
      sortBy: 'name',
      sortOrder: 'ascending',
      limit: 10,
      page: 0,
      spells: this.props.spells,
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
            <Panel title={'Spells'} content={this.renderContent} footer={this.renderFooter} loaded={this.state.loaded} />
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
      <Grid columns={3}>
        <Grid.Column>
          {/* TODO: Paginator Component */}
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

      <Table color='purple' selectable sortable unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell sorted={this.state.sortBy === 'name' ? this.state.sortOrder : null} onClick={() => { this.changeSortBy('name') }}>
              Name
            </Table.HeaderCell>
            <Table.HeaderCell sorted={this.state.sortBy === 'school' ? this.state.sortOrder : null} onClick={() => { this.changeSortBy('school') }}>
              School
            </Table.HeaderCell>
            <Table.HeaderCell sorted={this.state.sortBy === 'castingTime' ? this.state.sortOrder : null} onClick={() => { this.changeSortBy('castingTime') }}>
              Casting Time
            </Table.HeaderCell>
            <Table.HeaderCell sorted={this.state.sortBy === 'duration' ? this.state.sortOrder : null} onClick={() => { this.changeSortBy('duration') }}>
              Duration
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          { this.state.filteredSpells.length > 0 ?
              this.state.filteredSpells.sort(this.compare.bind(this)).slice(this.state.page*this.state.limit, this.state.limit*(this.state.page+1)).map(spell => (
                <Table.Row key={spell.slug}>
                  <Table.Cell>
                    <SpellModal spell={spell} trigger={<Header sub style={{cursor: 'pointer'}}>{spell.name}</Header>} />
                    <span style={{fontSize: '8pt'}}>{spell.school}</span>
                  </Table.Cell>
                  <Table.Cell>{spell.school}</Table.Cell>
                  <Table.Cell>{spell.castingTime}</Table.Cell>
                  <Table.Cell>{spell.duration}</Table.Cell>
                </Table.Row>
              ))
            : (
              <Table.Row>
                <Table.Cell colSpan={5}>No spells found.</Table.Cell>
              </Table.Row>
            )
          }
        </Table.Body>
      </Table>
    </div>
  )

  changePage = (direction) => this.setState({ page: this.state.page + direction })
  changeLimit = (e, { value }) => this.setState({ limit: value })

  search(e){
    e.preventDefault()

    this.setState({ searchQuery: e.target.value })

    if(e.target.value === ''){
      this.setState({ filteredSpells: this.state.spells })
      return;
    }else{
      var spells = this.state.spells.filter((spell) => spell.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        spell.school.toLowerCase().includes(e.target.value.toLowerCase()) ||
        spell.duration.toLowerCase().includes(e.target.value.toLowerCase()) ||
        spell.castingTime.toLowerCase().includes(e.target.value.toLowerCase())
      )

      this.setState({ filteredSpells: spells })
    }
  }
}
