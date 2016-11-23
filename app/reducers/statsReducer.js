import { createReducer } from '../utils'
import * as constants from '../constants/actions'

const initialState = {
    stats: {}
}

export default createReducer(initialState, {
    [constants.STORE_STATS]: (state, payload) => {
        return Object.assign({}, state, {
            stats: payload.stats
        })
    }
})
