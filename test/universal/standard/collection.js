/**
 *  test/universal/standard/collection.js
 *
 *  David Janes
 *  IOTDB
 *  2019-02-09
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

const assert = require("assert")

const _util = require("../../_util")

const db = require("./_db")

describe("universal/collection", function() {
    let self = {}

    before(function(done) {
        _.promise(self)
            .then(_util.initialize)
            .then(_util.load)
            .make(sd => {
                self = sd;
            })
            .end(done, {})
    })

    it("works", function(done) {
        _.promise(self)
            .make(sd => {
                assert.ok(!sd.mongodb$collection)
            })
            .then(db.movie.collection)
            .make(sd => {
                assert.ok(sd.mongodb$collection)
            })
            .end(done, {})
    })
})
