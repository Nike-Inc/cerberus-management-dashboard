import React from 'react'
import { Component, PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { loginUser } from '../../actions/authenticationActions'
import * as messengerActions from '../../actions/messengerActions'
import Messenger from '../Messenger/Messenger'
import './Login.scss'
import '../../assets/images/cerberus-logo-wide-off-white.svg'

export const fields = ['username', 'password', 'redirectTo']

const isValidEmailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i

// define our client side form validation rules
const validate = values => {
    const errors = {}

    if (!values.username) {
        errors.username = 'Required'
    } else if (! isValidEmailRegex.test(values.username)) {
        errors.username = 'Invalid email address'
    }

    if (! values.password) {
        errors.password = 'Required'
    }

    return errors
}

// connect to the store for the pieces we care about
@connect((state) => {
    return {
        isAuthenticating: state.auth.isAuthenticating,
        isAuthenticated: state.auth.isAuthenticated,
        isSessionExpired: state.auth.isSessionExpired,
        statusText: state.auth.statusText,
        initialValues: {
            redirectTo: state.routing.locationBeforeTransitions.query.next || '/'
        }
    }
})
// wire up the redux form
@reduxForm(
    {
        form: 'login-form',
        fields: fields,
        validate
    }
)
export default class LoginForm extends Component {
    static propTypes = {
        fields: PropTypes.object.isRequired,
        handleSubmit: PropTypes.func.isRequired,
        isAuthenticating: PropTypes.bool.isRequired,
        dispatch: PropTypes.func.isRequired
    }

    componentDidMount() {
        this.props.dispatch(messengerActions.clearAllMessages())
    }

    render() {
        const {fields: {username, password}, handleSubmit, isAuthenticating, isSessionExpired} = this.props
        return (
            <div id='login-container' className=''>
                <div id='login-form-div'>
                    <header>
                        <div id='logo-container'>
                            <div className='cerberus-logo'></div>
                        </div>
                        <h1 className='ncss-brand'>CERBERUS MANAGEMENT DASHBOARD</h1>

                    </header>
                    {isSessionExpired &&
                        <div id="session-expired-message">
                            Your session has expired and you are required to re-authenticate
                        </div>
                    }
                    <Messenger />
                    <form id='login-form' onSubmit={handleSubmit( data => {
                        this.props.dispatch(loginUser(data.username, data.password))
                    })}>
                        <div id='email-div' className='ncss-form-group'>
                            <div className={((username.touched && username.error) ? 'ncss-input-container error' : 'ncss-input-container')}>
                                <label className='ncss-label'>Email</label>
                                <input type='text'
                                       className='ncss-input pt2-sm pr4-sm pb2-sm pl4-sm'
                                       placeholder='Please enter your email address'
                                       {...username}/>
                                {username.touched && username.error && <div className='ncss-error-msg'>{username.error}</div>}
                            </div>
                        </div>
                        <div id='pass-div' className='ncss-form-group'>
                            <div className={((password.touched && password.error) ? 'ncss-input-container error' : 'ncss-input-container')}>
                                <label className='ncss-label'>Password</label>
                                <input type='password'
                                       className='ncss-input pt2-sm pr4-sm pb2-sm pl4-sm r'
                                       placeholder='Please enter your password'
                                       {...password}/>
                                {password.touched && password.error && <div className='ncss-error-msg'>{password.error}</div>}
                            </div>
                        </div>
                        <div id='login-form-submit-container'>
                            <div id='fountainG' className={isAuthenticating ? 'show-me' : 'hide-me'}>
                                <div id='fountainG_1' className='fountainG'></div>
                                <div id='fountainG_2' className='fountainG'></div>
                                <div id='fountainG_3' className='fountainG'></div>
                                <div id='fountainG_4' className='fountainG'></div>
                                <div id='fountainG_5' className='fountainG'></div>
                                <div id='fountainG_6' className='fountainG'></div>
                                <div id='fountainG_7' className='fountainG'></div>
                                <div id='fountainG_8' className='fountainG'></div>
                            </div>
                            <button id='login-btn'
                                    className='ncss-btn-offwhite ncss-brand pt3-sm pr5-sm pb3-sm pl5-sm pt2-lg pb2-lg u-uppercase'
                                    disabled={isAuthenticating}>Login</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
