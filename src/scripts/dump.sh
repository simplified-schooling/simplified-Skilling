#!/bin/bash
BACKUP_FILE="../dbs"

# Run mongodump command to create dump files
mongodump --host localhost --port 27017 --db Lms_Simplified_Schooling --out ../dbs
