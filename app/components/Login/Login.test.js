import * as ports from '../../constants/ports'

describe('Login', () => {

    it ('Test that email is required', () => {
        return Burnside.load({
                host: `http://localhost:${ports.REVERSE_PROXY_PORT}`,
                path: '/dashboard/#/login'
        })
        .waitForNoElement('#email-div div.error')
        .click('#login-btn')
        .waitForElement('#email-div div.error')
    })
})