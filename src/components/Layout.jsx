import React, { Component } from 'react';
import {Tab, Tabs, List, ListItem, ListDivider, Link, Input} from 'react-toolbox';
import AuthorizeButton from './Authorize.jsx';
import People from '../services/People';
import { removeAccents, computeLegend } from '../services/Email';
import map from 'lodash/map';
import itemStyle from './item.scss';
import tabStyle from './tabs.scss';
import inputStyle from './input.scss';
import PeopleList from './PeopleList';
import PeopleTabs from './Tabs.js';

class Layout extends Component {
  constructor(props) {
    super(props);

    const companies = JSON.parse(window.localStorage.getItem('ta_dir_companies')) || [];
    const isAuthenticated = window.localStorage.getItem('ta_dir_trello_token') !== null;

    this.state = {
      companyId: companies[0] ? companies[0].id : 0,
      isAuthenticated,
      companies,
    };
  }

  componentDidMount() {
    if (this.state.isAuthenticated) {
      const token = window.localStorage.getItem('ta_dir_trello_token');
      window.Trello.setToken(token)
      People.getCompanies((companies) => {
        const companyEmails = {}
        this.state.companies.map(company => {
          companyEmails[company.id] = company.name.split('|')[1];
        });
        this.setState({companies, companyEmails});
      });
    }
  }

  handleSearchChange = (value) => {
    this.setState({companies: People.searchPeople(value)});
  }

  onSignInSuccess = () => {
    this.setState({
      isAuthenticated: true,
    });
    this.getTabs();
  }

  render () {
    if (!this.state.isAuthenticated) {
      return (
        <AuthorizeButton
          onSignInSuccess={this.onSignInSuccess}
        />
      )
    }
    else {
      return (
        <div>
          <Input
            type="text"
            placeholder="Search a name or a phone number"
            onChange={this.handleSearchChange.bind(this)}
            theme={inputStyle}
          />
          <PeopleTabs companies={this.state.companies} companyId={this.state.companyId} />
        </div>
      )
    }
  }
}

export default Layout;
