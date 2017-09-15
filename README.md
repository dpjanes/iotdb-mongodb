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
with `iotdb-awslib/dynamodb`. 

## Sample Code

Copy the `mongodbd.json.template` to `mongodbd.json`.
Then set the `engine` to `mongodb` or `tingodb` 
as prefered.
