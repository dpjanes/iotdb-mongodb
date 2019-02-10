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

"use strict";

const _ = require("iotdb-helpers");
const fs = require("iotdb-fs");

const assert = require("assert");
const path = require("path");

const mongodb = require("..")
const mongodbd = require("./data/mongodbd.json");
const movies_schema = require("./data/movies.schema.json");

const auto_fail = done => _.promise.make(self => done(new Error("didn't expect to get here")));
const ok_error = (done, code) => error => {
    if (code && (_.error.code(error) !== code)) {
        return done(error)
    }

    done(null);
}

/**
 *  Sets up MongoDB and initializes
 */
const initialize = _.promise.make((self, done) => {
    if (mongodbd.engine === "tingodb") {
        mongodbd.path = path.join(__dirname, "data", ".tingodb")
    }

    _.promise.make(self)
        // remove old data
        .then(_.promise.add("path", mongodbd.path))
        .then(fs.remove.recursive)

        // initialize
        .then(_.promise.add("mongodbd", mongodbd))
        .then(mongodb.initialize)
        .then(mongodb.db.initialize)

        // finished
        .then(_.promise.done(done))
        .catch(done)
})

/**
 *  Loads sample data
 */
const load = _.promise.make((self, done) => {
    _.promise.make(self)
        .then(_.promise.add({
            movies: require("./data/movies.json").map(movie => {
                movie.movie_id = `urn:movie:${movie.year}:${_.id.slugify(movie.title)}`
                movie.release_date = movie.info.release_date || null;
                movie.rating = movie.info.rating || null;
                movie.rank = movie.info.rank || null;
                movie.removed = movie.removed || null;
                return movie;
            }),
            table_schema: movies_schema,
        }))
        .then(_.promise.series({
            method: mongodb.db.put,
            inputs: "movies:json",
        }))
        .then(_.promise.done(done))
        .catch(done)
})

/*
 *  Return true if ordered forward
 */
const ordered_forward = (jsons, key) => {
    const values = jsons.map(json => json[key]).filter(value => value !== null)

    let value_last = null;

    for (let vi = 0; vi < values.length; vi++) {
        const value = values[vi];
        if ((value_last !== null) && (value_last > value)) {
            return false;
        }

        value_last = value;
    }

    return true;
}

/**
 *  API
 */
exports.auto_fail = auto_fail;
exports.ok_error = ok_error;

exports.initialize = initialize;
exports.load = load;
exports.ordered_forward = ordered_forward;
