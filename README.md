# Password-reset

1) Create a .env file with variable name JWT_SECRET and assign it any value
2) npm install
3) npm start

# Instructions
1) In this project MongoDB is used for storing users credentials. 
2) In order to create a user, send a post request to /register route with fields 'username' and 'password' and it will create a user. 
3) In order to reset the password, send a post request to /reset route with fields 'password' and 'confirmPassword' and add a header with name 'x-auth-token' and paste in the token.  
4) In order to check if the password is changed, try logging in by sending a post request to /login route with fields 'username' and 'password'
