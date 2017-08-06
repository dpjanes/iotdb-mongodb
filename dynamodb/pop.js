/*
 *  pop.js
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

const Q = require("bluebird-q");
const mongodb = require('mongodb');

const mongo = require("../lib");
const util = require("../lib/util");

/**
 */
const pop = (_self, done) => {
    const self = _.d.clone.shallow(_self)
    const method = "pop";

    assert.ok(self.mongodbd, `${method}: expected self.mongodbd`)
    assert.ok(self.mongodbd.schema, `${method}: expected self.mongodbd.schema`)
    assert.ok(self.mongo_db, `${method}: expected self.mongo_db`)
    assert.ok(self.table_name, `${method}: expected self.table_name`)
    assert.ok(_.is.JSON(self.query), `${method}: expected self.query to be a JSON-like object`)

    const table_schema = self.mongodbd.schema[self.table_name]
    assert.ok(table_schema, `${method}: expected table_schema for ${self.table_name}`)
    assert.ok(table_schema.keys, `${method}: expected table_schema.keys for ${self.table_name}`)

    const values = table_schema.keys.map(key => self.query[key] || null)
    const query = _.object(table_schema.keys, values)
    // const sort = table_schema.keys.map(key => [ key, "ascending" ])

    Q(self)
        .then(mongo.collection)
        .then(sd => {
            sd.mongo_collection.findOneAndDelete(query, { w: 1, }, (error, result) => {
                if (error) {
                    return done(error);
                }

                if (result.value) {
                    self.json = util.safe_ids(result.value)
                } else {
                    self.json = null;
                }

                done(null, self);
            })
        })
        .catch(done)
}

/**
 *  API
 */
exports.pop = Q.denodeify(pop)
