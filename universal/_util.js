/*
 *  universal/_util.js
 *
 *  David Janes
 *  Consensas
 *  2019-01-07
 *
 *  THIS IS AN EXAMPLE
 */

"use strict"

const _ = require("iotdb-helpers")

/**
 *  The name of the module
 */
exports.name = "APPLICATION.db"

/**
 *  The name of a single record
 */
exports.one = "row"

/**
 *  The name of multiple records
 */
exports.one = "rows"

/**
 *  The name of the primary key in a record
 */
exports.primary_id = "row_id"

/**
 *  This sets up the database
 */
exports.setup = _.promise(self => {
    _.promise.validate(self, exports.setup)

    self.table_schema = {
        "schema": { 
            "name": exports.one,
            "indexes": {},
            "keys": [
                exports.primary_id,
            ]
        } 
    }

    self.table_name = self.table_schema.name

    self.query = null
    self.query_limit = null
    self.index_name = null
    self.projection = null
})

/**
 *  This cleans up one record
 */
exports.scrub = _.promise(self => {
    _.promise.validate(self, exports.scrub)
})

/**
 *  This creates a new record.
 *  There will always be a stub record,
 *  but you must set an ID.
 *  You don't need to do anything that
 *  scrub does.
 */
exports.create = _.promise(self => {
    _.promise.validate(self, exports.create)
})

/**
 */
exports.validate = record => _.is.Dictionary;
