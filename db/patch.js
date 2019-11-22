/*
 *  db/patch.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-08-16
 *
 *  Copyright (2013-2020) David P. Janes
 *
 *  Licensed under the Apache License, Version 2.0 (the "License")
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
 */
const patch = _.promise((self, done) => {
    const mongodb = require("..")

    _.promise.validate(self, patch)

    if (self.table_schema.keys.find(key => _.is.Undefined(self.json[key]))) {
        return done(new errors.Invalid())
    }

    const values = self.table_schema.keys.map(key => self.json[key] || null)
    const query = _.object(self.table_schema.keys, values)

    const json = {
        "$set": _.d.clone.deep(self.json),
    }

    _.promise(self)
        .then(mongodb.collection.p(self.table_schema.name))
        .make(sd => {
            sd.mongodb$collection.update(query, json, {
                upsert: false,
            }, (error, result) => {
                if (!result) {
                    const nerror = new errors.NotFound()
                    nerror.error = error
                    
                    return done(nerror)
                }

                done(null, self);
            })
        })
        .catch(done)
})

patch.method = "db.patch"
patch.requires = {
    mongodb: _.is.Object,
    json: _.is.JSON,
    table_schema: {
        name: _.is.String,
        keys: _.is.Array,
    },
}
patch.accepts = {
}
patch.produces = {
}

/**
 *  API
 */
exports.patch = patch
