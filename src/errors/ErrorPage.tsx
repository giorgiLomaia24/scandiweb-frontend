import { Component } from 'react';
import './errorPage.css'

export class ErrorPage extends Component {
    render() {
        return (
            <div className="error-container">
                <h1 className="error-title">Oops! Something Went Wrong</h1>
                <p className="error-message">
                    I am sorry, but an unexpected error occurred. Please try again later.
                </p>
                <button className="error-button" onClick={() => window.location.reload()}>
                    Refresh Page
                </button>
            </div>
        )
    }
}

export default ErrorPage
