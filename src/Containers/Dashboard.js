import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Grid, Icon, List, Message, Popup, Statistic } from 'semantic-ui-react'
import { Auth, Database } from './../Lib/firebase'
import Adsense from './../Components/Adsense'
import Panel from './../Components/UI/Panel'

import TreasureGenerator from './../Components/TreasureGenerator'

import LoginModal from './../Components/Auth/LoginModal'
import Affiliate from './../Components/Affiliate'

export default class Dashboard extends Component {
  constructor(props){
    super(props)

    this.state = {
      showMessage: localStorage.getItem('showMessage') === 'false' ? false : true,
      user_statistics: {
        monsters: 0,
        spells: 0,
        campaigns: 0,
        encounters: 0
      },
      statistics: {
        monsters: 0,
        spells: 0,
        custom_monsters: 0,
        custom_spells: 0
      },
      loading_campaigns: true,
      loading_statistics: true
    }
  }

  render() {
    return (
      <main>

        <Grid stackable>
          <Grid.Column width={6}>
            <Grid>
              <Grid.Row>
                <Grid.Column>
                  <Panel title={'Campaigns'} content={this.renderCampaigns.bind(this)} footer={false} loading={this.state.loading_campaigns} />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column>
                  <Panel title={'Latest Monsters'} content={this.renderMonsters.bind(this)} footer={false} loaded={true} />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column>
                  <Panel title={'Latest Spells'} content={this.renderSpells.bind(this)} footer={false} loaded={true} />
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column>
                  <Affiliate title='Get your dice and gaming supplies cheap!' alt='Easy Roller Dice' url='http://shareasale.com/r.cfm?b=755322&amp;u=1651477&amp;m=60247&amp;urllink=&amp;afftrack=' image='http://static.shareasale.com/image/60247/392x72.jpg' />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>

          <Grid.Column width={10} as={Grid}>
            <Grid.Row>
              <Grid.Column>
                <TreasureGenerator />
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column>
                <Panel title={'Statistics'} content={this.renderStatistics.bind(this)} footer={false} loading={this.state.loading_statistics} />
              </Grid.Column>
            </Grid.Row>
          </Grid.Column>
        </Grid>

        { this.state.showMessage && (
          <Message info icon onDismiss={() => { 
            this.setState({ showMessage: false })
            localStorage.setItem('showMessage', false);
          }}>
            <Icon name='info' />
            <Message.Content>
              <Message.Header>Why were some monsters/spells removed?</Message.Header>
              <p>I have decided to remove all none SRD (System Reference Document) monsters/spells from this tool. This is to prevent getting into copyright trouble with Wizards of the Coast.</p>
              <p>Custom monster will be added soon, this way you can make every monster from every source without putting this tool at risk.</p>
              <p>Thank you for your understanding.</p>
            </Message.Content>
          </Message>
        )}
      </main>
    )
  }

  renderCampaigns = () => {
    if(Auth.currentUser){
      return (
        <List>
        { this.state.campaigns  ?
            Object.keys(this.state.campaigns).map(key => {
              return <List.Item as={Link} to={'/campaign/'+key} key={key}>{this.state.campaigns[key].name}</List.Item>
            })
          :
            <List.Item>You don't have any campaigns yet.</List.Item>
        }
        </List>
      )
    }else{
      return (
        <p>Please <LoginModal trigger={<span style={{textDecoration: 'underline', cursor: 'pointer'}}>Sign In</span>} /> to see your campaigns</p>
      )
    }
  }

  renderMonsters = () => (
    <List>
    { this.props.monsters.slice(this.props.monsters.length-5, this.props.monsters.length).map(item => 
      <List.Item as={Link} to={'/monster/'+item.key} key={item.key}>{item.name}</List.Item>
    )}
    </List>
  )

  renderSpells = () => (
    <List>
    { this.props.spells.slice(this.props.spells.length-5, this.props.spells.length).map(item =>
      <List.Item as={Link} to={'/spell/'+item.key} key={item.key}>{item.name}</List.Item>
    )}
    </List>
  )

  renderStatistics = () => {
    const { statistics, user_statistics } = this.state

    return (
      <div>
        <Statistic.Group>
          <Popup content='SRD & Custom monsters' trigger={
            <Statistic as={Link} to='/monsters'>
              <Statistic.Value>{statistics.monsters + statistics.custom_monsters}</Statistic.Value>
              <Statistic.Label>Monsters</Statistic.Label>
            </Statistic>
          } />

          <Popup content='SRD & Custom spells' trigger={
            <Statistic as={Link} to='/spells'>
              <Statistic.Value>{statistics.spells + statistics.custom_spells}</Statistic.Value>
              <Statistic.Label>Spells</Statistic.Label>
            </Statistic>
          } />

          <Statistic as={Link} to='/monsters/custom'>
            <Statistic.Value>{user_statistics.monsters || 0}</Statistic.Value>
            <Statistic.Label>My Monsters</Statistic.Label>
          </Statistic>

          <Statistic as={Link} to='/spells/custom'>
            <Statistic.Value>{user_statistics.spells || 0}</Statistic.Value>
            <Statistic.Label>My Spells</Statistic.Label>
          </Statistic>

          <Statistic as={Link} to='/campaigns'>
            <Statistic.Value>{user_statistics.campaigns || 0}</Statistic.Value>
            <Statistic.Label>My Campaigns</Statistic.Label>
          </Statistic>

          <Statistic as={Link} to='/monsters'>
            <Statistic.Value>{user_statistics.encounters || 0}</Statistic.Value>
            <Statistic.Label>My Encounters</Statistic.Label>
          </Statistic>
        </Statistic.Group>        
      </div>
    )
  }

  componentDidMount() {
    Auth.onAuthStateChanged((user) => {
      if (user){
        Database.ref('statistics').on('value', snapshot => {
          this.setState({ statistics: snapshot.val(), loading_statistics: false })
        })

        Database.ref('userdata').child(user.uid).child('statistics').on('value', snapshot => {
          this.setState({ user_statistics: snapshot.val() })
        })

        Database.ref('userdata').child(user.uid).child('campaigns').limitToLast(5).on('value', snapshot => {
          this.setState({ campaigns: snapshot.val(), loading_campaigns: false })
        })
      }
    })
  }
}