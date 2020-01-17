var express = require('express');
var router = express.Router();
const Note = require('../models/note');
const withAuth = require('../middlewares/auth');

router.post('/', withAuth, async (req, res) =>{
    const {title, body} = req.body;
    try {
        let note = new Note({title, body, author: req.user._id});
        await note.save();
        res.status(200).json(note);
    } catch (error) {
        res.sendStatus(500).json({error: 'Problem to create a new note.'});
    }
})

router.get('/search', withAuth, async(req, res) =>{
    const { query } = req.query;
    try {
        let notes = await Note.find({author: req.user._id})
            .find({ $text: {$search: query} });
        res.status(200).json(notes);
    } catch (error) {
        res.sendStatus(500).json({error: 'Problem to get notes'});
    }
})

router.get('/:id', withAuth, async(req, res) =>{
    try {
        const { id } = req.params;
        let note = await Note.findById(id);
        if (isOwner(req.user, note)){
            res.status(200).json(note)
        }else{
            res.sendStatus(403).json({error: 'Permission denided.'});
        }
    } catch (error) {
        res.sendStatus(500).json({error: 'Problem to get a note.'});
    }
})

router.get('/', withAuth, async(req, res) =>{
    try {
        let notes = await Note.find({author: req.user._id})
        res.status(200).json(notes)
    } catch (error) {
        res.sendStatus(500).json({error: 'Problem to get a note.'});
    }
})

router.put('/:id', withAuth, async(req, res) =>{
    const { title, body} = req.body;
    const { id } = req.params;
    try {
        let note = await Note.findById(id);
        if (isOwner(req.user, note)){
            let note = await Note.findOneAndUpdate(id, 
                            {$set: {title: title, body: body}},
                            {upsert: true, 'new': true});
            res.status(200).json(note);
        }else{
            res.sendStatus(403).json({error: 'Permission denided.'});
        }
    } catch (error) {
        res.sendStatus(500).json({error: 'Problem to update a note.'});     
    }

})

router.delete('/:id', withAuth, async (req, res) =>{
    const { id } = req.params;
    try {
        let note = await Note.findById(id);
        if (isOwner(req.user, note)){
            await note.delete()
            res.status(204)
        }else{
            res.sendStatus(403).json({error: 'Permission denided.'});
        }
    } catch (error) {
        res.sendStatus(500).json({error: 'Problem to delete a note.'});     
    }
})

const isOwner = (user, note) =>  (JSON.stringify(user._id) === JSON.stringify(note.author._id))

module.exports = router;