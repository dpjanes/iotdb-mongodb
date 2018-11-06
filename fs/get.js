/*
 *  gridfs/get.js
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
const get = _.promise((self, done) => {
    logger.trace({
        method: get.method,
        bucket: self.bucket,
        filename: self.filename,
    }, "called")

    _.promise(self)
        .validate(get)
        .make((sd, sdone) => {
            const grid = self.mongodb.__grid

            const initd = {
                filename: self.filename,
                bucket: self.bucket || null,
            }

            grid.findOne(initd, (error, stat) => {
                if (stat === null) {
                    return sdone(new errors.NotFound())
                }

                if (error) {
                    return sdone(error)
                }

                grid.readFile(initd, (error, result) => {
                    if (error) {
                        return sdone(error)
                    }

                    self.document = result
                    self.document_name = self.filename
                    self.document_media_type = stat.contentType

                    if (self.document_encoding === "binary") {
                        self.document_encoding = null
                    } else if (self.document_encoding) {
                        self.document = result.toString(self.document_encoding)
                    } else if (stat.metadata.document_encoding === "binary") {
                        self.document_encoding = null
                    } else if (stat.metadata.document_encoding) {
                        self.document_encoding = stat.metadata.document_encoding
                        self.document = result.toString(self.document_encoding)
                    } else {
                        self.document_encoding = null
                    }

                    sdone(null, self)
                })
            })
        })
        .end(done, self, "document,document_encoding,document_media_type,document_name")
})

get.method = "gridfs.get"
get.required = {
    filename: _.is.String,
    mongodb: _.is.Object,
}
get.accepts = {
    bucket: _.is.String, 
    document_encoding: _.is.String, 
}

/**
 */
const get_json = _.promise((self, done) => {
    _.promise(self)
        .validate(get_json)
        .add({
            document_encoding: "utf8",
        })
        .then(get)
        .make(sd => {
            sd.json = JSON.parse(sd.document)
        })
        .end(done, self, "json")
})

get_json.method = "gridfs.get.json"
get_json.required = {
    filename: _.is.String,
    mongodb: {
        __grid: _.is.Object,
    },
}
get_json.accepts = {
    bucket: _.is.String, 
}

/**
 */
const get_buffer = _.promise((self, done) => {
    _.promise(self)
        .validate(get_buffer)
        .add({
            document_encoding: "binary",
        })
        .then(get)
        .end(done, self, "document,document_encoding,document_media_type,document_name")
})

get_buffer.method = "gridfs.get.json"
get_buffer.required = {
    filename: _.is.String,
    mongodb: {
        __grid: _.is.Object,
    },
}
get_buffer.accepts = {
    bucket: _.is.String, 
}

/**
 */
const get_utf8 = _.promise((self, done) => {
    _.promise(self)
        .validate(get_utf8)
        .add({
            document_encoding: "utf8",
        })
        .then(get)
        .end(done, self, "document,document_encoding,document_media_type,document_name")
})

get_utf8.method = "gridfs.get.json"
get_utf8.required = {
    filename: _.is.String,
    mongodb: {
        __grid: _.is.Object,
    },
}
get_utf8.accepts = {
    bucket: _.is.String, 
}

/**
 *  API
 */
exports.get = get
exports.get.json = get_json
exports.get.utf8 = get_utf8
exports.get.buffer = get_buffer
