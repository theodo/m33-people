import React from 'react';
import Button from 'material-ui/Button';

import AppBar from './AppBar';
import List from './PeopleList';

const findCompanyById = (companies, companyId) =>
  companies.find(company => company.id === companyId);

class PeopleTabs extends React.Component {
  state = {
    selectedCompany: findCompanyById(
      this.props.companies,
      this.props.companyId
    ),
    companyId: this.props.companyId
  };

  handleTabChange = (event, index) => {
    const selectedCompany = findCompanyById(this.props.companies, index);
    this.setState({
      companyId: index,
      selectedCompany
    });
  };

  render() {
    const selectedCompany = findCompanyById(
      this.props.companies,
      this.state.selectedCompany.id
    );
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <AppBar
          companies={this.props.companies}
          companyId={this.state.companyId}
          onTabChange={this.handleTabChange}
        />
        <Button
          href="https://trello.com/b/JLBMh7wp"
          style={{ alignSelf: 'center' }}
        >
          Add someone
        </Button>
        <div style={{ display: 'flex', flex: 1 }}>
          {selectedCompany &&
            selectedCompany.people && (
              <List
                people={selectedCompany.people}
                companyEmails={this.props.companyEmails}
              />
            )}
        </div>
      </div>
    );
  }
}

export default PeopleTabs;
