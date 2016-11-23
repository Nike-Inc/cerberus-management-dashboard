import * as cms from '../../constants/cms'
import { getLogger } from 'logger'
var log = getLogger('create-new-sdb-validator')

const doesContainNonAlphaNumericSpaceCharsRegex = /[^a-z\d\s]+/i

// define our client side form validation rules
const validate = values => {
    const errors = {}
    errors.userGroupPermissions = {}
    errors.iamRolePermissions = {}
    errors.foo = {}

    // Validate the Name field
    if (! values.name) {
        errors.name = 'You must enter a name for your SDB'
    } else if (doesContainNonAlphaNumericSpaceCharsRegex.test(values.name)) {
        errors.name = 'Name can only contain alpha numeric chars and spaces.'
    } else if (values.name.length > cms.SDB_NAME_MAX_LENGTH) {
        errors.name = `Name cannot be longer than ${cms.SDB_NAME_MAX_LENGTH} chars`
    }

    if(values.description && values.description.length > cms.SDB_DESC_MAX_LENGTH) {
        errors.description = `description cannot be longer than ${cms.SDB_DESC_MAX_LENGTH} chars`
    }

    if (! values.categoryId) {
        errors.categoryId = 'You must select a category'
    }

    if (! values.owner) {
        errors.owner = 'You must select an owning user group'
    }

    if (values.userGroupPermissions) {
        values.userGroupPermissions.map((permission, index) => { validateUserGroupPermissions(permission, index, errors) })
    }

    if (values.userGroupPermissions) {
        values.iamRolePermissions.map((permission, index) => { validateIamRolePermissions(permission, index, errors) })
    }

    log.debug('Completed validation returning Error:\n' + JSON.stringify(errors, null, 2))
    return errors
}

const validateUserGroupPermissions = (permission, index, errors) => {
    errors.userGroupPermissions[`${index}`] = {}
    if (! permission.name) {
        errors.userGroupPermissions[`${index}`].name = 'You must select a user group for this permission'
    }

    if (! permission.roleId) {
        errors.userGroupPermissions[`${index}`].roleId = 'You must select a role for this permission'
    }
}

const validateIamRolePermissions = (permission, index, errors) => {
    errors.iamRolePermissions[`${index}`] = {}
    if (! permission.accountId) {
        errors.iamRolePermissions[`${index}`].accountId = 'Required'
    } else if (! /^\d+$/.test(permission.accountId)) {
        errors.iamRolePermissions[`${index}`].accountId = 'Numeric only'
    }

    if (! permission.iamRoleName) {
        errors.iamRolePermissions[`${index}`].iamRoleName = 'You must enter a IAM role name for this permission'
    }

    if (! permission.roleId) {
        errors.iamRolePermissions[`${index}`].roleId = 'Required'
    }
}

export default validate