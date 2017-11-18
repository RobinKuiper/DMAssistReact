import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Grid, Icon, List, Message } from 'semantic-ui-react'
import { Auth, Database } from './../Lib/firebase'
import Panel from './../Components/UI/Panel'

import TreasureGenerator from './../Components/TreasureGenerator'

import LoginModal from './../Components/Auth/LoginModal'
import Affiliate from './../Components/Affiliate'

export default class Dashboard extends Component {
  constructor(props){
    super(props)

    this.state = {
      showMessage: localStorage.getItem('showMessage') === 'false' ? false : true,
      loading_campaigns: true,
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
                  <Panel title={'Campaigns'} content={this.renderCampaigns.bind(this)} footer={false} />
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
                <Affiliate 
                  title='Get the new Aliens comic book series!' 
                  alt='Get the new Aliens comic book series!' 
                  url='http://shareasale.com/r.cfm?b=188076&amp;u=1651477&amp;m=8908&amp;urllink=&amp;afftrack=' 
                  image='http://static.shareasale.com/image/728_aliens3.gif'
                />
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

  componentDidMount() {
    Auth.onAuthStateChanged((user) => {
      if (user){
        Database.ref('userdata').child(user.uid).child('campaigns').limitToLast(5).on('value', snapshot => {
          this.setState({ campaigns: snapshot.val() })
        })
      }
    })
  }
}