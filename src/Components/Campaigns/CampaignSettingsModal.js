import React, { Component } from 'react'
import { Button, Grid, Header, Image, Label, Modal, Segment } from 'semantic-ui-react'
import { Form } from 'formsy-semantic-ui-react'
import ImageUploader from 'react-firebase-image-uploader';
import firebase, { Auth, Database } from './../../Lib/firebase'

export default class CampaignSettingsModal extends Component {
  constructor(props){
    super(props)

    this.state = {
      name: props.campaign.name,
      short_rest: props.campaign.settings.shortRest,
      long_rest: props.campaign.settings.longRest,
      round_duration: props.campaign.settings.roundDuration,

      isUploading: false,
      progress: 0,
    }
  }

  handleChange = (e, { name, value }) => { this.setState({ [name]: value })}

  save = () => {
    let update = {
      settings: {
        shortRest: this.state.short_rest,
        longRest: this.state.long_rest,
        roundDuration: this.state.round_duration
      }
    }

    Database.ref('userdata/'+Auth.currentUser.uid+'/campaigns/'+this.props.campaign.slug).update(update)
    this.setState({ open: null })
  }

  render() {
    const campaign = this.props.campaign
    const errorLabel = <Label color="red" pointing />

    return (
      <Modal 
        open={this.state.open} 
        onOpen={() => this.setState({ open: true }) } 
        onClose={() => this.setState({ open: false }) }
        closeIcon 
        trigger={this.props.trigger}>
        <Modal.Content>
          { campaign &&
            <Form size='massive' onValidSubmit={this.save}>
              {/*<Form.Input
                disabled
                required
                name='name'
                label='Name'
                type='text'
                value={this.state.name || campaign.name}
                onChange={this.handleChange}
                validations="minLength:2,isWords"
                validationErrors={{
                    minLength: 'Minimal length is 2 letters',
                    isWords: 'No numbers or special characters allowed',
                    isDefaultRequiredValue: 'Name is Required',
                }} 
                errorLabel={ errorLabel }
              />*/}
              
              <Grid>
                <Grid.Column width={8}>
                  <Header>Settings</Header>
                  <Segment basic>
                    <Form.Input
                      required

                      name='short_rest'
                      label='Short Rest'
                      type='text'
                      value={this.state.short_rest || campaign.settings.shortRest}
                      onChange={this.handleChange}
                      validationErrors={{
                          isDefaultRequiredValue: 'Short rest time is Required',
                      }} 
                      errorLabel={ errorLabel }
                    />
                    <Form.Input
                      required

                      name='long_rest'
                      label='Long Rest'
                      type='text'
                      value={this.state.long_rest || campaign.settings.longRest}
                      onChange={this.handleChange}
                      validationErrors={{
                          isDefaultRequiredValue: 'Long rest time is Required',
                      }} 
                      errorLabel={ errorLabel }
                    />
                    <Form.Input
                      required

                      name='round_duration'
                      label='Round Duration'
                      type='text'
                      value={this.state.round_duration || campaign.settings.roundDuration}
                      onChange={this.handleChange}
                      validationErrors={{
                          isDefaultRequiredValue: 'Round duration is Required',
                      }} 
                      errorLabel={ errorLabel }
                    />
                  </Segment>
                </Grid.Column>
              
                <Grid.Column width={8}>
                  <Header>Picture</Header>
                  <Segment basic>
                    <Image centered src={this.state.pictureURL || campaign.pictureURL} size='small' />
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
                  </Segment>
                </Grid.Column>
              </Grid>
              
              <Button size='massive' fluid type='submit' content='Save' positive icon='save' />
            </Form>
          }
        </Modal.Content>
      </Modal>
    )
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
          this.setCampaignPicture(url)
      });
  };
  setCampaignPicture = (url) => {
    this.setState({ pictureURL: url })
    Database.ref('userdata/'+Auth.currentUser.uid+'/campaigns/'+this.props.campaign.slug).update({ pictureURL: url })
  }
}
