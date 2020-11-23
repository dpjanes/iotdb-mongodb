/*
 *  lib/remove.js
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

/**
 */
const _remove = _default => _.promise((self, done) => {
    _.promise.validate(self, remove)

    const mongodb = require("..")
    const query = mongodb.util.restore_ids(self.query || {})
    const options = Object.assign({}, self.mongodb$options || _remove)

    self.mongodb$collection.remove(query, options, (error, mongodb$result) => {
        if (!done) {
            return
        }

        if (error) {
            return done(mongodb.util.intercept(self)(error))
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

const remove = _remove({
    single: false,
    w: 1,
})
remove.method = "remove"
remove.requires = {
    mongodb$collection: _.is.Object,
}
remove.accepts = {
    mongodb$options: _.is.Dictionary,
}
remove.produces = {
    mongodb$result: _.is.Object,
}
remove.params = {
    query: _.p.normal,
    mongodb$options: _.is.Dictionary,
}
remove.p = _.p(remove)

/**
 */
const remove_one = _remove(remove.SINGLE)
remove_one.method = "remove.one"
remove_one.requires = {
    mongodb$collection: _.is.Object,
    query: _.is.Dictionary,
}
remove_one.accepts = {
    mongodb$options: _.is.Dictionary,
}
remove_one.produces = {
    mongodb$result: _.is.Object,
}
remove_one.params = {
    query: _.p.normal,
    mongodb$options: _.is.Dictionary,
}
remove_one.p = _.p(remove_one)

/**
 *  API
 */
exports.remove = remove
exports.remove.one = remove_one

exports.remove.SINGLE = {
    single: true,
    w: 1,
}
exports.remove.MULTI = {
    single: false,
    w: 1,
}
exports.remove.DEFAULT = exports.remove.MULTI

exports.remove.FAST_SINGLE = {
    single: true,
}
exports.remove.FAST_MULTI = {
    single: false,
}
exports.remove.FAST = {
    single: false,
}
