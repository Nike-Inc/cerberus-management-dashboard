import React from 'react'
import { Component } from 'react'
import { connect } from 'react-redux'
import * as statsActions from '../../actions/statsActions'
import './Stats.scss'

@connect((state) => {
    return {
        vaultToken: state.auth.vaultToken,
        stats: state.stats.stats
    }
})
export default class Stats extends Component {

    componentDidMount() {
        this.props.dispatch(statsActions.fetchStats(this.props.vaultToken))
    }

    render() {
        const {stats} = this.props

        if (stats['safe_deposit_box_stats'] == undefined) {
            return(
                <div>
                    NO STATS
                </div>
            )
        }

        return (
            <div className="read-only-permissions stats-table">
                <div className="ncss h3">SDB Quick Summary</div>
                <div className="ncss h4">Total SDBs: {stats.safe_deposit_box_total}</div>
                <div className="perm-block">
                    <table className="user-group-read-only-permission-group table">
                        <tbody>
                            <tr>
                                <th className="iam-read-label padding-left">Name</th>
                                <th className="iam-read-label">Owner</th>
                                <th className="iam-read-label">Last Updated</th>
                            </tr>

                            {stats['safe_deposit_box_stats'].map((sdb, index) =>
                                <tr key={sdb.name} className={(index + 1) % 2 == 0 ? "iam-read-only-perm even-row" : "iam-read-only-perm odd-row"}>
                                    <td className="padding-left">{sdb.name}</td>
                                    <td>{sdb.owner}</td>
                                    <td>{new Date(sdb.last_updated_ts).toString()}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}
