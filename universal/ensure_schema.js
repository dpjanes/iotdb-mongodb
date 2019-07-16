/*
 *  universal/ensure_schema.js
 *
 *  David Janes
 *  Consensas
 *  2019-05-28
 */

"use strict";

const _ = require("iotdb-helpers")

const _ensured = new Set()

/**
 */
const ensure_schema = _.promise((self, done) => {
    const mongodb = require("..")

    _.promise.validate(self, ensure_schema)

    if (_ensured.has(self.table_schema.name)) {
        return done(null, self) 
    } else {
        _ensured.add(self.table_schema.name)
    }

    _.promise(self)
        .then(mongodb.db.ensure_schema)
        .end(done, self)
})

ensure_schema.method = "db.ledger.ensure_schema"
ensure_schema.requires = {
    table_schema: _.is.Dictionary,
}
ensure_schema.accepts = {
}
ensure_schema.produces = {
}

/**
 *  API
 */
exports.ensure_schema = ensure_schema
