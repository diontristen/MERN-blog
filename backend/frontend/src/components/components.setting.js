import React, { Component } from 'react';
import Swal from 'sweetalert2'
import myConstClass from './constant/constant'
import { Redirect } from "react-router-dom";

class Setting extends Component {


    constructor(props) {
        super(props)
        this.onClick = this.onClick.bind(this)
        this.onChangeInput = this.onChangeInput.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onSubmitAccount = this.onSubmitAccount.bind(this)
        this.onCall = this.onCall.bind(this)
        this.onChangeOwn = this.onChangeOwn.bind(this)
        this.onChangeOld = this.onChangeOld.bind(this)
        this.onDelete = this.onDelete.bind(this)



        this.state = {
            value: "HELLO WORLD",
            nicknamePage: "tab-conent",
            accountPage: "is-hidden",
            deactivatePage: "is-hidden",
            nameCount: this.props.user.name.length,
            nameErr: "",
            password: '',
            password2: '',
            oldpassword: '',
            oldpassword2: '',
            passwordErr: '',
            passwordClass: 'input is-small',
            password2Err: '',
            password2Class: 'input is-small',
            oldpasswordErr: '',
            oldpasswordClass: 'input is-small',
            oldpassword2Class: 'input is-small',
            goOut: null

        } 
    }


    componentDidMount() {
        document.getElementById("name").value = this.props.user.name
        document.getElementById("username").value = this.props.user.username

    }
    onChangeOld(e) {
        this.setState({
            oldpasswordErr: '',
            oldpaaswordClass: 'input is-small'
        })

        this.setState({
            oldpassword : e.target.value
        })
    }

    onChangeOwn(e) {
        this.setState({
            passwordErr: "",
            passwordClass: "input is-small",
            password2Class: "input is-small",
            oldpassword2Class: "input is-small",
            oldpassword2Err: "",
        })
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    onChangeInput(e) {
        this.props.setState({
            user: {
                [e.target.id]: e.target.value
            }
        })
    }

    onClick(e) {
        this.setState( {
            nicknamePage: "is-hidden",
            accountPage: "is-hidden",
            deactivatePage: "is-hidden"
        })
          
        this.setState({
            [e.target.id]: 'tab-content'
        })
    }

   async onDelete(e) {
        e.preventDefault(e)
        if (this.state.oldpassword2.trim().length <= 0) {
            this.setState({
                oldpassword2Class: this.state.oldpassword2Class + ' is-danger',
                oldpassword2Err: 'Current Password cannot be empty.'
            })
        } else {

            let data = {
                id: this.props.user._id,
                oldpassword2: this.state.oldpassword2
            }
            await fetch(myConstClass.API_URL + '/users/delete', {
                method: "POST",
                headers: {"Content-Type": "application/json", 'auth-token': localStorage.getItem('auth-token')},
                body:JSON.stringify(data)
            })
            .then(res => res.json())
            .then(json => {
                if (json.status === true) {
                    localStorage.removeItem("auth-token")
                    Swal.fire({
                        title: 'Deleted!',
                        html: json.message,
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false,
                    }).then((result)=> {
                        this.setState({
                            goOut: '/'
                        })
                    })
                } else {
                    Swal.fire(
                        'ERROR!',
                        json.message,
                        'error'
                        )
                }
            })
        }

    }

    onSubmitAccount(e) {
        e.preventDefault(e)
        if (this.props.userCount.username <= 0) {
            this.props.onUserErr('username')
        }
        if (this.state.oldpassword.trim().length <= 0) {
            this.setState({
                oldpasswordErr: "Old password is required to submit this new account details.",
                oldpasswordClass: this.state.oldpasswordClass + " is-danger"
            })
            return false
        }

        if (this.state.password.trim().length > 0 || this.state.password2.trim().length > 0) {
            if (this.state.password.trim().length < 15 || this.state.password2.trim().length < 15) {
                if (this.state.password !== this.state.password2) {
                    this.setState({
                        passwordErr: "Password and Confirm  Password did not match",
                        passwordClass: this.state.passwordClass + " is-danger",
                        password2Class: this.state.password2Class + " is-danger"
                    })
                } else {
                    let data = {
                        id: this.props.user._id, 
                        oldpassword: this.state.oldpassword,
                        username: this.props.user.username,
                        password: this.state.password,
                        password2: this.state.password2
                    }

                    this.onCall(data, 'account')
                }
            } else {
                
            }
        } if (this.state.password.trim().length === 0 && this.state.password2.trim().length === 0) {
            let data = {
                id: this.props.user._id,
                oldpassword: this.state.oldpassword,
                username: this.props.user.username,
         
            }
            this.onCall(data, 'username')
        }


    }

    async onCall(data, spax) {
        await fetch(myConstClass.API_URL + '/users/update', {
            method: "POST",
            headers: {"Content-Type": "application/json", 'auth-token': localStorage.getItem('auth-token')},
            body:JSON.stringify(data)
        })
        .then(res => res.json())
        .then(json => {
            if (json.status === true) {
                Swal.fire(
                    'Updated!',
                    'Your' + spax + 'has been updated',
                    'success'
                    )
                this.setState({
                    oldpassword: '',
                    password: '',
                    password2: ''
                })
                    document.getElementById("password").value = ''
                    document.getElementById("password2").value = ''
                    document.getElementById("oldpassword").value = ''
                    if ( data.username !== undefined) {
                        this.props.onChangeWall(data.username)
                    }
            } else {
                Swal.fire(
                    'ERROR!',
                    json.message,
                    'error'
                    )
            }
        })
    }
    async onSubmit(e) {
        e.preventDefault()
        if (this.props.userCount[e.target.name] <= 0) {
            this.props.onUserErr(e.target.name)
        } else {
            let data = {
                id: this.props.user._id,
                name: this.props.user.name,
            }
            this.onCall(data, 'name')
            
        }
    }

  render() {
    if (this.state.goOut) {
        return <Redirect to={this.state.goOut} />
    }
    return (
        <div id="tabs-with-content">
          <div className="tabs is-centered">
                <ul>
                <li><button className="is-cust-bottom" id="nicknamePage" onClick={this.onClick}>Name</button></li>
                <li><button  className="is-cust-bottom" id="accountPage" onClick={this.onClick}>Account</button></li>
                <li><button  className="is-cust-bottom" id="deactivatePage" onClick={this.onClick}>Deactivate</button></li>
                </ul>
            </div>
            <div className="has-text-left">
                <section className={this.state.nicknamePage}>
                    <div>
                        <form>
                            <div className="field">
                                    <small className="is-pulled-right is-mr-10 is-too-small" >{this.props.userCount.name}/15</small>
                            <label className="label is-small">Name</label>
                                <div className="control">
                                    <input className={this.props.userClass.name} type="text" id="name" max="15" maxLength="15"  onChange={this.props.onChangeUser} placeholder="Text input" />
                                    <span className="help is-danger">{this.props.userErr.name} </span>
                                </div>
                            </div>

                            

                            <nav className="level">
                                <div className="level-left">
                                </div>

                                <div className="level-right">
                                    <div className="field is-grouped">
                                        <div className="control">
                                            <button onClick={this.onSubmit} name="name" className="button is-link is-small">Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </nav>
                        </form>
                    </div>
                </section>
                <section className={this.state.accountPage}>
                    <div>
                    <form>
                            <div className="field">
                                <small className="is-pulled-right is-mr-10 is-too-small" >{this.props.userCount.username}/15</small>
                            <label className="label is-small">Username </label>
                                <div className="control">
                                    <input className={this.props.userClass.username} type="text" id="username" max="15" maxLength="15"  onChange={this.props.onChangeUser} placeholder="Text input" />
                                    <span className="help is-danger">{this.props.userErr.username} </span    >
                                </div>
                            </div>


                 
                            <p>Leave New Password and Confirm Password blank if you don't want to change it.</p>



                            <div className="field">
                            <label className="label is-small">Password</label>
                                <div className="control">
                                    <input className={this.state.passwordClass} type="text" id="password"  maxLength="15"  onChange={this.onChangeOwn} placeholder="Text input" />
                                    <span className="help is-danger">{this.state.passwordErr} </span    >
                                </div>
                            </div>

                            <div className="field">
                            <label className="label is-small">Confirm Password</label>
                                <div className="control">
                                    <input className={this.state.password2Class} type="text" id="password2"  maxLength="15"  onChange={this.onChangeOwn} placeholder="Text input" />
                                    <span className="help is-danger">{this.state.password2Err} </span    >
                                </div>
                            </div>


                            <p>To save new account details, you need to enter your old password</p>

                            <div className="field">
                            <label className="label is-small">Old Password</label>
                                <div className="control">
                                    <input className={this.state.oldpasswordClass} type="text" id="oldpassword"  maxLength="15"  onChange={this.onChangeOld} placeholder="Text input" />
                                    <span className="help is-danger">{this.state.oldpasswordErr} </span    >
                                </div>
                            </div>





                            <nav className="level">
                                <div className="level-left">
                                </div>

                                <div className="level-right">
                                    <div className="field is-grouped">
                                        <div className="control">
                                            <button onClick={this.onSubmitAccount} name="name" className="button is-link is-small">Submit</button>
                                        </div>
                                    </div>
                                </div>
                            </nav>
                        </form>
                    </div>
                </section>
           
                <section className={this.state.deactivatePage}>
                <div>
                        <p className="has-text-danger has-text-centered">Are you sure you want to delete your password? </p>
                        <p >Enter your current password to delete your account.</p>
                        <div className="field">
                            <label className="label is-small is-mt-5">Current Password</label>
                                <div className="control">
                                    <input className={this.state.oldpassword2Class} type="text" id="oldpassword2"  maxLength="15"  onChange={this.onChangeOwn} placeholder="Text input" />
                                    <span className="help is-danger">{this.state.oldpassword2Err} </span    >
                                </div>
                        </div>

                        <div className="level-right">
                                    <div className="field is-grouped">
                                        <div className="control">
                                            <button onClick={this.onDelete} name="oldpassword2" className="button is-link is-small">Submit</button>
                                        </div>
                                    </div>
                                </div>
                    </div>
                </section>
            </div>
        </div>
    )
  }
}

export default Setting