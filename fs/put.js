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
    logger.trace({
        method: put.method,
        bucket: self.bucket,
        filename: self.filename,
    }, "called")

    _.promise(self)
        .validate(put)
        .make((sd, sdone) => {
            const grid = self.mongodb.__grid

            const initd = {
                filename: self.filename,
                bucket: self.bucket || null,
                metadata: {},
            }

            if (self.document_media_type) {
                initd.content_type = self.document_media_type
            }

            let document = self.document
            if (_.is.String(document)) {
                initd.metadata.document_encoding = self.document_encoding || "utf8"

                document = Buffer.from(document, initd.metadata.document_encoding)
            } else if (self.document_encoding) {
                initd.metadata.document_encoding = self.document_encoding 
            }

            grid.remove({
                filename: self.filename,
                bucket: self.bucket || null,
            }, () => {
                grid.writeFile(initd, document, (error, result) => {
                    if (error) {
                        return sdone(error)
                    }

                    sdone(null, self)
                })
            })
        })
        .end(done, self)
})

put.method = "fs.put"
put.required = {
    filename: _.is.String,
    document: [ _.is.String, _.is.Buffer ],
    mongodb: {
        __grid: _.is.Object,
    },
}
put.accepts = {
    bucket: _.is.String, 
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
    filename: _.is.String,
    json: _.is.JSON,
    mongodb: {
        __grid: _.is.Object,
    },
}
put_json.accepts = {
    bucket: _.is.String, 
}

/**
 *  API
 */
exports.put = put
exports.put.json = put_json
