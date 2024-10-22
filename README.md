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

## Next steps

- Add login / user base (auth0 or alternative, SSO mandatory)
- Add database (search a {db}-memory-server for testing)
- Cleanup test files
- Improve middleware to handle known errors
- Return Promises in repositories
- User can set a presence only for an half-day (AM / PM)
- unset a user presence
- get a week presence for one user
- add a location to the office presence
- manage locations (desk, floor, building, office address)
- allow pagination on list all users
