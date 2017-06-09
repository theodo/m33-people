const removeAccents = (string) => {
  return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

const computeLegend = (someone, companyEmails) => {
  const splitedName = someone.name.split(' ');
  let legend = '';
  if(splitedName && splitedName[0] && splitedName[1]) {
    const firstName = removeAccents(splitedName[0].replace("-","").toLowerCase());
    const lastName = splitedName[2] ? `${splitedName[1].toLowerCase()[0]}${splitedName[2].toLowerCase()[0]}` : splitedName[1].toLowerCase()[0];
    if(companyEmails && someone.companyId) {
      let email = '';
      if(someone.email) {
        email = someone.email;
      } else {
        email = `${firstName}${lastName}${companyEmails[someone.companyId]}`;
      }
      legend = `${someone.phone} ; ${email}`;
    } else {
    legend = `${someone.phone}${someone.email}`
    }
  }
  return legend;
}

module.exports = {
  removeAccents,
  computeLegend,
};
