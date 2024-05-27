# Real-Time Quiz App Backend

This repository contains the backend for a real-time quiz application built with Nest.js. The backend handles quiz
creation, management, and real-time participant interactions using WebSockets.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)

## Features

- User authentication and authorization
- Quiz creation and management
- Real-time participant joining and interactions using WebSockets
- Leaderboard and quiz session management
- Support for various quiz topics

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) (version 14 or higher)
- [npm](https://www.npmjs.com/get-npm) (version 6 or higher) or [Yarn](https://yarnpkg.com/getting-started/install)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/chaddaess/mentimeter-back 
    cd mentimeter-back 
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

   or

    ```bash
    yarn install
    ```

## Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

    ```env
    APP_PORT=3000
    SECRET=brika
    
    # Database Configuration
    DATABASE_TYPE=mysql
    DATABASE_HOST=localhost
    DATABASE_PORT=3306
    DATABASE_USERNAME=root
    DATABASE_PASSWORD=
    DATABASE_NAME=mentimeter_db
    DATABASE_SYNCHRONIZE=true
    ```

## Running the Application

Start the development server:

    ```bash
    npm run start:dev
    ```

    or

    ```bash
    yarn start:dev
    ```

The application will be running at `http://localhost:3000`.
