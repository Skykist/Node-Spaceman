var SpacemanGame = require('../models/spaceman_game').SpacemanGame
const getRandomWord = require('random-words')

exports.create_game = (req, res) => {
    wordToGuess = req.body.word
    if(req.body.word == null){
        SpacemanGame.create({ 
            word: getRandomWord()
        }, function( err, gameInstance ) {
            if( err ) {
                res.status(400).send(err)
            } else {
                res.send( gameInstance )
            }
        });
    } else {
        SpacemanGame.create({ 
            word: wordToGuess
        }, function( err, gameInstance ) {
            if( err ) {
                res.status(400).send(err)
            } else {
                res.send( gameInstance )
            }
        });
    }
    
};

exports.get_game = ( req, res ) => {
    SpacemanGame.findById( req.params.id, ( err, gameInstance ) => {
        if( err || !gameInstance ) {
            res.sendStatus( 404 )
        } else {
            res.send( gameInstance )
        }
    } )
};


exports.get_solution = (req, res) => {
    SpacemanGame.findById( req.params.id, ( err, gameInstance ) => {
        if( err || !gameInstance ) {
            res.sendStatus( 404 );
        } else {
            res.json( {
                solution: gameInstance.word
            } );
        }
    });
};

exports.take_guess = (req, res) => {
    SpacemanGame.findById( req.params.id, ( err, gameInstance ) => {
        if( err || !gameInstance ) return res.sendStatus( 404 );
        if( !req.body.letters_guessed ) return res.status(400).send("Missing 'letters_guessed' in request body.");

        gameInstance.handleGuess( req.body.letters_guessed, ( err, updatedInstance ) => {
            if( err != null && err.error ) {
                res.status( 400 ).send(err.error)
            } else {
                res.send( updatedInstance )
            }
        });
    });
};