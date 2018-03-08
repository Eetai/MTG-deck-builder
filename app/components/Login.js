import React, { Component } from 'react'
import { connect } from 'react-redux'
import { auth, logout } from '../reducers'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';


class Auth extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: ''
    }
  }

  render() {
    if (!this.props.user.id) return (
      <div>
        <FloatingActionButton
          mini={true}
          onClick={(e) => this.props.handleSubmit(event, 'login', this.state.email, this.state.password)}>
          <div>
            L
          </div>
        </FloatingActionButton>
        <FloatingActionButton
          secondary={true}
          mini={true}
          onClick={(e) => this.props.handleSubmit(event, 'signup', this.state.email, this.state.password)}>
          <div>
            S
          </div>
        </FloatingActionButton>
        <TextField
          hintText="Email"
          value={this.state.email}
          onChange={(event) => this.setState({ email: event.target.value.toLowerCase() }) }
        />
        <TextField
          hintText="Password"
          value={('*').repeat(this.state.password.length)}
          onChange={(event) => this.setState({ password: event.target.value.toLowerCase() }) }
        />
      </div>
    )
    else return (
      <div>
        <FloatingActionButton
          backgroundColor={'green'}
          mini={true}
          onClick={() => this.props.handleLogout()}>
          <div>
            L
          </div>
        </FloatingActionButton>
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
    handleSubmit: (evt, method, email, password) => {
      evt.preventDefault()
      // if (email.includes('@gmail.com')) method = 'google'
      dispatch(auth(email, password, method))
    },
    handleLogout: () => {
      dispatch(logout())
    }
  }
}

const Login = connect(mapState, mapDispatch)(Auth)

export default Login
