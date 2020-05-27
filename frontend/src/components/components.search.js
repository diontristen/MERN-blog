import React, { Component } from 'react';
import { Link } from 'react-router-dom'

const List = liv => (
    <article onClick={()=> {liv.onClick(liv.data.username)}} className="media is-marginless is-mb-5  is-p-75rem search">
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


class Search extends Component {

    constructor(props){
        super(props)

        this.onChange = this.onChange.bind(this)
        this.onClick = this.onClick.bind(this)
        this.removeVal = this.removeVal.bind(this)
        
        this.state = {
            outputCard: 'is-hidden',
            searchVal: '',
            users: []
        }
    }

    onClick(data) {
        window.location = '/profile/' + data
    }

   async onChange(e) {
        let parent = this
        let username = e.target.value
        let limit = e.target.name
        this.setState({
            searchVal: username
        })
        if (username.trim().length > 0) {
        await fetch(process.env.REACT_APP_API_URL + '/users/getByUser', {
            method: "POST",
            headers: {"Content-Type": "application/json", 'auth-token': localStorage.getItem('auth-token')},
            body: JSON.stringify({
                username: username,
                limit: limit
            })
        })
        .then(res => res.json())
        .then(json => {
            if (json.status  === false && json.rec === true) {
                parent.setState({
                    users: []
                })
            } else if (json.status === true) {
                parent.setState({
                    users: json.data,
                    outputCard: 'card'
                })
            } else {
                // window.location = '/'
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
          return <List data={users} key={count} onClick={this.onClick}/>;
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
        return (
        <div>
            <div className="card  is-mt-10">
                <div className="card-content">
                    <div className="field has-addons is-content-center">
                        <div className="control has-icons-right is-width-100">
                            <input className="input is-small" id="searchVal" type="text" maxLength="15" name="3" placeholder="Find a user" onChange={this.onChange}/>
                            <span  onClick={this.removeVal}  className="icon is-small is-right is-pointer">
                                <i  className="fas fa-times"></i>
                            </span>
                        </div>
                        <div className="control">
                            <Link to={'/search/' + this.state.searchVal}><button className="button is-info is-small">
                                Search
                            </button> </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className={this.state.outputCard}>
                <div className="card-content is-paddingless">
                { this.userList() }

                </div>
            </div>
        </div>
        )
    }
}

export default Search