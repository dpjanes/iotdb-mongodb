/*
 *  universal/remove.js
 *
 *  David Janes
 *  Consensas
 *  2019-01-07
 */

"use strict"

const _ = require("iotdb-helpers")
const mongodb = require("iotdb-mongodb")

const logger = require("../../logger")(__filename)
const _util = require("./_util")

/**
 */
const remove = _.promise((self, done) => {
    _.promise(self)
        .validate(remove)

        .then(_util.setup_db)
        .add({
            query: {
                machine_id: self.machine.machine_id,
            },
        })
        .then(mongodb.db.delete)

        .end(done, self)
})

remove.method = "db.machine.remove"
remove.requires = {
    machine: consensas.util.validate.machine,
}
remove.accepts = {
}
remove.produces = {
}

/**
 *  API
 */
exports.remove = remove
