import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import myConstClass from './constant/constant'
import { Redirect } from "react-router-dom";


export default class LoginPage extends Component {

    constructor(props){
        super(props)

        this.onChangeInput = this.onChangeInput.bind(this)
        this.onSubmit = this.onSubmit.bind(this)



        this.state = {
            username: '',
            password: '',
            usernameErr: '',
            passwordErr: '',
            usernameClass: 'input',
            passwordClass: 'input',
            redirect: null
        }

        console.log(myConstClass.TEST)
    }

    onChangeInput(e) {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    async onSubmit(e) {
        e.preventDefault(); 
        var parent = this
        const user = {
            username: this.state.username,
            password: this.state.password
        }

         fetch("/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(user)
        })
        .then(res => res.json())
        .then(json => {
            this.onReset()
            if (json.status === false) {
                Object.keys(json.error).forEach(async function(key) {
                    let suffix1 = key + "Err"
                    let suffix2 = key + "Class"
                    parent.setState({
                        [suffix1]: json.error[key],
                        [suffix2]: 'input is-danger'
                    })
                })
            } else {
                localStorage.setItem("auth-token", json.token)
                parent.setState({
                    redirect: '/home'
                })
            }
        })
    }

    onReset(){
        this.setState({
            usernameErr: '',
            passwordErr: '',
            usernameClass: 'input',
            passwordClass: 'input'
        })
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <div className="container is-fluid ">
                <div className="columns">
                    <div className="column is-two-thirds is-mt-10">
                        <img src={require('../resources/images/login.svg')}  alt="MERN-login"/>
                    </div>
                    <div className="column  is-one-third">
                        <div className="card">
                            <div className="card-content">
                                <p className="title">
                                #Freedom Wall
                                </p>
                                <p className="subtitle">
                                Simple | Basic | Easy-to-use
                                </p>

                                <div className="field">
                                    <label className="label">Username</label>
                                    <div className="control has-icons-left has-icons-right">
                                        <input className={this.state.usernameClass} type="text" id="username" maxLength="15" placeholder="Username" onChange={this.onChangeInput} />
                                        <span className="icon is-small is-left">
                                            <i className="fas fa-user"></i>
                                        </span>
                                    </div>
                                    <p className="help is-danger">{this.state.usernameErr}</p>
                                </div>

                                <div className="field">
                                    <label className="label">Password</label>
                                    <div className="control has-icons-left has-icons-right">
                                        <input className={this.state.passwordClass} name="username" id="password" maxLength="15" type="password" placeholder="******" onChange={this.onChangeInput} />
                                        <span className="icon is-small is-left">
                                            <i className="fas fa-lock"></i>
                                        </span>
                                    </div>
                                    <p className="help is-danger">{this.state.passwordErr}</p>
                                </div>

                                <div className="field">
                                    <p className="control">
                                        <button className="button is-asset-bg" onClick={this.onSubmit}>
                                        Login
                                        </button>
                                    </p>
                                </div>

                                <div className="has-text-centered is-mt-5">
                                    <Link to="/register">You don't have an account yet? Register Now!</Link>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
          </div>
        )
    }
}