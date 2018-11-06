/*
 *  gridfs/exists.js
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
    logger.trace({
        method: exists.method,
        bucket: self.bucket,
        filename: self.filename,
    }, "called")

    _.promise(self)
        .validate(exists)
        .make((sd, sdone) => {
            const grid = self.mongodb.__grid
            grid.collection(self.bucket || "fs")

            const initd = {
                filename: self.filename,
                bucket: self.bucket || null,
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

exists.method = "gridfs.exists"
exists.required = {
    filename: _.is.String,
    mongodb: {
        __grid: _.is.Object,
    },
}
exists.accepts = {
    bucket: _.is.String, 
}

/**
 *  API
 */
exports.exists = exists
