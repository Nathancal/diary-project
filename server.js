var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/planner');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Importing the models
var Submission = require('./models/submission');
var Diary = require('./models/diary');

//express function get retrieves data from the DB
app.get('/submission', function(req, res){
    //.find() function applied to find all records
    // associated with the submission model
    //Callback function used to either send back an error or submission
    //as a response.
    Submission.find({}, function(err, submission){
        if(err){
            //error if no records found
            res.status(500).send({error: "Could not find submission"});
        } else {
            res.send(submission);
        }
    })
});


app.post('/submission', function(req, res){
    var submission = new Submission();

    submission.title = req.body.title;
    submission.content = req.body.content;
    submission.date = req.body.date;
    submission.time = req.body.time;
    submission.sms = req.body.sms;

    submission.save(function(err, savedSubmission){
        if(err){
            res.status(500).send({error: "Could not add submission"});

        } else {
            res.status(200).send(savedSubmission);

        }

    })
});

//Function to create a new Diary
app.post('/diary', function(req, res){
    //Creates a new instance of Diary
    var diary = new Diary;

    //Takes the body and assigns it to title
    diary.title = req.body.title;

    //Saves data // Callback function
    diary.save(function(err, newDiary){
        if(err){
            res.status(500).send({error:"Could not create a diary"});
        } else {
            res.send(newDiary);
        }

    })

});

//This function retrieves a list of diarys
// app.get('/diary', function(req, res){
//     //Finds all objects associated
//     // with the Diary Model
//     Diary.find({}, function(err, Diarys){//Callback
//         if(err){//If there is an error
//             //Respond with error message
//             res.status(500).send({error:"Could not find Diary"});
//         } else {
//             res.send(Diarys);//Otherwise respond with Diarys
//         }
//
//     })
//
// });

app.put('/diary/submission/add', function(req, res){

    Submission.findOne({_id: req.body.submissionId}, function(err, submission){
            if(err){
                res.status(500).send({error:"could not find submission"});
            } else {
                Diary.update({_id: req.body.diaryId}, {$addToSet: {submissions: submission._id}}, function(err, diary){
                    if(err){
                        res.status(500).send({error:"Could not add to diary"});
                    } else {
                    res.send(diary);
                    }
            })

        }

    });

});

app.put('/diary/submission/remove', function(req, res){

    Submission.findOne({_id: req.body.submissionId}, function(err, submission){
        if(err){
            res.status(200).send({error:"Could not find submission"});
        } else {
            Diary.update({_id: req.body.diaryId}, {$pull: {submissions: submission._id}}, function(err, diary){
                if(err){
                    res.status(200).send({error: "could not remove submission"});
                } else{
                    res.send(diary);

                }

            })

        }

    });


});

app.get('/submission/search/:title', function(req, res){
    var title = req.params.title;



    Submission.find({title: req.params.title}, function(err, submission){
        if(err){
            res.status(200).send({error: "Could not find submission"});
        } else {
            res.send(submission);
        }

    })

});


app.get('/diary', function(req, res){
    Diary.find({}).populate({path:'submissions', model: 'Submission'}).exec(function(err, diary){
        if(err){
            res.status(200).send({error:"Cannot populate diary"});
        } else {
            res.send(diary);
        }

    })

});

app.listen(3000, function(){
    console.log("Diary Application running on port: 3000");

});
