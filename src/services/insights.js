import { auth, accounts, quotes } from 'wstrade-api';

export async function insights(event) {

  if (!event.access || !event.refresh || !event.expires) {
    return "Invalid authentication";
  }

  // Initialize the auth module with the state we were given by the user
  auth.use(event);

  // Retrieve all accounts under this Wealthsimple trade account
  const accs = await accounts.all();

  // Capture performance of all accounts in the past year
  const performance = {};
  await Promise.all(
    Object.keys(accs).map(async (account) => {
      if (!accs[account]) {
        return;
      }

      performance[account] = await accounts.history('1y', accs[account]);
    })
  );

  // return an object of the Wealthsimple data
  return {
    user: await accounts.me(),
    performance,
    securities: {
      history: {
        veqt: await quotes.history('VEQT:TSX', '1y')
      }
    }
  };
}
