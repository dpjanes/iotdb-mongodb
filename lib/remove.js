/*
 *  remove.js
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
const remove = (_self, done) => {
    const self = _.d.clone.shallow(_self)
    const method = "remove";

    assert.ok(self.mongo_collection, `${method}: expected self.mongo_collection`)
    assert.ok(_.is.Dictionary(self.query), `${method}: expected self.query to be a JSON-like object`)

    const query = util.restore_ids(self.query || {})
    const remove_in = self.remove_in || exports.remove.DEFAULT;

    self.mongo_collection.remove(query, remove_in, (error, mongo_result) => {
        if (error) {
            return done(error)
        }

        self.mongo_result = mongo_result.result;

        done(null, self)
    })

    if (!remove_in.w) {
        self.mongo_id = null;
        self.mongo_result = null;

        done(null, self)
        done = _.noop;
    }
}

/**
 *  API
 */
exports.remove = _.promise.denodeify(remove)

exports.remove.SINGLE = {
    single: true,
    w: 1,
}
exports.remove.MULTI = {
    single: false,
    w: 1,
}
exports.remove.DEFAULT = exports.remove.MULTI;

exports.remove.FAST_SINGLE = {
    single: true,
}
exports.remove.FAST_MULTI = {
    single: false,
}
exports.remove.FAST = {
    single: false,
}
