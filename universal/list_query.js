/*
 *  universal/list_query.js
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

/**
 */
const list_query = (_util, _index) => {
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
            .add("query", self.query)
            .conditional(_index, _.promise.add("index_name", _index))
            .conditional(self.mongodb$limit, _.promise.add("query_limit", self.mongodb$limit))
            .conditional(self.mongodb$start, _.promise.add("pager", self.mongodb$start))

            .then(mongodb.db.list)
            .each({
                method: _util.scrub,
                inputs: `jsons:${_util.one}`,
                outputs: _util.many,
                output_selector: sd => sd[_util.one],
                output_filter: x => x,
            })

            .end(done, self, _util.many, "cursor")
    })

    f.method = `${_util.name}.list_query`
    f.description = `Return records ${_util.one} matching query`
    f.requires = {
        query: _.is.Dictionary,
    }
    f.accepts = {
        pager: [ _.is.Integer, _.is.String ],
        limit: _.is.Integer, 
    }
    f.produces = {
        [ _util.many ]: _.is.Array,
        cursor: _.is.Dictionary,
    }

    /**
     *  Parameterized
     */
    f.p = query => _.promise((self, done) => {
        _.promise(self)
            .add("query", query)
            .then(f)
            .end(done, self, _util.one, _util.primary_key)
    })

    return f
}

/**
 *  API
 */
exports.list_query = list_query
