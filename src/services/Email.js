const removeAccents = (string) => {
  return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

const computeLegend = (someone, companyEmails) => {
  const phone = someone.phone;
  const email = computeEmail(someone, companyEmails);

  if (phone && !email) {
    return phone;
  }
  if (!phone && email) {
    return email;
  }
  if (phone && email) {
    return `${phone} - ${email}`;
  }
  return '';
}

const computeEmail = (someone, companyEmails) => {
  if (someone.email) {
    return someone.email;
  }

  if (someone.name) {
    const splitedName = removeAccents(someone.name).split(' ');
    if (splitedName && splitedName[0] && splitedName[1]) {
      const firstName = splitedName[0].replace('-', '').toLowerCase();
      const lastName = splitedName[2] ? `${splitedName[1].toLowerCase()[0]}${splitedName[2].toLowerCase()[0]}` : splitedName[1].toLowerCase()[0];
      if (companyEmails && someone.companyId) {
        return `${firstName}${lastName}${companyEmails[someone.companyId]}`;
      }
    }
  }

  return null;
}

module.exports = {
  removeAccents,
  computeLegend,
};
