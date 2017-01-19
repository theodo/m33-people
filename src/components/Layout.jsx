import React, { Component } from 'react';
import {Tab, Tabs} from 'react-toolbox';

class TabsExample extends Component {
  state = {
    index: 0,
  };

  handleTabChange = (index) => {
    this.setState({index});
  };

  render () {
    return (
      <Tabs index={this.state.index} onChange={this.handleTabChange} fixed>
        <Tab label='Theodo'><small>First Content</small></Tab>
        <Tab label='BAM'><small>Second Content</small></Tab>
        <Tab label='Theodo UK'><small>Third Content</small></Tab>
        <Tab label='Sicara'><small>Third Content</small></Tab>
      </Tabs>
    );
  }
}

export default TabsExample;
