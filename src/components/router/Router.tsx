import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {routes} from 'constants/routes';
import NotFoundPage from 'pages/not-found/NotFound';
import UserSignupPage from 'pages/user/signup/Signup';
import UserLoginPage from 'pages/user/login/Login';
import IntroPage from 'pages/intro/Intro';
import ApiKeyPage from 'pages/api-key/ApiKey';
import Holder from 'pages/holder/Holder';
import AcceptCredentials from 'components/credentials/AcceptCredentials'

interface Props {
  isUserAuthenticated: boolean
}

/**
 * Stateless component responsible for rendering public or private routes.
 * If user is authenticated, render private routes, otherwise render public routes.
 * Small note - there is a "/intro" route (not present in any navigation), which shows a simple textual and graphical overview
 * of what SSI is.
 * */
const Router = ({isUserAuthenticated}: Props) => {
  // render public routes
  if( !isUserAuthenticated ) {
    return (
      <Switch>
        <Route exact path={routes.INTRO} component={IntroPage} />
        <Route exact path={routes.SIGNUP} component={UserSignupPage} />
        <Route exact path={routes.API_KEY} component={ApiKeyPage} />
        <Route component={UserLoginPage} />
      </Switch>
    )
  }

  // render private routes
  return (
    <Switch>
      <Route exact path={routes.ROOT} component={Holder} />
      <Route exact path={routes.INTRO} component={IntroPage} />
      <Route exact path={routes.ACCEPT_CREDENTIALS} component={AcceptCredentials}/>
      <Route component={NotFoundPage}/>
    </Switch>
  )
}

export default Router;
