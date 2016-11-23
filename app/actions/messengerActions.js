import * as constants from '../constants/actions'

/**
 * adds a message to the messenger
 * @param message A string or JSX element to be rendered in the messenger component
 */
export function addNewMessage(message) {
    window.scrollTo(0, 0)
    return {
        type: constants.ADD_MESSAGE,
        payload: message
    }
}

export function removeMessage(indexToRemove) {
    return {
        type: constants.REMOVE_MESSAGE,
        payload: indexToRemove
    }
}

export function clearAllMessages() {
    return {
        type: constants.CLEAR_ALL_MESSAGES
    }
}