import React, { Component } from 'react';
import myConstClass from './constant/constant'
import { Redirect } from "react-router-dom";

const List = liv => (
    <article onMouseOver={() => {liv.testing(liv.data.name, liv.data.username)}} onClick={()=> {liv.onClick(liv.data.username)}} className="media is-marginless is-mb-5  is-p-75rem search">
    <figure className="media-left">
        <p className="image is-40x40">
        <img src={require('../resources/images/hash.png')} alt="Freedom"/>
        </p>
    </figure>
    <div className="media-content">
        <div className="content">
            <p className="subtitle is-marginless">
                    {liv.data.name}
            </p>
            <p className="subtitle"><small>@{liv.data.username}</small></p>
        </div>
    </div>

</article>
)


class SearchBig extends Component {
    constructor(props){
        super(props)

        this.onChange = this.onChange.bind(this)
        this.onClick = this.onClick.bind(this)
        this.removeVal = this.removeVal.bind(this)
        this.onLoad = this.onLoad.bind(this)
        this.onMouseEnter = this.onMouseEnter.bind(this)
        this.onFollow = this.onFollow.bind(this)
        this.setBottom = this.setBottom.bind(this)
        
        this.state = {
            outputCard: 'is-hidden',
            searchVal: '',
            skip: '',
            lastCount: 0,
            bottom: 'Loading...',
            users: [],
            reProfile: null,
        }
    }

    onMouseEnter(name, username) {
        document.getElementById('pname').innerHTML = name
        document.getElementById('pusername').innerHTML = username
    }
    componentDidMount() {
        this.onLoad()
    }
    onLoad() {
        let username = this.props.parameter
        if (username === undefined) {
            username = ""
        }
        this.setState({
            searchVal: username
        })
        let input = document.getElementById('searchVal')
        let nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(input, username)

        let ev2 = new Event('input', { bubbles: true});
        input.dispatchEvent(ev2);
      
    }
    
    onClick(data) {
        this.setState({
            reProfile: '/profile/' + data
        })
    }

    setBottom() {
        this.setState({
            bottom: 'No more users.'
        })
    }
    async onFollow() {
        let parent = this
        let username = document.getElementById('searchVal').value
        if (username.trim().length > 0) {
            await fetch(myConstClass.API_URL + '/users/getByUser', {
                method: "POST",
                headers: {"Content-Type": "application/json", 'auth-token': localStorage.getItem('auth-token')},
                body: JSON.stringify({
                    username: username,
                    limit: '10',
                    skip: this.state.skip
                })
            })
            .then(res => res.json())
            .then(json => {
                if (json.status  === false && json.rec === true) {
                    parent.props.setScroll(false)

                } else if (json.status === true) {
                    for (let key in json.data) {
                        parent.state.users.push(json.data[key])
                    }
                    let newskip = parseInt(this.state.skip) + 10
                    parent.setState(prevState => ({
                        users: prevState.users,
                        skip: newskip
                    }))
                } 
            })
            } else {
                parent.setState({
                    users: [],
                    outputCard: 'is-hidden'
                })
            }
    }

    
     async onChange(e) {
        let parent = this
        let username = e.target.value
        parent.props.setScroll(true)
        if (username.trim().length > 0) {
        await fetch(myConstClass.API_URL + '/users/getByUser', {
            method: "POST",
            headers: {"Content-Type": "application/json", 'auth-token': localStorage.getItem('auth-token')},
            body: JSON.stringify({
                username: username,
                limit: '8',
                skip: 0
            })
        })
        .then(res => res.json())
        .then(json => {
           
            if (json.status  === false && json.rec === true) {
                parent.setState({
                    users: [],
                    bottom: 'No more users.',
                    skip: '10'
                })
            } else if (json.status === true) {
                parent.setState({
                    users: json.data,
                    outputCard: 'card',
                    skip: '10'
                })
            } else {
            }
        })
        } else {
            parent.setState({
                users: [],
                outputCard: 'is-hidden'
            })
        }
    }

    userList() {
        let count = 0
            return this.state.users.map(users => {
                count++
              return <List data={users} key={count} onClick={this.onClick} testing={this.onMouseEnter}/>;
            })
    }

    removeVal(e) {
        this.setState({
            searchVal: '',
            users: [],
            outputCard: 'is-hidden'
        })
        document.getElementById('searchVal').value = ''
    }
    render() {
        if (this.state.reProfile) {
            return <Redirect to={this.state.reProfile} />
          }
        return (
        <div>
            <div className="card  is-mt-10">
                <div className="card-content">
                    <div className="field has-addons is-content-center">
                        <div className="control has-icons-right is-width-100">
                            <input className="input is-small" id="searchVal" type="text" maxLength="15" name="8" placeholder="Find a user" onChange={this.onChange}/>
                            <span  onClick={this.removeVal}  className="icon is-small is-right is-pointer">
                                <i  className="fas fa-times"></i>
                            </span>
                        </div>
                        <div className="control">
                            <button className="button is-info is-small">
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className={this.state.outputCard}>
                <div className="card-content is-paddingless">
                { this.userList() }
                </div>
                <p className="subtitle has-text-centered is-pb-5">{this.state.bottom}</p>

            </div>
        </div>
        )
    }
}

export default SearchBig