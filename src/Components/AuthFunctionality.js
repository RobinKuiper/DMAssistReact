import React, { Component } from 'react'
import { Auth } from './../Lib/firebase'
import { Button, Icon, Message } from 'semantic-ui-react'

export default class AuthFunctionality extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            mode: this.getParameterByName('mode'),
            actionCode: this.getParameterByName('oobCode'),
            apiKey: this.getParameterByName('apiKey'),
            continueUrl: this.getParameterByName('continueUrl'),
            success: false,
            error: null
        }

        switch(this.state.mode){
            case 'resetPassword': this.handleResetPassword; break;
            case 'recoverEmail': this.handleRecoverEmail; break;
            case 'verifyEmail':
                Auth.applyActionCode(this.state.actionCode)
                    .then(resp => {
                        this.setState({ success: true })
                    })  
                    .catch(error => {
                        this.setState({ error })
                    })    
            break;
            default: () => alert('Failure');
        }
    }

    render() {
        if(this.state.success) {
            return (
                <main>
                    <Message icon positive>
                        <Icon name='checkmark' />
                        <Message.Content>
                            <Message.Header>Email Verified</Message.Header>
                            <p>You have verified your email adres, thank you!</p>
                        </Message.Content>
                    </Message>
                </main>
            )
        } else {
            return (
                <main>
                    <Message icon error>
                        <Icon name='warning' />
                        <Message.Content>
                            <Message.Header>Something went wrong</Message.Header>
                            <p>There went something wrong with your verification.</p>
                            <Button content='Send me a new verification code' icon='mail' onClick={() => Auth.currentUser.sendEmailVerification()} />
                        </Message.Content>
                    </Message>
                </main>
            )
        }
    }

    getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    componentDidMount() {
        Auth.onAuthStateChanged((user) => {
          if (user){
              if(user.emailVerified) this.setState({ success: true })
          }
        })
    }
}