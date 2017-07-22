import React, { Component } from 'react';
import { ListItem, Link } from 'react-toolbox';
import { AutoSizer, List as InfiniteList } from 'react-virtualized';

import { computeLegend } from '../services/Email';
import itemStyle from './item.scss';

class PeopleList extends Component {
  itemRenderer = (someone) => {
    const phoneCallToAction = <Link href={'tel:' + someone.phone} icon='phone' theme={itemStyle} />
    const legend = computeLegend(someone, this.props.companyEmails);
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
        {this.itemRenderer(this.props.people[index])}
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
              rowCount={this.props.people.length}
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
