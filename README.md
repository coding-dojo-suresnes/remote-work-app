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

## Next steps

- Implement DTOs for POST and GET user-presence
- Is it useful to save week by week and not day by day ?
- Test all functions in UserWorkSituationRepository
- In RemoteWorkApp, saving erases the previous state of userWeekPresence.
- Allow saving multiple weeks (if we choose week-by-week system)
- Add user entity
