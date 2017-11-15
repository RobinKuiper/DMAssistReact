import React, { Component } from 'react'
import { Button, Grid, Header, Icon, Input, Dropdown, Popup, Table } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

import { pageLimits } from './../Lib/Common'
import { Auth, Database } from './../Lib/firebase'

import Adsense from './../Components/Adsense'

import Panel from './../Components/UI/Panel'
import SpellModal from './../Components/SpellModal'
import { PaginatorButtons } from './../Components/Paginator'
import CreateSpell from './../Components/CreateSpell'

import AlertContainer from 'react-alert'
import { removeByKey } from './../Lib/Array'

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

  toggleCustom = () => {
    const custom = this.state.custom === true ? 'both' : this.state.custom === 'both' ? false : true
    const processed_spells = custom === true ? this.state.custom_spells : custom === 'both' ? this.props.spells.concat(this.state.custom_spells) : this.props.spells
    this.setState({ custom, processed_spells })
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
    var spells = this.state.processed_spells

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
                  <Table.Row key={spell.key}>
                    <Table.Cell>
                      <Grid>
                        <Grid.Column width={14}>
                          <SpellModal spell={spell} trigger={<Header sub style={{cursor: 'pointer'}}>{spell.name}</Header>} />
                          <span style={{fontSize: '8pt'}}>{spell.school}</span>
                        </Grid.Column>

                        <Grid.Column width={2}>
                          <Popup position='top center' content='Open in a new page' trigger={
                            <Link to={spell.custom ? '/spell/'+spell.key+'/custom' : '/spell/'+spell.key}>
                              <Icon name='external' />
                            </Link>
                          } />
                        </Grid.Column>
                      </Grid>
                    </Table.Cell>
                    <Table.Cell>{spell.school}</Table.Cell>
                    <Table.Cell>{spell.casting_time}</Table.Cell>
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
    const processed_spells = this.state.custom === true ? this.state.custom_spells : this.state.custom === 'both' ? this.props.spells.concat(this.state.custom_spells) : this.props.spells

    if(value === ''){
      this.setState({ processed_spells })
      return;
    }else{
      var spells = processed_spells.filter((spell) => spell.name.toLowerCase().includes(value.toLowerCase()) ||
        spell.school.toLowerCase().includes(value.toLowerCase()) ||
        spell.duration.toLowerCase().includes(value.toLowerCase()) ||
        spell.casting_time.toLowerCase().includes(value.toLowerCase())
      )

      this.setState({ processed_spells: spells })
    }
  }

  componentWillMount() {
    if(this.state.custom === 'both' || this.state.custom === false)
      this.setState({ processed_spells: this.props.spells.concat(this.state.processed_spells) })
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
