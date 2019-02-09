/**
 *  test/universal/standard/delete.js
 *
 *  David Janes
 *  IOTDB
 *  2019-02-08
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

const assert = require("assert")

const _util = require("../../_util")

const db = require("./_db")

describe("universal/delete", function() {
    let self = {}

    before(function(done) {
        _.promise(self)
            .then(_util.initialize)
            .then(_util.load)
            .make(sd => {
                self = sd;
            })
            .end(done)
    })

    it("works", function(done) {
        _.promise(self)
            .add("movie", {
                "title": "Avengers : Infinity War",
                "year": 2018,
            })
            .then(db.movie.create)
            .make(sd => {
                assert.ok(sd.movie)
                assert.ok(!sd.movie.rating)
            })

            .then(db.movie.list.year.p(2018))
            .make(sd => {
                assert.deepEqual(sd.movies.length, 1)
            })

            .then(db.movie.list.all)
            .make(sd => {
                assert.deepEqual(sd.movies.length, 89)
            })

            .then(db.movie.delete)

            .then(db.movie.list.year.p(2018))
            .make(sd => {
                assert.deepEqual(sd.movies.length, 0)
            })

            .then(db.movie.list.all)
            .make(sd => {
                assert.deepEqual(sd.movies.length, 88)
            })

            .end(done)
    })
})
