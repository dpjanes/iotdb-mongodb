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
const _ensure_one = _.promise.make((self, done) => {
    const method = "db.ensure_schema/_ensure_one";
    const mongo = require("../lib");

    assert.ok(self.mongodb, `${method}: expected self.mongodb`)
    assert.ok(self.pair, `${method}: expected self.pair`)

    const indexes = {}

    self.pair[1]
        .filter(name => !name.startsWith("-"))
        .forEach(name => indexes[name] = +1)
    self.pair[1]
        .filter(name => name.startsWith("-"))
        .map(name => name.substring(1))
        .forEach(name => indexes[name] = -1)

    _.promise.make(self)
        .then(_.promise.add({
            index_name: self.pair[0],
            indexes: indexes,
        }))
        .then(mongo.ensure_index)
        .then(_.promise.done(done, self))
        .catch(done)
})

/**
 *  This makes sure all the indicies exist
 */
const ensure_schema = _.promise.make((self, done) => {
    const method = "db.ensure_schema";
    const mongo = require("../lib");

    logger.trace({
        method: method,
    }, "called")

    assert.ok(self.mongodb, `${method}: expected self.mongodb`)
    assert.ok(self.table_schema, `${method}: expected self.table_schema`)

    if (!self.table_schema.indexes) {
        return done(null, self)
    }

    _.promise.make(self)
        .then(mongo.collection)
        .then(_.promise.add("pairs", _.pairs(self.table_schema.indexes)))
        .then(_.promise.series({
            method: _ensure_one,
            inputs: "pairs:pair",
        }))
        .then(_.promise.done(done, self))
        .catch(done)
})

/**
 *  API
 */
exports.ensure_schema = ensure_schema
