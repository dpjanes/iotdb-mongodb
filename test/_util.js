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

const minimist = require('minimist');

const mongo = require("..")
const mongodbd = require("./data/mongodbd.json");
const movies_schema = require("./data/movies.schema.json");

/**
 *  Sets up MongoDB and initializes
 */
const initialize = _.promise.make((self, done) => {
    _.promise.make(self)
        .then(_.promise.add("mongodbd", mongodbd))
        .then(mongo.initialize)
        .then(mongo.dynamodb.initialize)
        .then(_.promise.done(done))
        .catch(done)
})

/**
 *  Loads sample data
 */
const load = _.promise.make((self, done) => {
    _.promise.make(self)
        .then(_.promise.add("movies", require("./data/movies.json")))
        .then(_.promise.series({
            method: mongo.dynamodb.put,
            inputs: "movies:json",
        }))
        .then(_.promise.done(done))
        .catch(done)
})

/**
 *  API
 */
exports.initialize = initialize;
exports.load = load;
