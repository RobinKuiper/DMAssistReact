import React, { Component } from 'react'
import { Divider, Grid, Header, Label, List, Modal, Segment, Table } from 'semantic-ui-react'

import { formatCR, CRtoEXP, calculateMod } from './../Lib/Common'

export default class MonsterModal extends Component {
  render() {
    const monster = this.props.monster

    return (
      <Modal closeIcon trigger={this.props.trigger}>
        <Modal.Content>
          { monster &&
            <Segment raised>
              <Label color='red' ribbon>{monster.size} {monster.type}</Label>
              <Header>{monster.name}</Header>
              <Segment.Group>
                <Segment>
                  <Grid columns={2}>
                    <Grid.Column>
                      <List>
                        <List.Item>
                          <strong>Armor Class:</strong>
                          <span>{monster.armor_class}</span>
                        </List.Item>
                        <List.Item>
                          <strong>Hit Points:</strong>
                          <span>{monster.hit_points}</span>
                        </List.Item>
                        <List.Item>
                          <strong>Speed:</strong>
                          <span>{monster.speed}</span>
                        </List.Item>
                      </List>
                    </Grid.Column>

                    <Grid.Column>
                      <List>
                        <List.Item>
                          <strong>Alignment:</strong>
                          <span>{monster.alignment}</span>
                        </List.Item>
                        <List.Item>
                          <strong>Languages:</strong>
                          <span>{monster.languages}</span>
                        </List.Item>
                        <List.Item>
                          <strong>Challenge:</strong>
                          <span>
                            {formatCR(monster.challenge_rating)}
                            ({CRtoEXP(monster.challenge_rating)} XP)
                          </span>
                        </List.Item>
                      </List>
                    </Grid.Column>
                  </Grid>

                  <Divider />

                  <Table color='black' fixed>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>STR</Table.HeaderCell>
                        <Table.HeaderCell>DEX</Table.HeaderCell>
                        <Table.HeaderCell>CON</Table.HeaderCell>
                        <Table.HeaderCell>INT</Table.HeaderCell>
                        <Table.HeaderCell>WIS</Table.HeaderCell>
                        <Table.HeaderCell>CHA</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>

                    <Table.Body>
                      <Table.Row>
                        <Table.Cell>
                          {monster.strength} ({calculateMod(monster.strength).formatted})
                        </Table.Cell>
                        <Table.Cell>
                          {monster.dexterity} ({calculateMod(monster.dexterity).formatted})
                        </Table.Cell>
                        <Table.Cell>
                          {monster.constitution} ({calculateMod(monster.constitution).formatted})
                        </Table.Cell>
                        <Table.Cell>
                          {monster.intelligence} ({calculateMod(monster.intelligence).formatted})
                        </Table.Cell>
                        <Table.Cell>
                          {monster.wisdom} ({calculateMod(monster.wisdom).formatted})
                        </Table.Cell>
                        <Table.Cell>
                          {monster.charisma} ({calculateMod(monster.charisma).formatted})
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table>

                  <Divider />

                  <Grid columns={2}>
                    <Grid.Column>
                      <List>
                        <List.Item><strong>Skills:</strong>
                          <List horizontal divided>
                            {monster.acrobatics && <List.Item>Acrobatics +{monster.acrobatics}</List.Item>}
                            {monster.animal_handling && <List.Item>Animal Handling +{monster.animal_handling}</List.Item>}
                            {monster.arcana && <List.Item>Arcana +{monster.arcana}</List.Item>}
                            {monster.athletics && <List.Item>Athletics +{monster.athletics}</List.Item>}
                            {monster.deception && <List.Item>Deception +{monster.deception}</List.Item>}
                            {monster.history && <List.Item>History +{monster.history}</List.Item>}
                            {monster.insight && <List.Item>Insight +{monster.insight}</List.Item>}
                            {monster.intimidation && <List.Item>Intimidation +{monster.intimidation}</List.Item>}
                            {monster.investigation && <List.Item>Investigation +{monster.investigation}</List.Item>}
                            {monster.medicine && <List.Item>Medicine +{monster.medicine}</List.Item>}
                            {monster.nature && <List.Item>Nature +{monster.nature}</List.Item>}
                            {monster.perception && <List.Item>Perception +{monster.perception}</List.Item>}
                            {monster.performance && <List.Item>Performance +{monster.performance}</List.Item>}
                            {monster.persuasion && <List.Item>Persuasion +{monster.persuasion}</List.Item>}
                            {monster.religion && <List.Item>Religion +{monster.religion}</List.Item>}
                            {monster.sleight_of_hand && <List.Item>Sleight of Hand +{monster.sleight_of_hand}</List.Item>}
                            {monster.stealth && <List.Item>Stealth +{monster.stealth}</List.Item>}
                            {monster.survival && <List.Item>Survival +{monster.survival}</List.Item>}
                          </List>
                        </List.Item>
                        <List.Item>
                          <strong>Senses:</strong>
                          <span>{monster.senses}</span>
                        </List.Item>
                        <List.Item><strong>Saves:</strong>
                          <List horizontal divided>
                            {monster.strength_save && <List.Item>Str +{monster.strength_save}</List.Item>}
                            {monster.dexterity_save && <List.Item>Dex +{monster.dexterity_save}</List.Item>}
                            {monster.constition_save && <List.Item>Con +{monster.constition_save}</List.Item>}
                            {monster.intelligence_save && <List.Item>Int +{monster.intelligence_save}</List.Item>}
                            {monster.wisdom_save && <List.Item>Wis +{monster.wisdom_save}</List.Item>}
                            {monster.charisma_save && <List.Item>Cha +{monster.charisma_save}</List.Item>}
                          </List>
                        </List.Item>
                      </List>
                    </Grid.Column>

                    <Grid.Column>
                      <List>
                        {monster.damage_immunities && <List.Item><strong>Damage Immunities:</strong> <span>{monster.damage_immunities}</span></List.Item>}
                        {monster.condition_immunities && <List.Item><strong>Condition Immunities:</strong> <span>{monster.condition_immunities}</span></List.Item>}
                        {monster.damage_vulnerabilities && <List.Item><strong>Damage Vulnerabilities:</strong> <span>{monster.damage_vulnerabilities}</span></List.Item>}
                        {monster.damage_resistances && <List.Item><strong>Damage Resistances:</strong> <span>{monster.damage_resistances}</span></List.Item>}
                      </List>
                    </Grid.Column>
                  </Grid>

                  <Divider />

                  { monster.special_abilities &&
                    <div>
                      <Header>Traits</Header>
                      <List>
                      {
                        monster.special_abilities.map((obj) => (
                          <List.Item key={obj.name}>
                            <strong>{obj.name}</strong>
                            <span>{obj.desc}</span>
                          </List.Item>
                        ))
                      }
                      </List>

                      <Divider />
                    </div>
                  }

                  { monster.actions &&
                    <div>
                      <Header>Actions</Header>
                      <List>
                      {
                        monster.actions.map((obj) => (
                          <List.Item key={obj.name}>
                            <strong>{obj.name}</strong>
                            <span>{obj.desc}</span>
                          </List.Item>
                        ))
                      }
                      </List>

                      <Divider />
                    </div>
                  }

                  { monster.reactions &&
                    <div>
                      <Header>Reactions</Header>
                      <List>
                      {
                        monster.reactions.map((obj) => (
                          <List.Item key={obj.name}>
                            <strong>{obj.name}</strong>
                            <span>{obj.desc}</span>
                          </List.Item>
                        ))
                      }
                      </List>

                      <Divider />
                    </div>
                  }

                  { monster.legendary_actions &&
                    <div>
                      <Header>
                        Legendary Actions
                        <Header.Subheader>The {monster.name} can take 3 legendary actions, choosing from the options below. Only one legendary action option can be used at a time and only at the end of another creature\'s turn. The {monster.name} regains spent legendary actions at the start of its turn.</Header.Subheader>
                      </Header>
                      <List>
                      {
                        monster.legendary_actions.map((obj) => (
                          <List.Item key={obj.name}>
                            <strong>{obj.name}</strong>
                            <span>{obj.desc}</span>
                          </List.Item>
                        ))
                      }
                      </List>
                    </div>
                  }

                </Segment>
              </Segment.Group>
            </Segment>
          }
        </Modal.Content>
      </Modal>
    )
  }

  listItems = (items) => {
    var r;
    for (var i = 0; i < items.length; i++) {
      r += <List.Item><strong>{items[i].name}</strong><span>{items[i].desc}</span></List.Item>
    }
    return r;
  }
}
