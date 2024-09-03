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

## Next steps
