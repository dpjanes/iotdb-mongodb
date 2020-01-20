/*
 *  universal/collection.js
 *
 *  David Janes
 *  IOTDB
 *  2020-01-20
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
 *  Remove adds a "keys.removed" to the record,
 *  so it's hidden from future searches
 */
const collection = _descriptor => {
    assert(_.is.String(_descriptor.name))
    assert(_.is.String(_descriptor.one))
    assert(_.is.Function(_descriptor.setup))
    assert(_.is.Function(_descriptor.validate))
    assert(_.is.Dictionary(_descriptor.keys))

    const f = _.promise((self, done) => {
        _.promise(self)
            .validate(f)

            .then(_util.setup)
            .then(_descriptor.setup)
            
            .add("table_schema/name:mongodb$collection_name")
            .then(mongodb.collection)

            .end(done, self, f)
    })

    f.method = `${_descriptor.name}.collection`
    f.description = `Access to the underlying descriptor for ${_descriptor.one}`
    f.requires = {
        [ _descriptor.one ]: _descriptor.validate,
    }
    f.accepts = {
    }
    f.produces = {
        mongodb$collection: _.is.Object,
    }

    return f
}

/**
 *  API
 */
exports.collection = collection
