import React from 'react';
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
      this.props.companyId,
    ),
  };

  handleTabChange = (event, index) => {
    this.setState({
      selectedCompany: findCompanyById(this.props.companies, index),
    });
  };

  handleChangeIndex = index => {
    this.setState({
      selectedCompany: this.props.companies[index],
    });
  };

  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <AppBar
          companies={this.props.companies}
          companyId={this.state.selectedCompany.id}
          onTabChange={this.handleTabChange}
        />
        <StyledViews>
          <SwipeableViews
            index={this.props.companies.indexOf(this.state.selectedCompany)}
            onChangeIndex={this.handleChangeIndex}
          >
            {this.props.companies.map(company => (
              <List
                key={company.id}
                people={company.people}
                companyEmails={this.props.companyEmails}
              />
            ))}
          </SwipeableViews>
        </StyledViews>
      </div>
    );
  }
}

export default PeopleTabs;
