/*
 *  universal/save.js
 *
 *  David Janes
 *  IOTDB
 *  2019-01-07
 *
 *  Copyright [2013-2019] David P. Janes
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict"

const _ = require("iotdb-helpers")
const mongodb = require("..")

const assert = require("assert")

const _util = require("./_util")

/**
 */
const save = _descriptor => {
    assert(_.is.String(_descriptor.name))
    assert(_.is.String(_descriptor.one))
    assert(_.is.String(_descriptor.many))
    assert(_.is.Function(_descriptor.scrub))
    assert(_.is.Function(_descriptor.setup))
    assert(_.is.Function(_descriptor.validate))

    const f = _.promise((self, done) => {
        _.promise(self)
            .validate(f)

            .then(_util.setup)
            .then(_descriptor.setup)

            .then(_descriptor.scrub)
            .make(sd => {
                sd.json = sd[_descriptor.one]

                sd.query = {}
                sd.table_schema.keys.forEach(key => {
                    sd.query[key] = sd[_descriptor.one][key]
                    assert.ok(!_.is.Undefined(sd.query[key]), `${f.method}: expected to find key ${key}`)
                })
            })

            .then(mongodb.db.replace)
            .conditional(_descriptor.updated, _descriptor.updated)

            .end(done, self, _descriptor.one)
    })

    f.method = `${_descriptor.name}.save`
    f.description = `Save a ${_descriptor.one}`
    f.requires = {
        [ _descriptor.one ]: _descriptor.validate,
    }
    f.accepts = {
    }
    f.produces = {
        [ _descriptor.one ]: _descriptor.validate,
    }

    return f
}

/**
 *  API
 */
exports.save = save
