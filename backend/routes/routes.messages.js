const router = require('express').Router()
let validator = require('../library/lib.validation')
let Messages = require('../models/models.message')
let User = require('../models/models.user')



router.route('/get/all').get((req, res) => {
    Messages.find().sort({updatedAt: -1})
    .then(messages => {
        res.json(messages)
    })
    .catch(error => {
        res.json({
            status: false,
            data: error
        })
    })
})

router.route('/set/:id').post(async (req, res) => {
    req.session.search_id = req.params.id
    res.json({
        status: true,
    })
})

router.route('/get/by/:value').post(async (req, res) => {
    let session_id = ""
    console.log(req.session)
    console.log(req.params.value)
    if (req.params.value == "own") {
        session_id = req.session.user_id
    } else if (req.params.value == "search") {
        console.log("SEARCH")
        session_id = req.session.search_id
    }
    
    Messages.find({user_id: session_id}).sort({updatedAt : -1})
    .then(async messages => {
        console.log("HERE: " + session_id)
        User.findById(session_id)
        .then(async users => {
            const username = users.username
            const user_id = session_id
            const name = users.name
            res.json(messages)
        })
        .catch(error => res.json({
            status: false,
            message: "System Error1"
        }))
     
    })
    .catch(error => res.json({
        status: false,
        message: "System Error2"
    }))
})


router.route('/add').post((req, res) => {
    bResult = validator.isEmpty(req.body, "Username")
    if (bResult.status == false) {
        res.json(bResult)
        return
    }
    
    User.findById(req.session.user_id)
    .then(async users => {
        if (Object.keys(users).length == 0) {
            res.json("ERROR")
            return
        }

        const newMessage = new Messages ({
            user_id: req.session.user_id,
            message: req.body.message,
        })

        newMessage.save()
        .then(() => res.json({
                status:true,
                data: req.body
            }))
            
        .catch(error => res.json({
            status: false,
            message: error
        }))
       
    })
    .catch(error => {
        res.json({
            status: false,
            message: "System Error"
        })
    })
 
})

router.route('/update').post(async (req, res) => {
    bResult = validator.isEmpty(req.body, "Username")
    if (bResult.status == false) {
        res.json(bResult)
        return
    }

    Messages.findByIdAndUpdate(req.body.msg_id)
    .then(message => {
        message.message = req.body.message
        message.save()
        .then(() =>  res.json({
            status: true,
        }))
        .catch(err => res.status(400).json('Error: ' + err))
    
    })
    .catch(error => res.json({
        status: false,
        message: error
    }))
})

router.route('/delete').post(async (req, res) => {
    Messages.findByIdAndDelete(req.body.msg_id)
    .then(message => {
        console.log(message)
        message.delete()
        .then(() =>  res.json({
            status: true,
        }))
        .catch(err => res.status(400).json('Error: ' + err))
    })
    .catch(error => res.json({
        status: false,
        message: error
    }))
})

module.exports = router;
