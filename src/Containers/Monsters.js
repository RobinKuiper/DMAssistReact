import React, { Component } from 'react'
import { Button, Dropdown, Grid, Input, Item, Loader, Popup, Table } from 'semantic-ui-react'

import { pageLimits } from './../Lib/Common'
import { Auth, Database } from './../Lib/firebase'

import Panel from './../Components/UI/Panel'
import {MonsterTableItem} from './../Components/Monsters/MonsterTableItem'
import {MonsterItem} from './../Components/Monsters/MonsterItem'
import EncounterPanel from './../Components/EncounterPanel'

import { PaginatorButtons } from './../Components/Paginator'

import CreateMonster from './../Components/CreateMonster'

import { removeByKey } from './../Lib/Array'
import Affiliate from './../Components/Affiliate'

import { Mobile, Default } from './../Lib/Responsive'
import InfiniteScroll from 'react-infinite-scroller'

export default class Monsters extends Component {
  constructor(props){
    super(props)
    this.changeSortBy = this.changeSortBy.bind(this);

    this.state = {
      searchQuery: '',
      processed_monsters: [],
      custom_monsters: [],
      monsters: [],
      custom: 'both',
      sortBy: 'name',
      sortOrder: 'ascending',
      limit: 10,
      page: 0,
      toEncounterMonster: null,
      encounter: false,
      isCreatingMonster: false, //false
      loading: true,

      hasMoreItems: true,
    }
  }

  setPage(page){
    let hasMoreItems = (this.state.processed_monsters.length > this.state.limit*(this.state.page+1))

    this.setState({ page, hasMoreItems })
  }

  toggleCustom = () => {
    const custom = this.state.custom === true ? 'both' : this.state.custom === 'both' ? false : true
    const processed_monsters = custom === true ? this.state.custom_monsters : custom === 'both' ? this.state.monsters.concat(this.state.custom_monsters) : this.state.monsters
    this.setState({ custom, processed_monsters })
  }

  render() {
    if(!this.state.isCreatingMonster){
      return (
        <main>
          <Mobile>
            <Grid columns={2} stackable>
              <Grid.Column width={5}>
                <EncounterPanel ref={instance => { this.encounters = instance }} setEncounter={(encounter) => this.setState({ encounter }) } />
                <Affiliate title='Get your dice and gaming supplies cheap!' alt='Easy Roller Dice' url='http://shareasale.com/r.cfm?b=1010621&amp;u=1651477&amp;m=60247&amp;urllink=&amp;afftrack=' image='https://i.shareasale.com/image/60247/erd350x250.png' />
              </Grid.Column>

              <Grid.Column width={11}>
                <Panel title={'Monsters'} content={this.renderMobileContent} loading={this.state.loading} />
              </Grid.Column>
            </Grid>
          </Mobile>

          <Default>
            <Grid columns={2} stackable>
              <Grid.Column width={11}>
                <Panel title={'Monsters'} content={this.renderContent} footer={this.renderFooter} loading={this.state.loading} />
              </Grid.Column>

              <Grid.Column width={5}>
                <EncounterPanel ref={instance => { this.encounters = instance }} setEncounter={(encounter) => this.setState({ encounter }) } />
                <Affiliate title='Get your dice and gaming supplies cheap!' alt='Easy Roller Dice' url='http://shareasale.com/r.cfm?b=1010621&amp;u=1651477&amp;m=60247&amp;urllink=&amp;afftrack=' image='https://i.shareasale.com/image/60247/erd350x250.png' />
              </Grid.Column>
            </Grid>
          </Default>
        </main>
      )
    }else{
      return <CreateMonster onSuccess={() => {
        this.setState({ isCreatingMonster: false })
        this.props.alert('Your monster is saved!', 'success', 'checkmark')
      }} />
    }
  }

  renderMobileContent = () => {
    let monsters = this.state.processed_monsters

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <Input fluid icon='search' placeholder='Search name, alignment, size, type, etc.' value={this.state.searchQuery} onChange={this.search.bind(this)} />
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={16}>
            { monsters.length > 0 ? (
              <InfiniteScroll
                  pageStart={0}
                  loadMore={this.setPage.bind(this)}
                  hasMore={this.state.hasMoreItems}
                  loader={Loader}>
                    <Item.Group divided>
                      { monsters.sort(this.compare.bind(this)).slice(0, this.state.limit*(this.state.page+1)).map(monster => (
                            <MonsterItem monster={monster} encounter={this.state.encounter} />
                      ))}
                    </Item.Group>
              </InfiniteScroll>
              ) : (
                <Item>
                  <Item.Content>
                    <Item.Description>No monsters found.</Item.Description>
                  </Item.Content>
                </Item>
              )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }

  renderContent = () => {
    var monsters = this.state.processed_monsters

    return (
      <div>
        <Grid columns={5} stackable>
          <Grid.Column width={3}>
            <PaginatorButtons page={this.state.page} totalPages={Math.ceil(monsters.length/this.state.limit)} handlePageChange={(page) => { this.setState({page}) }}/>
            {/*<Popup content='Show your custom monsters' trigger={<Checkbox toggle label='Custom' name='custom' checked={this.state.custom} onChange={this.toggleCustom} />} />*/}
          </Grid.Column>
          <Grid.Column width={5}>
            <Input fluid icon='search' placeholder='Search name, alignment, size, type, etc.' value={this.state.searchQuery} onChange={this.search.bind(this)} />
          </Grid.Column>
          <Grid.Column textAlign='right' width={3}>
            <Popup content='Show your custom monsters' trigger={<Button content={this.state.custom === 'both' ? 'custom: Both' : this.state.custom ? 'Custom: On' : 'Custom: Off'} color='blue' name='custom' onClick={this.toggleCustom} />} />
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
              { Auth.currentUser && this.state.encounter &&
                <Table.HeaderCell></Table.HeaderCell>
              }
            </Table.Row>
          </Table.Header>

          <Table.Body>
            { monsters.length > 0 ?
                monsters.sort(this.compare.bind(this)).slice(this.state.page*this.state.limit, this.state.limit*(this.state.page+1)).map(monster => (
                  <MonsterTableItem monster={monster} encounter={this.state.encounter} />
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

  renderFooter = () => {
    var monsters = this.state.processed_monsters
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


  search(e, {value}){
    this.setState({ searchQuery: value })
    const processed_monsters = this.state.custom === true ? this.state.custom_monsters : this.state.custom === 'both' ? this.state.monsters.concat(this.state.custom_monsters) : this.state.monsters

    if(value === ''){
      this.setState({ processed_monsters })
      return;
    }else{
      let monsters = processed_monsters.filter((monster) => monster.name.toLowerCase().includes(value.toLowerCase()) ||
        monster.type.toLowerCase().includes(value.toLowerCase()) ||
        monster.alignment.toLowerCase().includes(value.toLowerCase()) ||
        monster.size.toLowerCase().includes(value.toLowerCase())
      )

      this.setState({ processed_monsters: monsters })
    }
  }

  componentWillMount() {
    Database.ref('monsters').on('value', snapshot => {
      let monsters = []
      snapshot.forEach(value => {
        let monster = value.val()
        monster.key = value.key
        monsters.push(monster)
      })
      this.setState({ monsters, processed_monsters: monsters, loading: false })
    })
  }

  componentDidMount() {
    Auth.onAuthStateChanged((user) => {
      if (user){
        Database.ref('userdata/'+ user.uid + '/monsters').on('child_added', snapshot => {
          let monster = snapshot.val()
          monster.key = snapshot.key
          monster.custom = true
          this.setState({ custom_monsters: [monster].concat(this.state.custom_monsters) })

          if(this.state.custom === true || this.state.custom === 'both'){
            this.setState({ processed_monsters: [monster].concat(this.state.processed_monsters) })
          }
        })

        Database.ref('userdata/'+ user.uid + '/monsters').on('child_removed', snapshot => {
          const custom_monsters = removeByKey(this.state.custom_monsters, { key: 'key', value: snapshot.key })
          const processed_monsters = removeByKey(this.state.processed_monsters, { key: 'key', value: snapshot.key })

          this.setState({ custom_monsters, processed_monsters })
        })
      }
    })
  }
}
