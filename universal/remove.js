/*
 *  universal/remove.js
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

/**
 *  Remove adds a "remove_key" to the record,
 *  so it's hidden from future searches
 */
const remove = _descriptor => {
    assert(_.is.String(_descriptor.name))
    assert(_.is.String(_descriptor.one))
    assert(_.is.String(_descriptor.many))
    assert(_.is.String(_descriptor.remove_key))
    assert(_.is.Function(_descriptor.scrub))
    assert(_.is.Function(_descriptor.setup))
    assert(_.is.Function(_descriptor.validate))

    const f = _.promise((self, done) => {
        _.promise(self)
            .validate(f)

            .then(_descriptor.setup)
            .make(sd => {
                sd.json = _.d.clone(_descriptor.one)
                sd.json[_descriptor.remove_key] = _.timestamp.make()

                sd.query = {}
                sd.table_schema.keys.forEach(key => {
                    sd.query[key] = sd[_descriptor.one][key]
                    assert.ok(!_.is.Undefined(sd.query[key]), `${f.method}: expected to find key ${key}`)
                })
            })

            .conditional(_descriptor.remove, _descriptor.remove)
            .then(mongodb.db.replace)
            .conditional(_descriptor.removed, _descriptor.removed)

            .end(done, self)
    })

    f.method = `${_descriptor.name}.remove`
    f.description = `Remove one ${_descriptor.one}`
    f.requires = {
        [ _descriptor.one ]: _descriptor.validate,
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
