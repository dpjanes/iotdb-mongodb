/*
 *  db/pop.js
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

/**
 *  Find one and delete it. This isn't a real 
 *  DynamoDB function but we have it in our AWS code
 */
const pop = _.promise((self, done) => {
    const mongodb = require("..")

    _.promise.validate(self, pop)

    const values = self.table_schema.keys.map(key => self.query[key] || null)
    const query = _.object(self.table_schema.keys, values)

    _.promise(self)
        .then(mongodb.collection.p(self.table_schema.name))
        .make(sd => {
            sd.mongodb$collection.findOneAndDelete(query, {}, (error, result) => {
                if (error) {
                    return done(mongodb.util.intercept(self)(error))
                }

                if (result) {
                    self.json = mongodb.util.scrub_ids(result)
                } else {
                    self.json = null
                }

                done(null, self)
            })
            return null
        })
        .catch(done)
})

pop.method = "db.pop"
pop.requires = {
    mongodb: _.is.Object,
    table_schema: {
        name: _.is.String,
        keys: _.is.Array,
    },
}
pop.accepts = {
    query: _.is.JSON,
}
pop.produces = {
    json: _.is.JSON,
}

/**
 *  API
 */
exports.pop = pop
