import React from 'react'
import { Component } from 'react'
import { connect } from 'react-redux'
import * as statsActions from '../../actions/statsActions'
import './Stats.scss'
import ReactPaginate from 'react-paginate'
import Select from 'react-select'
import SDBStatSet from '../../components/SDBStatSet/SDBStatSet'


@connect((state) => {
    return {
        vaultToken: state.auth.vaultToken,
        stats: state.stats.stats,
        perPage: state.stats.perPage,
        pageNumber: state.stats.pageNumber
    }
})

export default class Stats extends Component {

    options = [
        { value: 10, label: '10' },
        { value: 50, label: '50' },
        { value: 100, label: '100' },
        { value: 1000, label: '1000' }
    ]

    componentDidMount() {
        this.props.dispatch(statsActions.fetchStats(this.props.vaultToken, this.props.pageNumber, this.props.perPage))
    }

    handlePageClick = (data) => {
        let pageNumber = data.selected;

        this.props.dispatch(statsActions.fetchStats(this.props.vaultToken, pageNumber, this.props.perPage));
    };

    handlePerPageSelect = (selected) => {
        let perPage = selected.value;

        this.props.dispatch(statsActions.updatePerPage(perPage));
        this.props.dispatch(statsActions.fetchStats(this.props.vaultToken, this.props.pageNumber, perPage));
    };

    render() {
        const {stats, perPage} = this.props

        if (stats['safe_deposit_box_meta_data'] == undefined) {
            return(
                <div>
                    NO STATS
                </div>
            )
        }

        return (
            <div className="read-only-permissions stats-table">
                <div className="ncss h3">SDB Quick Summary</div>
                <div className="ncss h4">Total SDBs: {stats.total_sdbcount}</div>
                <div className="perm-block">
                    {stats['safe_deposit_box_meta_data'].map((sdb, index) =>
                        <SDBStatSet sdbStats={sdb}
                                    key={index}/>
                    )}
                </div>
                <div>
                    <ReactPaginate pageCount={Math.ceil(stats.total_sdbcount / perPage)}
                                   pageRangeDisplayed={5}
                                   marginPagesDisplayed={2}
                                   previousLabel={"Prev"}
                                   nextLabel={"Next"}
                                   onPageChange={this.handlePageClick}
                                   containerClassName={"pagination"}
                                   subContainerClassName={"pages pagination"}
                                   activeClassName={"active"}
                    />
                    <Select
                        className={'category-select select-container'}
                        onChange = { this.handlePerPageSelect }
                        value={ this.props.perPage }
                        placeholder="Show Per Page"
                        options={this.options}
                        searchable={false}
                        clearable={false} />
                </div>
            </div>
        )
    }
}
