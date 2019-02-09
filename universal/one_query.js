/*
 *  universal/one_query.js
 *
 *  David Janes
 *  IOTDB
 *  2019-01-08
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
const one_query = _descriptor => {
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
            .then(mongodb.db.get)
            .make(sd => {
                sd[_descriptor.one] = sd.json
            })

            .end(done, self, _descriptor.one)
    })

    f.method = `${_descriptor.name}.one_query`
    f.description = `Return one record ${_descriptor.one} matching query`
    f.requires = {
        query: _.is.Dictionary,
    }
    f.accepts = {
        pager: [ _.is.Integer, _.is.String ],
    }
    f.produces = {
        [ _descriptor.one ]: [ _descriptor.validate, _.is.Null ],
    }

    /**
     *  Parameterized
     */
    f.p = query => _.promise((self, done) => {
        _.promise(self)
            .add("query", query)
            .then(f)
            .end(done, self, _descriptor.one)
    })

    return f
}

/**
 *  API
 */
exports.one_query = one_query
