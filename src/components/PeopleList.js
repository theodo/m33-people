// @flow
import React from 'react';
import { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import PhoneIcon from 'material-ui-icons/Phone';
import { AutoSizer, List as InfiniteList } from 'react-virtualized';

import { computeLegend } from '../services/Email';
import { buildVCard } from '../services/People';

class PeopleList extends React.Component {
  itemRenderer = someone => {
    const legend = computeLegend(someone, this.props.companyEmails);
    return (
      <ListItem
        button
        key={someone.name}
        onClick={() => this.exportVcard(someone, this.props.companyEmails)}
      >
        <Avatar alt={someone.name} src={someone.avatar} />
        <ListItemText primary={someone.name} secondary={legend} />
        <IconButton
          onClick={event => event.preventDefault}
          color="primary"
          aria-label="call"
          href={`tel:${someone.phone}`}
        >
          <PhoneIcon />
        </IconButton>
      </ListItem>
    );
  };

  rowRenderer = ({ index, style }) => (
    <div key={index} style={style}>
      {this.itemRenderer(this.props.people[index])}
    </div>
  );

  exportVcard = (someone, companyEmails) => {
    /* global document */
    const card = buildVCard(someone, companyEmails);

    const src = `data:text/x-vcard;base64,${window.btoa(
      unescape(encodeURIComponent(card))
    )}`;
    const anchor = document.createElement('a');
    anchor.setAttribute('href', src);
    anchor.click();
  };

  render() {
    return (
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
    );
  }
}

export default PeopleList;
