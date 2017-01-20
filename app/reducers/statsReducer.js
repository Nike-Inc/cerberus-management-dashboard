import { createReducer } from '../utils'
import * as constants from '../constants/actions'

const initialState = {
    stats: {},
    perPage: 100,
    pageNumber: 0
}

export default createReducer(initialState, {
    [constants.STORE_STATS]: (state, payload) => {
        return Object.assign({}, state, {
            stats: payload.stats
        })
    },

    [constants.UPDATE_PER_PAGE]: (state, payload) => {
        return Object.assign({}, state, {
            perPage: payload.perPage
        })
    },

    [constants.UPDATE_PAGE_NUMBER]: (state, payload) => {
        return Object.assign({}, state, {
            pageNumber: payload.pageNumber
        })
    }
})
