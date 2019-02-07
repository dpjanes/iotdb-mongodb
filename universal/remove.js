/*
 *  universal/remove.js
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
const remove = _util => {
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
                    [ _util.primary_key ]: sd[_util.one][_util.primary_key],
                }
            })
            .then(mongodb.db.delete)
            .then(_util.removed)

            .end(done, self)
    })

    f.method = `${_util.name}.remove`
    f.description = `Remove one ${_util.one}`
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
exports.remove = remove
