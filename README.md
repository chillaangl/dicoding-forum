# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Storybook

This project uses Storybook for component development and documentation.

### Running Storybook

To start Storybook development server:

```bash
npm run storybook
```

This will start Storybook on [http://localhost:6006](http://localhost:6006)

### Building Storybook

To build a static version of Storybook:

```bash
npm run build-storybook
```

## Testing

### Unit Tests

Run unit tests:

```bash
npm test
```

Run unit tests in watch mode:

```bash
npm run test:watch
```

### E2E Tests

Run E2E tests with Cypress:

```bash
npm run e2e
```

Run E2E tests in headed mode (interactive):

```bash
npm run e2e:headed
```

**Note:** E2E tests use MSW (Mock Service Worker) for API mocking when `REACT_APP_E2E=1` is set. This ensures stable, deterministic tests that don't depend on external API availability.

To initialize MSW service worker (first time only):

```bash
npx msw init public/ --save
```

### Linting

Run ESLint:

```bash
npm run lint
```

## CI/CD

This project uses GitHub Actions for Continuous Integration. The CI workflow runs on:
- Push to `master` or `main` branches
- Pull requests

**Branch Protection:** The main branch (`master` or `main`) is protected with required CI checks:
- Lint checks must pass
- Unit & Integration tests must pass
- E2E tests must pass

### CI Helper Scripts

For testing CI locally or generating artifacts:

```bash
# Simulate CI failure (for testing CI error handling)
npm run ci:fail

# Run all CI checks locally (lint + tests)
npm run ci:pass
```

**Note:** These scripts are useful for:
- Testing CI failure scenarios (`ci:fail`)
- Verifying all checks pass before pushing (`ci:pass`)
- Generating screenshots for CI documentation (e.g., `1_ci_check_error.png`, `2_ci_check_pass.png`)
