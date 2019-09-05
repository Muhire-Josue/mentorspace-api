# mentorspace-api
[![Coverage Status](https://coveralls.io/repos/github/Muhire-Josue/mentorspace-api/badge.svg?branch=bg-travis-168074919)](https://coveralls.io/github/Muhire-Josue/mentorspace-api?branch=bg-travis-168074919)

[![Build Status](https://travis-ci.org/Muhire-Josue/mentorspace-app.svg?branch=develop)](https://travis-ci.org/Muhire-Josue/mentorspace-app)<a href="https://codeclimate.com/github/Muhire-Josue/mentorspace-app/maintainability"><img src="https://api.codeclimate.com/v1/badges/80aafc2c40cc2dc82307/maintainability" /></a>

Mentorspace is a light-weight web application that helps Users to create mentorship session requests with
available mentors, and for mentors to choose which session they want to have with specific users.

### Links
##### gh-pages:  https://muhire-josue.github.io/mentorspace-app/UI
##### Heroku: https://mentorspace-api.herokuapp.com

### Requirements

- `Nodejs` - a JavaScript run-time environment that executes JavaScript code outside of a browser
- `NPM` - a package manager for the JavaScript programming language
- `Git` - version-control system for tracking changes in source code during software development

### SETUP
First clone it to your machine: 

```
https://github.com/Muhire-Josue/mentorspace-app.git
```

Open it using your favorite IDE
I used ([vs code](https://code.visualstudio.com/download))

Install all necessary node modules
```
npm install
```
To start the app
```
npm start
```
To run tests
```
npm test
```
### API ENDPOINTS
| API | Methods  | Description  |
| ------- | --- | --- |
| `/api/v1/auth/signup` | POST | user signup |
| `/api/v1/auth/login` | POST | user login |
| `/api/v1/sessions` | POST | create sessions |
| `api/v1/auth/mentors/:userId` | GET | display a mentor |
| `api/v1/auth/sessions/sessionId/accept` | PATCH | mentor accept a session request |
| `api/v1/auth/sessions/sessionId/reject` | PATCH | mentor reject a session request |
| `/api/v1/mentors` | GET | display all mentors |
| `api/v1/auth/users/:userId` | PATCH | change user to mentor |
### How can it be manually tested
- using [postman](https://www.getpostman.com/downloads/)

### Pivotal tracker stories
- using [stories](https://www.pivotaltracker.com/n/projects/2384182)
