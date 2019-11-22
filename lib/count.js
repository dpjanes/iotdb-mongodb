/*
 *  lib/count.js
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

"use strict"

const _ = require("iotdb-helpers")

const util = require("./util")

/**
 */
const count = _.promise((self, done) => {
    _.promise.validate(self, count)

    const query = util.restore_ids(self.query || {})

    self.mongodb$collection.count(query, (error, count) => {
        if (error) {
            return done(util.intercept(self)(error))
        }

        self.count = count

        done(null, self)
    })
})

count.method = "count"
count.requires = {
    mongodb$collection: _.is.Object,
}
count.accepts = {
    query: _.is.JSON,
}
count.produces = {
    count: _.is.Integer,
}
count.params = {
    query: _.p.normal,
}
count.p = _.p(count)

/**
 *  API
 */
exports.count = count
