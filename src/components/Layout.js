// @flow
import * as React from 'react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import { CircularProgress } from 'material-ui/Progress';
import AuthorizeButton from './Authorize';

import { getCompanies } from '../services/People';
import getSearchedPeople from '../services/Search';
import PeopleTabs from './PeopleTabs';
import List from './PeopleList';

const appBarStyle = {
  backgroundColor: '#eb2f06',
};

const toolbarStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const toopbarTitleStyle = {
  fontSize: 22,
};

const linkStyle = {
  marginLeft: 10,
  color: 'white',
};

class Layout extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    const companies =
      JSON.parse(window.localStorage.getItem('ta_dir_companies')) || [];
    const isAuthenticated =
      window.localStorage.getItem('ta_dir_trello_token') !== null;

    this.state = {
      companyId: companies[0] ? companies[0].id : '',
      isAuthenticated,
      companyEmails: {},
      companies,
      searchString: '',
      allSearchedPeople: [],
    };
  }

  componentDidMount() {
    if (this.state.isAuthenticated) {
      const token = window.localStorage.getItem('ta_dir_trello_token');
      window.Trello.setToken(token);
      this.getCompanies();
    }
  }

  onSignInSuccess = () => {
    this.setState({
      isAuthenticated: true,
    });
    this.getCompanies();
  };

  getCompanies = () => {
    getCompanies(companies => {
      const companyEmails = {};
      companies.forEach(company => {
        companyEmails[company.id] = company.name.split('|')[1];
      });
      this.setState({
        companies,
        companyEmails,
        companyId: companies[0] ? companies[0].id : '',
      });
    });
  };

  handleSearchChange = (event: any) => {
    this.setState({
      allSearchedPeople: getSearchedPeople(
        this.state.companies,
        event.target.value,
      ),
      searchString: event.target.value,
    });
  };

  renderAuthorizedButton = () => (
    <AuthorizeButton onSignInSuccess={this.onSignInSuccess} />
  );

  renderLayout = () => (
    <React.Fragment>
      <AppBar style={appBarStyle} position="absolute">
        <Toolbar style={toolbarStyle}>
          <Typography
            style={toopbarTitleStyle}
            variant="headline"
            color="inherit"
            noWrap
          >
            This application is deprecated, please use :
            <a style={linkStyle} href="https://contacts.m33.network">
              https://contacts.m33.network
            </a>
          </Typography>
        </Toolbar>
      </AppBar>
      <Button
        href="https://trello.com/b/JLBMh7wp"
        style={{ alignSelf: 'center' }}
      >
        Add someone
      </Button>
      <TextField
        label="Search a name, phone number or skill"
        type="search"
        onChange={this.handleSearchChange}
        style={{ width: '100%', marginTop: 10 }}
      />
      {this.state.searchString.length === 0 ? (
        <PeopleTabs
          companies={this.state.companies}
          companyId={this.state.companyId}
          companyEmails={this.state.companyEmails}
        />
      ) : (
        <div style={{ display: 'flex', flex: 1 }}>
          <List
            people={this.state.allSearchedPeople}
            companyEmails={this.state.companyEmails}
          />
        </div>
      )}
    </React.Fragment>
  );

  renderLoader = () => (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress />
    </div>
  );

  renderContainer = () => {
    if (!this.state.isAuthenticated) {
      return this.renderAuthorizedButton();
    } else if (Object.keys(this.state.companyEmails).length === 0) {
      return this.renderLoader();
    }
    return this.renderLayout();
  };

  render() {
    return <React.Fragment>{this.renderContainer()}</React.Fragment>;
  }
}

export default Layout;
