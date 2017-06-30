import React from 'react'
import { Component } from 'react'
import { connect } from 'react-redux'
import { reduxForm, touch } from 'redux-form'
import * as modalActions from '../../actions/modalActions'
import * as appActions from '../../actions/appActions'
import * as authActions from '../../actions/authenticationActions'
import CopyToClipboard from 'react-copy-to-clipboard';
import ProgressButton from 'react-progress-button'


import * as messengerActions from '../../actions/messengerActions'



// Some code from https://github.com/mathieudutour/react-progress-button

import './ViewTokenModal.scss'

// connect to the store in order to obtain the current vault token
@connect((state) => {
  return {
    clientToken: state.auth.vaultToken,
  }
})




export default class ViewTokenModal extends Component {

  render() {
    const {clientToken, dispatch} = this.props
    let tokenExpiresDate = sessionStorage.getItem('tokenExpiresDate');

    console.log(dateDiffinMin(tokenExpiresDate))

    return (
      <div>
        <div id="form-description" className="ncss-brand">
          <h1>View and Renew Client Token</h1>
          <h4>This is your current client token, export it and use it with your client to do this. Renew your client token for these reasons. </h4>

          <h3>Client Token:</h3>
          <p>{ clientToken }</p>

          <div className='row-buttons'>
            {/* <div className="btn-wrapper btn-wrapper-left">
            <input type="checkbox" className={! entry.revealed.value ? 'row-btn row-btn-reveal' : 'row-btn row-btn-revealed'} {...entry.revealed}/>
          </div> */}
          <CopyToClipboard text={clientToken}>
            {/* // what does this line do?  */}
            <div className={clientToken.length <= 1 ? 'btn-wrapper btn-wrapper-right' : 'btn-wrapper'}>
              <div className='row-btn row-btn-copy'></div>
            </div>
          </CopyToClipboard>
        </div>


        <h3>Client Token Expiration Date:</h3>
        <p>{tokenExpiresDate }</p>
        <h3>Client Token Time Remaining:</h3>
        <p> {dateDiffinMin(tokenExpiresDate)} minutes</p>
      </div>

      <div id="renew-btn-container">
        <div id='close-btn'
          className='btn ncss-btn-dark-grey ncss-brand pt3-sm pr5-sm pb3-sm pl5-sm pt2-lg pb2-lg u-uppercase'
          onClick={ () => {
            dispatch(modalActions.popModal())
          }}>Close
        </div>

        <ProgressButton ref='button' //id='renew-btn'
        className='btn ncss-btn-dark-grey ncss-brand pt3-sm pr5-sm pb3-sm pl5-sm pt2-lg pb2-lg u-uppercase'

        // onClick={ () => {
        //   dispatch(authActions.refreshAuth(clientToken, '', false));
        //   //  dispatch(messengerActions.addNewMessageWithTimeout('Your token has been renewed', 10000000))
        //
        //   // console.log("testing renew");
        //
        //   return new Promise(function(resolve, reject) {
        //     setTimeout(resolve, 3000)
        //   })
        //
        // }}
        onClick={this.handleRefreshTokenClick}
        >Renew Token
      </ProgressButton>
    </div>
  </div>

)
}

handleRefreshTokenClick() {
    const {clientToken, dispatch} = this.props
   dispatch(authActions.refreshAuth(clientToken, '', false));
  return new Promise(function(resolve, reject) {
    setTimeout(resolve, 3000)
  })
}

// handleClick() {
//     this.refs.button.loading();
//     console.log("loading")
//     //make asynchronious call
//     setTimeout(function() {
//       this.refs.button.success();
//         console.log("success")
//     }.bind(this), 3000);
//   }

}

export function dateDiffinMin(expiresDate) {
  var expDate = new Date(expiresDate)
  var currentDate = new Date()
  var t2 = expDate.getTime();
  var t1 = currentDate.getTime();
  var diff = parseInt((t2-t1)/(60*1000));
  return diff
}
