import React from 'react'
import { Component } from 'react'
import EnvironmentService from '../../service/EnvironmentService'
import './LandingView.scss'

export default class LandingView extends Component {
    render() {
        return (
            <div id='landing-view' className='ncss-brand'>
                <h2>Welcome to the Cerberus Management Dashboard</h2>
                <h3>Environment: {EnvironmentService.getEnvironment()}</h3>
                <h3>API Domain: {EnvironmentService.getDomain()}</h3>
                <h4>For help please visit the <a href="/dashboard/help/index.html">help page</a></h4>
            </div>
        )
    }
}