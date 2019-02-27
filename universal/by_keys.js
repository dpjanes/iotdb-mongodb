/*
 *  universal/by_keys.js
 *
 *  David Janes
 *  IOTDB
 *  2019-02-18
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
 *  Note that _keys can have "/" paths
 */
const by_keys = (_descriptor, _keys, _index) => {
    assert(_.is.String(_descriptor.name))
    assert(_.is.String(_descriptor.one))
    assert(_.is.String(_descriptor.many))
    assert(_.is.Function(_descriptor.scrub))
    assert(_.is.Function(_descriptor.setup))
    assert(_.is.Function(_descriptor.validate))

    const _with_index = _.promise((self, done) => {
        throw new Error("not implemented")
        _.promise(self)
            .add({
                index_name: _index,
                query_limit: 1,
            })
            .then(_util.fix_query(_descriptor))

            .then(mongodb.db.all)
            .add(_descriptor.one, sd => sd.jsons[0] || null)

            .end(done, self, _descriptor.one)
    })

    const _without_index = _.promise((self, done) => {
        _.promise(self)
            .then(mongodb.db.get)
            .add(_descriptor.one, sd => sd.json)

            .end(done, self, _descriptor.one)
    })

    const f = _.promise((self, done) => {
        _.promise(self)
            .validate(f)

            .then(_util.setup)
            .then(_descriptor.setup)

            .make(sd => {
                sd.query = {}

                _keys.forEach(key => {
                    const key_base = key.replace(/^.*\//, "")
                    
                    sd.query[key_base] = _.d.get(sd, key_base)
                    assert.ok(!_.is.Undefined(sd.query[key_base]))
                })
            })
            .then(_util.fix_query(_descriptor))

            .conditional(_index, _with_index, _without_index)

            .end(done, self, _descriptor.one)
    })

    f.method = `${_descriptor.name}.by_keys`
    f.description = `Return one record ${_descriptor.one} matching primary keys`
    f.requires = {
    }
    _keys.forEach(key => {
        _.d.set(f.requires, key, _.is.Atomic)
    })

    f.accepts = {
        pager: [ _.is.Integer, _.is.String ],
    }
    f.produces = {
        [ _descriptor.one ]: [ _descriptor.validate, _.is.Null ],
    }

    return f
}

/**
 *  API
 */
exports.by_keys = by_keys
