import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <nav className="header">
      <ul className="unlist">
        <Link className="links" to="/">
          <li>
            <img
              className="headerlogo"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </li>
        </Link>

        <Link className="links" to="/">
          <li className="listItem">Home</li>
        </Link>
        <Link className="links" to="/jobs">
          <li className="listItem">Jobs</li>
        </Link>
      </ul>
      <button className="LogoutButton" type="button" onClick={onLogout}>
        Logout
      </button>
    </nav>
  )
}

export default withRouter(Header)
