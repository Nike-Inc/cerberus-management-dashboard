import React from 'react'
import { Component } from 'react'
import { connect } from 'react-redux'
import { reduxForm, touch } from 'redux-form'
import * as modalActions from '../../actions/modalActions'
import * as appActions from '../../actions/appActions'


import './ViewTokenModal.scss'


// connect to the store in order to obtain the current vault token
@connect((state) => {
  console.log(state.auth.vaultToken)
    return {
        vaultToken: state.auth.vaultToken,

      }
  })


export default class ViewTokenModal extends Component {



    render() {
      const {vaultToken, dispatch} = this.props
      let tokenExpiresDate = sessionStorage.getItem('tokenExpiresDate');


      return (
  <div>
        <div id="form-description" className="ncss-brand">
            <h1>View and Refresh Vault Token</h1>
            <h4>View your current vault token which serves this purpose. Refresh your vault token for these reasons. </h4>
        {/* </div>
        <div  id="form-description" className="ncss-brand"> */}
          <h3>Vault Token:</h3>
              <p>{ vaultToken }</p>
                <h3>Vault Token Expiration Date:</h3>
                <p>{tokenExpiresDate }</p>
          </div>

          <div id="refresh-btn-container">
              <div id='cancel-btn'
                   className='btn ncss-btn-dark-grey ncss-brand pt3-sm pr5-sm pb3-sm pl5-sm pt2-lg pb2-lg u-uppercase'
                   onClick={ () => {
                          dispatch(modalActions.popModal())
                      }}>Cancel
              </div>
              <button id='refresh-btn'
                      className='btn ncss-btn-dark-grey ncss-brand pt3-sm pr5-sm pb3-sm pl5-sm pt2-lg pb2-lg u-uppercase'
                      // disabled={isSubmitting}
                      >Refresh
              </button>
          </div>
  </div>

      )
    }

}
