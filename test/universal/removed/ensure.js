/**
 *  test/universal/removed/ensure.js
 *
 *  David Janes
 *  IOTDB
 *  2020-01-20
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

describe("universal/ensure", function() {
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
                "movie_id": "avengersinfwar",
                "title": "Avengers : Infinity War",
                "year": 2018,
            })
            .then(db.movie.ensure)
            .then(db.movie.list.year.p(2018))
            .make(sd => {
                assert.deepEqual(sd.movies.length, 1)
                const movie = sd.movies[0]
                assert.deepEqual(movie.year, 2018)
                assert.deepEqual(movie.title, "Avengers : Infinity War")
                assert.ok(movie.created)
                assert.ok(movie.updated)
            })
            .end(done)
    })
    it("works - multiple times", function(done) {
        _.promise(self)
            .add("movie", {
                "movie_id": "avengersinfwar",
                "title": "Avengers : Infinity War",
                "year": 2018,
            })
            .then(db.movie.ensure)

            .then(db.movie.list.year.p(2018))
            .make(sd => {
                assert.deepEqual(sd.movies.length, 1)
                sd.original = sd.movies[0]
            })

            .add("movie", {
                "movie_id": "avengersinfwar",
                "title": "Avengers : Infinity War",
                "year": 2018,
                "description": "bla bla",
            })
            .then(db.movie.ensure)

            .then(db.movie.list.year.p(2018))
            .make(sd => {
                assert.deepEqual(sd.movies.length, 1)
                const movie = sd.movies[0]
                // console.log("ORIGINAL", sd.original)
                // console.log("MOVIE", movie)
                assert.ok(movie.created === sd.original.created)
                assert.ok(movie.updated !== sd.original.updated)
            })
            .end(done)
    })
})
