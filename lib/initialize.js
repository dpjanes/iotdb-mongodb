/*
 *  initialize.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-05
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

const Q = require("bluebird-q");
const mongodb = require('mongodb');

/**
 */
const initialize = (_self, done) => {
    const self = _.d.clone.shallow(_self)
    const method = "initialize";

    assert.ok(self.mongodbd, `${method}: expected self.mongodbd`)
    assert.ok(_.is.String(self.mongodbd.url), `${method}: expected self.mongodbd.url to be a String`)

    mongodb.MongoClient.connect(self.mongodbd.url, (error, mongo_db) => {
        if (error) {
            return done(error)
        }

        self.mongo_db = mongo_db;

        done(null, self)
    })
}

/**
 *  API
 */
exports.initialize = Q.denodeify(initialize)
