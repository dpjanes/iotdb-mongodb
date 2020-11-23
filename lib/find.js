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

"use strict"

const _ = require("iotdb-helpers")
const errors = require("iotdb-errors")
const is = require("../is")

/**
 */
const find = _.promise((self, done) => {
    _.promise.validate(self, find)

    const mongodb = require("..")
    const query = mongodb.util.restore_ids(self.query || {})

    const options = Object.assign({
        skip: 0
    }, self.mongodb$options || exports.find.DEFAULT)

    if (self.pager) {
        options.skip = _.coerce.to.Integer(self.pager, 0)
    }

    if (self.query_limit) {
        options.limit = self.query_limit
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
    let keys = self.mongodb$keys || []
    if (self.index_name) {
        keys = self.table_schema.indexes[self.index_name]
        if (!keys) {
            throw new errors.Internal(`${method}: no index named ${self.index_name}`)
        }
    }

    let sort = keys.map(key => [ key.replace(/^[-+]/, ""), key.startsWith("-") ? -1 : 1 ])
    if (self.mongodb$sort) {
        sort = _.d.list(self, "mongodb$sort", []).map(key => [ key.replace(/^[-+]/, ""), key.startsWith("-") ? -1 : 1 ])
    }

    self.mongodb$collection
        .find(query, options)
        .sort(sort)
        .toArray((error, mongodb$result) => {
            if (error) {
                return done(mongodb.util.intercept(self)(error))
            }

            self.jsons = mongodb.util.safe_ids(mongodb$result)
            self.json = self.jsons.length ? self.jsons[0] : null

            self.mongodb$result = mongodb$result

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
})

find.method = "find"
find.requires = {
    mongodb$collection: _.is.Object,
}
find.accepts = {
    query: _.is.JSON,
    projection: [ _.is.Array, _.is.Dictionary, ],
    pager: [ _.is.String, _.is.Integer, ],
    query_limit: _.is.Integer,
    mongodb$options: _.is.Dictionary,
    mongodb$keys: _.is.Array.of.String,
    index_name: _.is.String,
}
find.produces = {
    cursor: _.is.Dictionary,
    jsons: _.is.Array,
    json: _.is.mongodb.valid,
}
find.params = {
    query: _.is.Dictionary,
    mongodb$options: _.is.Dictionary,
}
find.p = _.p(find)

/**
 *  API
 */
exports.find = find

exports.find.DEFAULT = {}
