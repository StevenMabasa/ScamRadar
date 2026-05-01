import {
  DIFFICULTIES,
  PLAYABLE_CATEGORIES,
  advancedSignals,
  banks,
  beginnerSignals,
  cryptoBrands,
  deliveryCompanies,
  fakeDomains,
  intermediateSignals,
  jobPlatforms,
  marketplaces,
  retailers,
  safeDomains,
  scamTactics,
  socialPlatforms,
  urgencyPhrases,
} from '../data/scamTemplates';
import { difficultyPoints } from './scoring';

const names = ['Thabo', 'Aisha', 'Lerato', 'Mia', 'Daniel', 'Kabelo', 'Priya', 'Jordan'];
const timeLimits = ['within 2 hours', 'before 5 PM', 'in the next 30 minutes', 'today only'];
const amounts = [350, 499, 750, 1200, 2400, 5000, 8500, 12000];
const fees = [19, 24, 39, 79, 150, 299, 350, 499];

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function maybe(probability = 0.5) {
  return Math.random() < probability;
}

function makeId() {
  return `scenario-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function makeLink(path = 'verify') {
  return `https://${pick(fakeDomains)}/${path}-${Math.random().toString(36).slice(2, 6)}`;
}

function officialLink(path = 'support') {
  return `https://${pick(safeDomains)}/${path}`;
}

function getDifficultySignals(difficulty) {
  if (difficulty === 'Advanced') return advancedSignals;
  if (difficulty === 'Intermediate') return intermediateSignals;
  return beginnerSignals;
}

function scamTone(difficulty, obvious, realistic, subtle) {
  if (difficulty === 'Advanced') return subtle;
  if (difficulty === 'Intermediate') return realistic;
  return obvious;
}

function emailSender(brand, suspicious = false) {
  return suspicious
    ? `${brand} Support <security@${brand.toLowerCase().replaceAll(' ', '')}-${pick(fakeDomains)}>`
    : `${brand} Support <notifications@${pick(safeDomains)}>`;
}

function buildScam(category, difficulty) {
  const bank = pick(banks);
  const courier = pick(deliveryCompanies);
  const platform = pick(socialPlatforms);
  const marketplace = pick(marketplaces);
  const jobPlatform = pick(jobPlatforms);
  const cryptoBrand = pick(cryptoBrands);
  const retailer = pick(retailers);
  const urgency = pick(urgencyPhrases);
  const timeLimit = pick(timeLimits);
  const amount = pick(amounts);
  const fee = pick(fees);
  const fakeLink = makeLink(category.toLowerCase().replaceAll(' ', '-'));
  const signals = getDifficultySignals(difficulty);

  const common = {
    type: 'scam',
    isScam: true,
    link: fakeLink,
    points: difficultyPoints[difficulty],
    redFlags: signals,
  };

  switch (category) {
    case 'Phishing Email':
      return {
        ...common,
        sender: emailSender(retailer, true),
        subject: scamTone(
          difficulty,
          'URGENT: Your account has errors!!!',
          `Action needed for your ${retailer} profile`,
          `Review recent account activity for ${retailer}`,
        ),
        message: scamTone(
          difficulty,
          `Dear customer, your ${retailer} account is broken. Login ${urgency} at ${fakeLink} or account will close.`,
          `We detected unusual sign-in activity on your ${retailer} profile. Please confirm your details ${timeLimit}: ${fakeLink}`,
          `A recent security review requires a profile confirmation. Use this secure case link ${fakeLink} and complete the form before the case expires.`,
        ),
        explanation:
          'The message pushes you to use a non-official link and pressures you to act quickly. Real companies do not require password or profile verification through random domains.',
        safeAction: `Open the official ${retailer} app or website yourself and check notifications there.`,
      };
    case 'Fake SMS':
      return {
        ...common,
        sender: `${bank}-ALERT`,
        subject: undefined,
        message: scamTone(
          difficulty,
          `${bank}: Accnt BLOCKED. Verify now ${fakeLink} ${urgency}.`,
          `${bank} security notice: a new device login was detected. Verify this was you ${timeLimit}: ${fakeLink}`,
          `${bank}: We paused a profile change request. Review the case reference using ${fakeLink} if you did not request it.`,
        ),
        redFlags: [scamTactics.suspiciousLink, scamTactics.threat, scamTactics.urgent],
        explanation:
          'The SMS uses a bank name but sends you to an unrelated link. Banks will not ask you to enter credentials or OTPs through a link in an unexpected SMS.',
        safeAction: `Open the official ${bank} app, call the number on your card, or visit the official website manually.`,
      };
    case 'WhatsApp Scam':
      return {
        ...common,
        sender: pick(names),
        message: scamTone(
          difficulty,
          `Hi its me. Lost phone. Need R${amount} now plz send to this number, will explain later.`,
          `Hey, I am using a borrowed phone. I need R${amount} urgently for transport. Please send it now and do not call.`,
          `I am in a meeting and cannot talk. Could you help with R${amount}? Please send it to this temporary wallet and I will settle tonight.`,
        ),
        redFlags: [scamTactics.emotion, scamTactics.payment, scamTactics.bypass],
        explanation:
          'The message applies emotional pressure, asks for money, and discourages normal verification. This is common in impersonation scams.',
        safeAction: 'Call the person on their usual number or verify through another trusted contact before sending money.',
      };
    case 'Fake Job Offer':
      return {
        ...common,
        sender: `Recruitment Team <offers@${pick(fakeDomains)}>`,
        subject: `Remote role selected via ${jobPlatform}`,
        message: scamTone(
          difficulty,
          `Congratulations! You selected for remote job paying R${amount} per week. Pay R${fee} registration fee here: ${fakeLink}`,
          `Your ${jobPlatform} profile was shortlisted for a remote assistant role paying R${amount} per week. A once-off R${fee} verification fee secures onboarding: ${fakeLink}`,
          `We are finalising candidates for a remote operations role. To activate payroll screening, complete the refundable R${fee} compliance step here: ${fakeLink}`,
        ),
        redFlags: [scamTactics.payment, scamTactics.tooGood, scamTactics.suspiciousLink],
        explanation:
          'Legitimate employers do not ask candidates to pay registration, screening, or equipment fees to secure work.',
        safeAction: `Verify the role inside ${jobPlatform} or on the employer's official careers page before sharing documents or paying anything.`,
      };
    case 'Banking Scam':
      return {
        ...common,
        sender: emailSender(bank, true),
        subject: `${bank} account verification required`,
        message: scamTone(
          difficulty,
          `Your ${bank} account has been temporarily blocked. Verify your identity here: ${fakeLink} ${urgency}.`,
          `We noticed a failed debit order and limited your ${bank} profile. Restore access ${timeLimit}: ${fakeLink}`,
          `A risk review placed a temporary hold on selected online banking features. Confirm your profile using case portal ${fakeLink}.`,
        ),
        redFlags: [scamTactics.threat, scamTactics.suspiciousLink, scamTactics.personalInfo],
        explanation:
          'The sender claims to be a bank but uses a fake verification portal. The threat of suspension is designed to make you rush.',
        safeAction: `Use the official ${bank} app or call the verified support number. Never share OTPs or passwords.`,
      };
    case 'Delivery Scam':
      return {
        ...common,
        sender: `${courier} Parcel Desk`,
        subject: `Delivery action required`,
        message: scamTone(
          difficulty,
          `Your package could not be delivered. Pay a small redelivery fee of R${fee} here: ${fakeLink}.`,
          `${courier}: We need address confirmation and R${fee} customs handling before delivery can continue: ${fakeLink}`,
          `A delivery exception was logged for parcel ZA${amount}. Confirm your preferred redelivery window and settle R${fee} at ${fakeLink}.`,
        ),
        redFlags: [scamTactics.payment, scamTactics.suspiciousLink, scamTactics.urgent],
        explanation:
          'Small delivery fees are a common hook. The link is not an official courier domain and may capture card details.',
        safeAction: `Track the parcel directly on the official ${courier} website or app using a known tracking number.`,
      };
    case 'Marketplace Scam':
      return {
        ...common,
        sender: `${pick(names)} via ${marketplace}`,
        subject: 'Payment confirmation',
        message: scamTone(
          difficulty,
          `I paid. See proof here ${fakeLink}. Release item now, courier is waiting.`,
          `Payment is done through buyer protection. Open ${fakeLink} to confirm and hand over the item to my driver.`,
          `The platform is holding my payment until you confirm dispatch at ${fakeLink}. Please complete it so the courier can collect today.`,
        ),
        redFlags: [scamTactics.bypass, scamTactics.suspiciousLink, scamTactics.urgent],
        explanation:
          'The buyer tries to move verification to a fake link and rushes you to release the item before confirmed payment.',
        safeAction: 'Confirm money in your own bank account or marketplace dashboard before releasing goods.',
      };
    case 'Giveaway Scam':
      return {
        ...common,
        sender: `${retailer} Rewards`,
        subject: 'Prize claim selected',
        message: scamTone(
          difficulty,
          `You won a brand-new iPhone! Claim your prize now by entering your banking details here: ${fakeLink}.`,
          `${retailer} selected your number for a customer reward. Complete prize verification ${urgency}: ${fakeLink}`,
          `You are on the reserved list for an unclaimed promotional device. Confirm delivery eligibility at ${fakeLink}.`,
        ),
        redFlags: [scamTactics.tooGood, scamTactics.personalInfo, scamTactics.suspiciousLink],
        explanation:
          'Unexpected prizes that require banking details or a claim link are almost always scams.',
        safeAction: `Check competitions on the official ${retailer} channels and never enter banking details to claim surprise prizes.`,
      };
    case 'Crypto Scam':
      return {
        ...common,
        sender: `${cryptoBrand} Growth Desk`,
        subject: 'Guaranteed crypto allocation',
        message: scamTone(
          difficulty,
          `Invest R${amount} today and receive double by tomorrow. Limited spots: ${fakeLink}`,
          `${cryptoBrand} opened a high-yield wallet for South African clients. Deposit R${amount} ${urgency} to activate returns: ${fakeLink}`,
          `Your invite code qualifies for a managed crypto pool. The onboarding desk requires an initial R${amount} liquidity transfer via ${fakeLink}.`,
        ),
        redFlags: [scamTactics.tooGood, scamTactics.payment, scamTactics.urgent],
        explanation:
          'Guaranteed returns, pressure to deposit, and private investment links are classic crypto fraud signals.',
        safeAction: 'Treat guaranteed investment returns as a scam signal and research financial providers through official regulators.',
      };
    case 'Social Media Scam':
    default:
      return {
        ...common,
        sender: `${platform} Security`,
        subject: 'Creator verification notice',
        message: scamTone(
          difficulty,
          `${platform}: Your account violates rules. Login here ${fakeLink} or lose access ${urgency}.`,
          `${platform} support: Your profile is eligible for verification. Confirm ownership ${timeLimit}: ${fakeLink}`,
          `A rights complaint was submitted against your ${platform} profile. Review appeal documents at ${fakeLink} before restrictions apply.`,
        ),
        redFlags: [scamTactics.threat, scamTactics.suspiciousLink, scamTactics.personalInfo],
        explanation:
          'The message imitates platform support and sends you to an unrelated domain to steal login details.',
        safeAction: `Open ${platform} directly and check account status in the app settings or help center.`,
      };
  }
}

function buildSafe(category, difficulty) {
  const bank = pick(banks);
  const courier = pick(deliveryCompanies);
  const platform = pick(socialPlatforms);
  const marketplace = pick(marketplaces);
  const jobPlatform = pick(jobPlatforms);
  const retailer = pick(retailers);
  const link = difficulty === 'Advanced' && maybe(0.35) ? officialLink('help') : undefined;

  const common = {
    type: 'safe',
    isScam: false,
    redFlags: [],
    points: difficultyPoints[difficulty],
    link,
  };

  switch (category) {
    case 'Phishing Email':
      return {
        ...common,
        sender: emailSender(retailer, false),
        subject: `Your ${retailer} profile was updated`,
        message: `Your ${retailer} profile settings were updated. If this was not you, open the official ${retailer} app or website and review your account security settings.`,
        explanation:
          'This message avoids asking for passwords, OTPs, payment, or personal information. It tells you to use the official app or website.',
        safeAction: `Open ${retailer} directly if you want to review the change.`,
      };
    case 'Fake SMS':
      return {
        ...common,
        sender: `${bank}-INFO`,
        message: `${bank}: Your card ending 4821 was used for a purchase. If this was not you, open your banking app or call the number on your card.`,
        explanation:
          'The SMS gives an informational alert and directs you to official channels instead of asking you to click a verification link.',
        safeAction: `Use the official ${bank} app or verified phone number if you need to dispute the transaction.`,
      };
    case 'WhatsApp Scam':
      return {
        ...common,
        sender: pick(names),
        message: `Hi, I changed my number. Please call my old number first to confirm before updating this contact.`,
        explanation:
          'The sender encourages independent verification and does not ask for money, OTPs, or secrecy.',
        safeAction: 'Verify the number change through a known contact method before saving it.',
      };
    case 'Fake Job Offer':
      return {
        ...common,
        sender: `${jobPlatform} Jobs <alerts@${pick(safeDomains)}>`,
        subject: 'Saved job alert',
        message: `${jobPlatform} found new roles matching your saved search. Review openings by signing in to your ${jobPlatform} account or visiting the employer career page directly.`,
        explanation:
          'The message does not promise guaranteed work, ask for fees, or request identity documents through a random link.',
        safeAction: `Review roles from your ${jobPlatform} account and apply through official employer pages.`,
      };
    case 'Banking Scam':
      return {
        ...common,
        sender: `${bank} Notifications`,
        subject: 'Monthly statement available',
        message: `${bank}: Your monthly statement is available. Sign in through the official app to view it. We will never ask for your password or OTP by message.`,
        explanation:
          'It uses safe guidance, avoids embedded credential links, and reminds you not to share passwords or OTPs.',
        safeAction: `Open the official ${bank} app to view statements.`,
      };
    case 'Delivery Scam':
      return {
        ...common,
        sender: `${courier} Tracking`,
        subject: 'Package delivered',
        message: `Your ${courier} package has been delivered. You can view delivery status by opening the official ${courier} app or website.`,
        explanation:
          'The message does not request a redelivery fee or personal information through a third-party link.',
        safeAction: `Use the official ${courier} tracking page if you need delivery proof.`,
      };
    case 'Marketplace Scam':
      return {
        ...common,
        sender: `${marketplace} Safety`,
        subject: 'Selling reminder',
        message: `${marketplace} reminder: Keep chats on the platform and wait for confirmed payment before releasing an item.`,
        explanation:
          'This is a safety reminder and does not ask you to bypass payment protections or click a suspicious proof-of-payment link.',
        safeAction: 'Use platform messaging and confirm payment independently before handing over goods.',
      };
    case 'Giveaway Scam':
      return {
        ...common,
        sender: `${retailer} Newsletter`,
        subject: 'Weekly deals',
        message: `${retailer} weekly deals are available in the official app. Competitions and winners are listed on our verified channels.`,
        explanation:
          'It does not say you unexpectedly won, demand banking details, or pressure you to claim a prize immediately.',
        safeAction: `Check deals and competitions through verified ${retailer} channels.`,
      };
    case 'Crypto Scam':
      return {
        ...common,
        sender: 'Security Reminder',
        subject: 'Investment safety reminder',
        message:
          'Reminder: No legitimate investment can guarantee returns. Research providers, avoid pressure tactics, and never send funds to unknown wallets.',
        explanation:
          'This is educational guidance, not an offer asking for deposits, wallet keys, or urgent investment action.',
        safeAction: 'Verify any financial provider through official regulatory sources before investing.',
      };
    case 'Social Media Scam':
    default:
      return {
        ...common,
        sender: `${platform} Notifications`,
        subject: 'New login notification',
        message: `${platform}: A new login was detected. If this was not you, open the ${platform} app directly and review security settings.`,
        explanation:
          'The message points you to the official app and does not request your password through a link.',
        safeAction: `Open ${platform} directly and review your active sessions.`,
      };
  }
}

export function generateScenario(category = 'Random', difficulty = 'Beginner') {
  const selectedDifficulty = DIFFICULTIES.includes(difficulty) ? difficulty : 'Beginner';
  const selectedCategory = category === 'Random' ? pick(PLAYABLE_CATEGORIES) : category;
  const shouldBeScam = maybe(selectedDifficulty === 'Advanced' ? 0.58 : 0.64);
  const scenario = shouldBeScam
    ? buildScam(selectedCategory, selectedDifficulty)
    : buildSafe(selectedCategory, selectedDifficulty);

  return {
    id: makeId(),
    category: selectedCategory,
    difficulty: selectedDifficulty,
    isDailyChallenge: category === 'Random',
    ...scenario,
  };
}
