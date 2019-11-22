/*
 *  lib/insert.js
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
 */
const insert = _.promise((self, done) => {
    _.promise.validate(self, insert)
    const method = "insert";

    assert.ok(self.mongodb$collection, `${method}: expected self.mongodb$collection`)
    assert.ok(_.is.JSON(self.json), `${method}: expected self.json to be a JSON-like object`)

    const json = util.restore_ids(self.json)
    const insert_in = self.insert_in || { w: 1 };

    self.mongodb$collection.insert(json, insert_in, (error, mongodb$result) => {
        if (error) {
            return done(util.intercept(self)(error))
        }

        self.mongo_id = null;
        if (json._id) {
            self.mongo_id = json._id.toString();
        }
        self.mongodb$result = util.safe_ids(mongodb$result);

        done(null, self)
    })

    if (!insert_in.w) {
        self.mongo_id = null;
        self.mongodb$result = null;

        done(null, self)
        done = _.noop;
    }
})

insert.method = "insert"
insert.requires = {
    mongodb$collection: _.is.Object,
    json: _.is.JSON,
}
insert.accepts = {
}
insert.produces = {
    mongodb$result: _.is.Object,
}
insert.params = {
    json: _.p.normal,
}
insert.p = _.p(insert)

/**
 *  API
 */
exports.insert = insert
