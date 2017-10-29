import React, { Component } from 'react'

export default class Skype extends Component {
    componentDidMount() {
        let node = document.createElement('script')
        node.src = 'https://swc.cdn.skype.com/sdk/v1/sdk.min.js'
        node.type = 'text/javascript'
        node.async = true
        node.charset = 'utf-8'
        node.id ='skypeSDK'
        document.getElementsByTagName('head')[0].appendChild(node)
    }

    render() {
        return (<span id='skypeBtn' className="skype-button bubble" data-contact-id="robinkuiper.eu"></span>)
    }
}