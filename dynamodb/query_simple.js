/*
 *  query_simple.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-06
 *
 *  Copyright [2013-2018] [David P. Janes]
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

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const mongodb = require('mongodb');

const mongo = require("../lib");
const util = require("../lib/util");

/**
 */
const query_simple = (_self, done) => {
    const self = _.d.clone.shallow(_self)
    const method = "query_simple";

    assert.ok(self.mongodbd, `${method}: expected self.mongodbd`)
    assert.ok(self.mongo_db, `${method}: expected self.mongo_db`)
    assert.ok(_.is.JSON(self.query), `${method}: expected self.query to be a JSON-like object`)
    assert.ok(self.table_schema, `${method}: expected self.table_schema`)
    assert.ok(self.table_name || self.table_schema.name, `${method}: expected self.table_name`)

    let keys = self.table_schema.keys;
    if (self.index_name) {
        keys = self.table_schema.indexes[self.index_name]
        assert.ok(keys, `${method}: expected index for ${self.table_name||self.table_schema.name} / ${self.index_name}`)
    }

    const sort = keys.map(key => [ key, key === "created" ? -1 : 1 ])
    const options = {
        skip: 0
    }

    if (self.pager) {
        options.skip = _.coerce.to.Integer(self.pager, 0)
    }
    if (self.query_limit) {
        options.limit = self.query_limit;
    }

    _.promise.make(self)
        .then(mongo.collection)
        .then(sd => {
            sd.mongo_collection.find(self.query, options).sort(sort).toArray((error, mongo_result) => {
                if (error) {
                    return done(error)
                }

                self.jsons = util.scrub_ids(mongo_result);
                self.json = self.jsons.length ? self.jsons[0] : null;

                self.cursor = null;

                if (options.limit) {
                    self.cursor = {
                        first: "0",
                        previous: null,
                        current: `${options.skip}`,
                        next: null,

                        is_first: null,
                        is_last: null,
                        has_next: null,
                        has_previous: null,
                        is_previous_first: null,

                        implements_previous: true,

                        n_results: self.jsons.length,
                        n_start: options.skip,
                    }

                    if (self.jsons.length > 0) {
                        self.cursor.next = `${Math.min(options.limit, self.jsons.length) + options.skip}`;

                        if (self.jsons.length < options.limit) {
                            self.cursor.next = null;
                            self.cursor.is_last = true;
                            self.cursor.has_next = false;
                        } else {
                            self.cursor.has_next = true;
                        }

                        if (options.skip === 0) {
                            self.cursor.is_first = true;
                        }

                        const previous = options.skip - options.limit;
                        self.cursor.previous = `${Math.max(0, previous)}`
                        if (previous === 0) {
                            self.cursor.has_previous = true;
                            self.cursor.is_previous_first = true;
                        } else if (previous < 0) {
                            self.cursor.has_previous = false;
                        } else {
                            self.cursor.has_previous = true;
                        }

                    }
                }

                self.mongo_result = mongo_result;

                done(null, self)
            })
        })
        .catch(done)
}

/**
 *  API
 */
exports.query_simple = _.promise.denodeify(query_simple)
exports.scan_simple = _.promise.denodeify(query_simple)
