/*
 *  db/get.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-06
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
const mongo = require("../lib")
const util = require("../lib/util")

/**
 */
const get = _.promise.make((self, done) => {
    const method = "db.get";

    assert.ok(self.mongodb, `${method}: expected self.mongodb`)
    assert.ok(_.is.JSON(self.query), `${method}: expected self.query to be a JSON-like object`)
    assert.ok(self.table_schema, `${method}: expected self.table_schema`)

    logger.trace({
        method: method,
    }, "called")

    _.promise.make(self)
        .then(mongo.collection)
        .then(_.promise.make(sd => {
            sd.mongodb$collection.findOne(self.query, (error, result) => {
                if (error) {
                    return done(util.intercept(self)(error))
                }

                self.json = util.scrub_ids(result) || null;

                done(null, self);
            })
        }))
        .catch(done)
})

/**
 */
const get_document = _.promise((self, done) => {
})

/**
 *  API
 */
exports.get = get
exports.get.document = get_document
