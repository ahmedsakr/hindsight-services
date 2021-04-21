import { auth, accounts, quotes } from 'wstrade-api';

export async function insights(event) {

  if (!event.access || !event.refresh || !event.expires) {
    return "Invalid authentication";
  }

  // Initialize the auth module with the state we were given by the user
  auth.use(event);

  // Retrieve all accounts under this Wealthsimple trade account
  const accs = await accounts.all();

  // Capture performance for all accounts since they were opened
  // EXCEPT... for crypto, we only capture 1 year.
  // The data returned by crypto history for 'all' is not consistent with
  // all other accounts:
  // - crypto 'all' returns 7-day spaced records from 2018 (even though crypto
  //   first start being offered end of 2020)
  // - all other accounts 'all' return 1-day spaced records from when they were opened.
  const performance = {};
  await Promise.all(
    Object.keys(accs).map(async (account) => {
      if (!accs[account]) {
        return;
      }

      // Only pull 1 year for crypto due to asymmetric data mentioned above
      performance[account] = await accounts.history(account === 'crypto' ? '1y' : 'all', accs[account]);
    })
  );

  const securityIntervals = [ '1w', '1m', '3m', '1y', '5y' ];
  const fetchSecurityQuoteIntervals = async (security) => {
    const prices = {};
    await Promise.all(
      securityIntervals.map(async (interval) => {
        prices[interval] = await quotes.history(security, interval);
      }
    ));

    return prices;
  }

  // return an object of the Wealthsimple data
  return {
    user: await accounts.me(),
    accounts: accs,
    performance,
    securities: {
      history: {
        veqt: await fetchSecurityQuoteIntervals('VEQT:TSX')
      }
    },
    activities: await accounts.activities({ type: [ 'deposit' ] }),
  };
}
