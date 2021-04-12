import { auth } from 'wstrade-api';

/**
 * Performs stage 1 of login: send the email and password to wealthsimple
 * trade servers, which will fail because OTP was not provided. This will trigger
 * an OTP dispatch from Wealthsimple trade.
 *
 * @param {*} event 
 * @returns 
 */
export async function stage1(event) {
  try {
    await auth.login(event.email, event.password);
  } catch {
    return Promise.reject("Unsuccessful login");
  }

  // this should never happen because we aren't specifying OTP yet and the
  // login will never work.
  return "Ok";
}