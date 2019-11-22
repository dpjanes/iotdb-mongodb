/*
 *  lib/drop.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-06
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

const util = require("./util");

/**
 */
const drop = _.promise((self, done) => {
    _.promise.validate(self, done)

    const query = util.restore_ids(self.query || {});

    self.mongodb$collection.drop(query, (error, mongodb$result) => {
        if (error && (error.name === 'MongoError') && (error.code === 26)) {
            error = null;
            mongodb$result = false;
        }

        if (error) {
            return done(util.intercept(self)(error))
        }

        self.mongodb$result = mongodb$result;

        done(null, self)
    })
})

drop.method = "drop"
drop.requires = {
    mongodb$collection: _.is.Object,
}
drop.accepts = {
    query: _.is.JSON,
}
drop.produces = {
    mongodb$result: _.is.Object,
}
drop.params = {
    query: _.p.normal,
}
drop.p = _.p(drop)

/**
 *  API
 */
exports.drop = drop
