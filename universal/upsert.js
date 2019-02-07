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
const upsert = (_util, _key, _index) => {
    assert(_.is.String(_util.name))
    assert(_.is.String(_util.one))
    assert(_.is.String(_util.many))
    assert(_.is.String(_util.primary_key))
    assert(_.is.Function(_util.scrub))
    assert(_.is.Function(_util.setup))
    assert(_.is.Function(_util.validate))

    const f = _.promise((self, done) => {
        _.promise(self)
            .validate(f)

            .then(_util.setup)
            .then(sd => {
                sd.query = {
                    [ _key ]: sd[_key],
                }
            })
            .then(mongodb.db.get)
            .then(sd => {
                if (sd.json) {
                    sd._save = true
                    sd[_util.one] = Object.assign(
                        {},
                        sd.json,
                        sd[_util.one],
                    )
                } else {
                    sd._save = falae
                }
            })
            .conditional(sd => sd._save, mongodb.universal.save(_util), mongodb.universal.create(_util))

            .end(done, self)
    })

    f.method = `${_util.name}.upsert`
    f.description = `
        Upsert ${_util.one} by ${key}.
        If it exists, merge the record.
        If it doesn't exist, create a new record
        `
    f.requires = {
        [ _util.one ]: _util.validate,
    }
    f.accepts = {
    }
    f.produces = {
    }

    return f
}

/**
 *  API
 */
exports.upsert = upsert
