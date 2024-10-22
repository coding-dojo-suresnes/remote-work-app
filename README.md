# Remote work application in TypeScript using hexagonal architecture

1. Install the dependencies with this command: `yarn`
2. Run the game with this command: `yarn start`
3. Run the tests with this command: `yarn test`

   Any test source matching the pattern `*.test.ts` below `tests/` will be executed.

## Features

- [x] isUserInOffice

## Change log

- 2024-06-04: Add isUserInOffice feature
- 2024-06-18: Add date to isUserInOffice feature
- 2024-06-18: Implement adapter for user-presence.port
- 2024-07-02: Create server adapter using express
- 2024-07-16: Refactor the server so that it uses a RemoteWorkApp, continue tests for /user-presence
- 2024-07-16: Create UserWeekPresence entity
- 2024-09-03: continue save user presence, there is a failed test to make pass
- 2024-09-10: Implement E2E test that sets a user presence to IN_OFFICE on a given day and then retrieves it
- 2024-09-24: Implement DTOs for POST and GET user-presence
- 2024-09-24: Replace UserWeekPresence by UserDayPresence
- 2024-09-24: In RemoteWorkApp, saving erases the previous state of userWeekPresence
- 2024-10-01: Add user entity (replace username by user)
  - create user entity
  - create user repository
  - create API addUser
- 2024-10-15: Finish route GET /users/:id

  - check user existence before savePresence
  - list all users
  - add Middleware to catch errors in server.ts

- 2024-10-22:
  - Migrate to expressjs 5
  - Improve middleware to handle Zod Errors

## V1 features to develop

### Backend

- Add login / user base (SSO)
- Allow only one domain to login
- add user rights: a user can only set her own presence
- add database
- add SiteEntity: a user in office should be in a site. A site is composed of a list of Desks (DeskEntity)
- saveSite(SiteId, Desk[]): allow to create a new site
- update savePresence to include site and desk
- handle desk is occupied
- savePresence with any free desk
- get site occupation : returns all the desks with people occupying them

### Frontend

- Add login page
- show Site occupation page
- Set presence form
- get my presence

## Later

- User can set a presence only for an half-day (AM / PM) (after a database has been implemented)
- Allow manager to accept remote work requests
