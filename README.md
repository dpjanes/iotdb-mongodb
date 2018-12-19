# iotdb-mongodb
POP MongoDB interface

## TingoDB
Note that this will SORT OF work with
[TingoDB](http://www.tingodb.com/).

* set `mongodbd.engine: "tingodb"`
* set `mongodbd.path: "some-folder"`
* make sure the `tingodb` module is installed

Tingo seems to be a bit flaky and doesn't have
compatibility with the 3 version of MongoDB,
so this may disappear

## DynamoDB

This folder is to provide a compatibility layer
with `iotdb-awslib/dynamodb`. It makes MongoDB
look like AWS's DynamoDB. In particular, the DB
becomes must more "keyed" so duplicate records
don't show up so much.

### Ranged Queries

like this:

    _.promise.make({
        query: {
            year: [ ">=", 2013 ],
        },
    })
        .then(mongo.dynamodb.query_simple)

## Sample Code

Copy the `mongodbd.json.template` to `mongodbd.json`.
Then set the `engine` to `mongodb` or `tingodb` 
as prefered.
