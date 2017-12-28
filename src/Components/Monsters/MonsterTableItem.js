import React from 'react'
import { Button, Grid, Header, Icon, Popup, Table } from 'semantic-ui-react'
import MonsterModal from './MonsterModal'
import { Auth } from './../../Lib/firebase'
import { Link } from 'react-router-dom'
import { formatCR, CRtoEXP } from './../../Lib/Common'

export const MonsterTableItem = ({ monster, encounter }) => (
    <Table.Row key={monster.key}>
      <Table.Cell>{formatCR(monster.challenge_rating)}</Table.Cell>
      <Table.Cell>
        <Grid>
          <Grid.Column width={14}>
            <MonsterModal monster={monster} trigger={<Header sub style={{cursor: 'pointer'}}>{monster.name}</Header>} />
            <span style={{fontSize: '8pt'}}>{monster.alignment} - {monster.size} {monster.type}</span>
          </Grid.Column>

          <Grid.Column width={2}>
            <Popup position='top center' content='Open in a new page' trigger={
              <Link to={monster.custom ? '/monster/'+monster.key+'/custom' : '/monster/'+monster.key}>
                <Icon name='external' />
              </Link>
            } />
          </Grid.Column>
        </Grid>
      </Table.Cell>
      <Table.Cell>{monster.hit_points}</Table.Cell>
      <Table.Cell>{monster.armor_class}</Table.Cell>
      <Table.Cell>{CRtoEXP(monster.challenge_rating) + ' XP'}</Table.Cell>
      { Auth.currentUser && encounter &&
        <Table.Cell>{(<Popup content='Add to encounter' trigger={<Button icon='plus' size='mini' onClick={() => this.encounters.addMonster(monster) } />} />)}</Table.Cell>
      }
    </Table.Row>
)