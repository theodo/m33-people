import React, { Component } from 'react';
import {Tab, Tabs, List, ListItem, ListDivider, Link, Input} from 'react-toolbox';
import AuthorizeButton from './Authorize.jsx';
import People from '../services/People';
import { removeAccents, computeLegend } from '../services/Email';
import map from 'lodash/map';
import itemStyle from './item.scss';
import tabStyle from './tabs.scss';
import inputStyle from './input.scss';

class PeopleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      people: props.people,
    };
  }

  renderList(people) {
    const items = people.map(someone => {
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
      )
    })

    return (
      <List ripple>
        {items}
      </List>
    )
  }

  render () {
    return(
      this.renderList(this.state.people)
    );
  }
}

export default PeopleList;
