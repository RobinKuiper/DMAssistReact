import React, { Component } from 'react'
import AlertContainer from 'react-alert'
import { Icon } from 'semantic-ui-react'

export default class Alert extends Component {
    alertOptions = {
        offset: 14,
        position: 'top left',
        theme: 'dark',
        time: 5000,
        transition: 'scale'
    }

    showAlert = (message, type, icon, time = 5000) => {
        this.msg.show(message, {
            time,
            type,
            icon: <Icon name={icon} />
        })
    }

    render() {
        return (
            <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        )
    }
}