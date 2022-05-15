require('dotenv').config();

const APP_URL = process.env.TEAM_CRM_APP_URL;
const iss = [
  `${APP_URL}/api/signup`,
  `${APP_URL}/api/login`,
  `${APP_URL}/api/private/company`,
  `${APP_URL}/api/private/user`,
  `${APP_URL}/profile`,
  `${APP_URL}/token`,
];

module.exports = iss;