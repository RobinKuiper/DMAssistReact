import React, { Component } from 'react'
import { Button, Divider, Grid, Header, Icon, Image, Label, List, Segment, Popup } from 'semantic-ui-react'
import { formatSpellLevel, formatSpellRange } from './../../Lib/Common'
import { Auth } from './../../Lib/firebase'
import { Default, Mobile, isMatchingDevice } from './../../Lib/Responsive'

// IMAGES
import Verbal from './../../Images/Verbal.png'
import Material from './../../Images/Material.png'
import Somatic from './../../Images/Somatic.png'

export default class SpellLayout extends Component {
  constructor(props) {
    super(props)

    this.state = { Verbal, Material, Somatic }
  }


  render() {
    const spell = this.props.spell

    return (
      <Segment raised>
        <Default>
          <Label style={{marginBottom: 20}} color='red' ribbon>{formatSpellLevel(spell.level)} Level {spell.school}</Label>
          {this.props.backButton && <Button size='tiny' content='Go Back' icon='chevron left' onClick={() => this.props.history.goBack()} />}
        </Default>
        
        {spell.custom && Auth.currentUser && spell.uid === Auth.currentUser.uid && (
          <span>
          <Popup content='Coming soon' trigger={<Button size='tiny' content='Edit' icon='edit' />} />
            <Button size='tiny' content='Remove' icon='remove' onClick={() => {
              spell.remove(spell.key)
              if (this.props.backButton) this.props.history.goBack()
            }} />
          </span>
        )}
        <Grid>
          { this.props.backButton && (
            <Mobile>
                <Grid.Column width={3}>
                  <Button size='tiny' icon='chevron left' onClick={() => this.props.history.goBack()} />
                </Grid.Column>
            </Mobile>
          )}

            <Grid.Column width={13}>
                <Header>
                    {spell.name}

                    <Mobile>
                        <Header.Subheader>{formatSpellLevel(spell.level)} Level {spell.school}</Header.Subheader>
                    </Mobile>
                </Header>
            </Grid.Column>
        </Grid>
        <Segment.Group>
          <Segment>
            <Grid columns={2} stackable>
              <Grid.Column>
                <List>
                  <List.Item>
                    <Icon name='clock' />Casting Time: {spell.casting_time}
                  </List.Item>
                  <List.Item>
                    <Icon name='wifi' />Range: {formatSpellRange(spell.range)}
                  </List.Item>
                  <List.Item>
                    <Icon name='history' />Duration: {spell.duration}
                  </List.Item>
                </List>
              </Grid.Column>

              <Grid.Column>
                <List horizontal={isMatchingDevice('MOBILE')}>
                  <List.Item><strong>Classes</strong></List.Item>
                  {spell.classes &&
                    spell.classes.map(c => (
                      <List.Item key={c}>{c}</List.Item>
                    ))
                  }
                </List>
              </Grid.Column>
            </Grid>

            <Divider />

            <p dangerouslySetInnerHTML={{ __html: spell.desc }}></p>

            {spell.higher_level && spell.higher_level !== '' &&
              (
                <div>
                  <Header>At Higher Levels</Header>
                  <p dangerouslySetInnerHTML={{ __html: spell.higher_level }}></p>
                </div>
              )
            }

            <Divider />

            <List size='small' horizontal>
              {spell.components &&
                spell.components.map(component => (
                  <List.Item key={component}>
                    <Image size='mini' src={this.state[component]} />
                    <div>{component}</div>
                  </List.Item>
                ))
              }
              {spell.material &&
                <List.Item><strong>Material</strong> <span>{spell.material}</span></List.Item>
              }
            </List>

            <Divider />
          </Segment>
        </Segment.Group>
      </Segment>
    )
  }
}