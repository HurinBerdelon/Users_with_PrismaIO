# API Specifications

## Users

**Functional Requirements**

- [x] Should be able to register a user
- [x] Should be able to confirm user's e-mail
- [x] Should be able to authenticate user with e-mail or username
- [x] Should be able to refresh access token
- [x] Should be able to update user's e-mail
- [x] Should be able to update username
- [x] Should be able to update name
- [x] Should be able to add/update an avatar
- [x] Should be able to update user's password
- [x] Should be able to recover the password
- [x] Should be able to logout user
- [x] Should be able to delete user

**Business Rule**

- [x] Should not be able to create a user with e-mail already used
- [x] Should not be able to create a user with username already used
- [x] Should not be able to authenticate a non-existent user
- [x] Should not be able to authenticate user with incorrect password
- [x] Should not be able to delete, update, logout user without being authenticated
- [x] Should not be able to a non-existent user to recover a password