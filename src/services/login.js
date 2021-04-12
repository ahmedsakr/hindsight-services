import { auth } from 'wstrade-api';

/**
 * Performs the login workflow for Wealthsimple Trade.
 *
 * @param {*} event 
 * @returns 
 */
export async function login(event) {

  // Append otp if provided to us
  if (event.otp) {
    auth.on('otp', event.otp);
  }
  
  // this will fail if OTP was not provided
  await auth.login(event.email, event.password);

  // Successful login: return the authentication tokens to the user
  return auth.tokens();
}