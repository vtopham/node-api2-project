//'/api/posts'
const router = require('express').Router()

const db = require('../data/db.js')


//Returns an array of all the post objects contained in the database.
router.get('/',(req, res) => {
    db.find().then(posts => {
        res.status(200).json({data: posts})
    }).catch(_ => {
        //If there's an error in retrieving the posts from the database
        res.status(500).json({ error: "The posts information could not be retrieved." })
    })
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
    db.findById(req.params.id).then(post => {
       
        //If the post with the specified id is not found:
        if (post.length === 0) {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
        res.status(200).json({data: post})
    }
    ).catch(_ => {
        //If there's an error in retrieving the post from the database
        res.status(500).json({ error: "The post information could not be retrieved." })
    })

})


//Updates the post with the specified id using data from the request body. Returns the modified document, NOT the original.
router.put('/:id', (req, res) => {
    console.log(typeof(req.params.id))
    //If the request body is missing the title or contents property
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
    db.findById(parseInt(req.params.id)).then( post => {
        if (post.length === 0) {
            //If the post with the specified id is not found
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
        //If the post is found and the new information is valid
        const newPost = {
            title: req.body.title, 
            contents: req.body.contents, 
            created_at: post.created_at, 
            updated_at: new Date()
        }

        update(post.id, newPost).then(count => {
            res.status(200).json({data: newPost})
        }).catch(_ => {
            //If there's an error when updating the post
            res.status(500).json({ error: "The post information could not be modified." })
        })
    }
    ).catch(_ => {
        res.status(500).json({message: "error finding by id"})
    })

})

//Removes the post with the specified id and returns the deleted post object. You may need to make additional calls to the database in order to satisfy this requirement.
router.delete('/:id', (req, res) => {

})

//Returns an array of all the comment objects associated with the post with the specified id.
router.get('/:id/comments', (req, res) => {
    

})


//TODO: FIX Creates a comment for the post with the specified id using information sent inside of the request body.
router.post('/:id/comments', (req, res) => {
    //If the request body is missing the text property
    if(!req.body.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    } 
    db.findById(req.params.id).then(
        post => {
            //If the post with the specified id is not found
            if (post.length === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
            //If the information about the comment is valid
            const newComment = {
                text: req.body.text,
                post_id: post.id,
                created_at: new Date(),
                updated_at: new Date()
            }
            insertComment(newComment).then(comment => {
                res.status(201).json({...newComment, id: comment.id})
            }).catch( _ => {
                //If there's an error while saving the comment
                res.status(500).json({ error: "There was an error while saving the comment to the database" })
            })
        }
    ).catch( error => {
        res.status(500).json({message: "error!", error: error})
    })
    
})


module.exports = router