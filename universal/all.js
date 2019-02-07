/*
 *  universal/all.js
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
const all = _util => {
    assert(_.is.String(_util.name))
    assert(_.is.String(_util.one))
    assert(_.is.String(_util.many))
    assert(_.is.Function(_util.scrub))
    assert(_.is.Function(_util.setup))

    const f = _.promise((self, done) => {
        _.promise(self)
            .validate(all)

            .then(_util.setup)
            .then(mongodb.db.all)
            .each({
                method: _util.scrub,
                inputs: `jsons:${_util.one}`,
                outputs: _util.many,
                output_selector: sd => sd[_util.one],
                output_filter: x => x,
            })

            .done(done, self, _util.many, "cursor")
    }

    f.method = `${_util.name}.all`
    f.description = `Return all ${_util.many}`
    f.requires = {
    }
    f.accepts = {
        pager: [ _.is.Integer, _.is.String ],
    }
    f.produces = {
        [ _util.many ]: _.is.Array,
        cursor: _.is.Dictionary,
    }
})


/**
 *  API
 */
exports.all = all
