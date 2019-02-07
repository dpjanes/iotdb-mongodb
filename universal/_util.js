/*
 *  universal/_util.js
 *
 *  David Janes
 *  Consensas
 *  2019-01-07
 *
 *  THIS IS AN EXAMPLE.
 */

"use strict"

const _ = require("iotdb-helpers")

/**
 *  The name of the module
 */
exports.name = "APPLICATION.db.ROW"

/**
 *  The name of a single record
 */
exports.one = "ROW"

/**
 *  The name of multiple records
 */
exports.many = "ROWs"

/**
 *  The name of the primary key in a record
 */
exports.primary_id = "ROW_id"

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

exports.setup.method = "APPLICATION.db.ROW._util.setup"
exports.setup.description = `Setup database for ROW`
exports.setup.requires = {
}
exports.setup.accepts = {
    ROW: exports.validate,
}
exports.setup.produces = {
    ROW: exports.validate,
}

/**
 *  This cleans up one record
 */
exports.scrub = _.promise(self => {
    _.promise.validate(self, exports.scrub)

    self.ROW = _.d.clone(self.ROW)
})

exports.scrub.method = "APPLICATION.db.ROW._util.scrub"
exports.scrub.description = `Clean up one ROW`
exports.scrub.requires = {
}
exports.scrub.accepts = {
    ROW: exports.validate,
}
exports.scrub.produces = {
    ROW: exports.validate,
}

/**
 *  This is called after any operation which changes the record.
 */
exports.updated = _.promise(self => {
    _.promise.validate(self, exports.updated)
})

exports.updated.method = "APPLICATION.db.ROW._util.updated"
exports.updated.description = ``
exports.updated.requires = {
}
exports.updated.accepts = {
    ROW: exports.validate,
}
exports.updated.produces = {
    ROW: exports.validate,
}

/**
 *  This is called after any operation which removes the record
 */
exports.removed = _.promise(self => {
    _.promise.validate(self, exports.removed)
})

exports.removed.method = "APPLICATION.db.ROW._util.removed"
exports.removed.description = ``
exports.removed.requires = {
}
exports.removed.accepts = {
    ROW: exports.validate,
}
exports.removed.produces = {
    ROW: exports.validate,
}

/**
 *  This creates a new record.
 *  There will always be a stub record,
 *  but you must set an ID.
 *  You don't need to do anything that
 *  scrub does.
 */
exports.create = _.promise(self => {
    _.promise.validate(self, exports.create)

    self.ROW = _.d.clone(self.ROW)
    self.ROW.ROW_id = _.id.uuid.v4()
})

exports.create.method = "APPLICATION.db.ROW._util.create"
exports.create.description = `Finish creating one ROW`
exports.create.requires = {
}
exports.create.accepts = {
    ROW: exports.validate,
}
exports.create.produces = {
    ROW: exports.validate,
}

/**
 */
exports.validate = ROW => _.is.Dictionary;
exports.validate.method = "APPLICATION.db.ROW._util.validate"
exports.validate.description = "Test if ROW is valid"
