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

"use strict"

const _ = require("iotdb-helpers")

/**
 */
const find_one = _.promise.make((self, done) => {
    _.promise.validate(self, find_one)

    const mongodb = require("..")
    const query = mongodb.util.restore_ids(self.query || {})
    const options = Object.assign({}, self.mongodb$options || exports.find_one.DEFAULT)

    if (self.projection) {
        if (_.is.Array(self.projection)) {
            options.projection = {}
            self.projection.forEach(key => options.projection[key] = 1)
        } else {
            options.projection = _.d.clone(self.projection)
        }
    }

    self.mongodb$collection.findOne(query, options, (error, mongodb$result) => {
        if (error) {
            return done(mongodb.util.intercept(self)(error))
        } 
        
        self.mongodb$result = mongodb$result
        self.json = null

        if (mongodb$result) {
            self.json = mongodb.util.safe_ids(mongodb$result)
        }

        done(null, self)
    })
})

find_one.method = "find.one"
find_one.requires = {
    mongodb$collection: _.is.Object,
}
find_one.accepts = {
    query: _.is.JSON,
    mongodb$options: _.is.Dictionary,
    projection: [ _.is.Array, _.is.Dictionary, ],
}
find_one.produces = {
    json: _.is.JSON,
    mongodb$result: _.is.Object,
}
find_one.params = {
    query: _.p.normal,
    mongodb$options: _.p.normal,
}
find_one.p = _.p(find_one)

/**
 *  API
 */
exports.find_one = find_one
exports.find_one.DEFAULT = {}
