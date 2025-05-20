
#!/bin/bash

# Restore the database

mongorestore --host localhost --port 27017 --nsInclude 'Lms_Simplified_Schooling.*' ../dbs

# mongorestore --username root --password VRuAd2Nvmp4ELHh5 --authenticationDatabase admin --archive=$BACKUP_FILE --gzip --drop

