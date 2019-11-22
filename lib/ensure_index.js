/*
 *  lib/ensure_index.js
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

"use strict"

const _ = require("iotdb-helpers")

const util = require("./util")

/**
 *  indexes should be { key1: 1, key2: -1, }, where 1 /-1
 *  indicates sort direction
 */
const ensure_index = _.promise((self, done) => {
    _.promise.validate(self, ensure_index)

    const initd = {}
    if (self.index_name) {
        initd.name = self.index_name
    }

    self.mongodb$collection.ensureIndex(self.indexes, initd, (error, mongodb$result) => {
        if (error) {
            return done(util.intercept(self)(error))
        }

        self.mongodb$result = mongodb$result;

        done(null, self)
    })
})

ensure_index.method = "ensure_index"
ensure_index.requires = {
    mongodb$collection: _.is.Object,
    indexes: _.is.Dictionary,
}
ensure_index.accepts = {
    index_name: _.is.String,
}
ensure_index.produces = {
    mongodb$result: _.is.Object,
}

/**
 *  API
 */
exports.ensure_index = _.promise.denodeify(ensure_index)
