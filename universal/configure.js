/*
 *  universal/configure.js
 *
 *  David Janes
 *  IOTDB
 *  2019-02-18
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
const configure = _descriptor => {
    const f = _.promise((self, done) => {
        _.promise(self)
            .validate(f)

            .then(_util.setup)
            .then(_descriptor.setup)

            .end(done)
    })

    f.method = `${_descriptor.name}.configure`
    f.description = `Setup clean database table & clear query parameters`
    f.requires = {
    }
    f.accepts = {
    }
    f.produces = {
        table_schema: {
            name: _.is.String,
            keys: _.is.Array,
            indexes: _.is.Dictionary,
        },
        query: _.is.Null,
        query_limit: _.is.Null,
        index_name: _.is.Null,
    }

    return f
}

/**
 *  API
 */
exports.configure = configure
