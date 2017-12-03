[![Build Status](https://travis-ci.org/Ninja-Squad/globe42.svg?branch=master)](https://travis-ci.org/Ninja-Squad/globe42)

# Projet de gestion sécurisée des adhérents pour l'association Globe 42

## Setup


### Database

The project uses PostgreSQL as a database.
 
You need to [install PostgreSQL](https://www.postgresql.org/download/) on your machine.
When this is done, run the database creation script:

    psql -h localhost -U postgres -f backend/database/database.sql

Clever Cloud produces backups twice a day. You can import a backend locally to test with the real production data
by executing the script `backend/scripts/importBackupLocally.sh`. (Read the instructions inside the script).
    
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

### External services

The application stores uploaded documents in Google Cloud Storage. This means that the application
needs credentials (which are json files generated by Google) in order to work fine.

Two separate accounts, and thus credentials files, are used:

 - one for development
 - one for production
 
We expect to stay inside the "Always Free" tier, whatever the account is.

Here are various interesting links regarding Google Cloud Storage (GCS):

 - [The landing page of GCS](https://cloud.google.com/storage/)
 - [The pricing page of GCS](https://cloud.google.com/storage/pricing). It describes the conditions 
   of the "Always Free" tier. The most importtant part being that (as of now), the only regions 
   eligible to this free tier are `us-west1`, `us-central1`, and `us-east1`. This means that the buckets
   created for the application should be created in one of these 3 regions. We currently use only one bucket 
   (for each account - dev and prod)
 - [The Google Cloud console](https://console.cloud.google.com/storage): Make sure to select the appropriate 
   Google account when visiting it, and to select the `globe42` project. It allows creating the bucket,
   browsing and deleting the files, creating credentials (service accounts), etc.
 - [The documentation](https://cloud.google.com/storage/docs/), and 
   [the javadoc of the Java client library](https://googlecloudplatform.github.io/google-cloud-java/0.23.1/apidocs/index.html)
 
## Build

To build the app, just run:

    ./gradlew assemble
    
This will build a standalone jar at `backend/build/libs/globe42.jar`, that you can run with:

    java -jar backend/build/libs/globe42.jar --globe42.secretKey=<some secret key>
    
To start the application with the demo profile, add this command-line option:  
    
    --spring.profiles.active=demo
    
And the full app runs on http://localhost:9000

By default, the default GCS credentials are used when launching the app this way. That means
that the GCS APIs won't be accessible unless you set the `GOOGLE_APPLICATION_CREDENTIALS` as
described in [the documentation about default credentials](https://developers.google.com/identity/protocols/application-default-credentials#howtheywork)

To avoid setting a global environment variable, you can instead use this command-line option:

    --globe42.googleCloudStorageCredentialsPath=secrets/google-cloud-storage-dev.json
    
This credentials file is located in [the Ninja Squad Drive](https://drive.google.com/drive/u/1/folders/0B0FLWwufPzrTN1NVTDZJMWZTVXc)

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

### Google Cloud Storage credentials on CleverCloud

Applications on CleverCloud don't have access to the file system. So, instead of defining an environment variable
containing the path of the GCS credentials, we use an environment variable, `globe42.googleCloudStorageCredentials`,
containing the *content* of the production credentials file. 

