import React, { Component } from 'react'
import { Button, Dropdown, Grid, Input, Item, Loader, Popup, Table } from 'semantic-ui-react'

import { pageLimits } from './../Lib/Common'
import { Auth, Database } from './../Lib/firebase'

import Panel from './../Components/UI/Panel'
import { SpellTableItem } from './../Components/Spells/SpellTableItem'
import { SpellItem } from './../Components/Spells/SpellItem'

import { PaginatorButtons } from './../Components/Paginator'

import CreateSpell from './../Components/CreateSpell'

import { removeByKey } from './../Lib/Array'
import Affiliate from './../Components/Affiliate'

import { Mobile, Default } from './../Lib/Responsive'
import InfiniteScroll from 'react-infinite-scroller'

export default class Spells extends Component {
  constructor(props){
    super(props)

    this.changeSortBy = this.changeSortBy.bind(this);

    this.state = {
      searchQuery: '',
      custom: 'both',
      processed_spells: [],
      custom_spells: [],
      sortBy: 'name',
      sortOrder: 'ascending',
      limit: 10,
      page: 0,
      loading: true,
      isCreatingSpell: false,

      hasMoreItems: true,
    }
  }

  setPage(page){
    let hasMoreItems = (this.state.processed_spells.length > this.state.limit*(this.state.page+1))

    this.setState({ page, hasMoreItems })
  }

  toggleCustom = () => {
    const custom = this.state.custom === true ? 'both' : this.state.custom === 'both' ? false : true
    const processed_spells = custom === true ? this.state.custom_spells : custom === 'both' ? this.state.spells.concat(this.state.custom_spells) : this.state.spells
    this.setState({ custom, processed_spells })
  }

  render() {
    if(!this.state.isCreatingSpell){
      return (
        <main>
          <Mobile>
            <Grid columns={1}>
              <Grid.Column>
                <Panel title={'Spells'} content={this.renderMobileContent} loading={this.state.loading} />
              </Grid.Column>
            </Grid>
          </Mobile>

          <Default>
            <Grid columns={1}>
              <Grid.Column>
                <Panel title={'Spells'} content={this.renderContent} footer={this.renderFooter} loading={this.state.loading} />
              </Grid.Column>
            </Grid>
          </Default>
        </main>
      )
    }else{
      return <CreateSpell onSuccess={() => {
            this.toggleCustom('show')
            this.setState({ isCreatingSpell: false })
            this.showAlert('Your spell is saved!', 'success', 'checkmark')
          }} />
    }
  }

  renderMobileContent = () => {
    var spells = this.state.processed_spells

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <Input fluid icon='search' placeholder='Search name, school, etc.' value={this.state.searchQuery} onChange={this.search.bind(this)} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={16}>
            { spells.length > 0 ? (
              <InfiniteScroll
                  pageStart={0}
                  loadMore={this.setPage.bind(this)}
                  hasMore={this.state.hasMoreItems}
                  loader={Loader}>
                    <Item.Group divided>
                      { spells.sort(this.compare.bind(this)).slice(0, this.state.limit*(this.state.page+1)).map(spell => (
                            <SpellItem spell={spell} />
                      ))}
                    </Item.Group>
              </InfiniteScroll>
              ) : (
                <Item>
                  <Item.Content>
                    <Item.Description>No spells found.</Item.Description>
                  </Item.Content>
                </Item>
              )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  renderContent = () => {
    var spells = this.state.processed_spells

    return (
      <div>
        <Grid columns={5}>
          <Grid.Column width={3}>
            <PaginatorButtons page={this.state.page} totalPages={Math.ceil(spells.length/this.state.limit)} handlePageChange={(page) => { this.setState({page}) }}/>
          </Grid.Column>
          <Grid.Column width={5}>
            <Input fluid icon='search' placeholder='Search name, school, etc.' value={this.state.searchQuery} onChange={this.search.bind(this)} />
          </Grid.Column>
          <Grid.Column textAlign='right' width={3}>
            <Popup content='Show your custom spells' trigger={<Button content={this.state.custom === 'both' ? 'custom: Both' : this.state.custom ? 'Custom: On' : 'Custom: Off'} color='blue' name='custom' onClick={this.toggleCustom} />} />
          </Grid.Column>
          <Grid.Column textAlign='right' width={3}>
            <Popup content='Create a custom spell' trigger={<Button icon='plus' color='green' content='Create' onClick={() => this.setState({ isCreatingSpell: true })} />} />
          </Grid.Column>
          <Grid.Column textAlign='right' width={2}>
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
              <Table.HeaderCell sorted={this.state.sortBy === 'casting_time' ? this.state.sortOrder : null} onClick={() => { this.changeSortBy('casting_time') }}>
                Casting Time
              </Table.HeaderCell>
              <Table.HeaderCell sorted={this.state.sortBy === 'duration' ? this.state.sortOrder : null} onClick={() => { this.changeSortBy('duration') }}>
                Duration
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            { spells.length > 0 ?
              spells.sort(this.compare.bind(this)).slice(this.state.page*this.state.limit, this.state.limit*(this.state.page+1)).map(spell => (
                  <SpellTableItem spell={spell} />
                ))
              : (
                <Table.Row>
                  <Table.Cell colSpan={5}>No spells found.</Table.Cell>
                </Table.Row>
              )
            }
          </Table.Body>
        </Table>

        <Affiliate 
          title='Get your Anime, Manga, Figurines and more cheap!' 
          alt='Get your Anime, Manga, Figurines and more cheap!' 
          url='http://shareasale.com/r.cfm?b=939718&amp;u=1651477&amp;m=65886&amp;urllink=&amp;afftrack=' 
          image='https://i.shareasale.com/image/65886/holiday1-male-728.jpg' 
        />
      </div>
    )
  }

  renderFooter = () => {
    var spells = this.state.processed_spells
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

  search(e, {value}){
    this.setState({ searchQuery: value })
    const processed_spells = this.state.custom === true ? this.state.custom_spells : this.state.custom === 'both' ? this.state.spells.concat(this.state.custom_spells) : this.state.spells

    if(value === ''){
      this.setState({ processed_spells })
      return;
    }else{
      var spells = processed_spells.filter((spell) => spell.name.toLowerCase().includes(value.toLowerCase()) ||
        spell.school.toLowerCase().includes(value.toLowerCase()) ||
        spell.casting_time.toLowerCase().includes(value.toLowerCase())
      )

      this.setState({ processed_spells: spells })
    }
  }

  componentWillMount() {
    Database.ref('spells').on('value', snapshot => {
      let spells = []
      snapshot.forEach(value => {
        let spell = value.val()
        spell.key = value.key
        spells.push(spell)
      })
      this.setState({ spells, processed_spells: spells, loading: false })
    })
  }

  componentDidMount() {
    Auth.onAuthStateChanged((user) => {
      if (user){
        Database.ref('userdata/'+ user.uid + '/spells').on('child_added', snapshot => {
          let spell = snapshot.val()
          spell.key = snapshot.key
          spell.custom = true
          this.setState({ custom_spells: [spell].concat(this.state.custom_spells) })

          if(this.state.custom === true || this.state.custom === 'both'){
            this.setState({ processed_spells: [spell].concat(this.state.processed_spells) })
          }
        })

        Database.ref('userdata/'+ user.uid + '/spells').on('child_removed', snapshot => {
          const custom_spells = removeByKey(this.state.custom_spells, { key: 'key', value: snapshot.key })
          const processed_spells = removeByKey(this.state.processed_spells, { key: 'key', value: snapshot.key })

          this.setState({ custom_spells, processed_spells })
        })
      }
    })
  }
}
