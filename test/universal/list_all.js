/**
 *  test/universal/all.js
 *
 *  David Janes
 *  IOTDB
 *  2019-02-07
 *
 *  Copyright [2013-2019] [David P. Janes]
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

const mongodb = require("../..")
const _util = require("./../_util")

const db = require("./_db")

describe("universal/list_all", function() {
    let self = {}

    before(function(done) {
        _.promise({})
            .then(_util.initialize)
            .then(_util.load)
            .make(sd => {
                self = sd;
            })
            .end(done)
    })

    describe("good", function() {
        it("default index (+title, +year)", function(done) {
            _.promise(self)
                .then(db.movie.list.all)
                .make(sd => {
                    assert.deepEqual(sd.movies.length, 88);
                    assert.deepEqual(_util.ordered_forward(sd.movies, "title"), true)
                    assert.deepEqual(_util.ordered_forward(sd.movies, "year"), false)
                })
                .end(done)
        })
        it("index (+year, +title)", function(done) {
            _.promise(self)
                .then(db.movie.list.all.year_up)
                .make(sd => {
                    assert.deepEqual(sd.movies.length, 88);
                    assert.deepEqual(_util.ordered_forward(sd.movies, "title"), false)
                    assert.deepEqual(_util.ordered_forward(sd.movies, "year"), true)
                })
                .end(done)
        })
        it("index (-year, +title)", function(done) {
            _.promise(self)
                .then(db.movie.list.all.year_down)
                .make(sd => {
                    assert.deepEqual(sd.movies.length, 88);
                    assert.deepEqual(_util.ordered_forward(sd.movies, "year"), false)
                })
                .end(done)
        })
        it("default index, query limit", function(done) {
            _.promise(self)
                .add("mongodb$limit", 10)
                .then(db.movie.list.all)
                .make(sd => {
                    assert.deepEqual(sd.movies.length, 10);
                    assert.deepEqual(_util.ordered_forward(sd.movies, "title"), true)
                })
                .end(done)
        })
        it("default index, pager past end + query", function(done) {
            _.promise(self)
                .add("mongodb$page", 10)
                .add("mongodb$start", 100)
                .then(db.movie.list.all)
                .make(sd => {
                    assert.deepEqual(sd.movies.length, 0);
                })
                .end(done)
        })
        it("default index, pager near + query", function(done) {
            _.promise(self)
                .add("mongodb$page", 10)
                .add("mongodb$start", 80)
                .then(db.movie.list.all)
                .make(sd => {
                    assert.deepEqual(sd.movies.length, 8);
                })
                .end(done)
        })
    })
})
