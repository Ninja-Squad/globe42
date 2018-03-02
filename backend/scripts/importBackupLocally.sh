#!/bin/sh

# This script allows importing a backup produced by Clever Cloud in the local development database.

# The first step is to download a backup locally, from the Clever Cloud console - PostgreSQL addon
# (https://console.clever-cloud.com/organisations/orga_dd753560-9dfe-4c93-a891-c639d138354b/addons/addon_9fbf3f9f-4f62-4c41-a086-37990d898f33)
#
# You can then clean your local database schema using ./gradlew flywayCleanInteg, and then import the downloaded backup
# by executing this script with the downloaded dump file path as argument.
#
# The script will ask for the local database password: globe42

pg_restore -h localhost -p 5432 -U globe42 -d globe42 --format=c --no-owner $1
