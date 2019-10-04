
# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).  Users can register for an account and login securely with an email and password. Passwords are hashed, and users may only view and edit the URLS they have shortened while logged in. A shortened URL, when shared in a Twitter post etc., can be used by anyone to redirect to its linked long-form URL."

## Final Product

!["List of a user's created TinyURLs"](https://github.com/anmerfrank/tinyapp/blob/master/docs/URLsList.jpg)
!["Editing an existing TinyURL to redirect elsewhere"](https://github.com/anmerfrank/tinyapp/blob/master/docs/EditURL.jpg)
!["Creating a new TinyURL"](https://github.com/anmerfrank/tinyapp/blob/master/docs/createURL.jpg)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.