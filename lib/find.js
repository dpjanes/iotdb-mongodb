/*
 *  lib/find.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-05
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

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const util = require("./util");

/**
 */
const find = (_self, done) => {
    const self = _.d.clone.shallow(_self)
    const method = "find";

    assert.ok(self.mongo_collection, `${method}: expected self.mongo_collection`)
    assert.ok(_.is.JSON(self.query) || _.is.Nullish(self.query), `${method}: expected self.query to be a JSON-like object or Null`)

    const query = util.restore_ids(self.query || {});
    const find_in = self.find_in || exports.find.DEFAULT;

    const options = Object.assign({
        skip: 0
    }, find_in)

    if (self.pager) {
        options.skip = _.coerce.to.Integer(self.pager, 0)
    }
    if (self.query_limit) {
        options.limit = self.query_limit;
    }
    if (self.projection) {
        if (_.is.Array(self.projection)) {
            options.projection = {}
            self.projection.forEach(key => options.projection[key] = 1)
        } else {
            options.projection = _.d.clone(self.projection)
        }
    }

    // sort
    let keys = self.table_schema.keys || [];
    if (self.index_name) {
        keys = self.table_schema.indexes[self.index_name]
        assert.ok(keys, `${method}: no index named ${self.index_name}`)
    }

    let sort = keys.map(key => [ key.replace(/^[-+]/, ""), key.startsWith("-") ? -1 : 1 ])
    if (self.query_sort) {
        sort = _.d.list(self, "query_sort", []).map(key => [ key.replace(/^[-+]/, ""), key.startsWith("-") ? -1 : 1 ])
    }

    self.mongo_collection
        .find(query, options)
        .sort(sort)
        .toArray((error, mongo_result) => {
            if (error) {
                return done(util.intercept(self)(error))
            }

            self.jsons = util.safe_ids(mongo_result)
            self.json = self.jsons.length ? self.jsons[0] : null

            self.mongo_result = mongo_result

            self.cursor = null

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

                if (self.jsons.length === 0) {
                    self.cursor.is_first = true
                    self.cursor.is_last = true
                } else {
                    self.cursor.next = `${Math.min(options.limit, self.jsons.length) + options.skip}`

                    if (self.jsons.length < options.limit) {
                        self.cursor.next = null
                        self.cursor.is_last = true
                        self.cursor.has_next = false
                    } else {
                        self.cursor.has_next = true
                    }

                    if (options.skip === 0) {
                        self.cursor.is_first = true
                    }

                    const previous = options.skip - options.limit
                    self.cursor.previous = `${Math.max(0, previous)}`
                    if (previous === 0) {
                        self.cursor.has_previous = true
                        self.cursor.is_previous_first = true
                    } else if (previous < 0) {
                        self.cursor.has_previous = false
                    } else {
                        self.cursor.has_previous = true
                    }

                }
            }

            done(null, self)
        })
}

/**
 *  API
 */
exports.find = _.promise.denodeify(find)

exports.find.DEFAULT = {}
