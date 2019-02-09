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
const upsert = (_descriptor, _key, _index) => {
    assert(_.is.String(_descriptor.name))
    assert(_.is.String(_descriptor.one))
    assert(_.is.String(_descriptor.many))
    assert(_.is.Function(_descriptor.scrub))
    assert(_.is.Function(_descriptor.setup))
    assert(_.is.Function(_descriptor.validate))

    const f = _.promise((self, done) => {
        _.promise(self)
            .validate(f)

            .then(_descriptor.setup)
            .then(sd => {
                sd.query = {
                    [ _key ]: sd[_key],
                }
            })
            .then(mongodb.db.get)
            .then(sd => {
                if (sd.json) {
                    sd._save = true
                    sd[_descriptor.one] = Object.assign(
                        {},
                        sd.json,
                        sd[_descriptor.one],
                    )
                } else {
                    sd._save = falae
                }
            })
            .conditional(sd => sd._save, mongodb.universal.save(_descriptor), mongodb.universal.create(_descriptor))

            .end(done, self)
    })

    f.method = `${_descriptor.name}.upsert`
    f.description = `
        Upsert ${_descriptor.one} by ${key}.
        If it exists, merge the record.
        If it doesn't exist, create a new record
        `
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
exports.upsert = upsert
