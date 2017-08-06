/*
 *  all.js
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
const all = (_self, done) => {
    const self = _.d.clone.shallow(_self)
    const method = "all";

    assert.ok(self.mongodbd, `${method}: expected self.mongodbd`)
    assert.ok(self.mongodbd.schema, `${method}: expected self.mongodbd.schema`)
    assert.ok(self.mongo_db, `${method}: expected self.mongo_db`)
    assert.ok(self.table_name, `${method}: expected self.table_name`)

    const table_schema = self.mongodbd.schema[self.table_name]
    assert.ok(table_schema, `${method}: expected table_schema for ${self.table_name}`)
    assert.ok(table_schema.keys, `${method}: expected table_schema.keys for ${self.table_name}`)

    const sort = table_schema.keys.map(key => [ key, 1 ])
    const options = {}

    if (self.pager) {
        options.skip = _.coerce.to.Integer(self.pager, 0)
    }
    if (self.query_limit) {
        options.limit = self.query_limit;
    }

    Q(self)
        .then(mongo.collection)
        .then(sd => {
            sd.mongo_collection.find({}, options).sort(sort).toArray((error, mongo_result) => {
                if (error) {
                    return done(error)
                }

                self.jsons = util.safe_ids(mongo_result);
                self.json = self.jsons.length ? self.jsons[0] : null;

                if (options.limit) {
                    self.pager = `${Math.min(options.limit, self.jsons.length) + (options.skip || 0)}`;
                    if (self.jsons.length < options.limit) {
                        self.pager = null;
                    }
                } else if (self.jsons.length === 0) {
                    self.pager = null;
                }

                self.mongo_result = mongo_result;

                done(null, self)
            })
        })
        .catch(done)
}

/**
 *  API
 */
exports.all = Q.denodeify(all)
