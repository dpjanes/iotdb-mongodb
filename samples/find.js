/*
 *  index.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-05
 *
 *  Copyright [2013-2018] [David P. Janes]
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
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

"use strict";
const mongo = require("..")
const _ = require("iotdb-helpers");

const assert = require("assert");

const Q = require("bluebird-q");
const mongodb = require('mongodb');

Q({
    mongodbd: require("./mongodbd.json"),
    table_name: "test1",
})
    .then(mongo.initialize)
    .then(mongo.collection)

    .then(sd => _.d.update(sd, {
        query: {
            "_id": "5986339d58ff5819e0a8baa8",
            // "a": "c",
        }
    }))
    .then(mongo.find)
    .then(sd => {
        console.log("+", "jsons", sd.jsons)
        console.log("+", "json", sd.json)

        process.exit()
    })
    .catch(error => {
        console.log("#", error)
    })