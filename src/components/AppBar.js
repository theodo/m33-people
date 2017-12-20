// @flow
import React from 'react';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';

const PeopleTabs = props => (
  <AppBar position="static">
    <Tabs
      value={props.companyId}
      onChange={props.onTabChange}
      scrollable
      scrollButtons="auto"
    >
      {props.companies.map(company => (
        <Tab
          key={company.id}
          value={company.id}
          label={company.name.split('|')[0]}
        />
      ))}
    </Tabs>
  </AppBar>
);

export default PeopleTabs;
