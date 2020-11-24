/*
 *  db/all.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-06
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

/**
 *  Query the database. Note that this implements
 *  `all`, `query_simple` and `scan_simple`
 */
const all = _.promise((self, done) => {
    const mongodb = require("..")

    _.promise.validate(self, all)

    let keys = self.table_schema.keys
    if (self.index_name) {
        keys = self.table_schema.indexes[self.index_name]
        if (!keys) {
            return done(new errors.Invalid(`${all.method}: no index named ${self.index_name}`))
        }
    }

    const query = mongodb.util.build_query(self.query)

    if (!_.is.Empty(self.query_search)) {
        query["$text"] = {
            "$search": self.query_search,
        }
    }

    if (self.mongodb$query) {
        Object.assign(query, self.mongodb$query)
    }

    let sort = keys.map(key => [ key.replace(/^[-+]/, ""), key.startsWith("-") ? -1 : 1 ])
    if (self.query_sort) {
        sort = _.d.list(self, "query_sort", []).map(key => [ key.replace(/^[-+]/, ""), key.startsWith("-") ? -1 : 1 ])
    }

    const options = {
        skip: 0
    }

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

    /*
    console.log("===")
    // console.trace()
    console.log("HERE:XXX.1", "query", query)
    console.log("HERE:XXX.2", "sort", sort)
    console.log("HERE:XXX.3", "schema", self.table_schema)
    console.log("HERE:XXX.4", "index", self.index_name)
    console.log("===")
    */

    _.promise(self)
        .then(mongodb.collection.p(self.table_schema.name))
        .then(sd => {
            sd.mongodb$collection.find(query, options).sort(sort).toArray((error, mongodb$result) => {
                if (error) {
                    return done(mongodb.util.intercept(self)(error))
                }

                self.jsons = mongodb.util.scrub_ids(mongodb$result)
                self.json = self.jsons.length ? self.jsons[0] : null

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

                self.mongodb$result = mongodb$result

                done(null, self)
            })
            return null
        })
        .catch(done)
})

all.method = "db.all"
all.requires = {
    mongodb: _.is.Object,
    table_schema: {
        name: _.is.String,
        keys: _.is.Array,
        indexes: _.is.Dictionary,
    },
}
all.accepts = {
    index_name: _.is.String,
    query: _.is.JSON,
    query_search: _.is.String,
    pager: [ _.is.String, _.is.Integer ],
    query_limit: _.is.Intger,
    projection: [ _.is.Array, _.is.Dictionary ],
    query_sort: _.is.Array,
    mongodb$query: _.is.Dictionary,
}
all.produces = {
    jsons: _.is.Array,
    json: _.is.Dictionary,

    cursor: _.is.Dictionary,
    mongodb$result: _.is.Object,
}

/**
 *  API
 */
exports.all = all
exports.query_simple = all
exports.scan_simple = all
