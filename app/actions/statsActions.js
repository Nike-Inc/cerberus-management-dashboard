import * as actions from '../constants/actions'
import axios from 'axios'
import ApiError from '../components/ApiError/ApiError'
import environmentService from 'EnvironmentService'
import * as cms from '../constants/cms'
import * as messengerActions from '../actions/messengerActions'
import { getLogger } from 'logger'
var log = getLogger('stats')

export function fetchStats(token) {
    return function(dispatch) {
        return axios({
            url: environmentService.getDomain() + cms.RETRIEVE_STATS,
            headers: {'X-Vault-Token': token},
            timeout: 10000
        })
        .then(function (response) {
            let stats = response.data
            if (stats) {
                stats['safe_deposit_box_meta_data'].sort((a, b) => {
                    let dateA =  new Date(a['last_updated_ts']).getTime()
                    let dateB = new Date(b['last_updated_ts']).getTime()
                    return (dateA < dateB) - (dateA > dateB)
                })

                dispatch(storeStats(stats))
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