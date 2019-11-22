/*
 *  db/put.js
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

const util = require("../lib/util")
const Binary = require("mongodb").Binary

/**
 */
const _put = document => _.promise((self, done) => {
    const mongodb = require("..")

    if (self.table_schema.keys.find(key => _.is.Undefined(self.json[key]))) {
        return done(new errors.Invalid(`missing keys: ${self.table_schema.keys}`))
    }

    const values = self.table_schema.keys.map(key => self.json[key] || null)
    const query = _.object(self.table_schema.keys, values)
    const sort = self.table_schema.keys.map(key => [ key, 1 ])

    const json = _.d.clone(self.json)
    if (document) {
        json.document = document
    }

    _.promise(self)
        .then(mongodb.collection.p(self.table_schema.name))
        .make(sd => {
            sd.mongodb$collection.findOneAndReplace(query, json, {
                sort: sort,
                upsert: true,
                returnOriginal: false,
            }, (error, doc) => {
                if (error) {
                    return done(util.intercept(self)(error))
                }

                done(null, self)
            })
        })
        .catch(done)
})

_put.method = "db.put"
_put.requires = {
    mongodb: _.is.Object,
    table_schema: {
        name: _.is.String,
        keys: _.is.Array,
    },
    json: _.is.JSON,
}
_put.accepts = {
    query: _.is.JSON,
}
_put.produces = {
}

/**
 *  BLOB handling
 */
const put_document = _.promise((self, done) => {
    _.promise(self)
        .then(_put(Binary(self.document)))
        .end(done, self)
})

put_document.method = "db.put.document"
put_document.requires = {
    mongodb: _.is.Object,
    table_schema: {
        name: _.is.String,
        keys: _.is.Array,
    },
    json: _.is.JSON,
    document: _.is.Buffer,
}
put_document.produces = {
}

/**
 *  API
 */
exports.put = _put(null)
exports.put.document = put_document
