// @flow
import deburr from 'lodash/deburr';

const contactIsMatching = (contact, searchText) => {
  const lowerCaseSearchText = searchText.toLowerCase();
  const contactNameMatches = contact.name &&
    deburr(contact.name.toLowerCase()).indexOf(deburr(lowerCaseSearchText)) > -1;
  const contactPhoneMatches = contact.phone &&
    contact.phone.indexOf(lowerCaseSearchText) > -1;
  const transformedPhoneNumberMatches = contact.phone &&
    contact.phone.replace('+33', '0').indexOf(lowerCaseSearchText) > -1;
  return (
    contactNameMatches || contactPhoneMatches || transformedPhoneNumberMatches
  );
};

const getSearchedPeople = (companies: Array<*>, searchString: string): Array<*> => {
  return companies.reduce((previousPeople: any, company: any) => {
    const filteredPeople = company.people.filter(contact => (
      contactIsMatching(contact, searchString)
    ));
    return previousPeople.concat(filteredPeople);
  }, []);
};

export default getSearchedPeople;
