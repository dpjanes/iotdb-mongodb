/*
 *  fs/list.js
 *
 *  David Janes
 *  IOTDB.org
 *  2018-11-06
 *
 *  Copyright [2013-2019] [David P. Janes]
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

const assert = require("assert")

const logger = require("../logger")(__filename)

/**
 */
const _list_folder = _.promise((self, done) => {
    const mongodb = require("..")

    if (self.filename !== self.dirname) {
        return done(null, self)
    }

    _.promise(self)
        .add({
            table_name: `${self.bucket}.files`,
            query: {
                "metadata.dirname": self.dirname,
            },
            projection: [ "filename" ],
        })
        .then(mongodb.collection)
        .then(mongodb.find)
        .add("paths", sd => sd.jsons.map(json => json.filename))
        .end(done, self, "paths")
})

/**
 */
const _list_file = _.promise((self, done) => {
    const mongodb = require("..")

    if (self.filename === self.dirname) {
        return done(null, self)
    }

    _.promise(self)
        .then(mongodb.fs.exists)
        .make(sd => {

            if (sd.exists) {
                sd.paths.push(sd.path)
            }
        })
        .end(done, self)
})

/**
 */
const list = _.promise((self, done) => {
    const mongodb = require("..")

    logger.trace({
        method: list.method,
        path: self.path,
    }, "called")

    _.promise(self)
        .validate(list)
        .add("paths", [])
        .then(mongodb.fs.parse_path)
        .then(_list_folder)
        .then(_list_file)
        .end(done, self, "paths")
})

list.method = "fs.list"
list.required = {
    path: _.is.String,
    mongodb: _.is.Object,
}
list.accepts = {
}

/**
 *  API
 */
exports.list = list
