export const CATEGORIES = [
  'Phishing Email',
  'Fake SMS',
  'WhatsApp Scam',
  'Fake Job Offer',
  'Banking Scam',
  'Delivery Scam',
  'Marketplace Scam',
  'Giveaway Scam',
  'Crypto Scam',
  'Social Media Scam',
  'Random',
];

export const PLAYABLE_CATEGORIES = CATEGORIES.filter((category) => category !== 'Random');

export const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

export const banks = ['Capitec', 'FNB', 'Standard Bank', 'Absa', 'Nedbank'];
export const deliveryCompanies = ['DHL', 'FedEx', 'Aramex', 'Courier Guy', 'PAXI'];
export const jobPlatforms = ['LinkedIn', 'Indeed', 'PNet'];
export const socialPlatforms = ['Instagram', 'Facebook', 'TikTok', 'WhatsApp'];
export const marketplaces = ['Facebook Marketplace', 'Gumtree', 'Yaga', 'OLX'];
export const cryptoBrands = ['CoinNest', 'BlockVault', 'CryptoWave', 'TokenHub'];
export const retailers = ['Takealot', 'Checkers Sixty60', 'Woolworths', 'Makro'];

export const urgencyPhrases = [
  'within 2 hours',
  'immediately',
  'today only',
  'before your account is closed',
  'to avoid suspension',
];

export const fakeDomains = [
  'secure-login-help.com',
  'account-verify-now.net',
  'claim-prize-online.com',
  'delivery-fee-payments.com',
  'job-registration-portal.com',
];

export const safeDomains = [
  'support.example',
  'help.example',
  'orders.example',
  'careers.example',
];

export const scamTactics = {
  urgent: 'Urgent language',
  suspiciousLink: 'Suspicious link',
  personalInfo: 'Requests personal information',
  payment: 'Requests payment or upfront fee',
  tooGood: 'Too good to be true',
  unknownSender: 'Unknown sender',
  grammar: 'Poor grammar',
  threat: 'Threatens account closure',
  bypass: 'Asks user to bypass official channels',
  emotion: 'Uses emotional manipulation',
};

export const beginnerSignals = [
  scamTactics.suspiciousLink,
  scamTactics.urgent,
  scamTactics.grammar,
];

export const intermediateSignals = [
  scamTactics.suspiciousLink,
  scamTactics.personalInfo,
  scamTactics.bypass,
];

export const advancedSignals = [
  scamTactics.suspiciousLink,
  scamTactics.bypass,
  scamTactics.unknownSender,
];
