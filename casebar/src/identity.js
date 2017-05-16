import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { firebaseAuth } from './fire'
import { logout, SignupWithEmail, LoginWithEmail, resetPassword } from './functions'

/////////////////////身分/////////////////////////
export class Userbar extends React.Component {
	state = {
		authed: false,
		data: '訪客'
	}
	componentWillMount () {
		this.removeListener = firebaseAuth.onAuthStateChanged((user) => {
			if (user) {
				var usrname = firebaseAuth.currentUser.email
				console.log(usrname)
				this.setState({
					authed: true,
					data: usrname
				})
			} else {
				this.setState({
					authed: false,
					data: '訪客'
				})
			}
		})
	}
	componentWillUnmount () {
		this.removeListener()
	}

	render() {
		return (
			<div>
			<div>{this.state.data}</div>
			{	
				this.state.authed
				? 
				<span>
				<button onClick={() => {
					logout()
				}}>登出</button>
				</span>
				: 
				<span>
				<div>登入</div>
				<div>註冊</div>
				</span>
			}
			</div>
			);
	}
}
/////////////////////身分/////////////////////////


/////////////////////註冊/////////////////////////
export class Signup extends Component {
  state = { registerError: null }
  handleSubmit = (e) => {
    e.preventDefault()
    SignupWithEmail(this.email.value, this.pw.value)
  }
  render () {
    return (
      <div>
        <h1>註冊</h1>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>Email</label>
            <input ref={(email) => this.email = email} placeholder="Email"/>
          </div>
          <div>
            <label>Password</label>
            <input type="password" placeholder="Password" ref={(pw) => this.pw = pw} />
          </div>
          <button type="submit">註冊</button>
        </form>
      </div>
    )
  }
}
/////////////////////註冊/////////////////////////



/////////////////////登入/////////////////////////
function setErrorMsg(error) {
  return {
    loginMessage: error
  }
}

export class Login extends Component {
  state = { loginMessage: null }
  handleSubmit = (e) => {
    e.preventDefault()
    LoginWithEmail(this.email.value, this.pw.value)
  }
  resetPassword = () => {
    resetPassword(this.email.value)
      .then(() => this.setState(setErrorMsg(`Password reset email sent to ${this.email.value}.`)))
      .catch((error) => this.setState(setErrorMsg(`Email address not found.`)))
  }
  render () {
    return (
      <div>
        <h1>登入</h1>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label>Email</label>
            <input ref={(email) => this.email = email} placeholder="Email"/>
          </div>
          <div>
            <label>Password</label>
            <input type="password" placeholder="Password" ref={(pw) => this.pw = pw} />
          </div>
          <button type="submit">登入</button>
        </form>
      </div>
    )
  }
}
//<a href="#" onClick={this.resetPassword} >Forgot Password?</a>
/////////////////////登入/////////////////////////
