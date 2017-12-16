// @flow
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import startCase from 'lodash/startCase';
import { computeEmail } from './Email';

let companies = [];

const parsePeople = (someoneCard) => {
  let avatar = null;
  if (someoneCard.attachments.length > 0) {
    avatar = someoneCard.attachments[0].url;
  }
  const phoneRegex = /\[PHONE=(.+)\]/g;
  const emailRegex = /\[EMAIL=(.+)\]/g;
  const skillsRegex = /\[SKILLS=(.+)\]/g;
  const phoneMatch = phoneRegex.exec(someoneCard.desc);
  const emailMatch = emailRegex.exec(someoneCard.desc);
  const skillsMatch = skillsRegex.exec(someoneCard.desc);
  let phone = null;
  let email = null;
  let skills = null;

  if (phoneMatch) {
    phone = phoneMatch[1];
  }
  if (emailMatch) {
    email = emailMatch[1];
  }
  if (skillsMatch) {
    skills = skillsMatch[1].split(',');
  }

  return {
    name: someoneCard.name,
    avatar,
    companyId: someoneCard.idList,
    phone,
    email,
    skills,
  };
};

export const getCompanies = (callback) => {
  if (companies.length > 0) {
    return callback(companies);
  }
  return window.Trello.get('/boards/JLBMh7wp/lists?fields=name', (lists) => {
    window.Trello.get('/boards/JLBMh7wp/cards?attachments=true', (cards) => {
      const people = sortBy(cards.map(parsePeople), 'name');
      const peopleByCompanyId = groupBy(people, 'companyId');
      companies = lists.map(list => ({
        id: list.id,
        name: list.name,
        people: peopleByCompanyId[list.id] || [],
      }));
      window.localStorage.setItem(
        'ta_dir_companies',
        JSON.stringify(companies),
      );
      callback(companies);
    });
  }).catch(() => {
    window.localStorage.removeItem('ta_dir_trello_token');
    /* eslint no-alert: "off" */
    if (
      window.confirm(
        'You are not allow to use this application, maybe, you were not added to the trello board https://trello.com/b/JLBMh7wp/theodogithubio-m33-people-no-big-picture-to-load-faster-square-picture ; Go to the board ?',
      )
    ) {
      window.open(
        'https://trello.com/b/JLBMh7wp/theodogithubio-m33-people-no-big-picture-to-load-faster-square-picture',
      );
    }
  });
};

const buildCompanyName = (companyEmail) => {
  if (companyEmail === '@theodo.co.uk') return 'Theodo UK';
  if (companyEmail === '@bam.tech') return 'BAM';
  return startCase(companyEmail.match(/@(.+)\./)[1]);
};

export const buildVCard = (someone, companyEmails) => {
  const lastName = someone.name
    .split(' ')
    .slice(1)
    .join(' ');
  const firstName = someone.name.split(' ')[0];
  const company = buildCompanyName(companyEmails[someone.companyId]);

  return `BEGIN:VCARD
VERSION:3.0
N:${lastName};${firstName};;;
EMAIL;TYPE=work:${computeEmail(someone, companyEmails)}
TEL;TYPE=work:${someone.phone}
ORG:${company}
PHOTO;TYPE=work:${someone.avatar}
END:VCARD`;
};
