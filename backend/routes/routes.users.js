const router = require('express').Router()
const bcrypt = require('bcrypt')
const auth = require('../middleware/middleware.auth')

let User = require('../models/models.user')
let validator = require('../library/lib.validation')



router.route('/get/user').get((req, res) => {
    if (req.session.user_id === undefined) {
        res.json({
            status: false,
            message: "You must be logged in to view this page."
        })
    } else {
        User.findById(req.session.user_id)
        .then(user => {
            res.json({
                status: true,
                data: user
            })
        })
        .catch(err => {
            res.json({
                status: false,
                message: "System Error"
            })
        })
    }
})


/**
 * Get users by id. Exact values.
 */
router.route('/get/own').get(auth, (req,res) => {
    User.findById(req.token)
    .then(users => {
        res.json({
            status: true,
            data: users
        })
    })
    .catch(err => {
        res.json({
            status: false,
            data: "There is no user found"
        })
    })
})

router.route('/getByUser').post(async (req, res) => {
    data = new RegExp('^' + req.body.username, 'i') 
    await User.find({username:data}).sort({username: 1}).skip(parseInt(req.body.skip)).limit(parseInt(req.body.limit))
    .then(users => {
        if (users.length <= 0 || users === undefined) {
            res.json({
                status: false,
                rec: true
            })
        } else {
            res.json({
                status: true,
                data: users
            }) 
        }
      
    })
    .catch(err => res.json({
        status: false,
        rec: false,
        data: "There is no user found"
    }))
})

/**
 * Get user by username using like query.
 */
router.route('/getByUsername/:method/:username').get(async (req,res) => {
    let data = ''
    if (req.params.method == 'view') {
         data = req.params.username
    }
    if (req.params.method == 'search') {
        data = new RegExp('^' + req.params.username, 'i') 
    }
   await User.find({username:data})
    .then(users => {
        if (users.length <= 0 || users === undefined) {
            res.json({
                status: false,
                rec: true
            })
        } else {
            res.json({
                status: true,
                data: users
            }) 
        }
      
    })
    .catch(err => res.json({
        status: false,
        rec: false,
        data: "There is no user found"
    }))
})

/**
 * Get user by username using like query.
 */
router.route('/getByUsername/:username').get((req,res) => {
    data = new RegExp(req.params.username, 'i') 
    User.find({username:data})
    .then(users => {
        res.json({
            status: true,
            users: users
        })
    })
    .catch(err => res.json({
        status: false,
        data: "There is no user found"
    }))
})

/**
 * Add user to the database.
 */
router.route('/add').post( async (req,res) => {
    bResult = validator.isEmpty(req.body, "Username")
    if (bResult.status == false) {
        res.json(bResult)
        return
    }
    bResult = validator.isEqual(req.body.password, req.body.password2, "password", "password2")
    if (bResult.status == false) {
        res.json(bResult)
        return
    }
    User.find({username:req.body.username})
    .then(async users => {
        if (users.length != 0) {
            res.json({
                status:false,
                error: {
                    username: "Username is already registered."
                }
            })
            return
        } else {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const newUser = new User({
                username: req.body.username,
                name: req.body.name,
                password: hashedPassword
            });

            newUser.save()
            .then(() => res.json({
                status:true,
                message:"User has been successfully added!"})
                )
            .catch(err => res.status(400).json('Error: ' + err))
        }
    })
    .catch(err => res.status(400).json('Error: ' + err))
})


router.route('/update').post(auth, async (req, res) => {
    bResult = validator.isEmpty(req.body)
    if (bResult.status == false) {
        res.json(bResult)
        return
    }

    await User.findByIdAndUpdate(req.body.id)
    .then(async users => {
        delete req.body.id
        temp = req.body
        if ( !await bcrypt.compare(req.body.oldpassword, users.password)) {
            res.json({
                status: false,
                message: "Old Password is incorrect."
            })
            return
        }  
        bResult = validator.isEqual(req.body.password, req.body.password2, "password", "password2")
        if (bResult.status == false && (req.body.password !== undefined || req.body.password2 !== undefined)) {
            res.json(bResult)
            return
        } 
        if (req.body.password !== undefined && req.body.password2 !== undefined) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            users.password = hashedPassword
        } 
           
        for (key in req.body) {
           if (key != 'password2' && key != 'password' &&  key != 'old') {
            users[key] = req.body[key]
           } 
        }
        users.save()
        .then(() => res.json({
            status:true,
            data: users,
            message:"User has been updated!"})
            )
        .catch(err => res.status(400).json('Error: ' + err))
    })
    .catch(err => res.status(400).json('Error: ' + err))
})


router.route('/delete').post(auth, async (req, res) => {
    await User.findById(req.body.id)
    .then(async users => {
        if ( !await bcrypt.compare(req.body.oldpassword2, users.password)) {
            res.json({
                status: false,
                message: "Current Password is incorrect."
            })
            return
        } 
        await User.findByIdAndDelete(req.body.id)
        .then(users => res.json({
            status:true,
            message:"User has been deleted!. You will be automatically reditect to login page."})
        )
        .catch(err => res.status(400).json('Error: ' + err))
    }).catch(err => res.status(400).json('Error: ' + err))
    
})


module.exports = router;