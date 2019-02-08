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

/**
 */
const one_query = _util => {
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
            .then(mongodb.db.get)
            .make(sd => {
                sd[_util.one] = sd.json
            })
            .then(_util.scrub)
            .make(sd => {
                if (_util.primary_key) {
                    sd[_util.primary_key] = (sd.json || {})[_util.primary_key] || null
                }
            })

            .end(done, self, _util.one, _util.primary_key)
    })

    f.method = `${_util.name}.one_query`
    f.description = `Return one record ${_util.one} matching query`
    f.requires = {
        query: _.is.Dictionary,
    }
    f.accepts = {
        pager: [ _.is.Integer, _.is.String ],
    }
    f.produces = {
        [ _util.one ]: [ _util.validate, _.is.Null ],
        [ _util.primary_key ]: [ _util.validate, _.is.Null ],
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
exports.one_query = one_query
