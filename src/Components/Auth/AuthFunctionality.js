import React, { Component } from 'react'
import { Auth } from './../../Lib/firebase'
import LoginModal from './LoginModal'
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
            case 'resetPassword': this.handleResetPassword(); break;
            case 'recoverEmail': this.handleRecoverEmail(); break;
            case 'verifyEmail': this.verifyEmail(); break;
            default: return false;
        }
    }

    render() {
        if(this.state.success) {
            return (
                <main>
                    <Message icon positive>
                        <Icon name='checkmark' />
                        <Message.Content>
                        { this.state.mode === 'verifyEmail' && (<div>
                                <Message.Header>Email Verified</Message.Header>
                                <p>You have verified your email adres, thank you!</p>
                                { !this.state.user && <LoginModal trigger={<Button positive icon='user' content='Login!' />} />}
                        </div>)}
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
                        { this.state.mode === 'verifyEmail' && (<div>
                            <Message.Header>Something went wrong</Message.Header>
                            <p>There went something wrong with your verification.</p>
                            { this.state.user ? <Button content='Send me a new verification code' icon='mail' onClick={() => this.state.user.sendEmailVerification()} />
                            : <LoginModal trigger={<Button icon='user' content='Login' />} /> }
                        </div>)}
                        </Message.Content>
                    </Message>
                </main>
            )
        }
    }

    verifyEmail = () => {
        Auth.applyActionCode(this.state.actionCode)
            .then(resp => {
                this.setState({ success: true })
            })  
            .catch(error => {
                this.setState({ error })
            })    
    }

    getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    componentDidMount() {
        Auth.onAuthStateChanged((user) => {
          if (user){
              this.setState({ user })
              if(user.emailVerified) this.setState({ success: true })
              else this.verifyEmail()
          }
        })
    }
}