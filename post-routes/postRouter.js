//'/api/posts'
const router = require('express').Router()

const db = require('../data/db.js')


//Returns an array of all the post objects contained in the database.
router.get('/',(req, res) => {
    
})

//Creates a post using the information sent inside the request body.
router.post('/', (req, res) => {
    //If the request body is missing the title or contents property
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." }) 
    } else {
        //If the information about the post is valid
        const newPost = {
            title: req.body.title,
            contents: req.body.contents,
            created_at: new Date(),
            updated_at: new Date()
        }
        db.insert(newPost).then(response => {
            res.status(201).json({...newPost, id: response.id})
        }).catch( _ => {
            //If there's an error while saving the post
            res.status(500).json( { error: "There was an error while saving the post to the database" })
        })
    }
})

//Returns the post object with the specified id.
router.get('/:id', (req, res) => {

})


//Updates the post with the specified id using data from the request body. Returns the modified document, NOT the original.
router.put('/:id', (req, res) => {

})

//Removes the post with the specified id and returns the deleted post object. You may need to make additional calls to the database in order to satisfy this requirement.
router.delete('/:id', (req, res) => {

})

//Returns an array of all the comment objects associated with the post with the specified id.
router.get('/:id/comments', (req, res) => {

})

//Creates a comment for the post with the specified id using information sent inside of the request body.
router.post('/:id/comments', (req, res) => {

})


module.exports = router