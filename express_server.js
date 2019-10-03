// CONFIG CODE

const express = require("express");
const app = express();
const PORT = 8080;

var cookieParser = require('cookie-parser')
app.use(cookieParser()) 

const bcrypt = require('bcrypt');



const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

// USERS OBJECT

let users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "asdf"
  },
}



const generateRandomString = function() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};


// RESPONSE CODE



///// *** URL DATABASE: ***** //////

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.lighthouselabs.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "userRandomID" },
  d342sd: { longURL: "https://www.lighthouselabs.ca", userID: "asdf" },
  i8gfGr: { longURL: "https://www.google.ca", userID: "asdf" }
};

app.get("/register", (req, res) => {
  res.render("register");
})

app.get("/login", (req, res) => {
  res.render("login");
})


// GET USER ID

const getUser = (req, res) => {
  const cookie = req.cookies["user_id"];
  const user = users[cookie];
  return user;
 } 


app.get("/urls/new", (req, res) => {
  const user = getUser(req, res) 
  if (user) {
    let templateVars = { user: user };
    res.render("urls_new");
  }
  else {
    res.redirect("/login");
  };
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Tiny App listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello<b>World</b></body></html>\n");
});

  ////// FUNCTION TO CHECK FOR AN EMAIL IN USERS OBJECT 

const checkForEmail = function(email) {
  console.log("Users:",  users);
    for (const user in users) {
      if (users.hasOwnProperty(user) && users[user].email === email) {
        return true;
      }
  }
  return false;
}

// FUNCTION TO LOOK UP USER BY EMAIL

const lookUpEmail = function(email) {
  console.log("Users:",  users);
    for (const user in users) {
      if (users.hasOwnProperty(user) && users[user].email === email) {
        return email;
      }
  }
}
 // GET USER BY EMAIL

const getUserByEmail = function(email, password) {
  // console.log("Users:",  users);
    for (const user in users) {
      if (users.hasOwnProperty(user) && users[user].email === email) {
        return users[user];
      }
  }
  return null;
}


///// REGISTRATION AND USER CREATION /////

app.post("/register", (req, res) => {

  // ERROR CHECKING


  if (checkForEmail(req.body.email) === true) {
    res.send(400,"400 Error: An account with this email address already exists.");
  }
  if (req.body.email === "" || req.body.password === "") {
    res.send(400, "400 Error: Please make sure all fields are filled out correctly.");

  } else {

  // adds a user to the USERS object

  const password = req.body.password; 
  const hashedPassword = bcrypt.hashSync(password, 10);
  let userId = generateRandomString();
  
    const newUser = {
    id: userId, 
    email: req.body.email, 
    password: hashedPassword,
    }  
    
    users[userId] = newUser;

  res.cookie("user_id", users[userId].id);
  console.log(newUser);
  res.redirect("/urls");

  }
})


// REDIRECT TO SIGNUP PAGE

app.post("/signup", (req, res) => {
res.redirect("/register")
});

// ON CLICKING THE LOGIN BUTTON ON THE LOGIN PAGE

app.post("/login", (req, res) => {
  
  const user = getUserByEmail(req.body.email, req.body.password);
  const email = user.email;
 

  // CHECKING PASSWORD
  
  const password = user.password;
  console.log(user.password);
  if (bcrypt.compareSync(req.body.password, password)){ 
     res.cookie("user_id", user.id);
  } else {
    res.send(403, "403 Error: Username/password combination not found.");
  }
  let templateVars = { urls: urlDatabase, user: user, email: email, password: password};

  res.redirect("/urls"); 
});


// LOGOUT

app.post("/logout", (req, res) => {
  res.clearCookie("user_id", req.body.userId);
  res.redirect("/urls");
});





/// FUNCTION FOR FILTERING URLS BY USER

const urlsForUser = function(id) {
  let urls= { };
    for (const key in urlDatabase) {
      console.log(urlDatabase[key]);
      if (id === urlDatabase[key].userID) {
        urls[key] = urlDatabase[key];
    }
  } return urls;
}


// INDEX PAGE



app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId]; 
  let urls = urlsForUser(userId);

  let templateVars = { urls: urls, user: user};
  res.render("urls_index", templateVars);
});



// SHOW URLS

app.get("/urls/:shortURL", (req, res) => {
  const userId = req.cookies["user_id"];
  const user = users[userId]; 
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: user};
  res.render("urls_show", templateVars);
});

// GET SHORTENED URL

app.post("/urls", (req, res) => {
  let shortenedURL = generateRandomString();
  for (let uID in users) {
    let value = users[uID];

    urlDatabase[shortenedURL] = {
      longURL : req.body.longURL,
      userID : value.id
    };
  }
    res.redirect(`/urls/${shortenedURL}`);
});

// REDIRECT TO LONG URL PAGE

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].longURL; 
  res.redirect(longURL);
});

// DELETE A SHORT URL

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
})

// EDIT A SHORT URL

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls");
})

