/*
 *  lib/Valid.js
 *
 *  David Janes
 *  IOTDB.org
 *  2019-10-22
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

/**
 *  Is a Valid MongoDB object
 */
const isValid = (v, _verbose) => {
    if (_.is.Array(v)) {
        for (let vi in v) {
            if (!isValid(v[vi], _verbose)) {
                return false;
            }
        }
        return true;
    } else if (_.is.Dictionary(v)) {
        const values = _.values(v);
        for (let vi in values) {
            if (!isValid(values[vi], _verbose)) {
                return false;
            }
        }
        return true;
    } else {
        if (_.is.Atomic(v)) {
            return true
        } else if (isBinary(v)) { 
            return true
        } else if (_.is.Buffer(v)) { // ¯\_(ツ)_/¯
            return true
        } else {
            if (_verbose) {
                console.log("_.is.JSON:", "JSON:", typeof v, v)
            }

            return false
        }
    }
}

/**
 *  API
 */
exports.valid = isValid
