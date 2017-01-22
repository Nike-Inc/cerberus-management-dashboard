import * as actions from '../constants/actions'
import axios from 'axios'
import ApiError from '../components/ApiError/ApiError'
import environmentService from 'EnvironmentService'
import * as cms from '../constants/cms'
import * as messengerActions from '../actions/messengerActions'
import { getLogger } from 'logger'
var log = getLogger('stats')

export function fetchStats(token, pageNumber, perPage) {
    return function(dispatch) {
        return axios({
            url: environmentService.getDomain() + cms.RETRIEVE_STATS,
            params: {
                limit: perPage,
                offset: Math.ceil(pageNumber * perPage)
            },
            headers: {'X-Vault-Token': token},
            timeout: 10000
        })
        .then(function (response) {
            let stats = response.data
            if (stats) {
                dispatch(storeStats(stats))
                dispatch(updatePageNumber(pageNumber))
                window.scrollTo(0, 0)
            } else {
                log.warn("Stats was null or undefined")
            }
        })
        .catch(function (response) {
            log.error('Failed to get stats', response)
            dispatch(messengerActions.addNewMessage(<ApiError message="Failed to retrieve stats" response={response} />))
        })
    }
}

function storeStats(stats) {
    return {
        type: actions.STORE_STATS,
        payload: {
            stats: stats
        }
    }
}

export function updatePerPage(perPage) {
    return {
        type: actions.UPDATE_PER_PAGE,
        payload: {
            perPage: perPage
        }
    }
}

export function updatePageNumber(pageNumber) {
    return {
        type: actions.UPDATE_PAGE_NUMBER,
        payload: {
            pageNumber: pageNumber
        }
    }
}