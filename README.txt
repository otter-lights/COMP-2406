COMP-2406 Project Submission
R Routly (101183371), Z Ali (101186150)

The project report can be found in this folder under the name: Razara_Movie_Database_Project_Report

Running the Server
- Ensure the mongod daemon is running on your computer but navigating to the ‘bin’ file of the MongoDB program and running the command ‘mongod’. This must remain open in a separate terminal window while the project is tested.
- Navigate to the base folder of the project in a terminal window
- Run the command ‘npm install’ to install all required dependencies for the project.
- Required dependencies: mongoose, pug, express, express-session, csv-parser
- Initialize the mongo server with the provided base data and the beginning user data by running ‘node initialize.js’.
- The initialize.js file currently will initialize the database with the 2500 film dataset provided. If this must be changed, find the constant “fileName” and change the path.
- After the database is initialized, run the command ‘node server.js’ to start the server.
- Open Google Chrome and go to ‘localhost:3000’ to see the application

Supported URL endpoints for pages that can be accessed in the application:
- ‘/’ → Homepage of the application, offers links to the signup and login pages if no one is logged in. If no user is authenticated they will be redirected to this page
- ‘/signup’ → Contains fields for username and password and a button to submit. Will not allow duplicate usernames.
- ‘/login’ → Same format as signup but will log in a user that already exists in the database
- ‘/logout’ → Redirects to the homepage and logs out the currently authenticated user.
- ‘/addmovie’ → Contains form and instructions to submit a new user to the database, only accessible if the currently authenticated user is a contributing user.
- ‘/addperson’ → Contains field for the new person’s name and a button to submit to the database, only accessible if the currently authenticated user is a contributing user.
- ‘/advancedsearch’ → Three fields to enter information about title, cast, genre and a button that redirects to ‘/movies’ with the given parameters.
- ‘/users/:id’ → Shows the page and information of the user with the id in the url. Page is different depending on if the requested user is currently logged in or not.
If the user is the one currently logged in, further endpoints for accountType, watchlist, and following lists can be retrieved in json format with a GET request, or changed with a PUT request.
- ‘/movies/:id’ → Shows the page and information of the movie with the id in the url.
- ‘/movies’ → Accepts url parameters ‘title’, ‘person’, ‘genre’, and ‘page’ and parses then creates a database query for those parameters, resulting in a search result.
- ‘/people/:id’ → Shows the page and information of the person with the id in the url.
