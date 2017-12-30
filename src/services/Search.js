// @flow
import deburr from 'lodash/deburr';

const contactIsMatching = (contact, searchText) => {
  const lowerCaseSearchText = searchText.toLowerCase();
  const contactNameMatches =
    contact.name &&
    deburr(contact.name.toLowerCase()).indexOf(deburr(lowerCaseSearchText)) >
      -1;
  const contactPhoneMatches =
    contact.phone && contact.phone.indexOf(lowerCaseSearchText) > -1;
  const transformedPhoneNumberMatches =
    contact.phone &&
    contact.phone.replace('+33', '0').indexOf(lowerCaseSearchText) > -1;
  const skillsMatches = (contact) => {
    if (!contact.skills) {
      return false;
    }

    for (const skillIndex in contact.skills) {
      if (contact.skills[skillIndex].indexOf(lowerCaseSearchText) > -1) {
        return true;
      }
    }

    return false;
  };

  return (
    contactNameMatches || contactPhoneMatches || transformedPhoneNumberMatches || skillsMatches(contact)
  );
};

const getSearchedPeople = (
  companies: Array<*>,
  searchString: string,
): Array<*> =>
  companies.reduce((previousPeople: any, company: any) => {
    const filteredPeople = company.people.filter(contact =>
      contactIsMatching(contact, searchString));
    return previousPeople.concat(filteredPeople);
  }, []);

export default getSearchedPeople;
