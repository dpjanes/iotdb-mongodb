/**
 *  test/_util.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-29
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

"use strict"

const _ = require("iotdb-helpers")
const fs = require("iotdb-fs")

const assert = require("assert")
const path = require("path")

const mongodb = require("..")
const mongodb$cfg = require("./data/mongodb$cfg.json")
const movies_schema = require("./data/movies.schema.json")

const auto_fail = done => _.promise(self => done(new Error("didn't expect to get here")))
const ok_error = (done, code) => error => {
    if (code && (_.error.code(error) !== code)) {
        return done(error)
    }

    done(null)
}

/**
 *  Sets up MongoDB and initializes
 */
const initialize = _.promise((self, done) => {
    if (mongodb$cfg.engine === "tingodb") {
        mongodb$cfg.path = path.join(__dirname, "data", ".tingodb")
    }

    _.promise(self)
        // remove old data
        .add("path", mongodb$cfg.path)
        .then(fs.remove.recursive)

        // initialize
        .add("mongodb$cfg", mongodb$cfg)
        .then(mongodb.initialize)
        .then(mongodb.db.initialize)

        // finished
        .end(done, null)
})

/**
 *  Loads sample data
 */
const load = _.promise((self, done) => {
    _.promise(self)
        .add({
            movies: require("./data/movies.json").map(movie => {
                movie.movie_id = `urn:movie:${movie.year}:${_.id.slugify(movie.title)}`
                movie.release_date = movie.info.release_date || null
                movie.rating = movie.info.rating || null
                movie.rank = movie.info.rank || null
                movie.removed = movie.removed || null
                return movie
            }),
            table_schema: movies_schema,
        })
        .each({
            method: mongodb.db.put,
            inputs: "movies:json",
        })
        .end(done, self, "table_schema")
})

/*
 *  Return true if ordered forward
 */
const ordered_forward = (jsons, key) => {
    const values = jsons.map(json => json[key]).filter(value => value !== null)

    let value_last = null

    for (let vi = 0; vi < values.length; vi++) {
        const value = values[vi]
        if ((value_last !== null) && (value_last > value)) {
            return false
        }

        value_last = value
    }

    return true
}

/**
 *  Gathers all results from rx.Observable
 */
const gather = _.promise((self, done) => {
    _.promise.validate(self, gather)

    self.jsons = []
    self.observable.subscribe(
        json => self.jsons.push(json),
        error => done(error),
        () => done(null, self)
    )
})

gather.method = "gather"
gather.description = ``
gather.requires = {
    observable: _.is.rx.Observable,
}
gather.produces = {
    jsons: _.is.Array,
}


/**
 *  API
 */
exports.auto_fail = auto_fail
exports.ok_error = ok_error

exports.initialize = initialize
exports.load = load
exports.ordered_forward = ordered_forward

exports.gather = gather
