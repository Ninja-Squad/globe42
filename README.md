# Projet de gestion sécurisée des adhérents pour l'association Globe 42

## Setup


### Database

The project uses PostgreSQL as a database.
 
You need to [install PostgreSQL](https://www.postgresql.org/download/) on your machine.
When this is done, run the database creation script:

    psql -h localhost -U postgres -f backend/database/database.sql
    
### Backend

The project uses Spring (5.x) fot ehe backend,
with Spring Boot.

You need to install:

- a recent enough JDK8

Then a the root of the application, run `./gradlew build` to download the dependencies.
Then run `./gradlew bootRun` to start the app.

### Frontend

The project uses Angular (4.x) for the frontend,
with the Angular CLI.

You need to install:

- a recent enough NodeJS (6.9+)
- Yarn as a package manager (see [here to install](https://yarnpkg.com/en/docs/install))

Then in the `frontend` directory, run `yarn` to download the dependencies.
Then run `yarn start` to start the app, using the proxy conf to reroute calls to `/api` to the backend.

The application will be available on http://localhost:4200


## Build

To build the app, just run:

    ./gradlew assemble
    
This will build a standalone jar at `backend/build/libs/globe42.jar`, that you can run with:

    java -jar backend/build/libs/globe42.jar
    
And the full app runs on http://localhost:9000
