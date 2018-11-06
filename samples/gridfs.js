/**
 *  samples/gridfs.js
 *
 *  David Janes
 *  IOTDB
 *  2018-11-05
 *
 *  Copyright [2013-2018] [David P. Janes]
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
const fs = require("fs")

const minimist = require("minimist")

const mongo = require("..")
const mongodbd = require("./mongodbd.json")

const ad = minimist(process.argv.slice(2))

const action = (name) => ad._.indexOf(name) > -1

const _on_error = error => {
    console.log("#", _.error.message(error))
    delete error.self
    console.log(error)

    process.nextTick(() => process.exit(1))
}

if (action("initialize")) {
    _.promise({
        mongodbd: mongodbd,
    })
        .then(mongo.initialize)
        .then(mongo.db.initialize)
        .then(mongo.gridfs.initialize)
        .then(mongo.close)
        .make(sd => console.log("+", "ok"))
        .catch(_on_error)
}

if (action("put")) {
    _.promise({
        mongodbd: mongodbd,
        filename: "movies.json",
        document: fs.readFileSync("data/movies.json"),
        document_media_type: "text/plain",
    })
        .then(mongo.initialize)
        .then(mongo.db.initialize)
        .then(mongo.gridfs.initialize)
        .then(mongo.gridfs.put)
        .then(mongo.close)
        .make(sd => console.log("+", "ok"))
        .catch(_on_error)
}

if (action("put.json")) {
    _.promise({
        mongodbd: mongodbd,
        filename: "movies.json",
        json: JSON.parse(fs.readFileSync("data/movies.json")),
    })
        .then(mongo.initialize)
        .then(mongo.db.initialize)
        .then(mongo.gridfs.initialize)
        .then(mongo.gridfs.put.json)
        .then(mongo.close)
        .make(sd => console.log("+", "ok"))
        .catch(_on_error)
}

if (action("get")) {
    _.promise({
        mongodbd: mongodbd,
        filename: "movies.json",
    })
        .then(mongo.initialize)
        .then(mongo.db.initialize)
        .then(mongo.gridfs.initialize)
        .then(mongo.gridfs.get)
        .then(mongo.close)
        .make(sd => {
            console.log("+", "ok")
            console.log("+", "document", _.is.String(sd.document) ? "string" : _.is.Buffer(sd.document) ? "buffer" : "unknown")
            console.log("+", "document_encoding", sd.document_encoding)
            console.log("+", "document_media_type", sd.document_media_type)
            console.log("+", "document_name", sd.document_name)
        })
        .catch(_on_error)
}

if (action("get.utf8")) {
    _.promise({
        mongodbd: mongodbd,
        filename: "movies.json",
    })
        .then(mongo.initialize)
        .then(mongo.db.initialize)
        .then(mongo.gridfs.initialize)
        .then(mongo.gridfs.get.utf8)
        .then(mongo.close)
        .make(sd => {
            console.log("+", "ok")
            console.log("+", "document", _.is.String(sd.document) ? "string" : _.is.Buffer(sd.document) ? "buffer" : "unknown")
            console.log("+", "document_encoding", sd.document_encoding)
            console.log("+", "document_media_type", sd.document_media_type)
            console.log("+", "document_name", sd.document_name)
        })
        .catch(_on_error)
}

if (action("get.json")) {
    _.promise({
        mongodbd: mongodbd,
        filename: "movies.json",
    })
        .then(mongo.initialize)
        .then(mongo.db.initialize)
        .then(mongo.gridfs.initialize)
        .then(mongo.gridfs.get.json)
        .then(mongo.close)
        .make(sd => {
            console.log("+", "ok")
            console.log("+", "json", _.is.JSON(sd.json) ? true : false)
            console.log("+", "document", _.is.String(sd.document) ? "string" : _.is.Buffer(sd.document) ? "buffer" : "unknown")
            console.log("+", "document_encoding", sd.document_encoding)
            console.log("+", "document_media_type", sd.document_media_type)
            console.log("+", "document_name", sd.document_name)
        })
        .catch(_on_error)
}

if (action("get.buffer")) {
    _.promise({
        mongodbd: mongodbd,
        filename: "movies.json",
    })
        .then(mongo.initialize)
        .then(mongo.db.initialize)
        .then(mongo.gridfs.initialize)
        .then(mongo.gridfs.get.buffer)
        .then(mongo.close)
        .make(sd => {
            console.log("+", "ok")
            console.log("+", "json", _.is.JSON(sd.json) ? true : false)
            console.log("+", "document", _.is.String(sd.document) ? "string" : _.is.Buffer(sd.document) ? "buffer" : "unknown")
            console.log("+", "document_encoding", sd.document_encoding)
            console.log("+", "document_media_type", sd.document_media_type)
            console.log("+", "document_name", sd.document_name)
        })
        .catch(_on_error)
}
