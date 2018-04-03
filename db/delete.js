/*
 *  delete.js
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

const mongo = require("../lib");
const util = require("../lib/util");

/**
 */
const _delete = _.promise.make((self, done) => {
    const method = "dynamodb.delete";

    assert.ok(self.mongodb, `${method}: expected self.mongodb`)
    assert.ok(_.is.JSON(self.query), `${method}: expected self.query to be a JSON-like object`)
    assert.ok(self.table_schema, `${method}: expected self.table_schema`)

    const values = self.table_schema.keys.map(key => self.query[key] || null)
    const query = _.object(self.table_schema.keys, values)
    const sort = self.table_schema.keys.map(key => [ key, 1 ])

    _.promise.make(self)
        .then(mongo.collection)
        .then(_.promise.make(sd => {
            sd.mongo_collection.findAndRemove(query, sort, { w: 1, }, error => {
                if (error) {
                    return done(util.intercept(self)(error))
                }

                done(null, self);
            })
        }))
        .catch(done)
})

/**
 *  API
 */
exports.delete = _delete
