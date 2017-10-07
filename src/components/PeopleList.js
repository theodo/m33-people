import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListItem, Link } from 'react-toolbox';
import { AutoSizer, List as InfiniteList } from 'react-virtualized';

import { computeLegend } from '../services/Email';
import { buildVCard } from '../services/People';
import itemStyle from './item.scss';

class PeopleList extends Component {
  itemRenderer = (someone) => {
    const phoneCallToAction = <Link href={`tel:${someone.phone}`} icon="phone" theme={itemStyle} />;
    const legend = computeLegend(someone, this.props.companyEmails);
    return (
      <ListItem
        key={someone.name}
        avatar={someone.avatar}
        caption={someone.name}
        legend={legend}
        rightIcon={phoneCallToAction}
        onClick={() => this.exportVcard(someone, this.props.companyEmails)}
      />
    );
  }

  rowRenderer = ({ index, style }) => (
    <div
      key={index}
      style={style}
    >
      {this.itemRenderer(this.props.people[index])}
    </div>
  );

  exportVcard = (someone, companyEmails) => {
    /* global document */
    const card = buildVCard(someone, companyEmails);

    const src = `data:text/x-vcard;base64,${window.btoa(unescape(encodeURIComponent(card)))}`;
    const anchor = document.createElement('a');
    anchor.setAttribute('href', src);
    anchor.click();
  }

  render() {
    return (
      <div style={{ flex: '1 1 auto' }}>
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

PeopleList.propTypes = {
  people: PropTypes.arrayOf(PropTypes.object).isRequired,
  companyEmails: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default PeopleList;
