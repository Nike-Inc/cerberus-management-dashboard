import React from 'react'
import { Component } from 'react'
import { connect } from 'react-redux'
import * as statsActions from '../../actions/statsActions'
import ReactPaginate from 'react-paginate'
import Select from 'react-select'
import SDBMetadata from '../SDBMetadata/SDBMetadata'

import './SDBMetadataList.scss'

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
            <div className="metadata-list-container">
                <div className="ncss h3">SDB Metadata</div>
                <div className="ncss h4">Total SDBs: {stats.total_sdbcount}</div>
                { paginationMenu(stats, this.options, perPage, this.handlePerPageSelect, this.handlePageClick) }
                <div className="matadata-listings">
                    {stats['safe_deposit_box_meta_data'].map((sdb, index) =>
                        <SDBMetadata sdbMetadata={sdb}
                                     key={index}/>
                    )}
                </div>
                { paginationMenu(stats, this.options, perPage, this.handlePerPageSelect, this.handlePageClick) }
            </div>
        )
    }
}

const paginationMenu = (stats, options, perPage, handlePerPageSelect, handlePageClick) => {
    return (
      <div className="metadata-pagination-menu ncss-brand">
          <ReactPaginate pageCount={Math.ceil(stats.total_sdbcount / perPage)}
                         pageRangeDisplayed={3}
                         marginPagesDisplayed={1}
                         previousLabel={"Prev"}
                         nextLabel={"Next"}
                         onPageChange={handlePageClick}
                         containerClassName={"metadata-pagination"}
                         previousClassName={"metadata-previous-btn"}
                         nextClassName={"metadata-next-btn"}
                         previousLinkClassName={"ncss-btn-black ncss-brand pt2-sm pr5-sm pb2-sm pl5-sm"}
                         nextLinkClassName={"ncss-btn-black ncss-brand pt2-sm pr5-sm pb2-sm pl5-sm "}
                         pageClassName={"page-btn"}
                         breakClassName={"page-btn ncss-btn-light-grey disabled ncss-brand pt2-sm pr5-sm pb2-sm pl5-sm"}
                         pageLinkClassName={"ncss-btn-light-grey ncss-brand pt2-sm pr5-sm pb2-sm pl5-sm"}
                         activeClassName={"metadata-active"}
          />
          <Select
            className={'metadata-pagination-per-page-selector'}
            onChange = { handlePerPageSelect }
            value={ perPage }
            placeholder="Show Per Page"
            options={options}
            searchable={false}
            clearable={false} />
      </div>
    )
}

