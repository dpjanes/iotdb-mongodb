/*
 *  universal/by.js
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
const by = (_util, _key, _index) => {
    assert(_.is.String(_util.name))
    assert(_.is.String(_util.one))
    assert(_.is.String(_util.many))
    assert(_.is.String(_util.primary_key))
    assert(_.is.Function(_util.scrub))
    assert(_.is.Function(_util.setup))
    assert(_.is.Function(_util.validate))
    assert(_.is.String(_key))
    assert(_.is.String(_index) || !_index)

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
            .make(sd => {
                sd[_util.one] = sd.json
            })
            .then(_util.scrub)
            .make(sd => {
                sd[_util.primary_key] = (sd.json || {})[_util.primary_key] || null
            })

            .done(done, self, _util.many, _util.one, _util.primary_key)
    })

    f.method = `${_util.name}.by`
    f.description = `Return one record ${_util.one} matching ${_key}`
    f.requires = {
    }
    f.accepts = {
        pager: [ _.is.Integer, _.is.String ],
    }
    f.produces = {
        [ _util.one ]: [ _util.validate, _.is.Null ],
        [ _util.primary_key ]: [ _util.validate, _.is.Null ],
    }

    return f
}

/**
 *  API
 */
exports.by = by

