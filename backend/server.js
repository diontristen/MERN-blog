/**
 * Core Packages
 */
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
let validator = require('./library/lib.validation')
const jwt = require('jsonwebtoken')
const path = require('path')

/**
 * Router Directories
 */
const messageRouter = require('./routes/routes.messages')
const userRouter = require('./routes/routes.users')
const mEnv = require('./middleware/middleware.env')


/**
 * Main Applications
 */
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))


/**
 * Use Routers
 */
app.use('/messages', messageRouter)
app.use('/users', userRouter)



/**
 * MongoDB (Database) Declaration and Connection
 */
const mongoURI = mEnv.MONGO_URI
mongoose.connect(mongoURI, {useNewUrlParser:true, useCreateIndex:true,  useUnifiedTopology: true})
const mongoConnection = mongoose.connection
mongoConnection.once('open', () => {
    console.log("MongoDB database connection established succesfully")
})


let User = require('./models/models.user')
const bcrypt = require('bcrypt')

const auth = require('./middleware/middleware.auth')

app.post('/login' , async (req, res) => {
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
            const token = jwt.sign({id: users._id}, mEnv.SECRET_KEY)
            res.json({
                status: true,
                token
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

if (process.env.NODE_ENV === 'production') {
    app.use(express.static( 'frontend/build' ));

    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html')); // relative path
    });
}




const port = process.env.PORT || mEnv.PORT
app.listen(port, () => {
    console.log(`Server is up and running: ${port}`)
})