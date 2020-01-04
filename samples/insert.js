/*
 *  samples/insert.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-05
 *
 *  Copyright (2013-2020) David P. Janes
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

"use strict"

const mongodb = require("..")
const _ = require("iotdb-helpers")

_.promise({
    mongodb$cfg: require("./mongodb$cfg.json"),
    mongodb$collection_name: "test1",
})
    .then(mongodb.initialize)
    .then(mongodb.collection)

    .add("json", {
        "a": "b"
    })
    .then(mongodb.insert)
    .then(mongodb.insert)
    .then(sd => {
        console.log("+", "mongo_id", sd.mongo_id)
        console.log("+", "mongodb$result", sd.mongodb$result)
        console.log("+", "mongodb$result", _.is.JSON(sd.mongodb$result))
    })
    .then(mongodb.close)
    .catch(_.error.log)
