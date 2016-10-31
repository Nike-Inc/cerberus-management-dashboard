import { createReducer } from '../utils'
import * as constants from '../constants/actions'
import log from 'logger'

const initialState = {
    messages: []
}

export default createReducer(initialState, {
    [constants.ADD_MESSAGE]: (state, payload) => {
        let currentMessages = state.messages
        let newMessages = []

        currentMessages.forEach((message) => {
            newMessages.push(message)
        })

        newMessages.push(payload)

        log.info("New Messages", newMessages)
        
        return Object.assign({}, state, {
            messages: newMessages
        })
    },
    [constants.REMOVE_MESSAGE]: (state, payload) => {
        let currentMessages = state.messages
        let newMessages = []
        //noinspection JSUnresolvedVariable
        let indexToRemove = payload

        currentMessages.forEach((message, index) => {
            if (index != indexToRemove) {
                newMessages.push(message)
            }
        })

        return Object.assign({}, state, {
            messages: newMessages
        })
    },
    [constants.CLEAR_ALL_MESSAGES]: (state) => {
        return Object.assign({}, state, {
            messages: []
        })
    }
})
