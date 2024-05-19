## Description

### Major Changes

1. **Conversion to TypeScript**:
    - Refactored all `.js` files to `.ts` files.
    - Improved type safety and code maintainability.

2. **Database Integration with Prisma**:
    - Replaced raw SQL queries with Prisma ORM.
    - Enhanced security and simplified database interactions.

### New Features

1. **Multi-Server Support**:
    - The bot can now operate across multiple servers simultaneously.
    - Supports hosting multiple games concurrently on different servers.

2. **New Commands**:
    - Added `start` command: Initiates a new counting game in the current channel.
    - Added `reset` command: Resets the ongoing game in the current channel.

### Detailed Changes

- **TypeScript Conversion**:
    - Updated all source files from JavaScript (`.js`) to TypeScript (`.ts`).
    - Utilized TypeScript features for improved development experience.

- **Prisma Integration**:
    - Set up Prisma as the ORM for database management.
    - Defined schema models and migrated existing database structure to Prisma.
    - Replaced direct SQL queries with Prisma queries.

- **Multi-Server and Multi-Game Support**:
    - Updated the bot logic to handle multiple servers and games.
    - Ensured state management is scoped correctly to each server and channel.

- **Command Enhancements**:
    - Implemented `start` command:
        - Usage: `!start`
        - Function: Starts a new game in the channel where the command is executed.
    - Implemented `reset` command:
        - Usage: `!reset`
        - Function: Resets the current game in the channel where the command is executed.

## Testing

- Verified that the bot starts and resets games correctly on multiple servers.
- Ensured that database interactions via Prisma are functioning as expected.
- Tested the `start` and `reset` commands for proper operation and error handling.

## Future Improvements

- Additional command features and game modes.
- Enhanced error logging and user feedback mechanisms.
- Performance optimizations for handling a larger number of concurrent games.
