/*
 *  universal/delete.js
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
 */
const delete_ = _util => {
    assert(_.is.String(_util.name))
    assert(_.is.String(_util.one))
    assert(_.is.String(_util.many))
    assert(_.is.Function(_util.scrub))
    assert(_.is.Function(_util.setup))
    assert(_.is.Function(_util.validate))

    const f = _.promise((self, done) => {
        _.promise(self)
            .validate(f)

            .then(_util.setup)
            .make(sd => {
                sd.query = {}
                sd.table_schema.keys.forEach(key => {
                    sd.query[key] = sd[_util.one][key]
                    assert.ok(!_.is.Undefined(sd.query[key]), `${f.method}: expected to find key ${key}`)
                })
            })

            .conditional(_util.delete, _util.delete)
            .then(mongodb.db.delete)
            .conditional(_util.deleted, _util.deleted)

            .end(done, self)
    })

    f.method = `${_util.name}.delete`
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
exports.delete = delete_
