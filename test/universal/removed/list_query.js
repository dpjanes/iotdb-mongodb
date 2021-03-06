/**
 *  test/universal/removed/list_query.js
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

describe("universal/removed/list_query", function() {
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

    it("list_query", function(done) {
        const movie = {
            movie_id: _.id.uuid.v4(),
            title: "Avengers : Infinity War",
            year: 2018,
        }
            
        _.promise(self)
            // create
            .then(db.movie.create.p(movie))
            .make(sd => {
                assert.ok(sd.movie)
                assert.deepEqual(sd.movie.year, 2018)
                assert.deepEqual(sd.movie.title, "Avengers : Infinity War")
            })

            // make sure it exists
            .then(db.movie.list.query.p({
                movie_id: movie.movie_id,
            }))
            .make(sd => {
                assert.ok(_.d.is.subset(movie, sd.movies[0]))
            })

            // remove it
            .then(db.movie.remove)

            // it should be gone 
            .then(db.movie.list.query.p({
                movie_id: movie.movie_id,
            }))
            .make(sd => {
                assert.deepEqual(0, sd.movies.length)
            })

            .end(done, {})
    })
    it("query removed items (true)", function(done) {
        const movie = {
            movie_id: _.id.uuid.v4(),
            title: "Avengers : Infinity War",
            year: 2018,
        }
            
        _.promise(self)
            // create
            .then(db.movie.create.p(movie))
            .make(sd => {
                assert.ok(sd.movie)
                assert.deepEqual(sd.movie.year, 2018)
                assert.deepEqual(sd.movie.title, "Avengers : Infinity War")
            })

            // remove it
            .then(db.movie.remove)

            // only removed movies
            .then(db.movie.list.query.p({
                removed: true,
            }))
            .make(sd => {
                assert.ok(sd.movies.map(m => m.movie_id).indexOf(movie.movie_id) > -1)
                assert.ok(!sd.movies.find(m => !m.removed))
            })

            .end(done, {})
    })
    it("query all items", function(done) {
        const movie = {
            movie_id: _.id.uuid.v4(),
            title: "Avengers : Infinity War",
            year: 2018,
        }
            
        _.promise(self)
            // create
            .then(db.movie.create.p(movie))
            .make(sd => {
                assert.ok(sd.movie)
                assert.deepEqual(sd.movie.year, 2018)
                assert.deepEqual(sd.movie.title, "Avengers : Infinity War")
            })

            // remove it
            .then(db.movie.remove)

            // all movies, removed or not
            .then(db.movie.list.query.p({
                removed: null,
            }))
            .make(sd => {
                assert.ok(sd.movies.map(m => m.movie_id).indexOf(movie.movie_id) > -1)
                assert.ok(sd.movies.find(m => !m.removed))
                assert.ok(sd.movies.find(m => m.removed))
            })

            .end(done, {})
    })
    it("query unremoved items", function(done) {
        const movie = {
            movie_id: _.id.uuid.v4(),
            title: "Avengers : Infinity War",
            year: 2018,
        }
            
        _.promise(self)
            // create
            .then(db.movie.create.p(movie))
            .make(sd => {
                assert.ok(sd.movie)
                assert.deepEqual(sd.movie.year, 2018)
                assert.deepEqual(sd.movie.title, "Avengers : Infinity War")
            })

            // remove it
            .then(db.movie.remove)

            // unremoved only
            .then(db.movie.list.query.p({
                removed: false,
            }))
            .make(sd => {
                assert.ok(sd.movies.map(m => m.movie_id).indexOf(movie.movie_id) === -1)
                assert.ok(!sd.movies.find(m => m.removed))
                assert.ok(sd.movies.length)
            })

            .end(done, {})
    })
    it("removed before now", function(done) {
        const movie = {
            movie_id: _.id.uuid.v4(),
            title: "Avengers : Infinity War",
            year: 2018,
        }
            
        _.promise(self)
            // create
            .then(db.movie.create.p(movie))
            .make(sd => {
                assert.ok(sd.movie)
                assert.deepEqual(sd.movie.year, 2018)
                assert.deepEqual(sd.movie.title, "Avengers : Infinity War")
            })

            // remove it
            .then(db.movie.remove)

            // removed only
            .then(db.movie.list.query.p({
                removed: [ ">", _.timestamp.epoch() ],
            }))
            .make(sd => {
                assert.ok(sd.movies.map(m => m.movie_id).indexOf(movie.movie_id) !== -1)
                assert.ok(!sd.movies.find(m => !m.removed))
                assert.ok(sd.movies.length)
            })

            .end(done, {})
    })
})
