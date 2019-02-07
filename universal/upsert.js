/*
 *  universal/upsert.js
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


const logger = require("../../logger")(__filename)
const _util = require("./_util")

const _create = machine_update => _.promise((self, done) => {
    const website = require("../..")

    _.promise(self)
        .add("machine", machine_update)
        .then(website.db.machine.create)
        .end(done, self, "machine")
})

const _patch = machine_update => _.promise((self, done) => {
    const website = require("../..")

    const machine = Object.assign(
        {},
        self.machine,
        machine_update
    )

    _.promise(self)
        .add("machine", machine)
        .then(website.db.machine.save)
        .end(done, self, "machine")
})

/**
 */
const upsert = _.promise((self, done) => {
    const website = require("../..")

    _.promise(self)
        .validate(upsert)

        .add("name", self.machine.name)
        .then(website.db.machine.by.name)
        .conditional(sd => sd.machine, _patch(self.machine), _create(self.machine))

        .end(done, self, "machine,machine/machine_id")
})

upsert.method = "db.machine.upsert"
upsert.requires = {
    machine: {
        name: _.is.String,
        organization_id: consensas.util.validate.organization_id,
    },
}
upsert.accepts = {
}
upsert.produces = {
    machine: consensas.util.validate.machine,
    machine_id: consensas.util.validate.machine_id,
}

/**
 *  API
 */
exports.upsert = upsert
