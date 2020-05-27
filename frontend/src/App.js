import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom"
import './App.css';
import 'bulma/css/bulma.css'
import 'bulma-divider/dist/css/bulma-divider.min.css'
import './resources/css/general.css'

import LoginPage from "./components/components.login"
import RegisterPage from "./components/components.register"
import HomePage from "./components/components.home"
import ProfilePage from "./components/components.profile"
import SettingsPage from "./components/components.settings"
import SearchPage from "./components/components.spage"



function App() {
  return (
    <Router>
      <Route path="/" exact component={LoginPage}/> 
      <Route path="/register" exact component={RegisterPage}/>  
      <Route path="/home" exact component={HomePage}/>
      <Route path="/profile/:username" exact component={ProfilePage}/>
      <Route path="/settings" exact component={SettingsPage}/>
      <Route path="/search/:username" exact component={SearchPage}/>
    </Router>
  );
}

export default App;
