// @flow
import React from 'react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';
import AuthorizeButton from './Authorize';

import { getCompanies } from '../services/People';
import getSearchedPeople from '../services/Search';
import PeopleTabs from './PeopleTabs';
import List from './PeopleList';

class Layout extends React.Component {
  constructor(props) {
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

  handleSearchChange = event => {
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
      <Button
        href="https://trello.com/b/JLBMh7wp"
        style={{ alignSelf: 'center' }}
      >
        Add someone
      </Button>
      <TextField
        label="Search a name, a phone number or a skill"
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
