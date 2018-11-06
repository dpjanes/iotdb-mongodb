/*
 *  fs/remove.js
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
const remove = _.promise((self, done) => {
    const mongodb = require("..")

    logger.trace({
        method: remove.method,
        path: self.path,
    }, "called")

    _.promise(self)
        .validate(remove)
        .then(mongodb.fs.parse_path)
        .make((sd, sdone) => {
            const grid = sd.mongodb.__grid

            grid.remove({
                filename: sd.filename,
            }, error => {
                sdone(null, sd)
            })
        })
        .end(done, self)
})

remove.method = "fs.remove"
remove.required = {
    path: _.is.String,
    mongodb: {
        __grid: _.is.Object,
    },
}
remove.accepts = {
}

/**
 *  API
 */
exports.remove = remove
