// @flow
import React from 'react';
import Button from 'material-ui/Button';
import styled from 'styled-components';

const StyledContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

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
  };
  render() {
    return (
      <StyledContainer>
        <Button onClick={this.authorize} raised color="primary">
          Connect To Trello
        </Button>
      </StyledContainer>
    );
  }
}

export default AuthorizeButton;
