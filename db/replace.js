/*
 *  db/replace.js
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
const errors = require("iotdb-errors")

/**
 *  Requires: self.json, self.table_schema
 *  Produces: N/A
 *
 *  Replace an existing entry. If it does not exist,
 *  a NotFound error is thrown.
 */
const replace = _.promise((self, done) => {
    const mongodb = require("..")

    _.promise.validate(self, replace)

    if (self.table_schema.keys.find(key => _.is.Undefined(self.json[key]))) {
        return done(new errors.Invalid(`expected these keys: ${self.table_schema.keys.join(",")}`))
    }

    const values = self.table_schema.keys.map(key => self.json[key] || null)
    const query = _.object(self.table_schema.keys, values)
    const sort = mongodb.util.build_sort(self.table_schema)

    let operation = "findOneAndReplace"
    let json = _.d.clone.deep(self.json)

    if (self.table_schema.partials) {
        json = mongodb.util.updated(json, json.$_original)
        operation = "findOneAndUpdate"
    }

    delete json.$_original

    _.promise(self)
        .then(mongodb.collection.p(self.table_schema.name))
        .make(sd => {
            sd.mongodb$collection[operation](query, json, {
                sort: sort,
                upsert: false,
                returnOriginal: true,
            }, (error, result) => {
                if (!result) {
                    const nerror = new errors.NotFound()
                    nerror.error = error
                    
                    return done(nerror)
                } else if (result._id) {
                } else if (!result.value) {
                    return done(new errors.NotFound())
                }

                self.mongodb$result = result

                done(null, self)
            })
        })
        .catch(done)
})

replace.method = "db.replace"
replace.requires = {
    mongodb: _.is.Object,
    json: _.is.JSON,
    table_schema: {
        name: _.is.String,
        keys: _.is.Array,
    },
}
replace.accepts = {
    table_schema: {
        partials: _.is.Boolean
    },
}
replace.produces = {
    mongodb$result: _.is.Object,
}

/**
 *  API
 */
exports.replace = replace
