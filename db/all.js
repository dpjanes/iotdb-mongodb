/*
 *  all.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-06
 *
 *  Copyright [2013-2018] [David P. Janes]
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

"use strict"

const _ = require("iotdb-helpers")
const errors = require("iotdb-errors")

const assert = require("assert")

const logger = require("../logger")(__filename)
const mongo = require("../lib")
const util = require("../lib/util")

/**
 *  Make a mongo looking query from a DynamoDB one
 */
const _make_query = _query => {
    const query = _.d.clone.shallow(_query || {})

    _.keys(query)
        .filter(query_key => _.is.Array(query[query_key]))
        .forEach(query_key => {
            const parts = query[query_key];

            let position = 0;
            while (position < parts.length) {
                let comparitor;
                let q;

                switch (parts[position].toLowerCase()) {
                case "=":
                case "eq":
                    q = {
                        "$eq": parts[position + 1]
                    }

                    position += 2;
                    break;
                    
                case "<": case "lt":
                    q = {
                        "$lt": parts[position + 1]
                    }

                    position += 2;
                    break;
                    
                case "<=": case "le":
                    q = {
                        "$lte": parts[position + 1]
                    }

                    position += 2;
                    break;
                    
                case ">": case "gt":
                    q = {
                        "$gt": parts[position + 1]
                    }

                    position += 2;
                    break;
                    
                case ">=": case "ge":
                    q = {
                        "$gte": parts[position + 1]
                    }

                    position += 2;
                    break;
                    
                case "!=": case "ne":
                    q = {
                        "$ne": parts[position + 1]
                    }

                    position += 2;
                    break;

                case "between":
                    q = {
                        "$gte": parts[position + 1],
                        "$lte": parts[position + 2],
                    }

                    position += 3;
                    break;

                case "in":
                case "∈":
                    q = {
                        "$in": parts[position + 1]
                    }

                    position += 2;
                    break;

                default:
                    throw new errors.Invalid("unknown operator: " + parts[position])
                }

                query[query_key] = q;
            }
        })

    return query;
}

/**
 *  Query the database. Note that this implements
 *  `all`, `query_simple` and `scan_simple`
 */
const all = _.promise.make((self, done) => {
    const method = "db.all";

    assert.ok(self.mongodb, `${method}: expected self.mongodb`)
    assert.ok(self.table_schema, `${method}: expected self.table_schema`)
    assert.ok(_.is.Nullish(self.query) || _.is.JSON(self.query), 
        `${method}: expected self.query to be a JSON or Null`);

    logger.trace({
        method: method,
    }, "called")

    let keys = self.table_schema.keys;
    if (self.index_name) {
        keys = self.table_schema.indexes[self.index_name]
    }

    const query = _make_query(self.query)

    const sort = keys.map(key => [ key.replace(/^[-+]/, ""), key.startsWith("-") ? -1 : 1 ])
    const options = {
        skip: 0
    }

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

    /*
    console.log("===")
    console.trace()
    console.log("HERE:XXX.1", "query", query)
    console.log("HERE:XXX.2", "sort", sort)
    console.log("HERE:XXX.3", "schema", self.table_schema)
    console.log("HERE:XXX.4", "index", self.index_name)
    console.log("===")
    */

    _.promise.make(self)
        .then(mongo.collection)
        .then(sd => {
            sd.mongo_collection.find(query, options).sort(sort).toArray((error, mongo_result) => {
                if (error) {
                    return done(util.intercept(self)(error))
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

                    if (self.jsons.length === 0) {
                        self.cursor.is_first = true;
                        self.cursor.is_last = true;
                    } else {
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
            return null;
        })
        .catch(done)
})

/**
 */
const count = _.promise.make((self, done) => {
    const method = "db.count";

    assert.ok(self.mongodb, `${method}: expected self.mongodb`)
    assert.ok(self.table_schema, `${method}: expected self.table_schema`)
    assert.ok(_.is.Nullish(self.query) || _.is.JSON(self.query), 
        `${method}: expected self.query to be a JSON or Null`);

    logger.trace({
        method: method,
    }, "called")

    _.promise.make(self)
        .then(mongo.collection)
        .then(_.promise.make(sd => {
            sd.mongo_collection.count(_make_query(self.query), (error, count) => {
                if (error) {
                    return done(util.intercept(self)(error))
                }

                self.count = count;

                done(null, self)
            })
        }))
        .catch(done)
})

/**
 *  API
 */
exports.count = count;
exports.all = all;
exports.query_simple = all;
exports.scan_simple = all;
