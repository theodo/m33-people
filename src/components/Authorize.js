import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-toolbox/lib/button';

import itemStyle from './item.scss';

class AuthorizeButton extends React.Component {
  constructor(props) {
    super(props);
    const trelloToken = window.localStorage.getItem('ta_dir_trello_token');
    if (trelloToken !== null) {
      this.authorize();
    }
  }

  authorize = () => {
    window.Trello.authorize({
      type: 'popup',
      name: 'Theodo Academy Directory',
      scope: {
        read: true,
      },
      expiration: 'never',
      success: () => {
        this.props.onSignInSuccess();
      },
      error: () => {
        console.warn('Error during Trello authorization');
      },
    });
  }
  render() {
    return (
      <div className={itemStyle.authorizeContainer}>
        <Button
          className="authorize-button"
          onClick={this.authorize}
          raised
          primary
          label="Connect To Trello"
        />
      </div>
    );
  }
}

AuthorizeButton.propTypes = {
  onSignInSuccess: PropTypes.func.isRequired,
};

export default AuthorizeButton;
