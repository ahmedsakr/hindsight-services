import { auth, accounts } from 'wstrade-api';

export async function insights(event) {

  if (!event.access || !event.refresh || !event.expires) {
    return "Invalid authentication";
  }

  // Initialize the auth module with the state we were given by the user
  auth.use(event);

  // Fetch all data we need from Wealthsimple.
  const data = await Promise.all([
    accounts.me()
  ]);

  // return an object of the Wealthsimple data
  return {
    user: data[0]
  };
}
