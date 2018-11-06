/*
 *  gridfs/initialize.js
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
const initialize = _.promise((self, done) => {
    const gridfs = require("gridfs")

    // https://github.com/aheckmann/gridfs-stream/issues/125#issuecomment-376446255
    const Grid = require("gridfs-stream");
    eval(`Grid.prototype.findOne = ${Grid.prototype.findOne.toString().replace('nextObject', 'next')}`);

    logger.trace({
        method: initialize.method,
    }, "called")

    _.promise(self)
        .validate(initialize)
        .make(sd => {
            sd.mongodb.__grid = gridfs(self.mongodb, self.mongodb.__engine)
        })
        .end(done, self)
})

initialize.method = "gridfs.initialize"
initialize.required = {
    mongodb: _.is.Object,
}

/**
 *  API
 */
exports.initialize = initialize
