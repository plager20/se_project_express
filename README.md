# WTWR (What to Wear?): Back End

This project serves as a backend service for the WTWR (What to Wear) applications. Its purpose it to handle any request for user management (creating and reading) and clothing item management (creating, reading, updating, and deleting). This service interacts with MongoDB in order store and use data and follow RESTful API design principles.

## Functionality

The backend service is able to do the following:

- Retrieve a list of users
- Create new users
- Identify and retrieve specific users by their id
- Retrieve a list of clothign items
- Create new clothing items
- Delete specific clothing items by their id
- Allows any user to like and dislike clothing items based off their ids

The backend service also features error handling by giving you proper error codes and error messages if one is recieved.

## Technologies Used

This project utalizes many technologies/resources including:

- Express.js: A web application framework for Node.js
- MongoDB: A NoSWL database used to store users and clothing items
- ESLint: JS linting tool to ensure the quality of the code
- Postman: Used to test and debugg API's
- Github Actions: Allows the continous testing of code whenever it is updated

## Running the Project

`npm run start` — to launch the server

`npm run dev` — to launch the server with the hot reload feature
