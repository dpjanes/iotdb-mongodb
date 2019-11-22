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

"use strict"

const _ = require("iotdb-helpers")

const util = require("./util")

/**
 */
const insert = _.promise((self, done) => {
    _.promise.validate(self, insert)

    const json = util.restore_ids(self.json)
    const options = Object.assign({}, self.mongodb$options || { w: 1 })

    self.mongodb$collection.insert(json, options, (error, mongodb$result) => {
        if (!done) {
            return
        }

        if (error) {
            return done(util.intercept(self)(error))
        }

        self.mongodb$result = util.safe_ids(mongodb$result)
        self.mongodb$id = null
        if (json._id) {
            self.mongodb$id = json._id.toString()
        }

        done(null, self)
    })

    if (!options.w) {
        self.mongodb$id = null
        self.mongodb$result = null

        done(null, self)
        done = null
    }
})

insert.method = "insert"
insert.requires = {
    mongodb$collection: _.is.Object,
    json: _.is.JSON,
}
insert.accepts = {
    mongodb$options: _.is.Dictionary,
}
insert.produces = {
    mongodb$result: _.is.Object,
    mongodb$is: _.is.String,
}
insert.params = {
    json: _.p.normal,
    mongodb$options: _.is.Dictionary,
}
insert.p = _.p(insert)

/**
 *  API
 */
exports.insert = insert
