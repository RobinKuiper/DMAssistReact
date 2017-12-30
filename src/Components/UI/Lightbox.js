import React from 'react'
import { Image, Modal } from 'semantic-ui-react'

export const Lightbox = ({ src, trigger }) => (
    <Modal 
        basic
        size='huge'
        blurred
        closeIcon 
        trigger={trigger}>
        <Modal.Content>
            <Image src={src} />
        </Modal.Content>
    </Modal>
)