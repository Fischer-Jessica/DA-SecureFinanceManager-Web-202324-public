# SecureFinanceManager

## Description

The Secure Finance Manager is an Angular-based frontend application designed for managing user finances. It needs to be connected to the Secure Finance Manager backend to function correctly. The backend server is available at [SecureFinanceManager-Backend](https://github.com/Fischer-Jessica/DA-SecureFinanceManager-Backend-202324).

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.1.1.

## Guide

### Branches

The repository consists of two branches:

- `secure_finance_manager`: This is the primary branch housing the application's codebase.
- `test_program_to_check_the_connection_with_the_backend`: This branch was created for testing the connection between nodes and is not essential for regular use.

### Changing Files

To use this application, you need to change the `apiURL` in the `app.config.ts` file to the URL of the backend server.

### Running the Application

#### Development Server

Run `ng serve` for a development server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

#### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

#### Further Help

To get more help on the Angular CLI, use `ng help` or refer to the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
