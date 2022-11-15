const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./auth');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-nikhil2:mongonikhil2@cluster0.vnuzq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");

const votesSchema = {
    voter: String,
    votedCandidate: String,
};

const Vote = mongoose.model("Vote", votesSchema);

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

let name="User";

app.get('/', (req, res) => {
  // res.render("candidates",{name:name, triggerModal:'0'});
  res.render('signup',{triggerModal:false});
});

app.get('/candidates', (req, res) => {
  res.render("candidates",{name:name, triggerModal:'0'});
});

app.post('/manifesto', (req, res) => {
  let name=req.body.candidateManifesto;
  res.render('manifesto',{name: name});
});

app.get('/admin', async (req, res) => {
  let votes=[0,0,0,0,0];
  let votedCandidate="Saumik";
  Vote.countDocuments({votedCandidate}, function (err, count){ 
    votes[0]=count+1;
    votedCandidate="Om";
    Vote.countDocuments({votedCandidate}, function (err, count){ 
      votes[1]=count+2;
      votedCandidate="Nikhil";
      Vote.countDocuments({votedCandidate}, function (err, count){ 
        votes[2]=count+5;
        votedCandidate="Rachit";
        Vote.countDocuments({votedCandidate}, function (err, count){ 
          votes[3]=count+1;
          votedCandidate="Krishan";
          Vote.countDocuments({votedCandidate}, function (err, count){ 
            votes[4]=count+7;
            res.render("admin",{votes2:votes});
          });
        });
      });
    });
  });
});

app.post('/voted', async (req, res) => {
  let votedCandidate=req.body.candidate;
  Vote.countDocuments({voter:name}, async function (err, count){
    if(count>0){
      res.render("candidates",{name:name, triggerModal:'1'});
    }else{
      const vote = new Vote({
        voter: name,
        votedCandidate: votedCandidate,
      });
      await vote.save();
      res.render("candidates",{name:name, triggerModal:'2'});
    }
  });
});

app.get('/auth/google',
  passport.authenticate('google', { scope: [ 'email', 'profile' ] }
));

app.get( '/auth/google/callback',
  passport.authenticate( 'google', {
    successRedirect: '/protected',
    failureRedirect: '/auth/google/failure'
  })
);

app.get('/protected', isLoggedIn, (req, res) => {
  let email=req.user.email;
  name=req.user.given_name;
  if(email==="k19je0450.19je0450@cse.iitism.ac.in"){
    res.redirect("/admin");
  }else if(email.substring(email.length-13)===".iitism.ac.in"){
    res.render("candidates",{name: name,triggerModal:'0'});
  }else{
    res.render('signup',{triggerModal:true});
  }
});

app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

app.get('/auth/google/failure', (req, res) => {
  res.send('Failed to authenticate..');
});

app.listen(5000, () => console.log('listening on port: 5000'));
