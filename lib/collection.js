/*
 *  lib/collection.js
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
const collection = _.promise.make((self, done) => {
    _.promise.validate(self, collection)

    const mongodb = require("..")
    const collection_name = self.mongodb.__table_prefix + self.mongodb$collection_name

    self.mongodb.collection(collection_name, (error, mongodb$collection) => {
        if (error) {
            return done(mongodb.util.intercept(self)(error))
        }

        self.mongodb$collection = mongodb$collection

        // horrifying compatibility mode
        if (!self.mongodb$collection.findOneAndDelete) {
            self.mongodb$collection.findOneAndDelete = (query, params, callback) => {
                return self.mongodb$collection.findAndModify(
                    query, [], { remove: true }, callback
                )
            }
        }
        if (!self.mongodb$collection.findOneAndReplace) {
            self.mongodb$collection.findOneAndReplace = (query, json, params, callback) => {
                return self.mongodb$collection.findAndModify(
                    query, params.sort || [], json, { w: 1, upsert: true }, callback)
            }
        }
        if (!self.mongodb$collection.findOneAndUpdate) {
            self.mongodb$collection.findOneAndUpdate = (query, json, params, callback) => {
                return self.mongodb$collection.findAndModify(
                    query, params.sort || [], json, { w: 1, upsert: true }, callback)
            }
        }

        done(null, self)
    })
})

collection.method = "collection"
collection.requires = {
    mongodb: _.is.Object,
    mongodb$collection_name: _.is.String
}
collection.accepts = {
}
collection.produces = {
    mongodb$collection: _.is.Object,
}
collection.params = {
    mongodb$collection_name: _.p.normal,
}
collection.p = _.p(collection)

/**
 *  API
 */
exports.collection = collection
