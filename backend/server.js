/**
 * Use environment file for static configurations.
 */
require('dotenv').config()

/**
 * Core Packages
 */
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const session = require('express-session')
const bodyParser = require('body-parser')
let validator = require('./library/lib.validation')


/**
 * Router Directories
 */
const messageRouter = require('./routes/routes.messages')
const userRouter = require('./routes/routes.users')


/**
 * Main Applications
 */
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized: true
}))

/**
 * Use Routers
 */
app.use('/messages', messageRouter)
app.use('/users', userRouter)



/**
 * MongoDB (Database) Declaration and Connection
 */
const mongoURI = process.env.MONGO_URI
mongoose.connect(mongoURI, {useNewUrlParser:true, useCreateIndex:true,  useUnifiedTopology: true})
const mongoConnection = mongoose.connection
mongoConnection.once('open', () => {
    console.log("MongoDB database connection established succesfully")
})


let User = require('./models/models.user')
const bcrypt = require('bcrypt')

app.post('/login' , (req, res) => {
    bResult = validator.isEmpty(req.body, "Username")
    if (bResult.status == false) {
        res.json(bResult)
        return
    }

    User.findOne({username:req.body.username})
    .then(async users => {
        if (users === null) {
            res.json({
                status: false,
                error: {
                    username: "Username registered not registered."
                }
            })
        } else {
          if ( await bcrypt.compare(req.body.password, users.password)) {
            req.session.user_id = users._id;
            res.json({
                status: true,
                message: "Welcome Back!"
            })
          } else {
              res.json({
                  status: false,
                  error: {
                    password: "Incorrect password."
                  }
              })
          }
        }
    })
    .catch(error => res.json({
        status: false,
        message: error
    }))
})





/**
 * Run the Application
 * PORT => 5000
 * IP => localhost/local_ip
 */
const port = process.env.PORT
const local_ip = process.env.LOCAL_IP
app.listen(port, local_ip, () => {
    console.log(`Server is up and running: ${port}`)
})