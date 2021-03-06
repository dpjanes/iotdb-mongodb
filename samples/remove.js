/*
 *  samples/remove.js
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

const _ = require("iotdb-helpers")
const mongodb = require("..")

_.promise({
    mongodb$cfg: require("./mongodb$cfg.json"),
    mongodb$collection_name: "test1",
})
    .then(mongodb.initialize)
    .then(mongodb.collection)

    .then(sd => _.d.update(sd, {
        json: {
            "hello": "world",
        },
    }))
    .then(mongodb.insert)

    .add({
        query: {
            id: sd.mongo_id,
        },
    })
    .then(mongodb.remove)

    .then(sd => {
        console.log("+", "mongodb$result", sd.mongodb$result)
    })
    .then(mongodb.close)
    .catch(_.error.log)
