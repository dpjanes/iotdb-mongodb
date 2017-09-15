# iotdb-mongodb
POP MongoDB interface

## TingoDB
Note that this will also work with
[TingoDB](http://www.tingodb.com/).

* set `mongodbd.engine: "tingodb"`
* set `mongodbd.path: "some-folder"`
* make sure the `tingodb` module is installed

## DynamoDB

This folder is to provide a compatibility layer
with `iotdb-awslib/dynamodb`. It makes MongoDB
look like AWS's DynamoDB. In particular, the DB
becomes must more "keyed" so duplicate records
don't show up so much.

## Sample Code

Copy the `mongodbd.json.template` to `mongodbd.json`.
Then set the `engine` to `mongodb` or `tingodb` 
as prefered.
