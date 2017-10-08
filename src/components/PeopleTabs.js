import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';

import List from './PeopleList';

function TabContainer(props) {
  return <div style={{ padding: 20, display: 'flex', height: '100%' }}>{props.children}</div>;
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const findCompanyById = (companies, companyId) => (
  companies.find(company => (
    company.id === companyId
  ))
);

class PeopleTabs extends Component {

  state = {
    selectedCompany: findCompanyById(this.props.companies, this.props.companyId),
    companyId: this.props.companyId,
  };

  handleTabChange = (event, index) => {
    const selectedCompany = findCompanyById(this.props.companies, index);
    this.setState({
      companyId: index,
      selectedCompany,
    });
  };

  render() {
    const selectedCompany = findCompanyById(this.props.companies, this.state.selectedCompany.id);
    return (
      <div>
        <AppBar position="static">
          <Tabs value={this.state.companyId} onChange={this.handleTabChange}>
            {
              this.props.companies.map(company => (
                <Tab
                  key={company.id}
                  value={company.id}
                  label={company.name.split('|')[0]}
                >
                  <a href="https://trello.com/b/JLBMh7wp">Add someone</a>
                </Tab>
              ))
            }
          </Tabs>
        </AppBar>
        <TabContainer>
          {
            selectedCompany && selectedCompany.people &&
            <List
              people={selectedCompany.people}
              companyEmails={this.props.companyEmails}
              companies={this.props.companies}
            />
          }
        </TabContainer>
      </div>
    );
  }
}

PeopleTabs.propTypes = {
  companies: PropTypes.arrayOf(PropTypes.object).isRequired,
  companyId: PropTypes.string.isRequired,
  companyEmails: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default PeopleTabs;
