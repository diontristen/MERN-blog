const router = require('express').Router()
const bcrypt = require('bcrypt')


let User = require('../models/models.user')
let validator = require('../library/lib.validation')



router.route('/').get((req, res) => {
    res.json({
        status: true,
        data: req.session.user_id
    })
})


/**
 * Get users by id. Exact values.
 */
router.route('/getById/:id').post((req,res) => {
    User.findById(req.params.id)
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

/**
 * Get user by username using like query.
 */
router.route('/getByUsername/:username').get((req,res) => {
    data = new RegExp(req.params.username, 'i') 
    User.find({username:data})
    .then(users => {
        console.log(users)
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
                message: "Username is already registered."
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


router.route('/update').post((req, res) => {
    bResult = validator.isEmpty(req.body, "Username")
    if (bResult.status == false) {
        res.json(bResult)
        return
    }
   

    User.findByIdAndUpdate(req.body.id)
    .then(users => {
        delete req.body.id
        temp = req.body
        for (key in req.body) {
            users[key] = req.body[key]
        }
        users.save()
        .then(() => res.json({
            status:true,
            message:"User has been updated!"})
            )
        .catch(err => res.status(400).json('Error: ' + err))
    })
    .catch(err => res.status(400).json('Error: ' + err))


router.route('/delete').post((req, res) => {
    User.findByIdAndDelete(req.params.id)
    .then(users => res.json({
        status:true,
        message:"User has been deleted!. You will be automatically reditect to login page."})
        )
    .catch(err => res.status(400).json('Error: ' + err))
})
})


module.exports = router;