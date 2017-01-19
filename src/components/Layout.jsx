import React, { Component } from 'react';
import {Tab, Tabs, List, ListItem, ListDivider, Link} from 'react-toolbox';
import AuthorizeButton from './Authorize.jsx';
import map from 'lodash/map';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import itemStyle from './item.scss';

class Layout extends Component {
  state = {
    index: 0,
    isAuthenticated: window.localStorage.getItem('ta_dir_trello_token') !== null,
    companies: [],
  };

  componentDidMount() {
    if (this.state.isAuthenticated) {
      const token = window.localStorage.getItem('ta_dir_trello_token');
      window.Trello.setToken(token)
      this.getTabs()
    }
  }

  handleTabChange = (index) => {
    this.setState({index});
  };

  parsePeople(someoneCard) {
    var avatar = null
    if (someoneCard.attachments.length > 0) {
      avatar = someoneCard.attachments[0].url
    }

    const phoneRegex = /\[PHONE=(.+)\]/g
    const phoneMatch = phoneRegex.exec(someoneCard.desc)

    var phone = null
    if (phoneMatch) {
      phone = phoneMatch[1]
    }

    return {
      name: someoneCard.name,
      avatar: avatar,
      companyId: someoneCard.idList,
      phone: phone,
    }
  }

  getTabs() {
    window.Trello.get('/boards/JLBMh7wp/lists?fields=name', (lists) => {
      window.Trello.get('/boards/JLBMh7wp/cards?attachments=true', (cards) => {
        const people = sortBy(cards.map(this.parsePeople), 'name')
        const peopleByCompanyId = groupBy(people, 'companyId')
        this.setState({
          companies: lists.map(list => {
            return {
              id: list.id,
              name: list.name,
              people: peopleByCompanyId[list.id] || []
            }
          })
        });
      })
    })
  }

  onSignInSuccess() {
    this.setState({
      isAuthenticated: true,
    });
    this.getTabs()
  }

  renderList(people) {
    const items = people.map(someone => {
      const phoneCallToAction = <Link href={'tel:' + someone.phone} icon='phone' theme={itemStyle} />

      return (
        <ListItem
          key={someone.name}
          avatar={someone.avatar}
          caption={someone.name}
          legend={someone.phone}
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

  renderTabs() {
    if (this.state.companies.length === 0) {
      return null;
    }

    const tabs = this.state.companies.map(company => {
      return (
        <Tab key={company.id} label={company.name}>
          {this.renderList(company.people)}
        </Tab>
      )
    })

    return (
      <Tabs index={this.state.index} onChange={this.handleTabChange} fixed inverse>
        {tabs}
      </Tabs>
    );
  }

  render () {
    if (!this.state.isAuthenticated) {
      return (
        <AuthorizeButton
          onSignInSuccess={this.onSignInSuccess.bind(this)}
        />
      )
    }
    else {
      return this.renderTabs()
    }
  }
}

export default Layout;
