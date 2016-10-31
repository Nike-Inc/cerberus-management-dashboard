import * as ports from '../../constants/ports'

import React from 'react';
import { VaultSecretForm } from '../VaultSecretForm/VaultSecretForm'

describe('VaultSecretForm', () => {

    it ('Test that initial values do not override new entries when a user deletes an original value', () => {
        let promise = Burnside.load({
            host: `http://localhost:${ports.REVERSE_PROXY_PORT}`,
            path: '/dashboard/#/manage-safe-deposit-box/06f82494-fb60-11e5-ba72-e899458df21a'
        })

        // expand out the form and click add key value pair and ensure that 2 rows are present
        promise = promise.waitForElement('#vault-keys', null, 10000)
            .click('#vault-secret-container-other_key')
            .waitForElement('#vault-key-other_key .permissions-add-new-permission-button-container')
            .click('#vault-key-other_key .permissions-add-new-permission-button-container')
            .getCount('#vault-key-other_key #new-vault-secret-kv-map .new-vault-secret-kv-entry')
            .then(count => {
                expect(count).to.equal(2)
            })

        // click the remove button for the first row
        promise = promise.click('#vault-key-other_key #new-vault-secret-kv-map .new-vault-secret-kv-entry:first .row-btn-remove')
            .getCount('#vault-key-other_key #new-vault-secret-kv-map .new-vault-secret-kv-entry')
            .then(count => {
                expect(count).to.equal(1)
            })

        // verify that the contents of the remain row are empty
        promise.getValue('#vault-key-other_key #new-vault-secret-kv-map .new-vault-secret-kv-entry:first .vault-secret-key .ncss-input-container input')
            .then(text => {
                expect(text).to.equal('')
            })

        // verify that the contents of the remain row are empty
        promise.getValue('#vault-key-other_key #new-vault-secret-kv-map .new-vault-secret-kv-entry:first .vault-secret-value .ncss-input-container input')
            .then(text => {
                expect(text).to.equal('')
            })
        
        return promise
    })
})