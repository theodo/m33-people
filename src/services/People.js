import map from 'lodash/map';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';

var companies = [];

const parsePeople = (someoneCard) => {
  var avatar = null;
  if (someoneCard.attachments.length > 0) {
    avatar = someoneCard.attachments[0].url
  }
  const phoneRegex = /\[PHONE=(.+)\]/g;
  const emailRegex = /\[EMAIL=(.+)\]/g;
  const phoneMatch = phoneRegex.exec(someoneCard.desc);
  const emailMatch = emailRegex.exec(someoneCard.desc);
  var phone = null;
  var email = null;
  if (phoneMatch) {
    phone = phoneMatch[1];
  }
  if (emailMatch) {
    email = emailMatch[1];
  }

  return {
    name: someoneCard.name,
    avatar,
    companyId: someoneCard.idList,
    phone,
    email,
  };
};

const getCompanies = (callback) => {
  if (companies.length > 0) {
    return callback(companies);
  }
  window.Trello.get('/boards/JLBMh7wp/lists?fields=name', (lists) => {
    window.Trello.get('/boards/JLBMh7wp/cards?attachments=true', (cards) => {
      const people = sortBy(cards.map(parsePeople), 'name');
      const peopleByCompanyId = groupBy(people, 'companyId');
      companies = lists.map(list => ({
        id: list.id,
        name: list.name,
        people: peopleByCompanyId[list.id] || [],
      }));
      window.localStorage.setItem('ta_dir_companies', JSON.stringify(companies));
      callback(companies);
    });
  })
  .catch(() => {
    window.localStorage.removeItem('ta_dir_trello_token');
    if (window.confirm('You are not allow to use this application, maybee, you were not added to the trello board https://trello.com/b/JLBMh7wp/theodogithubio-m33-people-no-big-picture-to-load-faster-square-picture ; Go to the board ?')) {
      window.open('https://trello.com/b/JLBMh7wp/theodogithubio-m33-people-no-big-picture-to-load-faster-square-picture');
    }
  });
};

const contactIsMatching = (searchText) => {
  if (!searchText) {
    return false;
  }
  const lowerCaseSearchText = searchText.toLowerCase();
  return (contact) => {
    const contactNameMatches = contact.name && contact.name.toLowerCase().indexOf(lowerCaseSearchText) > -1;
    const contactPhoneMatches = contact.phone && contact.phone.indexOf(lowerCaseSearchText) > -1;
    const transformedPhoneNumberMatches = contact.phone && contact.phone.replace('+33', '0').indexOf(lowerCaseSearchText) > -1;
    return (
      contactNameMatches || contactPhoneMatches || transformedPhoneNumberMatches
    );
  };
};

const searchPeople = (searchText) => {
  if (!searchText) {
    return companies;
  }
  const filterFunc = contactIsMatching(searchText);
  const matchingCompanies = companies.reduce((matchingCompanies, company) => {
    const matchingPeople = company.people.filter(filterFunc);
    if (matchingPeople.length > 0) {
      matchingCompanies.push({
        id: company.id,
        name: company.name,
        people: matchingPeople,
      });
    }
    return matchingCompanies;
  }, []);
  return matchingCompanies;
};

module.exports = {
  getCompanies,
  searchPeople,
};
