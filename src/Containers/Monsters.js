import React, { Component } from 'react'

import firebase from './../Lib/firebase'

import { Button, Grid, Header, Input, Segment, Dropdown, Table } from 'semantic-ui-react'

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
      monsters: [],
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
    let monstersRef = firebase.database().ref('monsters').orderByKey().limitToLast(20);
    monstersRef.on('child_added', snapshot => {
      // Update React state message is added to the firebase database
      let monster = snapshot.val()
      monster.id = snapshot.key
      var monsters = [monster].concat(this.state.monsters);
      this.setState({ monsters: monsters, filteredMonsters: monsters, loaded: true  })
    })
  }

  render() {
    const limits = [
      {
        text: '2',
        value: 2
      },
      {
        text: '4',
        value: 4
      },
      {
        text: '10',
        value: 10
      },
      {
        text: '25',
        value: 25
      },
      {
        text: '50',
        value: 50
      },
      {
        text: '100',
        value: 100
      },
      {
        text: '200',
        value: 200
      },
    ]

    return (
      <main>
        <Grid columns={1}>
          <Grid.Column>
            <Segment.Group raised>
              <Segment id="panelHeader" className='header' textAlign='center' inverted clearing>Monsters</Segment>

              <Segment className='panel content' loading={!this.state.loaded}>
                <Grid columns={4}>
                  <Grid.Column>
                    <Button.Group size='tiny'>
                      <Button icon='chevron left' onClick={() => { this.changePage(-1) }} disabled={this.state.page === 0} />
                      <Button>{this.state.page+1} / {Math.ceil(this.state.filteredMonsters.length/this.state.limit)}</Button>
                      <Button icon='chevron right' onClick={() => { this.changePage(1) }} disabled={this.state.page + 1 >= this.state.filteredMonsters.length / this.state.limit } />
                    </Button.Group>
                  </Grid.Column>
                  <Grid.Column textAlign='center'>
                    <Input fluid icon='search' placeholder='Search...' value={this.state.searchQuery} onChange={this.search.bind(this)} />
                  </Grid.Column>
                  <Grid.Column textAlign='right'>
                    <Dropdown compact selection options={limits} defaultValue={this.state.limit} onChange={this.changeLimit.bind(this)} />
                  </Grid.Column>
                </Grid>

                <Table color='purple' sortable unstackable>
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
                    {
                      this.state.filteredMonsters.sort(this.compare.bind(this)).slice(this.state.page*this.state.limit, this.state.limit*(this.state.page+1)).map(monster => (
                        <Table.Row>
                          <Table.Cell>{this.formatCR(monster.challenge_rating)}</Table.Cell>
                          <Table.Cell>
                            <Header sub>{monster.name}</Header>
                            <span style={{fontSize: '8pt'}}>{monster.alignment} - {monster.size} {monster.type}</span>
                          </Table.Cell>
                          <Table.Cell>{monster.hit_points}</Table.Cell>
                          <Table.Cell>{monster.armor_class}</Table.Cell>
                          <Table.Cell>{this.convertExp(monster.challenge_rating)} XP</Table.Cell>
                        </Table.Row>
                      ))
                    }
                  </Table.Body>
                </Table>
              </Segment>

              <Segment className='panel bottom' clearing>
                <Button.Group size='tiny'>
                  <Button icon='chevron left' onClick={() => { this.changePage(-1) }} disabled={this.state.page === 0} />
                  <Button>{this.state.page+1} / {Math.ceil(this.state.filteredMonsters.length/this.state.limit)}</Button>
                  <Button icon='chevron right' onClick={() => { this.changePage(1) }} disabled={this.state.page + 1 >= this.state.filteredMonsters.length / this.state.limit } />
                </Button.Group>
                <span style={{float: 'right'}}>Total Monsters: {this.state.filteredMonsters.length}</span>
              </Segment>
            </Segment.Group>
          </Grid.Column>
        </Grid>
      </main>
    )
  }

  formatCR(cr){
    return (cr === 0.125) ? '1/8' : (cr === 0.25) ? '1/4' : (cr === 0.5) ? '1/2' : cr
  }

  convertExp(cr){
    var crToExp = {
      0: 10,
      0.125: 25,
      0.25: 50,
      0.5: 100,
      1: 200,
      2: 450,
      3: 700,
      4: '1.100',
      5: '1.800',
      6: '2.300',
      7: '2.900',
      8: '3.900',
      9: '5.000',
      10: '5.900',
      11: '7.200',
      12: '8.400',
      13: '1.0000',
      14: '11.500',
      15: '13.000',
      16: '15.000',
      17: '18.000',
      18: '20.000',
      19: '22.000',
      20: '25.000',
      21: '33.000',
      22: '41.000',
      23: '50.000',
      24: '62.000',
      25: '75.000',
      26: '90.000',
      27: '105.000',
      28: '120.000',
      29: '135.000',
      30: '155.000'
    }

    return crToExp[cr]
  }

  changePage = (direction) => this.setState({ page: this.state.page + direction })
  changeLimit = (e, { value }) => this.setState({ limit: value })

  search(e){
    this.setState({ searchQuery: e.target.value })

    if(e.target.value === ''){
      this.setState({ filteredMonsters: this.state.monsters })
      return;
    }else{
      var monsters = [];

      this.state.monsters.find((monster) => {
        if(monster.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
          monster.type.toLowerCase().includes(e.target.value.toLowerCase()) ||
          monster.alignment.toLowerCase().includes(e.target.value.toLowerCase()) ||
          monster.size.toLowerCase().includes(e.target.value.toLowerCase())){
          monsters.push(monster);
        }
      })

      this.setState({ filteredMonsters: monsters })
    }
  }
}
