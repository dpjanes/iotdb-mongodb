/*
 *  fs/exists.js
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
const errors = require("iotdb-errors")

const assert = require("assert")

const logger = require("../logger")(__filename)

/**
 */
const exists = _.promise((self, done) => {
    const mongodb = require("..")

    logger.trace({
        method: exists.method,
        path: self.path,
    }, "called")

    _.promise(self)
        .validate(exists)
        .then(mongodb.fs.parse_path)
        .make((sd, sdone) => {
            const grid = sd.mongodb.__grid

            const initd = {
                filename: sd.filename,
            }

            grid.findOne(initd, (error, stat) => {
                if (error) {
                    return sdone(error)
                }

                sd.exists = stat ? true : false

                sdone(null, sd)
            })
        })
        .end(done, self, "exists")
})

exists.method = "fs.exists"
exists.required = {
    path: _.is.String,
    mongodb: {
        __grid: _.is.Object,
    },
}
exists.accepts = {
}

/**
 *  API
 */
exports.exists = exists
