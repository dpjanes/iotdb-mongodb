/*
 *  db/ensure_schema.js
 *
 *  David Janes
 *  IOTDB.org
 *  2018-04-02
 *
 *  Copyright (2013-2020) David P. Janes
 *
 *  Licensed under the Apache License, Version 2.0 (the "License")
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

"use strict";

const _ = require("iotdb-helpers")

const assert = require("assert")

const logger = require("../logger")(__filename)
const util = require("../lib/util")

/**
 */
const _ensure_one = _.promise((self, done) => {
    const mongodb = require("..")

    _.promise(self)
        .validate(self)

        .make(sd => {
            sd.index = {
                name: self.pair[0],
                indexes: {},
            }

            sd.pair[1]
                .filter(name => !name.startsWith("-"))
                .forEach(name => sd.index.indexes[name] = +1)
            sd.pair[1]
                .filter(name => name.startsWith("-"))
                .map(name => name.substring(1))
                .forEach(name => sd.index.indexes[name] = -1)
        })
        .then(mongodb.ensure_index)

        .end(done, self)
})

_ensure_one.method = "db.ensure_schema/_ensure_one"
_ensure_one.requires = {
    mongodb: _.is.Object,
    pair: _.is.Array,
}
_ensure_one.produces = {
}

/**
 */
const ensure_schema = _.promise((self, done) => {
    const mongodb = require("..")

    _.promise(self)
        .validate(ensure_schema)

        .then(mongodb.collection.p(self.table_schema.name))
        .add("pairs", _.pairs(self.table_schema.indexes || {}))
        .each({
            method: _ensure_one,
            inputs: "pairs:pair",
        })

        .end(done, self)
})

ensure_schema.method = "db.ensure_schema"
ensure_schema.description = `
    This makes sure all the indicies exist.

    Indicies are found in table_schema which looks like

    table_schema = {
        indexes: {
            "index-name": [ "id", "-date" ],
        },
    }
    `
ensure_schema.requires = {
    mongodb: _.is.Object,
    table_schema: {
        name: _.is.String,
        keys: _.is.Array,
    },
}
ensure_schema.accepts = {
    table_schema: {
        indexes: _.is.Dictionary,
    },
}
ensure_schema.produces = {
}

/**
 *  API
 */
exports.ensure_schema = ensure_schema
