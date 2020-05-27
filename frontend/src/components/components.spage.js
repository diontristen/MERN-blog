import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import SearchBig from './components.bigsearch'

export default class SearchPage extends Component {

    constructor(props){
        super(props)

        this.getCount = this.getCount.bind(this)
        this.handleScroll = this.handleScroll.bind(this)
        this.setScroll = this.setScroll.bind(this)
        this.onLoad = this.onLoad.bind(this)


        this.state = {
            username: 'NaN',
            name: 'NaN',
            scrolling: true,
            mywall: '',
            token: localStorage.getItem('auth-token')
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll)
        this.onLoad()
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
                    mywall: '/profile/' + json.data.username
                })
            }
        })
    }


    setScroll(status) {
        this.setState({
            scrolling: status
        })
       
    }
    handleScroll(e) {
        let windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom
        let windowRelativeScrolled = document.documentElement.clientHeight + 100
        if (((windowRelativeBottom <= windowRelativeScrolled)) && this.state.scrolling === true) {
            this.setState({
                scrolling: false
            })
            this.refs.child.onFollow()
        } else if (((windowRelativeBottom <= windowRelativeScrolled)) && this.state.scrolling === false) {
            this.refs.child.setBottom()
        }
    }
    myWall(e) {
        e.preventDefault();
        window.location = this.state.mywall
    }


    async getCount() {
        await fetch(process.env.REACT_APP_API_URL + '/messages/count/' + this.state.id, {
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

    onLogout() {
        localStorage.removeItem("auth-token")
        window.location = "/"
    }


    render() {
        return (
          <div>
              <div className="container-fluid"> 
                <div className="columns is-mobile is-whole">
                    <div className="column is-1"></div>
                    <div className="column is-2">
                       

                    <div className="card">
                            <div className="card-content">
                                <p className="title">
                                    Freedom Wall
                                </p>
                            </div>
                        </div>

                        <div className="card is-mt-10">
                            <div className="card-content">
                                <p className="subtitle">
                                    Searching User
                                </p>
                                <img src={require('../resources/images/hash.png')} alt="Freedom" />

                                <div>
                                <p id="pname" className="title">{this.state.name}</p>
                                <p id="pusername" className="subtitle">@{this.state.username}</p>
                                </div>
                            </div>
                        </div>
                    


                    </div>
                    <div className="column is-5">
                    <SearchBig ref="child"  parameter={this.props.match.params.username} setScroll={this.setScroll}/>
                 
                    </div>
                    <div className="column is-3">

                        <div className="card is-mt-10">
                            <div className="card-content  has-text-centered">
                                <span className="subtitle is-mb-10">Side Wall</span>
                                <Link to="/home"> <button className="button is-fullwidth"> <i className="fas fa-home is-pr-5"></i> Back Home</button></Link>
                                <Link to={this.state.mywall} > <button className="button is-fullwidth"> <i className="fas fa-id-badge is-pr-5"></i> My Wall</button> </Link>
                                <Link to="/settings"> <button className="button is-fullwidth"> <i className="fas fa-cogs  is-pr-5"></i> Settings</button></Link>
                                <button className="button is-fullwidth" onClick={this.onLogout}> <i className="fas fa-sign-out-alt is-pr-5"></i> Logout</button>
                            </div>
                        </div>
                    </div>
                    <div className="column is-1"></div>
                </div>
              </div>
          </div>


        )
    }
}