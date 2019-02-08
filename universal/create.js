/*
 *  universal/create.js
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
const create = _util => {
    assert(_.is.String(_util.name))
    assert(_.is.String(_util.one))
    assert(_.is.String(_util.many))
    assert(_.is.Function(_util.create))
    assert(_.is.Function(_util.scrub))
    assert(_.is.Function(_util.setup))
    assert(_.is.Function(_util.validate))

    const f = _.promise((self, done) => {
        _.promise(self)
            .validate(f)

            .then(_util.setup)

            .make(sd => {
                self[_util.one] = _.d.clone(self[_util.one] || {})
            })
            .then(_util.create)
            .make(sd => {
                assert.ok(self[_util.one])

                self.table_schema.keys.forEach(key => {
                    assert.ok(!_.is.Undefined(self[_util.one][key]))
                })
            })
            .then(_util.scrub)

            .add("json", self[_util.one])
            .then(mongodb.db.put)

            .make(sd => {
                sd[_util.one] = sd.json
                sd[_util.primary_key] = sd.json || {}[_util.primary_key]
            })
            .then(_util.updated)

            .end(done, self, _util.many, _util.one, _util.primary_key)
    })

    f.method = `${_util.name}.create`
    f.description = `Create one record ${_util.one}`
    f.requires = {
    }
    f.accepts = {
        [ _util.one ]: _.is.Object,
    }
    f.produces = {
        [ _util.one ]: [ _util.validate, _.is.Null ],
        [ _util.primary_key ]: [ _util.validate, _.is.Null ],
    }

    /**
     *  Parameterized
     */
    f.p = value => _.promise((self, done) => {
        _.promise(self)
            .add(_util.one, value)
            .then(f)
            .end(done, self, _util.one, _util.primary_key)
    })

    return f
}

/**
 *  API
 */
exports.create = create
