/*
 *  fs/put.js
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
const put = _.promise((self, done) => {
    const mongodb = require("..")

    logger.trace({
        method: put.method,
        path: self.path,
    }, "called")

    _.promise(self)
        .validate(put)
        .then(mongodb.fs.parse_path)
        .make((sd, sdone) => {
            const grid = sd.mongodb.__grid

            const initd = {
                filename: sd.filename,
                metadata: {
                    dirname: sd.dirname,
                },
            }

            if (sd.document_media_type) {
                initd.content_type = sd.document_media_type
            }

            let document = sd.document
            if (_.is.String(document)) {
                initd.metadata.document_encoding = sd.document_encoding || "utf8"

                document = Buffer.from(document, initd.metadata.document_encoding)
            } else if (sd.document_encoding) {
                initd.metadata.document_encoding = sd.document_encoding 
            }

            grid.remove({
                filename: sd.filename,
            }, () => {
                grid.writeFile(initd, document, (error, result) => {
                    if (error) {
                        return sdone(error)
                    }

                    sdone(null, sd)
                })
            })
        })
        .end(done, self)
})

put.method = "fs.put"
put.required = {
    path: _.is.String,
    document: [ _.is.String, _.is.Buffer ],
    mongodb: {
        __grid: _.is.Object,
    },
}
put.accepts = {
    document_media_type: _.is.String,
    document_encoding: _.is.String,
}

/**
 */
const put_json = _.promise((self, done) => {
    _.promise(self)
        .validate(put_json)
        .add({
            document: JSON.stringify(self.json),
            document_media_type: "application/json",
            document_encoding: "utf8",
        })
        .then(put)
        .end(done, self)
})

put_json.method = "fs.put.json"
put_json.required = {
    path: _.is.String,
    json: _.is.JSON,
    mongodb: {
        __grid: _.is.Object,
    },
}
put_json.accepts = {
}

/**
 *  API
 */
exports.put = put
exports.put.json = put_json
