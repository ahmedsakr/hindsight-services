import { auth, accounts, quotes } from 'wstrade-api';

export async function insights(event) {

  if (!event.access || !event.refresh || !event.expires) {
    return "Invalid authentication";
  }

  // Initialize the auth module with the state we were given by the user
  auth.use(event);

  // Retrieve all accounts under this Wealthsimple trade account
  const accs = await accounts.all();

  // Capture performance of all accounts since they were opened
  const performance = {};
  await Promise.all(
    Object.keys(accs).map(async (account) => {
      if (!accs[account]) {
        return;
      }

      performance[account] = await accounts.history('all', accs[account]);
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
    performance,
    securities: {
      history: {
        veqt: await fetchSecurityQuoteIntervals('VEQT:TSX')
      }
    }
  };
}
