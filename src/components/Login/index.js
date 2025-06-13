import {Component} from 'react'

import Cookies from 'js-cookie'

import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {showError: false, errorMSg: '', username: '', password: ''}

  onSuccessAuthentication = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  formSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const loginDetails = {username, password}

    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(loginDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.onSuccessAuthentication(data.jwt_token)
      this.setState({showError: false, errorMSg: ''})
      console.log(data.jwt_token)
    } else {
      this.setState({showError: true, errorMSg: data.error_msg})
    }
  }

  changeUserNameInput = e => {
    this.setState({username: e.target.value})
  }

  changePasswordInput = e => {
    this.setState({password: e.target.value})
  }

  render() {
    const {username, password, errorMSg, showError} = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="loginBackground">
        <div className="inputCard">
          <form className="inputForm" onSubmit={this.formSubmit}>
            <img
              className="websitelogo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
            <div className="inputContainer">
              <label className="labels" htmlFor="username">
                USERNAME
              </label>
              <input
                type="text"
                id="username"
                className="inputbox"
                placeholder="Username"
                onChange={this.changeUserNameInput}
                value={username}
              />
            </div>
            <div className="inputContainer">
              <label className="labels" htmlFor="password">
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                className="inputbox"
                placeholder="Password"
                onChange={this.changePasswordInput}
                value={password}
              />
            </div>
            <button className="loginbutton" type="submit">
              Login
            </button>
            {showError && <p className="errorMsg">{`*${errorMSg}`}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
