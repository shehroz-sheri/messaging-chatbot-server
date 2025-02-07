<!-- Readme File -->

# Chatter - Chat App

## Description

A chat application built using Node.js, Express, MongoDB, and Socket.IO.

## Features

- User registration and login
- Chat functionality
- Real-time messaging
- User authentication
- User profile management
- Conversation management

## Installation

1. Clone the repository
2. Install dependencies using npm or yarn
3. Create a .env file in the root directory and add the following variables:

```
MONGO_URI='your-uri'
BASE_URL='url-here'
JWT_SECRET='jwt-secret-here
```

4. Run the server using npm or yarn

```
npm start
```

## Usage

### User Registration

To register a new user, make a POST request to the `/user/register` endpoint with the following body:

```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "password123",
  "number": "1234567890"
}
```

### User Login

To log in an existing user, make a POST request to the `/user/login` endpoint with the following body:

```json
{
  "username": "johndoe@example.com",
  "password": "password123"
}
```

### Get All Users

To get all users, make a GET request to the `/user` endpoint.

### Get Current User

To get the current user, make a POST request to the `/user/current` endpoint with the following body:

```json
{
  "user": {
    "email": "johndoe@example.com"
  }
}
```

### Delete User

To delete a user, make a DELETE request to the `/user/delete` endpoint with the following body:

```json
{
  "user": {
    "email": "johndoe@example.com"
  }
}
```

### Update User

To update a user, make a PUT request to the `/user/update` endpoint with the following body:

```json
{
  "userEmail": "johndoe@example.com",
  "userDetails": {
    "name": "John Doe",
    "number": "1234567890"
  }
}
```

## Contributing

Contributions are welcome!
