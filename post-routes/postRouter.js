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
        return;
    } 
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
    
})


//Returns the post object with the specified id.
router.get('/:id', (req, res) => {
    db.findById(req.params.id).then(post => {
       
        //If the post with the specified id is not found:
        if (post.length === 0) {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
            return;
        }
        res.status(200).json({data: post})
        return;
    }
    ).catch(_ => {
        //If there's an error in retrieving the post from the database
        res.status(500).json({ error: "The post information could not be retrieved." })
    })

})


//Updates the post with the specified id using data from the request body. Returns the modified document, NOT the original.
router.put('/:id', (req, res) => {
    console.log(req.params.id)
    //If the request body is missing the title or contents property
    if (!req.body.title || !req.body.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
        return;
    }
    db.findById(req.params.id).then( post => {
        
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

        db.update(post.id, newPost).then(count => {
            console.log("we're in the update")
            res.status(200).json({data: newPost})
        }).catch(_ => {
            //If there's an error when updating the post
            res.status(500).json({ error: "The post information could not be modified." })
        })
    }
    ).catch( (error)=> {
        res.status(500).json({message: "error finding by id", error: error})
    })

})

//Removes the post with the specified id and returns the deleted post object. You may need to make additional calls to the database in order to satisfy this requirement.
router.delete('/:id', (req, res) => {
    
    db.remove(req.params.id).then( recordsDeleted => {
        //If the post with the specified id is not found
        if (recordsDeleted === 0) {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
            return;
        }
        res.status(200).json({message: `${recordsDeleted} record has been deleted`})
    }
    ).catch(_ => {
        //If there's an error in removing the post from the database
        res.status(500).json({ error: "The post could not be removed" })
    })
    

    
})

//Returns an array of all the comment objects associated with the post with the specified id.
router.get('/:id/comments', (req, res) => {
    db.findPostComments(req.params.id).then( comments => {
        //If the post with the specified id is not found:
        if (comments.length === 0) {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
            return;
        }
        res.status(200).json({data: comments})
    }).catch(_ => {
        //If there's an error in retrieving the comments from the database
        res.status(500).json({ error: "The comments information could not be retrieved." })
        
    })

})


//Creates a comment for the post with the specified id using information sent inside of the request body.
router.post('/:id/comments', (req, res) => {
    //If the request body is missing the text property
    if(!req.body.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
        return;
    } 
    db.findById(req.params.id).then(
        post => {
            //If the post with the specified id is not found
            if (post.length === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
                return;
            }
            //If the information about the comment is valid
            
            const newComment = {
                text: req.body.text,
                post_id: req.params.id
            }

            db.insertComment([newComment]).then(comment => {
                res.status(201).json({...newComment, id: comment.id})
            }).catch( error => {
                //If there's an error while saving the comment
                res.status(500).json({ error: "There was an error while saving the comment to the database", message: error })
            })
        }
    ).catch( error => {
        res.status(500).json({message: "error!", error: error})
    })
    
})


module.exports = router