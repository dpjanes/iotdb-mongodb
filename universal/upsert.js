/*
 *  universal/upsert.js
 *
 *  David Janes
 *  IOTDB
 *  2019-02-07
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

const assert = require("assert")

const _util = require("./_util")

/**
 */
const upsert = (_descriptor, _key) => {
    const mongodb = require("..")

    assert(_.is.String(_descriptor.name))
    assert(_.is.String(_descriptor.one))
    assert(_.is.String(_descriptor.many))
    assert(_.is.Function(_descriptor.scrub))
    assert(_.is.Function(_descriptor.setup))
    assert(_.is.Function(_descriptor.validate))
    assert(_.is.Dictionary(_descriptor.keys))

    const f = _.promise((self, done) => {
        _.promise(self)
            .validate(f)

            .then(_util.setup)
            .then(_descriptor.setup)

            .make(sd => {
                sd.query = {}

                if (_key) {
                    sd.query[_key] = sd[_descriptor.one][_key]
                    assert.ok(!_.is.Undefined(sd.query[_key]), `${f.method}: expected to find key ${_key}`)
                } else {
                    sd.table_schema.keys.forEach(key => {
                        sd.query[key] = sd[_descriptor.one][key]
                        assert.ok(!_.is.Undefined(sd.query[key]), `${f.method}: expected to find key ${key}`)
                    })
                }
            })
            .then(mongodb.db.get)
            .make(sd => {
                if (sd.json) {
                    sd._save = true
                    sd[_descriptor.one] = Object.assign(
                        {},
                        sd.json,
                        sd[_descriptor.one],
                    )
                } else {
                    sd._save = false
                }
            })
            .conditional(sd => sd._save, mongodb.universal.save(_descriptor), mongodb.universal.create(_descriptor))

            .end(done, self, _descriptor.one)
    })

    f.method = `${_descriptor.name}.upsert`
    f.description = `
        Upsert ${_descriptor.one} record.
        If it exists, merge the record.
        If it doesn't exist, create a new record
        `
    f.requires = {
        [ _descriptor.one ]: _descriptor.validate,
    }
    f.accepts = {
    }
    f.produces = {
        [ _descriptor.one ]: [ _descriptor.validate, _.is.Null ],
    }

    /**
     *  Parameterized
     */
    f.p = value => _.promise((self, done) => {
        _.promise(self)
            .add(_descriptor.one, value)
            .then(f)
            .end(done, self, _descriptor.one)
    })

    return f
}

/**
 *  API
 */
exports.upsert = upsert
