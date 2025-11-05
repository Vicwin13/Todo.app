# Todo App

A cross-platform Todo application built with React Native, Expo, and Convex for real-time data synchronization.

## Features

- Create, update, and delete tasks
- Mark tasks as active or completed
- Reorder tasks with drag and drop
- Real-time synchronization across devices
- Cross-platform support (iOS, Android, Web)

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Convex (real-time database and functions)
- **Navigation**: Expo Router (file-based routing)
- **State Management**: React hooks with Convex integration

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- For iOS development: Xcode (macOS only)
- For Android development: Android Studio

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Todo.app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Convex:
   - Create a Convex account at [https://convex.dev](https://convex.dev)
   - Create a new project in the Convex dashboard
   - Run the following commands to connect your app:
     ```bash
   npx convex dev
   ```
   - Follow the prompts to link your local project to your Convex project
   - This will generate the necessary files in the `convex/_generated` directory

4. Configure environment variables:
   - Create a `.env.local` file in the root directory
   - Add your Convex deployment URL:
     ```
     CONVEX_DEPLOYMENT=<your-convex-deployment-url>
     ```

## Build Commands

### Development

Start the development server:
```bash
npm start
# or
npx expo start
```

Run on specific platforms:
```bash
# Android
npm run android
# or
npx expo start --android

# iOS
npm run ios
# or
npx expo start --ios

# Web
npm run web
# or
npx expo start --web
```

### Linting

Run ESLint to check for code issues:
```bash
npm run lint
```

### Reset Project

Reset the project to a blank state (moves current code to app-example):
```bash
npm run reset-project
```

## Environment Variables Configuration

Create a `.env.local` file in the root directory with the following variables:

```
# Convex deployment URL
CONVEX_DEPLOYMENT=<your-convex-deployment-url>

# Optional: Expo configuration
EXPO_PUBLIC_API_KEY=<your-api-key>
```

Note: Replace `<your-convex-deployment-url>` with your actual Convex deployment URL, which you can find in your Convex dashboard.

## Convex Setup Steps

1. Install Convex CLI:
   ```bash
   npm install -g convex-dev
   ```

2. Initialize Convex in your project:
   ```bash
   npx convex dev
   ```

3. Deploy your schema and functions:
   ```bash
   npx convex deploy
   ```

4. Verify your deployment:
   - Check your Convex dashboard to ensure the schema is deployed correctly
   - Verify that the tables and functions are visible

5. Connect your app:
   - The `npx convex dev` command will automatically update your local environment
   - Your app will connect to the development backend during development
   - For production, use `npx convex deploy` to deploy to production

## Project Structure

```
Todo.app/
├── app/                    # React Native app screens
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home/All tasks screen
│   │   ├── active.tsx     # Active tasks screen
│   │   └── completed.tsx  # Completed tasks screen
│   ├── _layout.tsx        # Root layout
│   └── (tabs)/_layout.tsx # Tab navigation layout
├── assets/                # Static assets (images, icons)
├── convex/                # Convex backend code
│   ├── schema.ts          # Database schema
│   ├── task.ts            # Task-related functions
│   └── _generated/        # Auto-generated Convex types
├── package.json           # Project dependencies
├── app.json               # Expo configuration
└── eas.json               # Expo Application Services configuration
```

## Data Model

The app uses a simple task model with the following fields:

- `text`: The task description (string)
- `isCompleted`: Task completion status (boolean)
- `order`: Task order for sorting (optional number)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please contact [support@example.com] or create an issue in the repository.
