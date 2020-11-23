/*
 *  lib/update.js
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
const is = require("../is")

/**
 */
const update = _.promise((self, done) => {
    _.promise.validate(self, update)

    const query = util.restore_ids(self.query)
    const record = util.restore_ids(self.json)
    const options = Object.assign({}, self.mongodb$options || exports.update.DEFAULT)

    self.mongodb$collection.update(query, record, options, (error, mongodb$result) => {
        if (!done) {
            return
        }

        if (error) {
            return done(util.intercept(self)(error))
        }

        self.mongodb$result = mongodb$result.result

        done(null, self)
    })

    if (!options.w) {
        self.mongodb$result = null

        done(null, self)
        done = null
    }
})

update.method = "update"
update.requires = {
    mongodb$collection: _.is.Object,
    query: _.is.JSON,
    json: _.is.mongodb.valid,
}
update.accepts = {
    mongodb$options: _.is.Dictionary,
}
update.produces = {
    mongodb$result: _.is.Object,
}

/**
 */
const update_upsert = _.promise((self, done) => {
    _.promise(self)
        .add("mongodb$options", exports.update.UPSERT)
        .then(update)
        .end(done, self, "mongodb$result")
})

/**
 *  API
 */
exports.update = update
exports.update.upsert = update_upsert
exports.upsert = update_upsert

/**
 *  Handy flags
 */
exports.update.MULTI = {
    multi: true,
    w: 1,
}
exports.update.SINGLE = {
    multi: false,
    w: 1,
}
exports.update.UPSERT = {
    upsert: true,
    w: 1,
}
exports.update.DEFAULT = exports.update.SINGLE

exports.update.FAST_MULTI = {
    multi: true,
}
exports.update.FAST_SINGLE = {
    multi: false,
}
exports.update.FAST_UPSERT = {
    upsert: true,
}
exports.update.FAST = {
}
