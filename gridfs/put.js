/*
 *  gridfs/put.js
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
    const gridfs = require("gridfs")

    logger.trace({
        method: put.method,
        bucket: self.bucket,
        filename: self.filename,
    }, "called")

    _.promise(self)
        .validate(put)
        .make((sd, sdone) => {
            let document = self.document
            if (_.is.String(document)) {
                document = Buffer.from(document, self.document_encoding || "utf8")
            }

            const initd = {
                filename: self.filename,
                metadata: {},
            }

            if (self.bucket) {
                initd.bucket = self.bucket
            }

            if (self.document_media_type) {
                initd.metadata.document_media_type = self.document_media_type
            }

            gridfs.writeFile(initd, document, (error, result) => {
                if (error) {
                    return sdone(error)
                }

                sdone(null, self)
            })
        })
        .end(done, self)
})

put.method = "gridfs.put"
put.required = {
    filename: _.is.String,
    mongodb: _.is.Object,
    document: [ _.is.String, _.is.Buffer ],
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
        .validate(put)
        .add({
            document: JSON.stringify(self.json),
            document_media_type: "application/json",
            document_encoding: "utf8",
        })
        .end(done, self)
})

put_json.method = "gridfs.put.json"
put_json.required = {
    filename: _.is.String,
    json: _.is.JSON,
    mongodb: _.is.Object,
}
put_json.accepts = {
    bucket: _.is.String, 
}

/**
 *  API
 */
exports.put = put
exports.put.json = put_json
