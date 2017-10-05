import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ListItem, Link } from 'react-toolbox';
import { AutoSizer, List as InfiniteList } from 'react-virtualized';
import vCard from 'vcard-generator';

import { computeLegend } from '../services/Email';
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
        onClick={this.exportVcard.bind(this, someone)}
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

  exportVcard(someone) {
    let card = vCard.generate({
      name: {
        familyName: someone.name.split(' ').slice(1).join(' '),
        givenName: someone.name.split(' ')[0]
      },
      works: [{
        organisation: 'Theodo'
      }],
      phones: [{
        type: 'work',
        text: someone.phone
      }],
      emails: [{
        type: 'work',
        text: someone.email
      }],
      photos: [{
        type: 'work',
        uri: someone.avatar
      }]
    });

    let src = 'data:text/x-vcard;base64,' + window.btoa(unescape(encodeURIComponent(card)));
    let anchor = document.createElement('a');
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
