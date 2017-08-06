import React, { Component } from 'react';
import { Input } from 'react-toolbox';
import AuthorizeButton from './Authorize';
import People from '../services/People';
import inputStyle from './input.scss';
import PeopleTabs from './Tabs.js';

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
      companyId: 'sddsadsa',
    });
    this.getCompanies();
  }

  getCompanies = () => {
    People.getCompanies((companies) => {
      const companyEmails = {};
      this.state.companies.map((company) => {
        companyEmails[company.id] = company.name.split('|')[1];
      });
      this.setState({
        companies,
        companyEmails,
        companyId: companies[0] ? companies[0].id : '',
      });
    });
  }

  handleSearchChange = (value) => {
    this.setState({ companies: People.searchPeople(value) });
  }

  render() {
    if (!this.state.isAuthenticated) {
      return (
        <AuthorizeButton
          onSignInSuccess={this.onSignInSuccess}
        />
      );
    }
    return (
      <div>
        <Input
          type="text"
          placeholder="Search a name or a phone number"
          onChange={this.handleSearchChange}
          theme={inputStyle}
        />
        {
          Object.keys(this.state.companyEmails).length === 0
          ? null
          : <PeopleTabs
            companies={this.state.companies}
            companyId={this.state.companyId}
            companyEmails={this.state.companyEmails}
          />
        }
      </div>
    );
  }
}

export default Layout;
