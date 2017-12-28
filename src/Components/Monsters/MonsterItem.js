import React from 'react'
import { Button, Item, List, Popup } from 'semantic-ui-react'
import { Auth } from './../../Lib/firebase'
import { Link } from 'react-router-dom'
import { formatCR, CRtoEXP } from './../../Lib/Common'

export const MonsterItem = ({ monster, encounter }) => (
    <Item key={monster.key}>
      <Item.Content  as={Link} to={monster.custom ? '/monster/'+monster.key+'/custom' : '/monster/'+monster.key} style={{marginBottom: 10}}>
        <Item.Header>{monster.name}</Item.Header>
        <Item.Meta>{monster.alignment} - {monster.size} {monster.type}</Item.Meta>
        <Item.Description>
          <List horizontal divided>
            <List.Item>{monster.hit_points} HP</List.Item>
            <List.Item>{monster.armor_class} AC </List.Item>
          </List>
        </Item.Description>
        <Item.Extra>
          CR {formatCR(monster.challenge_rating)} ({CRtoEXP(monster.challenge_rating) + ' XP'})
        </Item.Extra>
      </Item.Content>

      { Auth.currentUser && encounter &&
        <Popup content='Add to encounter' trigger={<Button floated='right' icon='plus' content={'Add to encounter: ' + encounter.name} onClick={() => this.encounters.addMonster(monster) } />} />
      }
    </Item>
)