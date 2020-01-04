/**
 *  samples/fs.js
 *
 *  David Janes
 *  IOTDB
 *  2018-11-05
 *
 *  Copyright (2013-2020) David P. Janes
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

const fs = require("fs")

const minimist = require("minimist")

const mongodb = require("..")
const mongodb$cfg = require("./mongodb$cfg.json")

const ad = minimist(process.argv.slice(2))

const command = ad._[0]
const filename = ad._[1]
const action = (name) => name === command
const bucket = ad.bucket || null

const _on_error = error => {
    console.log("#", _.error.message(error))
    delete error.self
    console.log(error)

    process.nextTick(() => process.exit(1))
}

if (action("initialize")) {
    _.promise({
        mongodb$cfg: mongodb$cfg,
    })
        .then(mongodb.initialize)
        .then(mongodb.db.initialize)
        .then(mongodb.fs.initialize)
        .then(mongodb.close)
        .make(sd => console.log("+", "ok"))
        .catch(_on_error)
}

if (action("put")) {
    _.promise({
        mongodb$cfg: mongodb$cfg,
        path: filename || "gridfs:/movies.json",
        document: fs.readFileSync("data/movies.json"),
        document_media_type: "text/plain",
        bucket: bucket,
    })
        .then(mongodb.initialize)
        .then(mongodb.db.initialize)
        .then(mongodb.fs.initialize)
        .then(mongodb.fs.put)
        .then(mongodb.close)
        .make(sd => console.log("+", "ok"))
        .catch(_on_error)
}

if (action("put.json")) {
    _.promise({
        mongodb$cfg: mongodb$cfg,
        path: filename || "gridfs:/movies.json",
        json: JSON.parse(fs.readFileSync("data/movies.json")),
        bucket: bucket,
    })
        .then(mongodb.initialize)
        .then(mongodb.db.initialize)
        .then(mongodb.fs.initialize)
        .then(mongodb.fs.put.json)
        .then(mongodb.close)
        .make(sd => console.log("+", "ok"))
        .catch(_on_error)
}

if (action("get")) {
    _.promise({
        mongodb$cfg: mongodb$cfg,
        path: filename || "gridfs:/movies.json",
        bucket: bucket,
    })
        .then(mongodb.initialize)
        .then(mongodb.db.initialize)
        .then(mongodb.fs.initialize)
        .then(mongodb.fs.get)
        .then(mongodb.close)
        .make(sd => {
            console.log("+", "document", _.is.String(sd.document) ? "string" : _.is.Buffer(sd.document) ? "buffer" : "unknown")
            console.log("+", "document_encoding", sd.document_encoding)
            console.log("+", "document_media_type", sd.document_media_type)
            console.log("+", "document_name", sd.document_name)
            console.log("+", "ok")
        })
        .catch(_on_error)
}

if (action("get.utf8")) {
    _.promise({
        mongodb$cfg: mongodb$cfg,
        path: filename || "gridfs:/movies.json",
        bucket: bucket,
    })
        .then(mongodb.initialize)
        .then(mongodb.db.initialize)
        .then(mongodb.fs.initialize)
        .then(mongodb.fs.get.utf8)
        .then(mongodb.close)
        .make(sd => {
            console.log("+", "document", _.is.String(sd.document) ? "string" : _.is.Buffer(sd.document) ? "buffer" : "unknown")
            console.log("+", "document_encoding", sd.document_encoding)
            console.log("+", "document_media_type", sd.document_media_type)
            console.log("+", "document_name", sd.document_name)
            console.log("+", "ok")
        })
        .catch(_on_error)
}

if (action("get.json")) {
    _.promise({
        mongodb$cfg: mongodb$cfg,
        path: filename || "gridfs:/movies.json",
        bucket: bucket,
    })
        .then(mongodb.initialize)
        .then(mongodb.db.initialize)
        .then(mongodb.fs.initialize)
        .then(mongodb.fs.get.json)
        .then(mongodb.close)
        .make(sd => {
            console.log("+", "json", _.is.JSON(sd.json) ? true : false)
            console.log("+", "document", _.is.String(sd.document) ? "string" : _.is.Buffer(sd.document) ? "buffer" : "unknown")
            console.log("+", "document_encoding", sd.document_encoding)
            console.log("+", "document_media_type", sd.document_media_type)
            console.log("+", "document_name", sd.document_name)
            console.log("+", "ok")
        })
        .catch(_on_error)
}

if (action("get.buffer")) {
    _.promise({
        mongodb$cfg: mongodb$cfg,
        path: filename || "gridfs:/movies.json",
        bucket: bucket,
    })
        .then(mongodb.initialize)
        .then(mongodb.db.initialize)
        .then(mongodb.fs.initialize)
        .then(mongodb.fs.get.buffer)
        .then(mongodb.close)
        .make(sd => {
            console.log("+", "json", _.is.JSON(sd.json) ? true : false)
            console.log("+", "document", _.is.String(sd.document) ? "string" : _.is.Buffer(sd.document) ? "buffer" : "unknown")
            console.log("+", "document_encoding", sd.document_encoding)
            console.log("+", "document_media_type", sd.document_media_type)
            console.log("+", "document_name", sd.document_name)
            console.log("+", "ok")
        })
        .catch(_on_error)
}

if (action("exists")) {
    _.promise({
        mongodb$cfg: mongodb$cfg,
        path: filename || "gridfs:/movies.json",
        bucket: bucket,
    })
        .then(mongodb.initialize)
        .then(mongodb.db.initialize)
        .then(mongodb.fs.initialize)
        .then(mongodb.fs.exists)
        .then(mongodb.close)
        .make(sd => {
            console.log("+", "exists", sd.exists)
            console.log("+", "ok")
        })
        .catch(_on_error)
}

if (action("remove")) {
    _.promise({
        mongodb$cfg: mongodb$cfg,
        path: filename || "gridfs:/movies.json",
        bucket: bucket,
    })
        .then(mongodb.initialize)
        .then(mongodb.db.initialize)
        .then(mongodb.fs.initialize)
        .then(mongodb.fs.remove)
        .then(mongodb.close)
        .make(sd => {
            console.log("+", "ok")
        })
        .catch(_on_error)
}

if (action("list")) {
    _.promise({
        mongodb$cfg: mongodb$cfg,
        path: filename || "gridfs:/movies.json",
    })
        .then(mongodb.initialize)
        .then(mongodb.db.initialize)
        .then(mongodb.fs.initialize)
        .then(mongodb.fs.list)
        .then(mongodb.close)
        .make(sd => {
            sd.paths.forEach(path => {
                console.log("+", path)
            })
            console.log("+", "ok")
        })
        .catch(_on_error)
}
