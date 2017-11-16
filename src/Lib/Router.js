import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { Auth } from './firebase'
import ReactGA from 'react-ga'

if(window && window.location && window.location.hostname === 'dmassist5e.firebaseapp.com')
  ReactGA.initialize('UA-69733203-5')

export const PrivateRoute = ({ component, redirectTo, ...rest }) => {
  logPageView()
  return (
    <Route {...rest} render={routeProps => {
      return Auth.currentUser ? (
        renderMergedProps(component, routeProps, rest)
      ) : (
        <Redirect to={{
          pathname: redirectTo,
          state: { from: routeProps.location }
        }} />
      )
    }} />
  )
}

export const PropsRoute = ({ component, ...rest }) => {
  logPageView()
  return (
    <Route {...rest} render={routeProps => {
      return renderMergedProps(component, routeProps, rest);
    }} />
  )
}

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
}

function logPageView() {
  if(window && window.location && window.location.hostname === 'dmassist5e.firebaseapp.com'){
    ReactGA.set({ page: window.location.pathname + window.location.search });
    ReactGA.pageview(window.location.pathname + window.location.search);
  }
}
