const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    try {
     
        const token = req.header('auth-token')
      
        if (!token)
        return res.status(401)
        .json({status: false, message:"No authentication token, authorization denied."})

        const verified = jwt.verify(token, process.env.SECRET_KEY)

        if (!verified)
        return res.status(401)
        .json({status: false, message:"Token verification faild, authorization denid."})

        req.token = verified.id
        next()

    } catch(err) {
        res.status(500).json({status: false, message: err.message})
    }
}

module.exports = auth