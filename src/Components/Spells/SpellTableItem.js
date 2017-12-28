import React from 'react'
import { Grid, Header, Icon, Popup, Table } from 'semantic-ui-react'
import SpellModal from './SpellModal'
import { Link } from 'react-router-dom'

export const SpellTableItem = ({ spell }) => (
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
)