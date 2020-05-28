import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import myConstClass from './constant/constant'
import Swal from 'sweetalert2'
import { Redirect } from "react-router-dom";

export default class  LoginPage extends Component {


    constructor(props) {
        super(props)
        this.state = {
            username:'',
            password:'',
            password2:'',
            name:'',
            usernameClass: 'input',
            passwordClass: 'input',
            password2Class: 'input',
            nameClass: 'input',
            usernameErr: '',
            passwordErr: '',
            password2Err: '',
            nameErr: '',
            notLogin: null
        }   

        this.onChangeInput = this.onChangeInput.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onReset = this.onReset.bind(this) 
    }



    onChangeInput(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onReset(e) {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure?',
            text: "All data would be cleared.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.value) {
                this.resetError()
                document.getElementById("regForm").reset()
                Swal.fire(
                    'Reset!!',
                    'Form has been reset.',
                    'success'
                )
            }
          })
    }

    async onSubmit(e) {
        e.preventDefault();
        let parent = this
        const user = {
            username: this.state.username,
            password: this.state.password,
            password2: this.state.password2,
            name: this.state.name
        }

       fetch(myConstClass.API_URL + "/users/add", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(user)
       })
       .then(res => res.json())
       .then(json => {
           this.resetError()
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
            Swal.fire({
                title: 'Account created!',
                html: json.message + ' , you will be redirected to the login page',
                icon: 'success',
                timer: 2200,
                showConfirmButton: false,
            }).then((result) => {
                this.setState({
                    notLogin: '/'
                })
            })
        }
       })
    }

   

    resetError() {
        this.setState ({
            usernameClass: 'input',
            nameClass : 'input',
            passwordClass : 'input',
            password2Class : 'input'
        })
    }



    render() {
        if (this.state.notLogin) {
            return <Redirect to={this.state.notLogin} />
        }
        return (
            <div className="container is-fluid ">
                <div className="columns">
                    <div className="column is-two-thirds">
                        <img src={require('../resources/images/register.svg')}  alt="MERN-login"/>
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
                                <div className="is-mt-5 has-text-centered">  
                                    <p className="title is-mb-0">Register Account</p>
                                    <div className="is-divider is-mt-10 is-mb-10"></div>
                                </div>

                                <form id="regForm">  
                                <div className="field">
                                    <label className="label">Username</label>
                                    <div className="control has-icons-left has-icons-right">
                                        <input className={this.state.usernameClass} maxLength="15" name="username" type="text" placeholder="Username" onChange={this.onChangeInput} />
                                        <span className="icon is-small is-left">
                                            <i className="fas fa-user"></i>
                                        </span>
                                    </div>
                                    <p className="help is-danger">{this.state.usernameErr}</p>
                                </div>

                                <div className="field">
                                    <label className="label">Nickname</label>
                                    <div className="control has-icons-left has-icons-right">
                                        <input className={this.state.nameClass} type="text" maxLength="15" name="name" placeholder="Name" onChange={this.onChangeInput}   />
                                        <span className="icon is-small is-left">
                                            <i className="fas fa-address-card"></i>
                                        </span>
                                    </div>
                                    <p className="help is-danger">{this.state.nameErr}</p>
                                </div>
                                <div className="field">
                                    <label className="label">Password</label>
                                    <div className="control has-icons-left has-icons-right">
                                        <input className={this.state.passwordClass} type="password" maxLength="15" name="password" placeholder="******" onChange={this.onChangeInput} />
                                        <span className="icon is-small is-left">
                                            <i className="fas fa-lock"></i>
                                        </span>
                                    </div>
                                    <p className="help is-danger">{this.state.passwordErr}</p>
                                </div>
                                <div className="field">
                                    <label className="label"> Confirm Password</label>
                                    <div className="control has-icons-left has-icons-right">
                                        <input className={this.state.password2Class} type="password" maxLength="15" name="password2" placeholder="******" onChange={this.onChangeInput} />
                                        <span className="icon is-small is-left">
                                            <i className="fas fa-lock"></i>
                                        </span>
                                    </div>
                                        <p className="help is-danger">{this.state.password2Err}</p>
                                </div>
                                <div className="field">
                                    <div className="buttons">
                                        <button className="button is-asset-bg" onClick={this.onSubmit}>Register</button>
                                        <button className="button is-light" onClick={this.onReset}>Reset</button>
                                    </div>
                                </div>

                                </form>
                                <div className="has-text-centered is-mt-5">
                                <Link to="/">Back to Login Page.</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
          </div>
        )
    }
}