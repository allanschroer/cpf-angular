# CfpAngular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.2.

## Mock API (json-server) — start this before the web app

This project uses `json-server` to provide a small mocked REST API from `db.json`. Start the mock API first, then start the Angular app in a separate terminal.

```cmd
npm run api
```

This runs the local `json-server` and serves endpoints such as:
- http://localhost:3000/employees
- http://localhost:3000/metrics
- http://localhost:3000/positions



## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Author

This project was made by Allan Schroer.
