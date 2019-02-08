/**
 *  test/dynamodb/get.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-29
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

describe("dynamodb/get", function() {
    let self = {}

    before(function(done) {
        _.promise.make(self)
            .then(_util.initialize)
            .then(_util.load)
            .then(_.promise.make(sd => {
                self = sd;
            }))
            .then(_.promise.done(done))
            .catch(done)
    })

    describe("good", function() {
        it("exists", function(done) {
            _.promise.make(self)
                .then(_.promise.add("query", {
                    "year": 2014,
                    "title": "Rush",
                }))
                .then(mongodb.dynamodb.get)
                .then(_.promise.make(sd => {
                    assert.ok(sd.json)
                    assert.deepEqual(sd.json.year, 2014)
                    assert.deepEqual(sd.json.title, "Rush")
                }))
                .then(_.promise.done(done))
                .catch(done)
        })
        it("does not exists", function(done) {
            _.promise.make(self)
                .then(_.promise.add("query", {
                    "year": 2014,
                    "title": "Rush XXX",
                }))
                .then(mongodb.dynamodb.get)
                .then(_.promise.make(sd => {
                    assert.deepEqual(sd.json, null)
                }))
                .then(_.promise.done(done))
                .catch(done)
        })
    })
})
