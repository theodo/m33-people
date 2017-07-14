import React, { Component } from 'react';
import {Tab, Tabs, List, ListItem, ListDivider, Link, Input} from 'react-toolbox';
import AuthorizeButton from './Authorize.jsx';
import People from '../services/People';
import { removeAccents, computeLegend } from '../services/Email';
import map from 'lodash/map';
import itemStyle from './item.scss';
import tabStyle from './tabs.scss';
import inputStyle from './input.scss';
import { AutoSizer, List as InfiniteList } from 'react-virtualized';

class PeopleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      people: props.people,
      companyEmails: props.companyEmails
    };
  }

  componentWillRecieveProps(newProps) {
    console.log('newprops');
    this.setState = {
      people: newProps.people,
      companyEmails: newProps.companyEmails
    };
  }

  itemRenderer = (someone) => {
    const phoneCallToAction = <Link href={'tel:' + someone.phone} icon='phone' theme={itemStyle} />
    const legend = computeLegend(someone, this.state.companyEmails);
    return (
      <ListItem
        key={someone.name}
        avatar={someone.avatar}
        caption={someone.name}
        legend={legend}
        rightIcon={phoneCallToAction}
      />
    );
  }

  rowRenderer = ({ key, index, isScrolling, isVisible, style }) => {
    return (
      <div
        key={index}
        style={style}
      >
        {this.itemRenderer(this.state.people[index])}
      </div>
    )
  }

  render () {
    return(
      <div style={{flex: '1 1 auto'}}>
        <AutoSizer>
          {({ width, height }) => (
            <InfiniteList
              width={width}
              height={height}
              rowCount={this.state.people.length}
              rowHeight={72}
              rowRenderer={this.rowRenderer}
            />
          )}
        </AutoSizer>
      </div>
    );
  }
}

export default PeopleList;
