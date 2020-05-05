//'/api/posts'
const router = require('express').Router()


router.get('/',(req, res) => {
    res.status(200).json({message: "Looking good in the router!"})
})

module.exports = router