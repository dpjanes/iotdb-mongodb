/*
 *  universal/count_key.js
 *
 *  David Janes
 *  IOTDB
 *  2019-02-10
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
const count_key = (_descriptor, _key, _index) => {
    assert(_.is.String(_descriptor.name))
    assert(_.is.String(_descriptor.one))
    assert(_.is.String(_descriptor.many))
    assert(_.is.Function(_descriptor.scrub))
    assert(_.is.Function(_descriptor.setup))
    assert(_.is.Function(_descriptor.validate))
    assert(_.is.String(_key))
    assert(_.is.String(_index) || !_index)

    const f = _.promise((self, done) => {
        _.promise(self)
            .validate(f)

            .then(_util.setup)
            .then(_descriptor.setup)
            
            .conditional(_index, _.promise.add("index_name", _index))
            .make(sd => {
                sd.query = {
                    [ _key ]: sd[_key],
                }
            })
            .then(_util.fix_query(_descriptor))

            .then(mongodb.db.count)

            .end(done, self, "count")
    })

    f.method = `${_descriptor.name}.count_key`
    f.description = `How many ${_descriptor.one} records match ${_key}`
    f.requires = {
        [ _key ]: _.is.Atomic,
    }
    f.accepts = {
    }
    f.produces = {
        count: _.is.Integer,
    }

    /**
     *  Parameterized
     */
    f.p = value => _.promise((self, done) => {
        _.promise(self)
            .add(_key, value)
            .then(f)
            .end(done, self, "count")
    })

    return f
}

/**
 *  API
 */
exports.count_key = count_key
