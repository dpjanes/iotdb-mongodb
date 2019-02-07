/*
 *  universal/create.js
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
const create = _util => {
    assert(_.is.String(_util.name))
    assert(_.is.String(_util.one))
    assert(_.is.String(_util.many))
    assert(_.is.String(_util.primary_key))
    assert(_.is.Function(_util.create))
    assert(_.is.Function(_util.scrub))
    assert(_.is.Function(_util.setup))
    assert(_.is.Function(_util.validate))

    const f = _.promise((self, done) => {
        _.promise(self)
            .validate(create)

            .then(_util.setup)

            .make(sd => {
                const json = _.d.clone(self[_util.one] || {})
                json.created = json.created || _.timestamp.make()
                json.updated = json.updated || json.created

                self[_util].one = json
            })
            .then(_util.create)
            .make(sd => {
                assert.ok(self[_util.one])
                assert.ok(self[_util.one][_util.primary_key])
            })
            .then(_util.scrub)

            .add("json", self[_util.one])
            .then(mongodb.db.put)

            .make(sd => {
                sd[_util.one] = sd.json
                sd[_util.primary_key] = sd.json || {}[_util.primary_key]
            })

            .done(done, self, _util.many, _util.one, _util.primary_key)
    }

    f.method = `${_util.name}.create`
    f.description = `Create one record ${_util.one}`
    f.requires = {
    }
    f.accepts = {
        [ _util.one ]: _.is.Object,
    }
    f.produces = {
        [ _util.one ]: [ _util.validate, _.is.Null ],
        [ _util.primary_key ]: [ _util.validate, _.is.Null ],
    }
})

/**
 *  API
 */
exports.create = create
