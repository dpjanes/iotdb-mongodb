/*
 *  universal/save.js
 *
 *  David Janes
 *  Consensas
 *  2019-01-07
 */

"use strict"

const _ = require("iotdb-helpers")
const mongodb = require("..")

const assert = require("assert")

/**
 */
const save = _.promise((self, done) => {
    _.promise(self)
        .validate(save)

        .then(_util.setup_db)
        .make(sd => {
            sd.machine = _util.scrub(sd.machine, sd)
            sd.json = sd.machine
            sd.query = {
                machine_id: self.machine_id,
            }
        })
        .then(mongodb.db.replace)

        .end(done, self)
})

save.method = "db.machine.save"
save.requires = {
    machine: {
        machine_id: consensas.util.validate.machine_id,
        name: _.is.String,
    },
}
save.accepts = {
    machine: {
        ping: _.is.Timestamp,
    },
}
save.produces = {
}

/**
 *  API
 */
exports.save = save
