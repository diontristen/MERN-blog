const router = require('express').Router()
let validator = require('../library/lib.validation')
let Messages = require('../models/models.message')
let User = require('../models/models.user')
const auth = require('../middleware/middleware.auth')
const mongoose = require('mongoose')






router.route('/get/all').post(async (req, res) => {
    let skip = parseInt(req.body.skip, 10)
    let limit = parseInt(req.body.limit, 10)
    Messages.aggregate([
        {
            "$lookup": {
              "from": "users",
              "localField": "user_id",
              "foreignField": "_id",
              "as": "data"
            }
          },
          {
            "$unwind": "$data"
          },
          {
            "$project": {
              username: "$data.username",
              name: "$data.name",
              message: 1,
              _id: 1,
              user_id: 1,
              updatedAt: 1,
            }
          }   
    ]).sort({updatedAt: -1}).skip(skip).limit(limit)
    .then(data => {
        res.json({
            status: true,
            data: data
        })
    }).catch(error => {
        res.json({
            status: false,
            data: error
        })
    })
})

router.route('/count/:id').get(auth, async (req, res) => {
    Messages.countDocuments({user_id: req.params.id})
    .then(count => {
        res.json({status: true, count:count})
    })
    .catch(err => {
        res.json({status: false, count:err})
    })
})

router.route('/getById/:id').post(async (req, res) => {
    let skip = parseInt(req.body.skip, 10)
    let limit = parseInt(req.body.limit, 10)
    let user_id = mongoose.Types.ObjectId(req.params.id);
    Messages.aggregate([
        {
            "$match": {
                "user_id": user_id
            }
        },
        {
            "$lookup": {
              "from": "users",
              "localField": "user_id",
              "foreignField": "_id",
              "as": "data"
            }
          },
          {
            "$unwind": "$data"
          },
          {
            "$project": {
              username: "$data.username",
              name: "$data.name",
              message: 1,
              _id: 1,
              user_id: 1,
              updatedAt: 1,
            }
          }   
    ]).sort({updatedAt: -1}).skip(skip).limit(limit)
    .then(data => {
        res.json({
            status: true,
            data: data
        })
    }).catch(error => {
        res.json({
            status: false,
            data: error
        })
    })
})

router.route('/count/own').get(auth, async (req, res) => {
    Messages.countDocuments({user_id: req.token})
    .then(count => {
        res.json({status: true, count:count})
    })
    .catch(err => {
        res.json({status: false, count:err})
    })
})


router.route('/get/by/:value').post(async (req, res) => {
    let session_id = ""
    if (req.params.value == "own") {
        session_id = req.session.user_id
    } else if (req.params.value == "search") {
        session_id = req.session.search_id
    }
    
    Messages.find({user_id: session_id}).sort({updatedAt : -1})
    .then(async messages => {
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


router.route('/add').post(auth , (req, res) => {
    bResult = validator.isEmpty(req.body)
    if (bResult.status == false) {
        res.json(bResult)
        return
    }
    User.findById(req.token)
    .then(async users => {
        if (Object.keys(users).length == 0) {
            res.json("ERROR")
            return
        }

        const newMessage = new Messages ({
            user_id: req.token,
            message: req.body.message,
            updatedAt: Date.now()
        })
        newMessage.save()
        data = {
            message: newMessage.message,
            name: users.name,
            updatedAt: newMessage.updatedAt,
            user_id: newMessage.user_id,
            _id: newMessage._id,
            username: users.username
        }
        res.json({
            status:true,
            data: data
        })
    })
    .catch(error => {
        res.json({
            status: false,
            data: error
        })
    })
 
})

router.route('/update').post(async (req, res) => {
    bResult = validator.isEmpty(req.body)

    if (bResult.status == false) {
        res.json(bResult)
        return
    }

    Messages.findByIdAndUpdate(req.body.msg_id)
    .then(message => {
        message.message = req.body.message
        message.save()
        .then(message =>  {
            User.findById(message.user_id)
            .then(user => {
                data = {
                    message: message.message,
                    name: user.name,
                    updatedAt: message.updatedAt,
                    user_id: message.user_id,
                    _id: message._id,
                    username: user.username
                }
                res.json({
                    status: true,
                    data: data
                })
            })
        })
        .catch(err => res.status(400).json('Error: ' + err))
    
    })
    .catch(error => res.json({
        status: false,
        message: error
    }))
})

router.route('/delete/:id').get(auth , async (req, res) => {
    Messages.findByIdAndDelete(req.params.id)
    .then(message => {
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
