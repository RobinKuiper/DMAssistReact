import React, { Component } from 'react'

import { pageLimits } from './../Lib/Common'

import Adsense from './../Components/Adsense'

import Panel from './../Components/UI/Panel'
import SpellModal from './../Components/SpellModal'
import { PaginatorButtons } from './../Components/Paginator'
import Table from './../Components/UI/Table'

import { Button, Grid, Header, Input, Dropdown, Popup } from 'semantic-ui-react'

export default class Spells extends Component {
  constructor(props){
    super(props)

    this.changeSortBy = this.changeSortBy.bind(this);

    this.state = {
      searchQuery: '',
      filteredSpells: this.props.spells,
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
            <Panel title={'Spells'} content={this.renderContent} footer={this.renderFooter} loaded={this.state.loaded} />
          </Grid.Column>
        </Grid>
      </main>
    )
  }

  renderContent = () => {
    var spells = (this.state.filteredSpells.length === 0) ? this.props.spells : this.state.filteredSpells

    const tableConfig = {
      headerCells: [
        { content: 'Name', sortName: 'name' },
        { content: 'School', sortName: 'school' },
        { content: 'Casting Time', sortName: 'castingTime' },
        { content: 'Duration', sortName: 'duration' },
      ],
      bodyRows: []
    }

    tableConfig.bodyRows = spells.sort(this.compare.bind(this)).slice(this.state.page*this.state.limit, this.state.limit*(this.state.page+1)).map(spell => {
      return {
        key: spell.slug,
        cells: [
          { content: (<div>
            <SpellModal spell={spell} trigger={<Header sub style={{cursor: 'pointer'}}>{spell.name}</Header>} />
            <span style={{fontSize: '8pt'}}>{spell.school}</span>
          </div>) },
          { content: spell.school },
          { content: spell.castingTime },
          { content: spell.duration }
        ]
      }
    })

    return (
      <div>
        <Grid columns={3}>
          <Grid.Column>
            <PaginatorButtons page={this.state.page} totalPages={Math.ceil(spells.length/this.state.limit)} handlePageChange={(page) => { this.setState({page}) }}/>
          </Grid.Column>
          <Grid.Column textAlign='center'>
            <Input fluid icon='search' placeholder='Search...' value={this.state.searchQuery} onChange={this.search.bind(this)} />
          </Grid.Column>
          <Grid.Column textAlign='right'>
            <Popup content='Coming Soon' trigger={<Button icon='plus' content='Create Spells' onClick={() => this.setState({ isCreatingMonster: true })} />} />
            <Dropdown compact selection options={pageLimits} defaultValue={this.state.limit} onChange={this.changeLimit.bind(this)} />
          </Grid.Column>
        </Grid>

        <Table color='purple' headerCells={tableConfig.headerCells} bodyRows={tableConfig.bodyRows} />

        { process.env.NODE_ENV !== "development" &&
          <Adsense client='ca-pub-2044382203546332' slot='7541388493' style={{marginTop: 40, width: 728, height: 90}} />
        }
      </div>
    )
  }

  renderFooter = () => {
    var spells = (this.state.filteredSpells.length === 0) ? this.props.spells : this.state.filteredSpells
    return (
      <div>
        <PaginatorButtons page={this.state.page} totalPages={Math.ceil(spells.length/this.state.limit)} handlePageChange={(page) => { this.setState({page}) }}/>
        <span style={{float: 'right'}}>Total Spells: {spells.length}</span>
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
    e.preventDefault()

    this.setState({ searchQuery: e.target.value })

    if(e.target.value === ''){
      this.setState({ filteredSpells: this.props.spells })
      return;
    }else{
      var spells = this.props.spells.filter((spell) => spell.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        spell.school.toLowerCase().includes(e.target.value.toLowerCase()) ||
        spell.duration.toLowerCase().includes(e.target.value.toLowerCase()) ||
        spell.castingTime.toLowerCase().includes(e.target.value.toLowerCase())
      )

      this.setState({ filteredSpells: spells })
    }
  }
}
