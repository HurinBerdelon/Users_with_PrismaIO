# API Specifications

## Users

**Functional Requirements**

- [ ] Should be able to register a user
- [ ] Should be able to confirm user's e-mail
- [ ] Should be able to authenticate user with e-mail or username
- [ ] Should be able to update user's e-mail
- [ ] Should be able to update username
- [ ] Should be able to add/update an avatar
- [ ] Should be able to update user's password
- [ ] Should be able to recover the password
- [ ] Should be able to logout user
- [ ] Should be able to delete user

**Business Rule**

- [ ] Should not be able to create a user with e-mail already used
- [ ] Should not be able to create a user with username already used
- [ ] Should not be able to authenticate a non-existent user
- [ ] Should not be able to authenticate user with incorrect password
- [ ] Should not be able to delete, update, logout user without being authenticated
- [ ] Should not be able to a non-existent user to recover a password