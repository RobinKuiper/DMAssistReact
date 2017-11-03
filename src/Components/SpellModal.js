import React, { Component } from 'react'
import { Divider, Grid, Header, Icon, Image, Label, List, Modal, Segment } from 'semantic-ui-react'
import { formatSpellLevel, formatSpellRange } from './../Lib/Common'

// IMAGES
import Verbal from './../Images/Verbal.png'
import Material from './../Images/Material.png'
import Somatic from './../Images/Somatic.png'

export default class SpellModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      Verbal,
      Material,
      Somatic
    }
  }

  render() {
    const spell = this.props.spell

    return (
      <Modal closeIcon trigger={this.props.trigger}>
        <Modal.Content>
          { spell &&
            <Segment raised>
              <Label color='red' ribbon>{formatSpellLevel(spell.level)} Level {spell.school}</Label>
              <Header>{spell.name}</Header>
              <Segment.Group>
                <Segment>
                  <Grid columns={2}>
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
                      <List>
                        <List.Item><strong>Classes</strong></List.Item>
                      { spell.classes &&
                          spell.classes.map(c => (
                            <List.Item key={c}>{c}</List.Item>
                          ))
                      }
                      </List>
                    </Grid.Column>
                  </Grid>

                  <Divider />

                  <p dangerouslySetInnerHTML={{ __html: spell.desc }}></p>

                  { spell.higher_level && spell.higher_level !== '' &&
                    (
                      <div>
                        <Header>At Higher Levels</Header>
                        <p dangerouslySetInnerHTML={{ __html: spell.higher_level }}></p>
                      </div>
                    )
                  }

                  <Divider />

                  <List size='small' horizontal>
                  { spell.components &&
                      spell.components.map(component => (
                        <List.Item key={component}>
                          <Image size='mini' src={this.state[component]} />
                          <div>{component}</div>
                        </List.Item>
                      ))
                  }
                  { spell.material &&
                      <List.Item><strong>Material</strong><span>{spell.material}</span></List.Item>
                  }
                  </List>

                  <Divider />
                </Segment>
              </Segment.Group>
            </Segment>
          }
        </Modal.Content>
      </Modal>
    )
  }
}
