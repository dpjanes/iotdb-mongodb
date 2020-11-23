/**
 *  test/db/partials.js
 *
 *  David Janes
 *  IOTDB
 *  2020-01-04
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

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const mongodb = require("../..")
const _util = require("./../_util")

describe("db/replace", function() {
    let self = {}

    before(function(done) {
        _.promise(self)
            .then(_util.initialize)
            .then(_util.load)
            .make(sd => {
                sd.table_schema = _.d.clone(sd.table_schema)
                sd.table_schema.partials = true

                self = sd;
            })
            .end(done, {})
    })

    describe("bad", function() {
        it("does not exists - expect 404", function(done) {
            _.promise(self)
                .add("json", {
                    "year": 2014,
                    "title": "Rush XXX",
                })
                .then(mongodb.db.replace)
                .then(_util.auto_fail(done))
                .catch(_util.ok_error(done, 404))
        })
        it("missing keys - expect 403", function(done) {
            _.promise(self)
                .add("json", {
                    "year": 2014,
                })
                .then(mongodb.db.replace)
                .then(_util.auto_fail(done))
                .catch(_util.ok_error(done, 403))
        })
    })
    describe("good", function() {
        it("exists", function(done) {
            _.promise(self)
                .add("query", {
                    "year": 2014,
                    "title": "Rush",
                })
                .then(mongodb.db.get)
                .make(sd => {
                    assert.ok(sd.json)
                })

                .add("json", {
                    "year": 2014,
                    "title": "Rush",
                    "description": "Never going to give you up",
                })
                .then(mongodb.db.replace)
                .make(sd => {
                    assert.ok(sd.json)
                })

                .add("query", {
                    "year": 2014,
                    "title": "Rush",
                })
                .then(mongodb.db.get)
                .make(sd => {
                    /**
                     *  Note how the "replace" basically became "patch"
                     *  because we wiped out $_original
                     */
                    assert.deepEqual(sd.json.description, "Never going to give you up")
                    assert.ok(!_.is.Undefined(sd.json.release_date))
                    assert.ok(!_.is.Undefined(sd.json.rating))
                })

                .end(done, {})
        })
    })
})
