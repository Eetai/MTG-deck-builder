import React, { Component } from 'react'
import { connect } from 'react-redux'
import { auth, logout } from '../reducers'
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';


class Auth extends Component {
  constructor(props) {
    super(props)
    this.state = {
      SigningUp: false,
      username: '',
      password: '',
      confirmPassword: ''
    }
  }

  render() {
    if (!this.props.user.id && !this.state.SigningUp) return (
      <div style={{ display: 'flex'}}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            hintText="Username"
            value={this.state.username}
            onChange={(event) => this.setState({ username: event.target.value.toLowerCase() })}
          />
          <TextField
            hintText="Password"
            value={('*').repeat(this.state.password.length)}
            onChange={(event) => this.setState({ password: event.target.value })}
          />
        </div>
        <div>
          <FlatButton
            label="Login"
            disabled={!this.state.password.length || !this.state.username.length}
            primary={true}
            onClick={(e) => this.props.handleSubmit(event, 'login', this.state.username, this.state.password)}
          />
          <FlatButton
            label="New User?"
            primary={true}
            onClick={() => this.setState({ SigningUp: true })}
          />
        </div>
      </div>
    )
    else if (!this.props.user.id && this.state.SigningUp) return (
      <div style={{ display: 'flex'}}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            hintText="Username"
            value={this.state.username}
            onChange={(event) => this.setState({ username: event.target.value.toLowerCase() })}
          />
          <TextField
            hintText="Password"
            value={('*').repeat(this.state.password.length)}
            onChange={(event) => this.setState({ password: event.target.value })}
          />
          <TextField
            hintText="Confirm Password"
            value={('*').repeat(this.state.confirmPassword.length)}
            onChange={(event) => this.setState({ confirmPassword: event.target.value })}
          />
        </div>
        <div>
          <FlatButton
            label="Signup"
            disabled={!this.state.password.length || !this.state.username.length || this.state.password !== this.state.confirmPassword}
            primary={true}
            onClick={(e) => this.props.handleSubmit(event, 'signup', this.state.username, this.state.password)}
          />
          <FlatButton
            label="Existing User?"
            primary={true}
            onClick={() => this.setState({ SigningUp: false })}
          />
        </div>
      </div>
    )
    else return (
      <div>
      </div>
    )
  }
}

const mapState = (storeState) => {
  return {
    error: storeState.defaultUser.error,
    user: storeState.defaultUser
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleSubmit: (evt, method, username, password) => {
      evt.preventDefault()
      dispatch(auth(username, password, method))
    },
    handleLogout: () => {
      dispatch(logout())
    }
  }
}

const Login = connect(mapState, mapDispatch)(Auth)

export default Login
