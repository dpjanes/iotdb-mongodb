/*
 *  replace.js
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
const errors = require("iotdb-errors");

const assert = require("assert");

const mongodb = require('mongodb');

const mongo = require("../lib");
const util = require("../lib/util");

/**
 */
const replace = (_self, done) => {
    const self = _.d.clone.shallow(_self)
    const method = "replace";

    assert.ok(self.mongodbd, `${method}: expected self.mongodbd`)
    assert.ok(self.mongo_db, `${method}: expected self.mongo_db`)
    assert.ok(self.table_name, `${method}: expected self.table_name`)
    assert.ok(self.table_schema, `${method}: expected self.table_schema`)
    assert.ok(_.is.JSON(self.json), `${method}: expected self.json to be a JSON-like object`)

    /*
    const table_schema = self.mongodbd.schema[self.table_name]
    assert.ok(table_schema, `${method}: expected table_schema for ${self.table_name}`)
    assert.ok(table_schema.keys, `${method}: expected table_schema.keys for ${self.table_name}`)
     */

    const values = self.table_schema.keys.map(key => self.json[key] || null)
    const query = _.object(self.table_schema.keys, values)
    const sort = self.table_schema.keys.map(key => [ key, 1 ])

    _.promise.make(self)
        .then(mongo.collection)
        .then(sd => {
            sd.mongo_collection.findAndModify(query, sort, self.json, { w: 1, upsert: false, }, (error, result) => {
                if (error) {
                    return done(error);
                }

                if (!result.value) {
                    return done(new errors.NotFound())
                }

                done(null, self);
            })
        })
        .catch(done)
}

/**
 *  API
 */
exports.replace = _.promise.denodeify(replace)
