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
const save = _util => {
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
            .then(_util.scrub)
            .then(sd => {
                sd.json = sd[_util.one]
                sd.json.updated = _.timestamp.make()
                sd.query = {
                    [ _util.primary_key ]: sd[_util.one][_util.primary_key],
                }
            })
            .then(mongodb.db.replace)
            .then(_util.updated)

            .done(done, self, _util.one)
    })

    f.method = `${_util.name}.save`
    f.description = `Remove one ${_util.one}`
    f.requires = {
        [ _util.one ]: _util.validate,
    }
    f.accepts = {
    }
    f.produces = {
        [ _util.one ]: _util.validate,
    }
}

/**
 *  API
 */
exports.save = save
