var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();



//load game model
require('../models/Game');
var Game = mongoose.model('games');

//Game Entry CRUD route

router.get('/games', function(req, res){
    Game.find({user:req.user.id}).lean().then(function(games){
        console.log("Fetch Route ");
        console.log(games);
        res.render('gameentry/index',{
            games:games
        });
    });
    
});

router.get('/gameentry/gameentryadd', function(req, res){
    res.render('gameentry/gameentryadd');
});

router.get('/gameentry/gameentryedit/:id',  function(req, res){
    console.log(req.params.id)
    Game.findOne({
        _id:req.params.id
    }).lean().then(function(game){

        if(game.user != req.user.id){
            req.flash('error_msg', 'Not Authorized');
            res.redirect('/game/games');
        }
        else{
           res.render('gameentry/gameentryedit',{
                 game:game
            }); 
        }
        
    })
});

//Post Requests
router.post('/gameentry', function(req,res){
    console.log(req.body);
    var errors = [];

    if(!req.body.title){
        errors.push({text:'please add a title'});
    }
    if(!req.body.price){
        errors.push({text:'please add a price'});
    }
    if(!req.body.description){
        errors.push({text:'please add a description'});
    }

    if(errors.length > 0){
        res.render('gameentry/gameentryadd',{
            errors:errors,
            title:req.body.title,
            price:req.body.price,
            description:req.body.description
        });
    }
    else{
        //Send info to database
       // res.send(req.body);
       var newUser = {
            title:req.body.title,
            price:req.body.price,
            description:req.body.description,
            user:req.user.id
       }
        new Game(newUser).save().then(function(games){
           //Saves game and redirects to game page
           req.flash('success_msg', 'Game Added Successfully');
           res.redirect('games');
       });
    }


    //res.send(req.body);
});

router.put('/gameedit/:id', function(req,res){
    console.log(req.params.id)
    Game.findOne({
        _id:req.params.id
    }).then(function(game){
        game.title = req.body.title
        game.price = req.body.price
        game.description = req.body.description

        game.save().then(function(game){
            req.flash('success_msg', 'Game Edited Successfully');
            res.redirect('/game/games');
        });

    });
});

router.delete('/gamedelete/:id', function(req,res){
    Game.deleteOne({
        _id:req.params.id
    }).then(function(){
        req.flash('success_msg', 'Game Deleted Successfully');
        res.redirect('/game/games');
    });
} );

module.exports = router;