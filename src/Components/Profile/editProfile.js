import React, { Component } from 'react'
import firebase, { Database, Auth, Providers } from './../../Lib/firebase'
import { Button, Divider, Grid, Header, Image, Label, List } from 'semantic-ui-react'
import { Form } from 'formsy-semantic-ui-react'
import Panel from './../../Components/Panel'
import ImageUploader from 'react-firebase-image-uploader';

export default class EditProfile extends Component {
    constructor(props){
        super(props)

        this.state = {
            user: null,
            loading: Auth.currentUser ? false : true,
            bio: '',

            isUploading: false,
            progress: 0,
        }

        this.link = this.link.bind(this)
        this.unlink = this.unlink.bind(this)
    }

    render() {
        return (
            <main>
                <Grid columns={3}>
                    <Grid.Column width={4}>
                        <Panel title="Photo" content={this.photo} loaded={true} />
                    </Grid.Column>

                    <Grid.Column width={8}>
                        <Panel title="Profile" content={this.content} loaded={!this.state.loading} />
                    </Grid.Column>

                    <Grid.Column width={4}>
                        <Panel title="Linked Accounts" content={this.linkedAccounts} loaded={true} />
                    </Grid.Column>
                </Grid>
            </main>
        )
    }

    content = () => {
        const errorLabel = <Label color="red" pointing/>
        return (
            <div>
                { this.state.user && (
                    <div>
                        <Form onValidSubmit={this.save}>
                            <Form.Input 
                                label='Display Name' 
                                type='text' 
                                name='displayName' 
                                value={this.state.displayName || this.state.user.displayName} 
                                onChange={(e) => this.setState({ displayName: e.target.value })}
                                validations="isWords"
                                validationError="Only letters are accepted"
                                errorLabel={ errorLabel }
                            />
                            <Form.Input 
                                label='Email Address' 
                                type='email' 
                                name='email' 
                                value={this.state.email || this.state.user.email} 
                                onChange={(e) => this.setState({ email: e.target.value })}
                                validations="isEmail"
                                validationError="This must be a valid email address"
                                errorLabel={ errorLabel }
                            />
                            <Form.TextArea label='Bio' name='bio' value={this.state.bio || (this.state.profile && this.state.profile.bio)} onChange={(e) => this.setState({ bio: e.target.value })}/>      
                            <Button content='Save' icon='save' type='submit' />                 
                        </Form>

                        {/*<Divider />

                        <Header>Setup Password Authentication</Header>
                        <Form onValidSubmit={this.setupPassword}>
                            <Form.Group>
                                <Form.Input 
                                    instantValidation
                                    width={8} 
                                    label='Password' 
                                    placeholder='Password' 
                                    name='password' 
                                    type='password' 
                                    value={this.state.password}
                                    onChange={(e) => this.setState({ password: e.target.value })}
                                    validations="minLength:6"
                                    validationError="Password must be at least 6 characters"
                                    errorLabel={ errorLabel }
                                />
                                <Form.Input 
                                    width={8} 
                                    label='&nbsp;' 
                                    placeholder='Password Confirmation' 
                                    name='passwordc' 
                                    type='password' 
                                    validations={{
                                        minLength:6,
                                        equalsField:'password'
                                    }}
                                    validationErrors={{
                                        minLength: "Password must be at least 6 characters",
                                        equalsField: "Password and confirmation don't match"
                                    }}
                                    errorLabel={ errorLabel }
                                />
                            </Form.Group>
                            <Button type='submit' content='Save' />
                        </Form>*/}
                    </div>
                )}       
            </div>
        )
    }

    save = () => {
        const { displayName, bio, email } = this.state

        this.state.user.updateProfile({ displayName })
            .then(r => {
                console.log(r)
                this.forceUpdate()
            })
            .catch(error => {
                console.log(error)
            })

        if(email) {
            this.state.user.updateEmail(email)
                .then(r => {
                    console.log(r)
                    this.forceUpdate()
                })
                .catch(error => {
                    console.log(error)
                })
        }

        if(bio) {
            Database.ref('userdata/'+this.state.user.uid+'/profile/bio').set(bio)
        }
    }

    setupPassword = () => {
        const password = this.state.password, 
        email = this.state.user.email

        const credential = firebase.auth.EmailAuthProvider.credential(email, password)

        Auth.currentUser.linkWithCredential(credential)
            .then(r => {
                console.log(r)
                this.forceUpdate()
            })
            .catch(error => {
                console.log(error)
            })
    }

    handleUploadStart = () => this.setState({isUploading: true, progress: 0})
    handleProgress = (progress) => this.setState({progress})
    handleUploadError = (error) => {
        this.setState({isUploading: false});
        console.error(error);
    }
    handleUploadSuccess = (filename) => {
        this.setState({avatar: filename, progress: 100, isUploading: false});
        firebase.storage().ref('images').child(filename).getDownloadURL().then(url => {
            this.setProfilePhoto(url)
        });
    };

    setProfilePhoto = (url) => {
        this.setState({photoURL: url})
        this.state.user.updateProfile({ photoURL: url })
            .then(r => {
                console.log(r)
                this.forceUpdate()
            })
            .catch(error => {
                console.log(error)
            })
    }

    photo = () => {
        if(this.state.user) {
            return (
                <div style={{textAlign: 'center'}}>
                    <Image centered src={this.state.photoURL || this.state.user.photoURL} size='small' />
                    { this.state.isUploading &&
                        <p>Progress: {this.state.progress}%</p>
                    }
                    <ImageUploader
                        name="avatar"
                        storageRef={firebase.storage().ref('images')}
                        onUploadStart={this.handleUploadStart}
                        onUploadError={this.handleUploadError}
                        onUploadSuccess={this.handleUploadSuccess}
                        onProgress={this.handleProgress}
                    />

                    { this.state.user.providerData.length > 0 && (
                        <div>
                            <Divider />

                            <Header>Social Accounts</Header>
                            <List horizontal>
                            { this.state.user.providerData.map(provider => {
                                console.log(provider)
                                if(provider.photoURL){
                                    return (
                                        <List.Item>
                                            <Image as='a'
                                                size='tiny' 
                                                src={provider.photoURL} 
                                                onMouseOver={(e) => 
                                                    e.target.src= provider.providerId === 'facebook.com' ? 'https://facebookbrand.com/wp-content/themes/fb-branding/prj-fb-branding/assets/images/fb-art.png' : 
                                                        provider.providerId === 'google.com' ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Google-favicon-2015.png/150px-Google-favicon-2015.png' : 
                                                        provider.providerId === 'twitter.com' ? 'https://seeklogo.com/images/T/twitter-2012-negative-logo-5C6C1F1521-seeklogo.com.png' :
                                                        provider.providerId === 'github.com' && 'https://image.flaticon.com/icons/png/512/25/25231.png' } 
                                                onMouseOut={(e) => 
                                                    e.target.src=provider.photoURL} 
                                                onClick={() => this.setProfilePhoto(provider.photoURL)}
                                                disabled={this.state.user.photoURL === provider.photoURL}
                                            />
                                        </List.Item>
                                    )
                                }
                                return false
                            })}
                            </List>
                        </div>
                    )}
                </div>
            )
        }

        return ''
    }

    linkedAccounts = () => {
        var linkedProviders = {}
        if(this.state.user) {
            for(var data of this.state.user.providerData){
                linkedProviders[data.providerId] = data.uid
            }
        }

        return (
            <div style={{textAlign: 'center'}}>
            <p style={{fontSize: '8pt'}}>Link different account to sign in with them.</p>
            <Divider />
            <List>
                <List.Item>
                    { linkedProviders['google.com'] ? (
                        <Button fluid color='google plus' icon='google' content='Unlink Google' onClick={() => this.unlink('google.com')} disabled={this.state.user.providerData.length === 1} />
                    ) : (
                        <Button fluid color='google plus' icon='google' content='Link with Google' onClick={() => this.link(Providers.Google)} loading={this.state.loading} />
                    )}
                </List.Item>
                <List.Item>
                    { linkedProviders['facebook.com'] ? (
                        <Button fluid color='facebook' icon='facebook' content='Unlink Facebook' onClick={() => this.unlink('facebook.com')} disabled={this.state.user.providerData.length === 1} />
                    ) : (
                        <Button fluid color='facebook' icon='facebook' content='Link with Facebook' onClick={() => this.link(Providers.Facebook)} loading={this.state.loading} />
                    )}
                </List.Item>
                <List.Item>
                    { linkedProviders['twitter.com'] ? (
                        <Button fluid color='twitter' icon='twitter' content='Unlink Twitter' onClick={() => this.unlink('twitter.com')} disabled={this.state.user.providerData.length === 1} />
                    ) : (
                        <Button fluid color='twitter' icon='twitter' content='Link with Twitter' onClick={() => this.link(Providers.Twitter)} loading={this.state.loading} />
                    )}
                </List.Item>
                <List.Item>
                    { linkedProviders['github.com'] ? (
                        <Button fluid icon='github' content='Unlink Github' onClick={() => this.unlink('github.com')} disabled={this.state.user.providerData.length === 1} />
                    ) : (
                        <Button fluid icon='github' content='Link with Github' onClick={() => this.link(Providers.Github)} loading={this.state.loading} />
                    )}
                </List.Item>
            </List>
            </div>
        )
    }

    link = (provider) => {
        this.state.user.linkWithPopup(provider)
            .then(r => {
                console.log(r)
                this.forceUpdate()
            })
            .catch(error => {
                console.log(error)
            })
    }

    unlink = (provider) => {
        this.state.user.unlink(provider)
            .then(r => {
                console.log(r)
                this.forceUpdate()
            })
            .catch(error => {
                console.log(error)
            })
    }

    componentDidMount() {
        Auth.onAuthStateChanged((user) => {
            if (user){
                Database.ref('userdata/'+user.uid+'/profile').on('value', snapshot =>{
                    this.setState({ profile: snapshot.val() })
                })
                this.setState({ user, loading: false })
            }
        })
    }
}