import React from 'react'
import { Component } from 'react'
import './SDBStatSet.scss'


export default class SDBStatSet extends Component {

    componentDidMount() {

    }

    render() {
        const {sdbStats} = this.props

        return (
            <div className="sdb-stats-box-header">
                <div className="sdb-stats-box-header-button-name-wrapper">
                    <div className="sdb-stats-box-header-name">
                        <div className="sdb-stats-box-header-label">Name:</div>
                        <div className="sdb-stats-box-header-value">{sdbStats.name}</div>
                    </div>
                </div>
                <div className="sdb-stats-box-header-owner-wrapper">
                    <div className="sdb-stats-box-header-category">
                        <div className="sdb-stats-box-header-label">Owner:</div>
                        <div className="sdb-stats-box-header-value">{sdbStats.owner}</div>
                    </div>
                    <div className="sdb-stats-box-header-created-by">
                        <div className="sdb-stats-box-header-label">Created By:</div>
                        <div className="sdb-stats-box-header-value">{sdbStats.created_by}</div>
                    </div>
                    <div className="sdb-stats-box-header-created-ts">
                        <div className="sdb-stats-box-header-label">Created:</div>
                        <div className="sdb-stats-box-header-value">{sdbStats.created_ts}</div>
                    </div>
                    <div className="sdb-stats-box-header-last-updated-by">
                        <div className="sdb-stats-box-header-label">Last Updated By:</div>
                        <div className="sdb-stats-box-header-value">{sdbStats.last_updated_by}</div>
                    </div>
                    <div className="sdb-stats-box-header-last-updated-ts">
                        <div className="sdb-stats-box-header-label">Last Updated:</div>
                        <div className="sdb-stats-box-header-value">{sdbStats.last_updated_ts}</div>
                    </div>
                    <div className="sdb-stats-box-header-description">
                        <div className="sdb-stats-box-header-label">Description:</div>
                        <div className="sdb-stats-box-header-value">{sdbStats.description}</div>
                    </div>
                </div>

                <div className="sdb-stats-box-permissions-container">
                    <div className="read-only-permissions">
                        { readOnlyUserGroupPermissions(sdbStats.user_group_permissions) }
                        { readOnlyIamRolePermissions(sdbStats.iam_role_permissions) }
                    </div>

                </div>
            </div>
        )
    }
}

const readOnlyUserGroupPermissions = (userGroupPermissions) => {
    if (userGroupPermissions == null || userGroupPermissions.length < 1) {
        return(<div>No User Group Permissions Defined</div>)
    } else {
        return(
            <div className=".">
                <div className="read-only-permissions-label">User Group Permissions</div>
                <table className="user-group-read-only-permission-group">
                    <tbody>
                    <tr>
                        <th className="iam-read-label">User Group</th>
                        <th className="iam-read-label">Role</th>
                    </tr>

                    {Object.keys(userGroupPermissions).forEach((key) => {
                        let index = 0
                        return (
                            <tr key={index++}>
                                <td>{key}</td>
                                <td>{userGroupPermissions[key]}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        )
    }
}

const readOnlyIamRolePermissions = (iamRolePermissions) => {
    if (iamRolePermissions == null || iamRolePermissions.length < 1) {
        return(<div>No IAM Role Permissions Defined</div>)
    } else {
        return(
            <div className="perm-block">
                <div className="read-only-permissions-label">IAM Role Permissions</div>
                <table className="iam-read-only-permission-group">
                    <tbody>
                    <tr>
                        <th className="iam-read-label">ARN</th>
                        <th className="iam-read-label">Role</th>
                    </tr>

                    {Object.keys(iamRolePermissions).forEach((key) => {
                        let index = 0;
                        return (
                            <tr key={index++}>
                                <td className="iam-read-only-perm-item iam-read-only-perm-role-name">{key}</td>
                                <td className="iam-read-only-perm-item iam-read-only-perm-role">{iamRolePermissions[key]}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>



        )
    }
}