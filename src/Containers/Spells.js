import React, { Component } from 'react'
import { Button, Grid, Header, Icon, Input, Dropdown, Popup, Table } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import { pageLimits } from './../Lib/Common'

import Adsense from './../Components/Adsense'

import Panel from './../Components/UI/Panel'
import SpellModal from './../Components/SpellModal'
import { PaginatorButtons } from './../Components/Paginator'
import CreateSpell from './../Components/CreateSpell'

import { Auth, Database } from './../Lib/firebase'

import AlertContainer from 'react-alert'

export default class Spells extends Component {
  constructor(props){
    super(props)

    this.changeSortBy = this.changeSortBy.bind(this);

    this.state = {
      searchQuery: '',
      filteredSpells: this.props.spells,
      custom_spells: [],
      sortBy: 'name',
      sortOrder: 'ascending',
      limit: 10,
      page: 0,
      loaded: true,
      isCreatingSpell: false
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

  toggleCustom = (type) => {
    //this.setState({ custom: checked, filteredMonsters: (checked) ? this.state.custom_monsters : this.props.monsters })
    const custom = type === 'show' ? true : type === 'hide' ? false : !this.state.custom
    const filteredSpells = (custom) ? this.state.custom_spells : this.props.spells
    this.setState({ custom, filteredSpells })
  }

  render() {
    return (
      <main>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        { !this.state.isCreatingSpell ? (
          <Grid columns={1}>
            <Grid.Column>
              <Panel title={'Spells'} content={this.renderContent} footer={this.renderFooter} loaded={this.state.loaded} />
            </Grid.Column>
          </Grid>
        ) : (
          <CreateSpell onSuccess={() => {
            this.toggleCustom('show')
            this.setState({ isCreatingSpell: false })
            this.showAlert('Your spell is saved!', 'success', 'checkmark')
          }} />
        )}
      </main>
    )
  }

  renderContent = () => {
    var spells = (this.state.filteredSpells.length === 0) ? this.props.spells : this.state.filteredSpells

    return (
      <div>
        <Grid columns={5}>
          <Grid.Column width={3}>
            <PaginatorButtons page={this.state.page} totalPages={Math.ceil(spells.length/this.state.limit)} handlePageChange={(page) => { this.setState({page}) }}/>
          </Grid.Column>
          <Grid.Column width={5}>
            <Input fluid icon='search' placeholder='Search name, school, duration, etc.' value={this.state.searchQuery} onChange={this.search.bind(this)} />
          </Grid.Column>
          <Grid.Column textAlign='right' width={3}>
            <Popup content='Show your custom spells' trigger={<Button content={this.state.custom ? 'Custom: On' : 'Custom: Off'} color='blue' name='custom' active={this.state.custom} onClick={this.toggleCustom} />} />
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
              <Table.HeaderCell sorted={this.state.sortBy === 'castingTime' ? this.state.sortOrder : null} onClick={() => { this.changeSortBy('castingTime') }}>
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
                  <Table.Row key={spell.slug}>
                    <Table.Cell>
                      <Grid>
                        <Grid.Column width={14}>
                          <SpellModal spell={spell} trigger={<Header sub style={{cursor: 'pointer'}}>{spell.name}</Header>} />
                          <span style={{fontSize: '8pt'}}>{spell.school}</span>
                        </Grid.Column>

                        <Grid.Column width={2}>
                          <Popup position='center top' content='Open in a new page' trigger={
                            <Link to={'/spell/'+spell.slug}>
                              <Icon name='external link' />
                            </Link>
                          } />
                        </Grid.Column>
                      </Grid>
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
    const s = (this.state.custom) ? this.state.custom_spells : this.props.spells

    if(e.target.value === ''){
      this.setState({ filteredSpells: s })
      return;
    }else{
      var spells = s.filter((spell) => spell.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        spell.school.toLowerCase().includes(e.target.value.toLowerCase()) ||
        spell.duration.toLowerCase().includes(e.target.value.toLowerCase()) ||
        spell.castingTime.toLowerCase().includes(e.target.value.toLowerCase())
      )

      this.setState({ filteredSpells: spells })
    }
  }

  componentDidMount = () => {
    Auth.onAuthStateChanged((user) => {
      if (user){
        const csRef = Database.ref('userdata/'+user.uid+'/spells/')
        csRef.on('child_added', snapshot => {
          snapshot.val().id = snapshot.key
          this.setState({ custom_spells: [snapshot.val()].concat(this.state.custom_spells) })
        })
      }
    })
  }
}
