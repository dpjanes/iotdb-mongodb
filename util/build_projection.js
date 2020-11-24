/*
 *  util/build_projection.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-11-24
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
 */
const build_projection = mongodb$projection => {
    if (_.is.Array(mongodb$projection)) {
        const projection = {}
        mongodb$projection.forEach(key => projection[key] = 1)
        return projection
    } else if (_.is.Dictionary(mongodb$projection)) {
        return _.d.clone(mongodb$projection)
    } else {
        return null
    }
}

/**
 *  API
 */
exports.build_projection = build_projection
