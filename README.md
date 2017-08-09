[![Build Status](https://travis-ci.org/Ninja-Squad/globe42.svg?branch=master)](https://travis-ci.org/Ninja-Squad/globe42)

# Projet de gestion sécurisée des adhérents pour l'association Globe 42

## Setup


### Database

The project uses PostgreSQL as a database.
 
You need to [install PostgreSQL](https://www.postgresql.org/download/) on your machine.
When this is done, run the database creation script:

    psql -h localhost -U postgres -f backend/database/database.sql
    
### Backend

The project uses Spring (5.x) for the backend,
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

    java -jar backend/build/libs/globe42.jar --globe42.secretKey=<some secret key>
    

To start the application with the demo profile, add this command-line option:  
    
    --spring.profiles.active=demo
    
And the full app runs on http://localhost:9000


## Deployment on CleverCloud

Here is our [application management on Clever Cloud](https://console.clever-cloud.com/organisations/orga_dd753560-9dfe-4c93-a891-c639d138354b). All the ninjas are admin for this app (they need to log in with github).

Log to Clever and add your Public SSH key. In the left navigation bar, go in "Profile" and in the "SSH Keys" tab. Add the key by entering a name and the public SSH key (the key is the entire contents of the id_rsa.pub file). To check if your ssh key is correctly configured, you can try to run:
`ssh git@push.clever-cloud.com`

Then clone locally the Git repository dedicated to the Clever deployment of Globe42 app : `git clone git+ssh://git@push-par-clevercloud-customers.services.clever-cloud.com/app_5e422400-281d-499b-b34c-7555c2f7fadd.git`

Inside this repo you have :
- a json file containing the name of the jar to deploy : clevercloud/jar.json (don't modify this file)
- and a jar corresponding to the last deployment : globe42.jar

If you want to deploy a new version of the app:
- replace the globe42.jar by the new one, keeping the same name (you can find your last jar in `backend/build/libs`)
- `add` and `commit` this new jar : (`git add .` & `git commit -m "last version of Globe42 jar with a nice feature`)
- push your work : `git push origin master`

That's it!

see the [logs console](https://console.clever-cloud.com/organisations/orga_dd753560-9dfe-4c93-a891-c639d138354b/applications/app_5e422400-281d-499b-b34c-7555c2f7fadd/logs) and cross your fingers ;-)


