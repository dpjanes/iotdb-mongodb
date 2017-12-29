/**
 *  test/dynamodb/all.js
 *
 *  David Janes
 *  IOTDB
 *  2017-01-29
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

describe("dynamodb/all", function() {
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
        it("default index (+title, +year)", function(done) {
            _.promise.make(self)
                .then(mongodb.dynamodb.all)
                .then(_.promise.make(sd => {
                    assert.deepEqual(sd.jsons.length, 88);
                    assert.deepEqual(_util.ordered_forward(sd.jsons, "title"), true)
                    assert.deepEqual(_util.ordered_forward(sd.jsons, "year"), false)
                }))
                .then(_.promise.done(done))
                .catch(done)
        })
        it("index (+year, +title)", function(done) {
            _.promise.make(self)
                .then(_.promise.add("index_name", "year-title-index"))
                .then(mongodb.dynamodb.all)
                .then(_.promise.make(sd => {
                    assert.deepEqual(sd.jsons.length, 88);
                    assert.deepEqual(_util.ordered_forward(sd.jsons, "title"), false)
                    assert.deepEqual(_util.ordered_forward(sd.jsons, "year"), true)
                }))
                .then(_.promise.done(done))
                .catch(done)
        })
        it("index (-year, +title)", function(done) {
            _.promise.make(self)
                .then(_.promise.add("index_name", "-year-title-index"))
                .then(mongodb.dynamodb.all)
                .then(_.promise.make(sd => {
                    assert.deepEqual(sd.jsons.length, 88);
                    assert.deepEqual(_util.ordered_forward(sd.jsons, "year"), false)
                }))
                .then(_.promise.done(done))
                .catch(done)
        })
        it("default index, query limit", function(done) {
            _.promise.make(self)
                .then(_.promise.add("query_limit", 10))
                .then(mongodb.dynamodb.all)
                .then(_.promise.make(sd => {
                    assert.deepEqual(sd.jsons.length, 10);
                    assert.deepEqual(_util.ordered_forward(sd.jsons, "title"), true)
                }))
                .then(_.promise.done(done))
                .catch(done)
        })
        it("default index, pager past end + query", function(done) {
            _.promise.make(self)
                .then(_.promise.add("pager", 100))
                .then(_.promise.add("query_limit", 10))
                .then(mongodb.dynamodb.all)
                .then(_.promise.make(sd => {
                    assert.deepEqual(sd.jsons.length, 0);
                }))
                .then(_.promise.done(done))
                .catch(done)
        })
        it("default index, pager near + query", function(done) {
            _.promise.make(self)
                .then(_.promise.add("pager", 80))
                .then(_.promise.add("query_limit", 10))
                .then(mongodb.dynamodb.all)
                .then(_.promise.make(sd => {
                    assert.deepEqual(sd.jsons.length, 8);
                }))
                .then(_.promise.done(done))
                .catch(done)
        })
    })
})
