import React from 'react'
import { Component, PropTypes } from 'react'
import RoleSelect from '../RoleSelect/RoleSelect'
import Buttons from '../Buttons/Buttons'
import AddButton from '../AddButton/AddButton'
import { touch } from 'redux-form'
import './IamRolePermissionsFieldSet.scss'

/**
 * Component for displaying User Group Permissions form field set
 * @prop iamRolePermissions is the Redux form field for the array of IAM role permission objects (Group -> Role)
 * @prop dispatch from the store to dispatch touch events for the drop downs
 * @prop formName The redux form name for touch events in the drop downs
 * @props roles The list of roles that a user can select for the permission
 */
export default class IamRolePermissionsFieldSet extends Component {
    static propTypes = {
        iamRolePermissions: PropTypes.array.isRequired,
        dispatch: PropTypes.func.isRequired,
        formName: PropTypes.string.isRequired,
        roles: PropTypes.array.isRequired
    }

    render() {
        const {iamRolePermissions, dispatch, formName, roles} = this.props

        return (
            <div className='iam-role-permissions'>
                <div className='iam-role-permissions-label ncss-label'>IAM Role Permissions</div>
                <div className="iam-role-permissions-perms-container">
                    <div className="iam-role-permissions-perms-container">
                    {iamRolePermissions.map((permission, index) =>
                        <div key={index}>
                            <div className='iam-role-permissions-permission'>
                                <div className='role-perm-acct-id'>
                                    <div className={((permission.accountId.touched && permission.accountId.error) ? 'ncss-input-container error' : 'ncss-input-container')}>
                                        <input {...permission.accountId}
                                            type='text'
                                            className='ncss-input pt2-sm pr4-sm pb2-sm pl4-sm'
                                            placeholder='AWS Acct Id' />
                                        {permission.accountId.touched && permission.accountId.error && <div className='ncss-error-msg'>{permission.accountId.error}</div>}
                                    </div>
                                </div>

                                <div className='role-perm-role-name'>
                                    <div className={((permission.iamRoleName.touched && permission.iamRoleName.error) ? 'ncss-input-container error' : 'ncss-input-container')}>
                                        <input {...permission.iamRoleName}
                                            type='text'
                                            className='ncss-input pt2-sm pr4-sm pb2-sm pl4-sm'
                                            placeholder='Role Name' />
                                        {permission.iamRoleName.touched && permission.iamRoleName.error && <div className='ncss-error-msg'>{permission.iamRoleName.error}</div>}
                                    </div>
                                </div>

                                <RoleSelect {...permission.roleId}
                                    roles={roles.filter((role => role.name.toLowerCase() != 'owner'))}
                                    handleBeingTouched={() => {
                                                    dispatch(touch(formName, permission.roleId.name))
                                            }} />

                                <Buttons handleRemoveClicked={() => {
                                                     iamRolePermissions.removeField(index)
                                                 }} />
                            </div>
                        </div>
                    )}
                    </div>
                </div>
                <AddButton handleClick={iamRolePermissions.addField} message="Add new permission" />
            </div>
        )
    }
}