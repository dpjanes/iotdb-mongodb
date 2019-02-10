/*
 *  universal/count_query.js
 *
 *  David Janes
 *  IOTDB
 *  2019-01-10
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
const count_query = (_descriptor, _index) => {
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
            .then(_util.post_setup)
            
            .add("query", self.query)
            .then(_util.fix_query(_descriptor))

            .conditional(_index, _.promise.add("index_name", _index))
            .then(mongodb.db.count)

            .end(done, self, "count")
    })

    f.method = `${_descriptor.name}.count_query`
    f.description = `How many ${_descriptor.one} records match query`
    f.requires = {
        query: _.is.Dictionary,
    }
    f.accepts = {
    }
    f.produces = {
        count: _.is.Integer,
    }

    /**
     *  Parameterized
     */
    f.p = query => _.promise((self, done) => {
        _.promise(self)
            .add("query", query)
            .then(f)
            .end(done, self, "count")
    })

    return f
}

/**
 *  API
 */
exports.count_query = count_query
