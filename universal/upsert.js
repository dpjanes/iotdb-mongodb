/*
 *  universal/upsert.js
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
const upsert = (_util, _key, _index) => {
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
