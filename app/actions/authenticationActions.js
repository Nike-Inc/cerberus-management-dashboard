import React from 'react'
import environmentService from 'EnvironmentService'
import { hashHistory } from 'react-router'
import axios from 'axios'
import * as constants from '../constants/actions'
import * as appActions from '../actions/appActions'
import * as messengerActions from '../actions/messengerActions'
import * as cms from '../constants/cms'
import * as headerActions from '../actions/headerActions'
import * as cmsUtils from '../utils/cmsUtils'
import ApiError from '../components/ApiError/ApiError'
import { getLogger } from 'logger'

var log = getLogger('authentication-actions')

const AUTH_ACTION_TIMEOUT = 10000 // 10 seconds in milliseconds

/**
 * These are the actions for authentication events that will trigger the related reducers to change application state
 */

/**
 * This action is dispatched when we have a valid response object from the CMS Auth endpoint
 * @param response The json response object from the ldap auth cms endpoint
 * @returns {{type: string, payload: {tokenData: *}}} The object to dispatch to trigger the reducer to update the auth state
 */
export function loginUserSuccess(response) {
    return {
        type: constants.LOGIN_USER_SUCCESS,
        payload: {
            tokenData: response.data.client_token,
        }
    }
}
/**
 * This action is dispatched to let the app state know that the auth request is in progress.
 * @returns {{type: string}} The object to dispatch to trigger the reducer to update the auth state
 */
export function loginUserRequest() {
    return {
        type: constants.LOGIN_USER_REQUEST
    }
}

/**
 * Updates the state to indicate that MFA is required for the given user to authenticate.
 * @returns {{type: string}} The object to dispatch to trigger the reducer to update the auth state
 */
export function loginMfaRequired(response) {
    return {
        type: constants.LOGIN_MFA_REQUIRED,
        payload: {
            stateToken: response.data.data.state_token,
            mfaDevices: response.data.data.devices,
        }
    }
}

/**
 * Updates the state to indicate that the user is successfully authenticated.
 */
function handleUserLogin(response, dispatch) {
    let leaseDurationInSeconds = response.data.data.client_token.lease_duration
    const millisecondsPerSecond = 1000
    const bestGuessOfRequestLatencyInMilliseconds = 120 * millisecondsPerSecond // take 2 minutes off of duration to account for latency

    let now = new Date()
    let vaultTokenExpiresDateInMilliseconds = (now.getTime() + ((leaseDurationInSeconds * millisecondsPerSecond) - bestGuessOfRequestLatencyInMilliseconds))

    let tokenExpiresDate = new Date()
    tokenExpiresDate.setTime(vaultTokenExpiresDateInMilliseconds)

    log.debug(`Setting session timeout to ${tokenExpiresDate}`)

    setTimeout(() => {
        dispatch(handleSessionExpiration())
    }, tokenExpiresDate.getTime() - now.getTime())

    sessionStorage.setItem('token', JSON.stringify(response.data))
    sessionStorage.setItem('tokenExpiresDate', tokenExpiresDate)
    dispatch(messengerActions.clearAllMessages())
    dispatch(loginUserSuccess(response.data))
    dispatch(appActions.fetchSideBarData(response.data.data.client_token.client_token))
}

/**
 * This action will let the state know that we are performing the auth
 * It will then perform the authentication and update state after success
 * @param username The Username of the user to auth
 * @param password The password of the user to auth
 * @returns {Function} The object to dispatch
 */
export function loginUser(username, password) {
    return function(dispatch) {
        dispatch(loginUserRequest())
        return axios({
            url: environmentService.getDomain() + cms.USER_AUTH_PATH,
            auth: {
                username: username,
                password: password
            },
            timeout: AUTH_ACTION_TIMEOUT
        })
        .then(function (response) {
            if (response.data.status === cms.MFA_REQUIRED_STATUS) {
                dispatch(loginMfaRequired(response))
            } else {
                handleUserLogin(response, dispatch)
            }
        })
        .catch(function (response) {
            log.error('Failed to login user', response)

            dispatch(messengerActions.addNewMessage(
                <div className="login-error-msg-container">
                    <div className="login-error-msg-header">Failed to Login</div>
                    <div className="login-error-msg-content-wrapper">
                        <div className="login-error-msg-label">Server Message:</div>
                        <div className="login-error-msg-cms-msg">{cmsUtils.parseCMSError(response)}</div>
                    </div>
                </div>
            ))

            dispatch(resetAuthState())
        })
    }
}

/**
 * This action re-authenticates a user with MFA, if MFA is required
 * @param otpToken The security token of the user to auth
 * @param mfaDeviceId ID of the MFA security device
 * @param stateToken Identifying token for the authentication request
 */
export function finalizeMfaLogin(otpToken, mfaDeviceId, stateToken) {
    return function(dispatch) {
        dispatch(loginUserRequest())
        return axios({
            method: 'post',
            url: environmentService.getDomain() + cms.USER_AUTH_MFA_PATH,
            data: {
                state_token: stateToken,
                device_id: mfaDeviceId,
                otp_token: otpToken
            },
            timeout: AUTH_ACTION_TIMEOUT
        })
        .then(function (response) {
            handleUserLogin(response, dispatch)
        })
        .catch(function (response) {
            log.error('Failed to finalize MFA login', response)

            dispatch(messengerActions.addNewMessage(
                <div className="login-error-msg-container">
                    <div className="login-error-msg-header">Failed to Login</div>
                    <div className="login-error-msg-content-wrapper">
                        <div className="login-error-msg-label">Server Message:</div>
                        <div className="login-error-msg-cms-msg">{cmsUtils.parseCMSError(response)}</div>
                    </div>
                </div>
            ))

            dispatch(resetAuthState())
        })
    }
}

/**
 * This action is dispatched to renew a users session token
 */
export function refreshAuth(token, redirect='/') {
    return function(dispatch) {
        return axios({
            url: environmentService.getDomain() + cms.USER_AUTH_PATH_REFRESH,
            headers: {'X-Vault-Token': token},
            timeout: AUTH_ACTION_TIMEOUT
        })
        .then(function (response) {
            sessionStorage.setItem('token', JSON.stringify(response.data))
            dispatch(loginUserSuccess(response.data))
            hashHistory.push(redirect)
            log.info(response)
            dispatch(appActions.fetchSideBarData(response.data.data.client_token.client_token))
        })
        .catch(function (response) {
            log.error('Failed to login user', response)
            dispatch(messengerActions.addNewMessage(<ApiError message="Failed to refresh user token" response={response} />))
            dispatch(resetAuthState())
            hashHistory.push('dashboard/#/login')
        })
    }
}

/**
 * This action is dispatched to log a user out
 */
export function logoutUser(token) {
    return function(dispatch) {
        return axios({
            method: 'delete',
            url: environmentService.getDomain() + cms.TOKEN_DELETE_PATH,
            headers: {'X-Vault-Token': token},
            timeout: AUTH_ACTION_TIMEOUT
        })
        .then(function () {
            dispatch(resetAuthState())
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('tokenExpiresDate')
            dispatch(headerActions.mouseOutUsername())
            hashHistory.push('/login')
        })
        .catch(function (response) {
            log.error('Failed to logout user', response)
            dispatch(messengerActions.addNewMessage(<ApiError message="Failed to Logout User" response={response} />))
        })
    }
}

/**
 * This action is dispatched to log a user out
 */
export function handleSessionExpiration() {
    return function(dispatch) {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('tokenExpiresDate')
        dispatch(expireSession())
    }
}

export function resetAuthState() {
    return {
        type: constants.RESET_USER_AUTH_STATE
    }
}

export function expireSession() {
    return {
        type: constants.SESSION_EXPIRED
    }
}