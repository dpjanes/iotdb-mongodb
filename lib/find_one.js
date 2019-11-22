/*
 *  lib/find_one.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-05
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

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const util = require("./util");

/**
 *  Requires: self.mongo_collection, self.query
 *  Accepts: self.find_one_in
 *  Produces: self.json
 */
const find_one = _.promise.make((self, done) => {
    const method = "find_one";

    assert.ok(self.mongo_collection, `${method}: expected self.mongo_collection`)
    assert.ok(_.is.JSON(self.query) || _.is.Nullish(self.query), `${method}: expected self.query to be a JSON-like object or Null`)

    const query = util.restore_ids(self.query || {});
    const find_one_in = self.find_one_in || exports.find_one.DEFAULT;

    self.mongo_collection.findOne(query, find_one_in, (error, mongo_result) => {
        if (error) {
            return done(util.intercept(self)(error))
        } 
        
        self.mongo_result = mongo_result;
        self.json = null;

        if (mongo_result) {
            self.json = util.safe_ids(mongo_result);
        }

        done(null, self)
    })
})

/**
 *  API
 */
exports.find_one = find_one;
exports.find_one.DEFAULT = {}
