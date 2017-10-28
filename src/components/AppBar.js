import React from 'react';
import PropTypes from 'prop-types';
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
      {
        props.companies.map(company => (
          <Tab
            key={company.id}
            value={company.id}
            label={company.name.split('|')[0]}
          />
        ))
      }
    </Tabs>
  </AppBar>
);

PeopleTabs.propTypes = {
  companies: PropTypes.arrayOf(PropTypes.object).isRequired,
  companyId: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default PeopleTabs;
