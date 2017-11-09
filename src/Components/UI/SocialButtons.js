import React from 'react'
import { Button, Popup } from 'semantic-ui-react'

const SocialButtons = ({style}) => (
    <Button.Group id='SocialButtons' size='mini' style={style}>
        <Popup content='Follow us at Facebook!' trigger={<Button color='facebook' icon='facebook' as='a' href='https://www.facebook.com/DMAssist5e' target='_blank' />} />
        <Popup content='Skype me!' trigger={<Button color='blue' icon='skype' as='a' href='skype:robinkuiper.eu?chat' />} />
        <Popup content='Join our Discord!' trigger={<Button icon='phone square' as='a' href='https://discord.gg/VDqHRdz' target='_blank' />} />
    </Button.Group>

)
export default SocialButtons