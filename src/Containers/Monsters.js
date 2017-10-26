import React, { Component } from 'react'

import { pageLimits, formatCR, CRtoEXP } from './../Lib/Common'

import Panel from './Panel'
import MonsterModal from './../Components/MonsterModal'

import { Button, Grid, Header, Input, Dropdown } from 'semantic-ui-react'
import Table from './../Components/Table'

import { PaginatorButtons } from './../Components/Paginator'

export default class Monsters extends Component {
  constructor(props){
    super(props)

    this.changeSortBy = this.changeSortBy.bind(this);

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

  renderContent = () => {
    var monsters = (this.state.filteredMonsters.length === 0) ? this.props.monsters : this.state.filteredMonsters

    const tableConfig = {
      headerCells: [
        { content: 'CR', sortName: 'challenge_rating' },
        { content: 'Name', sortName: 'name' },
        { content: 'HP', sortName: 'hit_points' },
        { content: 'AC', sortName: 'armor_class' },
        { content: 'Exp', sortName: 'challenge_rating' },
      ],
      bodyRows: []
    }

    monsters.sort(this.compare.bind(this)).slice(this.state.page*this.state.limit, this.state.limit*(this.state.page+1)).map(monster => {
      tableConfig.bodyRows.push({
        key: monster.slug,
        cells: [
          { content: formatCR(monster.challenge_rating) },
          { content: (<div>
            <MonsterModal monster={monster} trigger={<Header sub style={{cursor: 'pointer'}}>{monster.name}</Header>} />
            <span style={{fontSize: '8pt'}}>{monster.alignment} - {monster.size} {monster.type}</span>
          </div>) },
          { content: monster.hit_points },
          { content: monster.armor_class },
          { content: CRtoEXP(monster.challenge_rating) + ' XP' }
        ]
      })
    })

    return (
      <div>
        <Grid columns={3}>
          <Grid.Column>
            <PaginatorButtons page={this.state.page} totalPages={Math.ceil(monsters.length/this.state.limit)} handlePageChange={(page) => { this.setState({page}) }}/>
          </Grid.Column>
          <Grid.Column textAlign='center'>
            <Input fluid icon='search' placeholder='Search...' value={this.state.searchQuery} onChange={this.search.bind(this)} />
          </Grid.Column>
          <Grid.Column textAlign='right'>
            <Dropdown compact selection options={pageLimits} defaultValue={this.state.limit} onChange={this.changeLimit.bind(this)} />
          </Grid.Column>
        </Grid>

        <Table color='purple' headerCells={tableConfig.headerCells} bodyRows={tableConfig.bodyRows} />
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
