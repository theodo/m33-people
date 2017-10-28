import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { CircularProgress } from 'material-ui/Progress';
import AuthorizeButton from './Authorize';

import People from '../services/People';
import PeopleTabs from './PeopleTabs';

class Layout extends Component {
  constructor(props) {
    super(props);

    const companies = JSON.parse(window.localStorage.getItem('ta_dir_companies')) || [];
    const isAuthenticated = window.localStorage.getItem('ta_dir_trello_token') !== null;

    this.state = {
      companyId: companies[0] ? companies[0].id : '',
      isAuthenticated,
      companyEmails: {},
      companies,
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
  }

  getCompanies = () => {
    People.getCompanies((companies) => {
      const companyEmails = {};
      companies.forEach((company) => {
        companyEmails[company.id] = company.name.split('|')[1];
      });
      this.setState({
        companies,
        companyEmails,
        companyId: companies[0] ? companies[0].id : '',
      });
    });
  }

  handleSearchChange = (event) => {
    this.setState({
      companies: People.searchPeople(event.target.value),
    });
  }

  renderAuthorizedButton = () => (
    <AuthorizeButton
      onSignInSuccess={this.onSignInSuccess}
    />
  );

  renderLayout = () => (
    <div>
      <TextField
        label="Search a name or a phone number"
        type="search"
        onChange={this.handleSearchChange}
        style={{ width: '100%', marginTop: 10 }}
      />
      <PeopleTabs
        companies={this.state.companies}
        companyId={this.state.companyId}
        companyEmails={this.state.companyEmails}
      />
    </div>
  );

  renderLoader = () => (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </div>
  )

  renderContainer = () => {
    if (!this.state.isAuthenticated) {
      return this.renderAuthorizedButton();
    } else if (Object.keys(this.state.companyEmails).length === 0) {
      return this.renderLoader();
    }
    return this.renderLayout();
  }

  render() {
    return (
      <div>
        { this.renderContainer() }
      </div>
    );
  }
}

export default Layout;
