/**
 *  test/db/swapout.js
 *
 *  David Janes
 *  IOTDB
 *  2017-12-30
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

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const mongodb = require("../..")
const _util = require("./../_util")

describe("db/swapout", function() {
    let self = {}

    describe("good", function() {
        it("exists", function(done) {
            _.promise(self)
                .then(mongodb.db.swapout)
                .make(sd => {
                    const aws = require("iotdb-awslib")
                    assert.strictEqual(aws.dynamodb, mongodb.db)
                })
                .end(done, {})
        })
    })
})
