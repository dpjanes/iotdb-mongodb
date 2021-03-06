/*
 *  lib/util.js
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

const mongodb = require("mongodb")
const is = require("../is")

/**
 *  Change "_id" that are Objects to Strings
 */
const safe_ids = o => {
    if (_.is.Array(o)) {
        return o.map(safe_ids)
    } else if (is.Binary(o)) {
        return o
    } else if (_.is.Object(o)) {
        return _.mapObject(o, (value, key) => {
            if ((key === "_id") && value.toString) {
                return value.toString()
            } else {
                return safe_ids(value)
            }
        })
    } else {
        return o
    }
}

/**
 *  API
 */
exports.safe_ids = safe_ids
