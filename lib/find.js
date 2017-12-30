/*
 *  find.js
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

const util = require("./util");

/**
 */
const find = (_self, done) => {
    const self = _.d.clone.shallow(_self)
    const method = "find";

    assert.ok(self.mongo_collection, `${method}: expected self.mongo_collection`)
    assert.ok(_.is.JSON(self.query) || _.is.Nullish(self.query), `${method}: expected self.query to be a JSON-like object or Null`)

    const query = util.restore_ids(self.query || {});
    const find_in = self.find_in || exports.find.DEFAULT;

    self.mongo_collection.find(query, find_in).toArray((error, mongo_result) => {
        if (error) {
            return done(error)
        }

        self.jsons = util.safe_ids(mongo_result);
        self.json = self.jsons.length ? self.jsons[0] : null;

        self.mongo_result = mongo_result;

        done(null, self)
    })
}

/**
 *  API
 */
exports.find = _.promise.denodeify(find)

exports.find.DEFAULT = {}
