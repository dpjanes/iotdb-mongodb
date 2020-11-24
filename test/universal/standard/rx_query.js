/**
 *  test/universal/standard/rx_query.js
 *
 *  David Janes
 *  IOTDB
 *  2020-11-24
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

/**
 */
describe("universal/rx_query", function() {
    let self = {}

    before(function(done) {
        _.promise({})
            .then(_util.initialize)
            .then(_util.load)
            .make(sd => {
                self = sd;
            })
            .end(done, {})
    })

    describe("good", function() {
        it("year", function(done) {
            _.promise(self)
                .add("query", {
                    year: 2013,
                    title: [ ">", "H" ],
                })
                .then(db.movie.rx.query)
                .then(_util.gather)
                .make(sd => {
                    assert.deepEqual(sd.jsons.length, 34);
                })
                .end(done, {})
        })
        it("parameterized empty", function(done) {
            _.promise(self)
                .then(db.movie.rx.query.p({}))
                .then(_util.gather)
                .make(sd => {
                    // console.log(sd.jsons.map(m => m.title))

                    assert.deepEqual(sd.jsons.length, 88);
                    // likely TingoDB breaking sort
                    // assert.deepEqual(_util.ordered_forward(sd.jsons, "title"), true)
                    // assert.deepEqual(_util.ordered_forward(sd.jsons, "year"), true)
                })
                .end(done, {})
        })
        it("paramterized", function(done) {
            _.promise(self)
                .then(db.movie.rx.query.p({
                    year: [ ">", 1900 ],
                }))
                .then(_util.gather)
                .make(sd => {
                    assert.deepEqual(sd.jsons.length, 88);
                    assert.deepEqual(_util.ordered_forward(sd.jsons, "year"), true)
                })
                .end(done, {})
        })
    })
})

