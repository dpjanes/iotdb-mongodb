/*
 *  universal/create.js
 *
 *  David Janes
 *  IOTDB
 *  2019-02-07
 *
 *  Copyright (2013-2020) David P. Janes
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
const create = _descriptor => {
    assert(_.is.String(_descriptor.name))
    assert(_.is.String(_descriptor.one))
    assert(_.is.String(_descriptor.many))
    assert(_.is.Function(_descriptor.setup))
    assert(_.is.Function(_descriptor.validate))
    assert(_.is.Dictionary(_descriptor.keys))

    const f = _.promise((self, done) => {
        const now = _.timestamp.make()

        _.promise(self)
            .validate(f)

            .then(_util.setup)
            .then(_descriptor.setup)

            .make(sd => {
                sd[_descriptor.one] = _.d.clone(sd[_descriptor.one] || {})
            })

            .then(_util.key(_descriptor, "created", now))
            .then(_util.key(_descriptor, "updated", now))
            .then(_util.key(_descriptor, "removed", null))
            .then(_descriptor.create)
            .then(_descriptor.scrub || _util.scrub(_descriptor.one))

            .make(sd => {
                sd.json = sd[_descriptor.one]
                assert.ok(sd.json)

                sd.table_schema.keys.forEach(key => {
                    assert.ok(!_.is.Undefined(sd.json[key]), `expected to see "${key}" in the record: ${JSON.stringify(sd.json, null, 2)}`)
                })
            })
            .conditional(!!_descriptor.scrub_json, _descriptor.scrub_json)
            .then(mongodb.db.put)
            .conditional(!!_descriptor.updated, _descriptor.updated)

            .end(done, self, _descriptor.one)
    })

    f.method = `${_descriptor.name}.create`
    f.description = `Create one record ${_descriptor.one}`
    f.requires = {
    }
    f.accepts = {
        [ _descriptor.one ]: _.is.Object,
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
exports.create = create
