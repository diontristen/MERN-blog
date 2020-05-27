import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { BallClipRotateMultiple } from 'react-pure-loaders';
import Swal from 'sweetalert2'
import Search from './components.search'

const List = liv => (
    <article id={liv.data._id + "-main"} className="media">
    <figure className="media-left">
        <p className="image is-64x64">
        <img src={require('../resources/images/hash.png')} alt="Freedom"/>
        </p>
    </figure>
    <div className="media-content">
        <div className="content">
        <p>
<strong>{liv.data.name}</strong> <small className="is-italic has-text-link is-new-link" name={liv.data.user_id}>@{liv.data.username} | </small> <small className="is-too-small">{liv.time}</small>
            <br/>
            {liv.data.message}
        </p>
        </div>

        <nav className={liv.nav}>
            <div className="level-left">
                <button id={liv.data._id} onClick={() => liv.updateMsg(liv.data._id,liv.data.message)} className="level-item is-anti-button">
                <span className="icon is-small"><i className="fas fa-edit"></i></span>
                </button>
            </div>
        </nav>
    </div>
    <div className={liv.media}>
        <button id={liv.data._id} onClick={() => liv.deleteMsg(liv.data._id)} className="delete is-small "></button>
    </div>
</article>
   
)

export default class HomePage extends Component {

    constructor(props){
        super(props)

        this.getAll = this.getAll.bind(this)
        this.onLoad = this.onLoad.bind(this)
        this.getCount = this.getCount.bind(this)
        this.onLogout = this.onLogout.bind(this)
        this.postMessage = this.postMessage.bind(this)
        this.onChangeInput = this.onChangeInput.bind(this)
        this.onChangeInputClass = this.onChangeInputClass.bind(this)
        this.onDelete = this.onDelete.bind(this)
        this.onUpdate = this.onUpdate.bind(this)
        this.onModalClose = this.onModalClose.bind(this)
        this.onLoadSearch = this.onLoadSearch.bind(this)
        this.myWall = this.myWall.bind(this)
        this.onFollow = this.onFollow.bind(this)
        this.handleScroll = this.handleScroll.bind(this)

        

        
        this.state = {
            username: '',
            name: '',
            id: '',
            currentid: '',
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
            secondClass: 'column is-2 is-mt-5',
            hiddenClass: 'is-hidden',
            mainClass: 'column is-5 is-paddingles is-mt-5',
            textareaClass: 'media',
            mywall: '/profile/',
            scrolling: true,
        }

  
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll)

        this.onLoad()
        this.onLoadSearch()
    }

    handleScroll(e) {
        let windowRelativeBottom = document.documentElement.getBoundingClientRect().bottom
        let windowRelativeScrolled = document.documentElement.clientHeight + 100
        if ((windowRelativeBottom <= windowRelativeScrolled) && this.state.scrolling === true) {
            this.setState({
                scrolling: false,
                skip: (this.state.skip) + 10
            })
            this.onFollow()
        } else if (((window.innerHeight + window.scrollY) >= (window.innerHeight + window.scrollY - 0.085)) && this.state.scrolling === false) {
            // this.refs.child.setBottom()
        }
    }
    async onFollow() {
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
                for (let key in json.data) {
                    parent.state.messages.push(json.data[key])
                }
                parent.setState(prevState => ({
                    messages: prevState.messages,
                    scrolling: true
                }))
                // parent.setState({messages: json.data})
            }
        })
    }

    myWall(e) {
        e.preventDefault();
        window.location = this.state.mywall
    }
    onCheck() {
        if (this.state.currentid !== this.state.id) {
            this.setState({
                textareaClass: 'is-hidden'
            })
        }
    }

    onChangeInputClass(e) {
        let sClass = e.target.id + "Class"
        let sError = e.target.id + "Err"
        this.setState({
            [sClass]: "textarea",
            [sError]: ''
        })
    }

    async postMessage(e) {
        let prefix =  e.target.getAttribute('prefix')
        let tempMessage = prefix + "Message"
        let tempClass = tempMessage + 'Class'
        let tempErr = tempMessage + 'Err'
        let URI = e.target.getAttribute('uri')
        let message = {
            message: this.state[tempMessage],
            msg_id: this.state.updateId
        }
        if (message.message.trim().length === 0) {
            this.setState({
                [tempClass]: "textarea is-danger",
                [tempErr]: "Message cannot be empty."
            })
        } else {
            this.submitMessage(message, URI, prefix)
        }
    }

    async submitMessage(message, URI, prefix, suffix) {
        await fetch(process.env.REACT_APP_API_URL + URI, {
            method: "POST",
            headers: {"Content-Type": "application/json" , 'auth-token': this.state.token},
            body: JSON.stringify(message)
        })
        .then(res => res.json())
        .then(json => {

            if (json.status === true) {
                let count = this.state.count
            let getElement = prefix + 'Message'
            let suffix = "updated."
            if (prefix === 'post') {
                count++
                suffix = "posted."
            }
            this.setState({
                messages:  this.state.messages.filter(el => el._id !== json.data._id)

            })
            this.state.messages.unshift(json.data)
            this.setState(prevState => ({
                count: count,
                [getElement]: '',
                modalClass: 'modal',
                messages: prevState.messages
            }))
            
            document.getElementById(getElement).value = "";
            this.showResponse('Message has been ' + suffix)
            } 
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


     async getAll() {
        let parent = this
        let body =     {skip: this.state.skip, 
            limit: this.state.limit}
        await fetch(process.env.REACT_APP_API_URL + '/messages/getById/' + this.state.id, {
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

    onLoadSearch() {
        let parent = this
        parent.setState({
            name: '',
            username: '',
        })
        let username = this.props.match.params.username
        fetch(process.env.REACT_APP_API_URL + '/users/getByUsername/view/' + username, {
            method: "GET",
            headers: {"Content-Type": "application/json", 'auth-token': localStorage.getItem('auth-token')},
        })
        .then(res => res.json())
        .then(json => {
            if (json.status  === false && json.rec === true) {
                document.getElementById("waller").style.display = "none"
                parent.setState({
                    secondClass: 'is-hidden',
                    hiddenClass: 'column is-7 is-whole ',
                    mainClass: 'is-hidden'
                })
            } else if (json.status === true) {
                parent.setState({
                    name: json.data[0].name,
                    username: json.data[0].username,
                    id: json.data[0]._id
                })
             
                document.getElementById("waller").style.display = "none"
                this.onCheck()
                this.getAll()
                this.getCount()

            } else {
                window.location = '/'
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
                    // name: json.data.name,
                    // username: json.data.username,
                    token: this.state.token,
                    currentid: json.data._id,
                    mywall: '/profile/' + json.data.username
                })
                // this.getAll()
                document.getElementById("waller").style.display = "none"
            }
        })
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

    onUpdate(id,msg) {
        this.setState({
            modalClass: "modal is-active",
            updateMessage: msg,
            updateId: id,
            updateCount: msg.length
        })
        document.getElementById('updateMessage').value = msg;
    }


    onModalClose() {
        this.setState({
            modalClass: "modal",
            updateMsg: ''
        }) 
    }

    
    messageList() {
        let count = 0
        return this.state.messages.map(messages => {
            count++
            let time = Math.floor(((Math.abs(Date.now() - Date.parse(messages.updatedAt))/1000)/60)) + "m ago"
   
            let media = "media-right is-hidden"
            let nav = "level is-mobile is-hidden"
            if (messages.user_id === this.state.currentid) {
                media = "media-right"
                nav = "level is-mobile"
            } 
            if (time === "0m ago") {
                time = "few moments ago"
            }

          return <List data={messages} key={count} time={time} nav={nav} media={media} updateMsg={this.onUpdate} deleteMsg={this.onDelete}/>;
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
                        'Your post has been deleted.',
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
                    <div className={this.state.hiddenClass}>
                        <div className="card is-whole ">
                            <div className="card-content  is-whole">
                                <p className="subtitle is-mt-10">
                                    No user found.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={this.state.secondClass}>
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
                                    Searched User
                                </p>
                                <img src={require('../resources/images/hash.png')} alt="Freedom" />

                                <div>
                                <p className="title">{this.state.name}</p>
                                <p className="subtitle">@{this.state.username}</p>
                                </div>
                            </div>
                        </div>
                        <div className="card is-mt-10">
                            <div className="card-content">
                            <nav className="level is-mobile">
                            <div className="level-item has-text-centered">
                                <div>
                                <p className="heading">Post Count</p>
                                <p className="title">{this.state.count}</p>
                                </div>
                            </div>
                            </nav>
                            </div>
                        </div>
                    </div>
                    
                    <div className={this.state.mainClass}>
                        <div className="card">
                            <div className="card-content">
                                <article className={this.state.textareaClass}>
                                    <figure className="media-left">
                                        <p className="image is-64x64">
                                        <img src={require('../resources/images/hash.png')} alt="Freedom" />
                                        </p>
                                    </figure>
                                    <div className="media-content">
                                        <div className="field">
                                        <p className="control">
                                            <textarea className={this.state.postMessageClass} maxLength="150" id="postMessage" prefix='post' onChange={this.onChangeInput} placeholder="Say something in the freedom wall..."></textarea>
                                            <span className="help is-danger">{this.state.postMessageErr} </span    >
                                        </p>
                                        </div>
                                        <nav className="level">
                                        <div className="level-left">
                                            <div className="level-item">
                                            </div>
                                        </div>
                                        <div className="level-right">
                                            <div className="level-item">
                                            <small className="is-pulled-right is-mr-10 is-too-small" >{this.state.postCount}/150</small>
                                            <button className="button is-info" uri="/messages/add" prefix="post" onClick={this.postMessage}>Submit</button>
                                            </div>
                                        </div>
                                        </nav>
                                    </div>
                                </article>

                                { this.messageList() }
                                <p> No more messages.</p>
                            </div>
                        </div>
                        
                    </div>

                    <div className="column is-3">

                    <Search />


                        <div className="card is-mt-10">
                            <div className="card-content">
                                <span className="subtitle is-mb-10">Side Wall</span>
                                <Link to="/home"> <button className="button is-fullwidth"> <i className="fas fa-home is-pr-5"></i> Back Home</button></Link>
                                 <button onClick={this.myWall} className="button is-fullwidth"> <i className="fas fa-id-badge is-pr-5"></i> My Wall</button>
                                <Link to="/settings"> <button className="button is-fullwidth"> <i className="fas fa-cogs  is-pr-5"></i> Settings</button></Link>
                                <button className="button is-fullwidth" onClick={this.onLogout}> <i className="fas fa-sign-out-alt is-pr-5"></i> Logout</button>
                            </div>
                        </div>

                    </div>






                    <div className="column is-1 ">
               

                    </div>
                </div>

                <div className={this.state.modalClass}>
                    <div className="modal-background"></div>
                    <div className="modal-card">
                        <section className="modal-card-body">
                        <article className="media ">
                                    <figure className="media-left">
                                        <p className="image is-64x64">
                                        <img src={require('../resources/images/hash.png')} alt="Freedom" />
                                        </p>
                                    </figure>
                                    <div className="media-content">
                                        <div className="field">
                                        <p className="control">
                                            <textarea className={this.state.updateMessageClass} id="updateMessage" prefix="update" onChange={this.onChangeInput} placeholder="Say something in the freedom wall..."></textarea>
                                            <span className="help is-danger">{this.state.updateMessageErr}</span    >
                                        </p>
                                        </div>
                                        <nav className="level">
                                        <div className="level-left">
                                            <div className="level-item">
                                            </div>
                                        </div>
                                        <div className="level-right">
                                            <div className="level-item">
                                                <div className="buttons is-mt-10">
                                                    <small className="is-pulled-right is-mr-10 is-too-small" >{this.state.updateCount}/150</small>
                                                    <button onClick={this.onModalClose} className="button">Cancel</button>
                                                    <button onClick={this.postMessage} prefix="update" uri="/messages/update" className="button is-info">Save changes</button>
                                                </div>
                                            </div>
                                        </div>
                                        </nav>
                                    </div>
                                </article>
                   
                        </section>
                   
                    </div>
                </div>
          </div>


        )
    }
}