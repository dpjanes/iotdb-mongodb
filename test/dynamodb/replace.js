/**
 *  test/dynamodb/replace.js
 *
 *  David Janes
 *  IOTDB
 *  2017-12-30
 *
 *  Copyright [2013-2018] [David P. Janes]
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

describe("dynamodb/replace", function() {
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

    /*
    describe("bad", function() {
        it("does not exists - expect 404", function(done) {
            _.promise.make(self)
                .then(_.promise.add("json", {
                    "year": 2014,
                    "title": "Rush XXX",
                }))
                .then(mongodb.dynamodb.replace)
                .then(_util.auto_fail(done))
                .catch(_util.ok_error(done, 404))
        })
        it("missing keys - expect 403", function(done) {
            _.promise.make(self)
                .then(_.promise.add("json", {
                    "year": 2014,
                }))
                .then(mongodb.dynamodb.replace)
                .then(_util.auto_fail(done))
                .catch(_util.ok_error(done, 403))
        })
    })
    */
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
                }))

                .then(_.promise.add("json", {
                    "year": 2014,
                    "title": "Rush",
                    "description": "Never going to give you up",
                }))
                .then(mongodb.dynamodb.replace)
                .then(_.promise.make(sd => {
                    assert.ok(sd.json)
                }))

                .then(_.promise.add("query", {
                    "year": 2014,
                    "title": "Rush",
                }))
                .then(mongodb.dynamodb.get)
                .then(_.promise.make(sd => {
                    assert.deepEqual(sd.json.description, "Never going to give you up")
                }))

                .then(_.promise.done(done))
                .catch(done)
        })
    })
})
