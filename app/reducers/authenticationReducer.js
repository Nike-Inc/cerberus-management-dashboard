import { createReducer } from '../utils'
import * as constants from '../constants/actions'

const initialState = {
    vaultToken: null,
    userName: null,
    isAuthenticated: false,
    isAuthenticating: false,
    isSessionExpired: false,
    isAdmin: false,
    groups: [],
    policies: null
}

export default createReducer(initialState, {
    // lets the app know that the user is being authenticated
    [constants.LOGIN_USER_REQUEST]: (state) => {
        return Object.assign({}, state, {
            'isAuthenticating': true,
            'statusText': null
        })
    },
    // lets the app know that the user has been logged in and save the needed user data
    [constants.LOGIN_USER_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            isAuthenticating: false,
            isAuthenticated: true,
            isSessionExpired: false,
            isAdmin: payload.tokenData.metadata.is_admin,
            vaultToken: payload.tokenData.client_token,
            userName: payload.tokenData.metadata.username,
            groups: payload.tokenData.metadata.groups.split(/,/),
            policies: payload.tokenData.policies
        })
    },
    // logs the user out and resets user data
    [constants.RESET_USER_AUTH_STATE]: (state) => {
        return Object.assign({}, state, {
            isAuthenticating: false,
            isAuthenticated: false,
            isAdmin: false,
            vaultToken: null,
            userName: null,
            isSessionExpired: false
        })
    },
    // logs the user out and resets user data, sets session expired true
    [constants.SESSION_EXPIRED]: (state) => {
        return Object.assign({}, state, {
            isAuthenticating: false,
            isAuthenticated: false,
            isAdmin: false,
            vaultToken: null,
            userName: null,
            isSessionExpired: true
        })
    }
})
