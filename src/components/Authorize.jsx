import React from 'react';
import {Button} from 'react-toolbox/lib/button';
import {List, ListItem} from 'react-toolbox/lib/list';

class AuthorizeButton extends React.Component {
  constructor (props) {
    super(props);
    const trelloToken = window.localStorage.getItem('ta_dir_trello_token')
    if (trelloToken !== null) {
      this.authorize()
    }
  }
  authorize () {
    window.Trello.authorize({
      type: 'popup',
      name: 'Theodo Academy Directory',
      scope: {
        read: true,
      },
      expiration: 'never',
      success: () => {
        this.props.onSignInSuccess()
      },
      error: () => {
        console.warn('Error during Trello authorization');
      }
    });
  }
  render () {
    if (this.props.isAuthenticated) {
      return null
    } else {
      return (
        <Button onClick={this.authorize.bind(this)} raised primary label='Connect To Trello' />
      );
    }
  }
}

export default AuthorizeButton;
