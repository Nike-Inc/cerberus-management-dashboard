export function parseCMSError(response) {
    let msg = 'Server did not respond with message, checkout the console for full response'

    if (response.data != null) {
        if (response.data.errors.length > 0) {
            if (response.data.errors[0].message) {
                msg = response.data.errors[0].message
            }
        }
    }
    
    return msg
}