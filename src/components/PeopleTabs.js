import React from 'react';
import Button from 'material-ui/Button';
import SwipeableViews from 'react-swipeable-views';
import styled from 'styled-components';

import AppBar from './AppBar';
import List from './PeopleList';

const StyledViews = styled.div`
  display: flex;
  flex: 1;
  > div {
    display: flex;
    flex: 1;
    div.react-swipeable-view-container {
      flex: 1;
    }
  }
`;

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

  handleChangeIndex = index => {
    const selectedCompany = this.props.companies[index];
    this.setState({
      companyId: selectedCompany.id,
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
        <StyledViews>
          <SwipeableViews
            index={this.props.companies.indexOf(this.state.selectedCompany)}
            onChangeIndex={this.handleChangeIndex}
          >
            {this.props.companies.map(company => {
              return (
                <List
                  key={company.id}
                  people={company.people}
                  companyEmails={this.props.companyEmails}
                />
              );
            })}
          </SwipeableViews>
        </StyledViews>
      </div>
    );
  }
}

export default PeopleTabs;
