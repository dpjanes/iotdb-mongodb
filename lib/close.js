/*
 *  lib/close.js
 *
 *  David Janes
 *  IOTDB.org
 *  2018-03-04
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
const close = _.promise((self, done) => {
    _.promise.validate(self, close)

    // allow to be safely called even if nothing got initialized
    if (!self.mongodb) {
        return done(null, self)
    }

    if (!self.mongodb.__client) {
        return done(null, self)
    }

    self.mongodb.__client.close(() => {
        done(null, self)
    })
})

close.method = "close"
close.description = `
    Close database.

    Can be called multiple times, etc..
    It will never report an error`
close.requires = {
}
close.produces = {
}

/**
 *  API
 */
exports.close = close
