import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { BallClipRotateMultiple } from 'react-pure-loaders';
import Swal from 'sweetalert2'
import Setting from './components.setting'
import Search from './components.search'



export default class SettingPage extends Component {

    constructor(props){
        super(props)

        this.getAll = this.getAll.bind(this)
        this.onLoad = this.onLoad.bind(this)
        this.getCount = this.getCount.bind(this)
        this.onLogout = this.onLogout.bind(this)
        this.onChangeInput = this.onChangeInput.bind(this)
        this.onChangeUser = this.onChangeUser.bind(this)
        this.onChangeInputClass = this.onChangeInputClass.bind(this)
        this.onDelete = this.onDelete.bind(this)
        this.onModalClose = this.onModalClose.bind(this)
        this.onUserErr = this.onUserErr.bind(this)
        this.onChangeWall = this.onChangeWall.bind(this)



        

        
        this.state = {
            user: {
                username: '',
                name: '',
                _id: '',
                updatedAt: '',
                createdAt: ''
            },
            userCount: {
                username: '',
                name: '',
            },
            userErr: {
                username: '',
                name: '',
                password: ''
            },
            userClass: {
                username: 'input is-small',
                name: 'input is-small',
                password: 'input is-small'
            },
            count: '',
            postMessage: '',
            postMessageClass: 'textarea',
            postMessageErr: '',
            updateMessageClass: 'textarea',
            updateMessageErr: '',
            updateMessage: '',
            postCount: 0,
            updateCount: 0,
            updateId: '1',
            loading: true,
            defaultBody: "columns has-text-centered is-hidden ",
            defaultLoader: "is-full-page",
            token: localStorage.getItem('auth-token'),
            modalClass: "modal",
            messages :[],
            skip: 0,
            limit: 10,
            setting: false,
            mywall: ''
        }

  
    }

    componentDidMount() {
        this.onLoad()
     
    }

    onChangeInputClass(e) {
        let sClass = e.target.id + "Class"
        let sError = e.target.id + "Err"
        this.setState({
            [sClass]: "textarea",
            [sError]: ''
        })
    }



    showResponse(message) {
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: message,
            showConfirmButton: false,
            timer: 1500,
            width: "12rem",
          })
    }
    onChangeInput(e) {
        let prefix =  e.target.getAttribute('prefix')+ "Count"
        
        if (e.target.value.length <= 150) {
            this.setState({
                [e.target.id]: e.target.value,
                [prefix]: e.target.value.length
            })
            this.onChangeInputClass(e);
        }

    }


    onUserErr(e) {
        let newUserErr = JSON.parse(JSON.stringify(this.state.userErr))
        let newUserClass = JSON.parse(JSON.stringify(this.state.userClass))
        newUserErr[e] = e + " should not be empty."
        newUserClass[e] = this.state.userClass[e] + " is-danger"
        this.setState({
            userErr: newUserErr,
            userClass: newUserClass
            
        })
    }

    onChangeWall(wall) {
        this.setState({
            mywall: '/profile/' + wall
        })
    }
    onChangeUser(e) {
        let max =  e.target.getAttribute('max')+ "Count"
        if (e.target.value.length <= parseInt(max, 10)) {
        let newUser = JSON.parse(JSON.stringify(this.state.user))
        let newUserCount = JSON.parse(JSON.stringify(this.state.userCount))
        let newUserErr = JSON.parse(JSON.stringify(this.state.userErr))
        let newUserClass = JSON.parse(JSON.stringify(this.state.userClass))

        newUser[e.target.id] = e.target.value
        newUserCount[e.target.id] = e.target.value.length
        newUserErr[e.target.id] = ""
        newUserClass[e.target.id] = "input is-small"
            this.setState({
                user: newUser,
                userCount: newUserCount,
                userErr: newUserErr,
                userClass: newUserClass
            })
        }
    }

     async getAll() {
        let parent = this
        let body =     {skip: this.state.skip, 
            limit: this.state.limit}
        await fetch(process.env.REACT_APP_API_URL + '/messages/get/all', {
            method: "POST",
            headers: {"Content-Type": "application/json", 'auth-token': this.state.token},
            body:JSON.stringify(body)
        })
        .then(res => res.json())
        .then(json => {
            if (json.status !== false) {
                parent.setState({messages: json.data})
            }
        })
    }

    async onLoad() {
        let parent = this

        let token = this.state.token
        
        if (!token) {
            window.location = '/'
            return 
        }

        fetch(process.env.REACT_APP_API_URL + '/users/get/own', {
            method: "GET",
            headers: {"Content-Type": "application/json", 'auth-token': this.state.token},
        })
        .then(res => res.json())
        .then(json => {
            if (json.status  === false) {
                window.location = "/"
            } else {
                parent.setState({
                    loading: false,
                    defaultBody: "columns has-text-centered",
                    token: this.state.token,
                    user: json.data,
                    userCount: {
                        username: json.data.username.length,
                        name: json.data.name.length,
                    },
                    mywall: '/profile/' + json.data.username
                })
                document.getElementById("waller").style.display = "none"
                this.setState({
                    setting: true
                })
            }
        })
    }

  

    async getCount() {
        await fetch(process.env.REACT_APP_API_URL + '/messages/count/own', {
            method: "GET",
            headers: {"Content-Type": "application/json", 'auth-token': this.state.token},
        })
        .then(res => res.json())
        .then(json => {
            if (json.status === true) {
                this.setState({
                    count: json.count
                })
            } 
        })
    }



    onModalClose() {
        this.setState({
            modalClass: "modal",
            updateMsg: ''
        }) 
    }

    

    onLogout() {
        localStorage.removeItem("auth-token")
        window.location = "/"
    }

    async onDelete(id) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then(async (result) => {
            if (result.value) {
                await fetch(process.env.REACT_APP_API_URL + '/messages/delete/' + id, {
                    method: "GET",
                    headers: {"Content-Type": "application/json", 'auth-token': this.state.token},
                })
                .then(res => res.json())
                .then(json => {
                    if (json.status === true) {
                        this.showResponse("Message has been deleted!")
                        let count = this.state.count
                        count--
                        this.setState({
                            count: count,
                            messages:  this.state.messages.filter(el => el._id !== id)

                        })
                        Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                        )
                    } else {
                        Swal.fire(
                            'Error',
                            'There was an error upon deleting your post.',
                            'failed'
                            ) 
                    }
                })


            }
          })
    
    }

    render() {
        return (
            
            <div className="container is-fluid ">
                
                     <div id="waller" className="is-full-page">
                        <div className="is-force-center">
                            <BallClipRotateMultiple  color={'#08009E'} loading={this.state.loading}/>
                        </div>
                    </div>
                <div className={this.state.defaultBody}>
                    <div className="column is-1 ">
                    </div>

                  
                    
                    <div className="column is-7 is-paddingles is-mt-5">
                        <div className="card">
                            <div className="card-content">
                                

                            {this.state.setting && <Setting user={this.state.user} userCount={this.state.userCount} userClass={this.state.userClass} userErr={this.state.userErr} onUserErr={this.onUserErr} onChangeUser={this.onChangeUser} onChangeWall={this.onChangeWall}  />}
                            
                                
                            </div>
                        </div>
                    </div>

                    <div className="column is-3">

                      
                    <Search />

                        <div className="card is-mt-10">
                            <div className="card-content">
                                <p className="title">Back Wall</p>
                                <Link to="/home"> <button className="button is-fullwidth"> <i className="fas fa-home is-pr-5"></i>Back to Home</button></Link>
                                <Link to={this.state.mywall}> <button className="button is-fullwidth">  <i className="fas fa-id-badge is-pr-5"> </i>My Wall</button></Link>
                                <button className="button is-fullwidth" onClick={this.onLogout}> <i className="fas fa-sign-out-alt is-pr-5"></i> Logout</button>
                            </div>
                        </div>

                    </div>






                    <div className="column is-1 ">
               

                    </div>
                </div>
            
          </div>


        )
    }
}