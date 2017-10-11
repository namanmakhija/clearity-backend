# MP #3: APIed Piper
### Due: October 30th, 2017, 11.59PM CDT

## Table of Contents
1. [Assignment](#assignment)
2. [Tips](#tips)
3. [Rules](#rules)
4. [Environment Setup Guide](#environment-setup-guide)
5. [Submission Details](#submission-details)

## Assignment

**The Basic Goal** : Create an API for a task management / todo list.

**The Fun Goal** : Imagine your hot new startup, Llama.io, is creating the best todo webapp on the market. You're competing in a crowded space with hot players like Asana, Wunderlist, Google Keep, etc, so your API has to be top-notch.

#### Task

 Implement an API with the following end-points (they would be preceded by something like http://localhost:4000/api/). Your implementation should use Node, Express and Mongoose.


| Endpoints| Actions | Intended Outcome                                    |
|----------|---------|-----------------------------------------------------|
| users    | GET     | Respond with a List of users                        |
|          | POST    | Create a new user. Respond with details of new user |
|          | OPTIONS | See the last tip at the bottom of the page          |
| users/:id| GET     | Respond with details of specified user or 404 error |
|          | PUT     | Replace entire user with supplied user or 404 error |
|          | DELETE  | Delete specified user or 404 error                  |
| tasks    | GET     | Respond with a List of tasks                        |
|          | POST    | Create a new task. Respond with details of new task |
|          | OPTIONS | See the last tip at the bottom of the page          |
| tasks/:id| GET    | Respond with details of specified task or 404 error  |
|          | PUT     | Replace entire task with supplied task or 404 error |
|          | DELETE  | Delete specified user or 404 error                  |

In addition, the API has the following JSON encoded query string parameters for the GET requests to the `users` and `tasks` endpoints:

| Parameter | Description                                                                                  |
|----------|----------------------------------------------------------------------------------------------|
| where    | filter results based on JSON query                                                           |
| sort     | specify the order in which to sort each specified field  (1- ascending; -1 - descending)     |
| select   | specify the set of fields to include or exclude in each document  (1 - include; 0 - exclude) |
| skip     | specify the number of results to skip in the result set; useful for pagination               |
| limit    | specify the number of results to return (default should be 100 for tasks and unlimited for users)                    |
| count    | if set to true, return the count of documents that match the query (instead of the documents themselves)                    |

Here are some example queries and what they would return:

| Query                                                                                | Description                                             |
|-----------------------------------------------------------------------------------------|---------------------------------------------------------|
| `http://www.uiucwp.com:4000/api/users?where={"_id": "55099652e5993a350458b7b7"}`         | Returns a list with a single user with the specified ID |
| `http://www.uiucwp.com:4000/api/tasks?where={"completed": true}`                          | Returns a list of completed tasks                       |
| `http://www.uiucwp.com:4000/api/tasks?where={"_id": {"$in": ["235263523","3872138723"]}}` | Returns a set of tasks                                  |
| `http://www.uiucwp.com:4000/api/users?sort={"name": 1}`                                  | Returns a list of users sorted by name                  |
| `http://www.uiucwp.com:4000/api/users?select={"_id": 0}`                                  | Returns a list of users without the _id field           |
| `http://www.uiucwp.com:4000/api/users?skip=60&limit=20`                                   | Returns user number 61 to 80                            |

**The API should be able to handle any combination of those parameters in a single request**. For example, the following is a valid GET request:

```javascript
http://www.uiucwp.com:4000/api/users?sort={"name": 1}&skip=60&limit=20
```

Here is the User Schema:

1. "name" - String
2. "email" - String
3. "pendingTasks" - [String] - The \_id fields of the *pending* tasks that this user has
4. "dateCreated" - Date - should be set automatically by server

Here is the Task Schema:

1. "name" - String
2. "description" - String
3. "deadline" - Date
4. "completed" - Boolean
5. "assignedUser" - String - The \_id field of the user this task is assigned to - default ""
6. "assignedUserName" - String - The name field of the user this task is assigned to - default "unassigned"
7. "dateCreated" - Date - should be set automatically by server to present date

**We assume that each task can be assigned only to one user.**

#### Requirements

1. Your database should be on [mLab](http://www.mlab.com). It should contain at least 20 users and 100 tasks (about half of which should be completed) (**We provided scripts for you in the database_scripts folder**).

2. Responses from your API should be a JSON object with two fields. The first field should be named `message` and should contain a human readable String. The second field should be named `data` and should contain the actual JSON response object. For example, here is a valid response:

```javascript
{
    "message": "OK",
    "data": {
        "_id": "55099652e5993a350458b7b7",
        "email": "khandek2@illinois.edu",
        "name": "Sujay Khandekar"
    }
}
```

3. Error responses from your API should also also be a JSON object with a `message` and `data` fields. Messages have to sensible and human readable so that on the client side it can be displayed to the user. Also, it should be independent of the server side technology that you are using. For example, your API should not return an error message directly from Mongoose to the client. For examples of error messages, take a look at the API reference implementation that we have provided.

4. Your API should respond with appropriate [HTTP status codes](http://www.restapitutorial.com/httpstatuscodes.html) for both successful and error responses. You should at least have the following codes: 200 (success), 201 (created), 404 (not found), 500 (server error).

5. You should implement the query string functionality by using the methods provided by Mongoose (as opposed to querying Mongoose for all the results and then doing the filtering/sorting/skipping etc. in your Node/Express application code).

6. Have server side validation for:
    - Users cannot be created (or updated) without a name or email. All other fields that the user did not specify should be set to reasonable values.
    - Multiple users with the same email cannot exist.
    - Tasks cannot be created (or updated) without a name or a deadline. All other fields that the user did not specify should be set to reasonable values.

7. In terms of code, your routes can be defined in the `server.js` file. Your Mongoose models should however all be under the `models` directory. 

## Tips
  - Start early!
  - Please DO NOT delete the `.gitignore file` from the project
  - Check out [Postman](https://www.getpostman.com/postman) to your API

## Rules
1. This is an individual assignment. No collaboration is permitted.
2. It is not permitted to copy/paste code that is not your own. You are, however, free to look at different code sources for inspiration and clarity. All sources (code as well as reading material) that you reference to complete this assignment must be declared in the submission.
3. If you think something you’re doing might not be acceptable, please ask on Piazza.

## Environment Setup Guide
1. Clone the repository:
`git clone https://github.com/uiuc-web-programming/mp3_starter_17.git mp3`, then `cd mp3`
2. Install dependencies:
`npm install`
3. Run the dev server:
`npm start` or 
`nodemon --exec node server.js` to automatically restart the server on save.

## Submission Details
1. [Submission Form](https://uiuc-web-programming.github.io/fa17/)
2. You need to also submit at [the submission website](http://uiucwp.com)
