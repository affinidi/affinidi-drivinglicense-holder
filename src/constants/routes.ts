/**
 * File containing various browser routes.
 * */

interface Routes {
  ROOT: string,
  LOGIN: string,
  SIGNUP: string,
  SIGNUP_CONFIRM: string,
  INTRO: string,
  API_KEY: string,
  ISSUER: string,
  ACCEPT_CREDENTIALS: string,
}

export const routes: Routes = {
  ROOT: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  SIGNUP_CONFIRM: '/confirm-signup',
  INTRO: '/intro',
  API_KEY: '/api-key',
  ISSUER: '/issuer',
  ACCEPT_CREDENTIALS: '/accept-credentials'
}
