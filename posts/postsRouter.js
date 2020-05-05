const express = require("express");
const router = express.Router();

const db = require("../data/db");

const postslength = 9

let Post = {
    title: "", // String, required
    contents: "", // String, required
    created_at: Date.now(), // Date, defaults to current date
    updated_at: Date.now() // Date, defaults to current date
}

let comment = {
    text: "", // String, required
    post_id: "", // Integer, required, must match the id of a post entry in the database
    created_at: Date.now(), // Date, defaults to current date
    updated_at: Date.now() // Date, defaults to current date
}

router.get("/", (req, res) => {
    db.find()
    .then(posts => {
        res.json({posts: posts})
    })
    .catch(error => {
        res.status(500).json({error: "The posts information could not be retrieved."}).end()
    })
})

router.get("/:id", (req, res) => {
    const id = req.params.id
    db.findById(id)
    .then(post => {
        if(!post.id){
            res.status(404).json({error: "The post with the specified ID does not exist."})
        } else {
            res.status(200).json({post: post})
        }
    }).catch(error => {
        res.status(500).json({error: "The posts information could not be retrieved."}).end()
    })
})

router.get("/:id/comments", (req, res) => {
    const id = req.params.id
    db.findPostComments(id)
    .then(comment => {
        if(comment.length>0){
            res.status(200).json({comment: comment})
        } else {
            res.status(404).json({error: "The post with the specified ID does not exist."})
        }
    }).catch(error => {
        res.status(500).json({error: "The posts information could not be retrieved."}).end()
    })
  });

  router.post("/", (req, res) => {
    Post.title = req.body.title,
    Post.contents = req.body.contents
    db.insert(Post)
    .then(post => {
        if(req.body.contents.length==0 || req.body.title.length==0){
            res.status(404).json({errorMessage: "Please provide title and contents for the post."})
        } else {

            res.status(200).json({post: post})
        }
    }).catch(error => {
        res.status(500).json({error: "The posts information could not be retrieved."}).end()
    })
})


router.post("/:id/comments", (req, res) => {
    const id = req.params.id
    comment.text = req.body.text,
    comment.post_id = req.body.post_id
    db.insertComment(comment)
    .then(comment => {
        if(req.body.post_id == (id)){
            res.status(201).json(comment)
        } else if(req.body.text = 0) {
            res.status(400).json({errorMessage: "Please provide text for the comment."})
        } else {
            res.status(404).json({message: "The post with the specified ID does not exist."})
        }
    }).catch(error => {
        res.status(500).json({error: "The posts information could not be retrieved."}).end()
    })
})

router.put("/:id", (req, res) => {
    const id = req.params.id
    const update = req.body

    db.update(id, update)
    .then(post => {
        if (post === 1) {
            res.status(200).json(post)
        } else if (!update.title || !update.contents) {
            res.status(400).json({message: 'provide a title and contents for the post.' })
        } else if (post === 0) {
            res.status(404).json({ message: 'The post with the specified ID does not exist, please try again.' })
        }
        res.status(200).json(postToUpdate)
    }).catch(err => {
        res.status(500).json({error: 'post information could not be modified, please retry'})
    })
})

router.delete("/:id", (req, res) => {
    const id = req.params.id
    db.remove(id)
    .then(post => {
        if (post) {
            res.status(200).json({ message: 'The post has been deleted' });
        } else {
            res.status(404).json({message: 'The post with the specified ID does not exist.'})
        }
    }).catch(error => {
        console.log(error);
        res.status(500).json({ error: 'The post could not be recovered' });
    })
})




module.exports = router