const express = require("express");
const bodyParser = require("body-parser");
const axion = require("axios");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req,res){
  res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req,res){
  const fName = req.body.firstName;
  const lName = req.body.lastName;
  const email = req.body.mail;
  
  var data = {
    members: [
       {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME:fName,
          LNAME:lName
        }
       }
      ]
  };
  const jsonData = JSON.stringify(data);
  const url = "https://us3.api.mailchimp.com/3.0/lists/474f13493d"
  const options = {
    method:"POST",
    auth: "safe01:" + process.env.MAILCHIMP_API_KEY
  };
  const request = https.request(url,options,function (response){
    if (response.statusCode === 200){
    res.sendFile(__dirname+"/success.html");
  }else{
    res.sendFile(__dirname+"/failure.html");
  }
  
    response.on("data",function(data){
      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req,res){
  res.redirect("/");
});


app.listen(process.env.PORT || 3000, function(){
  console.log("server is currently running on port " + (process.env.PORT || 3000));
});

//api key: ed2cfbf344707b92c825e3d00ad0ba87-us3
//list id  474f13493d
//new api key: ea105b436fd939775e77a0ce557d25d8-us3
