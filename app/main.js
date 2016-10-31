import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import { Provider } from 'react-redux'
import { syncHistoryWithStore } from 'react-router-redux'

import App from './components/App/App'
import LandingView from './components/LandingView/LandingView'
import ManageSDBox from './components/ManageSDBox/ManageSDBox'
import Stats from './components/Stats/Stats'
import NotFound from './components/NotFound/NotFound'
import configureStore from './store/configureStore'
import { loginUserSuccess, handleSessionExpiration } from './actions/authenticationActions'
import { Client } from 'burnside'
import * as cookie from 'cookie'
import { getLogger } from 'logger'
import './assets/styles/reactSelect.scss'

var log = getLogger('main')

/**
 * Let the webpack server tell the app whether or not to enable burnside, in prod the header will not be set.
 */
let cookies = cookie.parse(document.cookie)
if (cookies['burnside-enabled'] === 'true') {
    log.info('Burnside enabled')
    var client = new Client()
    client.start()
}

/**
 * This is our redux data store for storing all data retrieved from API Calls and any other state that needs
 * to be maintained.
 */
const store = configureStore(window.__INITIAL_STATE__)

/**
 * Grab token from session storage
 */
let token = JSON.parse(sessionStorage.getItem('token'))

// use session token to register user as logged in
if (token != null && token != "") {
    let dateString = sessionStorage.getItem('tokenExpiresDate')
    let tokenExpiresDate = new Date(dateString)
    let now = new Date()
    
    log.debug(`Token expires on ${tokenExpiresDate}`)
    
    setTimeout(() => {
        store.dispatch(handleSessionExpiration())
    }, tokenExpiresDate.getTime() - now.getTime())
    store.dispatch(loginUserSuccess(token))
}

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(hashHistory, store)

/**
 * The Provider makes the dispatch method available to children components that connect to it.
 * The dispatcher is used to fire off actions such as a button being clicked, or submitting a form.
 *
 * Once an action fires off a reducer is triggered to manipulate the data in the store to change the state of
 * this app.
 *
 * Components that connect to the piece of state that has changed will have there inputs updated.
 *
 * This is an implementation of FLUX.
 */
render(
    <div>
        <Provider store={store}>
            <div>
                <Router history={history}>
                    <Route path='/' component={App}>
                        <IndexRoute component={LandingView}/>
                        <Route path='manage-safe-deposit-box/:id' component={ManageSDBox}/>
                        <Route path='admin/stats' component={Stats}/>
                        <Route path='*' component={NotFound} />
                    </Route>
                    <Route path='*' component={NotFound} />
                </Router>
            </div>
        </Provider>
    </div>,
    document.getElementById('root')
)