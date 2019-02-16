/*
 *  universal/util.js
 *
 *  David Janes
 *  IOTDB
 *  2019-02-16
 *
 *  Copyright [2013-2019] David P. Janes
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
const scrub_underscore = _.promise(self => {
    _.promise.validate(self, scrub_underscore)

    self.json = _.d.clone(self.json)

    _.keys(self.json)
        .filter(key => key.startsWith("_"))
        .forEach(key => delete self.json[key]);
})

scrub_underscore.method = "universal.util.scrub_underscore"
scrub_underscore.description = `Remove underscores from JSON record`
scrub_underscore.requires = {
}
scrub_underscore.accepts = {
    json: _.is.Dictionary,
}
scrub_underscore.produces = {
    json: _.is.JSON,
}

/**
 *  API
 */
exports.util = {
    scrub_underscore: scrub_underscore,
}
