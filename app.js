const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const fName = req.body.firstName;
  const lName = req.body.lastName;
  const email = req.body.mail;

  // Log partial API key for debug (don’t log full key in production)
  console.log("Using Mailchimp API Key (partial):", process.env.MAILCHIMP_API_KEY?.slice(0, 8) + "...");

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us3.api.mailchimp.com/3.0/lists/474f13493d";
  const options = {
    method: "POST",
    auth: "safe01:" + process.env.MAILCHIMP_API_KEY
  };

  const request = https.request(url, options, function (response) {
    console.log("Mailchimp response status code:", response.statusCode);

    response.on("data", function (data) {
      console.log("Mailchimp response body:", data.toString());
    });

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  });

  request.on("error", function (e) {
    console.error("Request error:", e);
    res.sendFile(__dirname + "/failure.html");
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Server is running on port " + PORT);
});