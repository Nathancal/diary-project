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
var User = require('./models/user');



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

    //Creates a variable that displays the date day/month/year.
    //Data derived from the date() function
    var date = new Date();
    var month = date.getMonth() + 1; //months from 1-12
    var day = date.getDate();
    var year = date.getFullYear();
    var dateComplete = day + "/" + month + "/" + year;

    //Creates a variable that displays the timestamp of each submission
    //Data also derived form the date() function
    var time = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var seconds = date.getSeconds();
    var timeComplete = hour + ":" + minute + ":" + seconds;

    //Collects the Data from the User for all except the
    //date and time which is generated automatically
    var submission = new Submission();

    submission.title = req.body.title;
    submission.content = req.body.content;
    submission.date = dateComplete;
    submission.time = timeComplete;
    submission.sms = req.body.sms;

    //Uses a callback function to throw any errors and
    //save the new object
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
    //Uses the findOne function to find the submission objectId connected
    //with the submissionId
    Submission.findOne({_id: req.body.submissionId}, function(err, submission){
        if(err){
            res.status(200).send({error:"Could not find submission"});
        } else {
            //Once a submission is found the diary its to be pulled from is then found
            //the submission is then pulled from the diary
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



//The following are two functions that allow the user to search for
//submissions both by title and by date.
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
app.get('/submission/search/:date', function(req, res){
    var date = req.params.date;

    Submission.find({date: req.params.date}, function(err, submission){
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

// app.post('/user', function(req, res){
//     var user = new User;
//
//     user.title = req.body.title;
//     user.userName = req.body.userName;
//     user.passWord = req.body.passWord;
//     user.forename = req.body.forename;
//     user.surname = req.body.surname;
//     user.loggedIn = false;
//
//     user.save(function(err, savedUser){
//         if(err){
//             res.status(200).send({error: "Could not add user"});
//         } else {
//             res.send(savedUser);
//
//         }
//
//     })
//
//
// });


app.listen(3000, function(){
    console.log("Diary Application running on port: 3000");

});
