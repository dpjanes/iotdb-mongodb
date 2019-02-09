/**
 *  test/universal/_db.js
 *
 *  David Janes
 *  IOTDB
 *  2019-02-08
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
const mongodb = require("../..")

const _descriptor = require("./_descriptor")

/**
 *  Simulate how we like to do this at Consensas
 */
const movie = {
    create: mongodb.universal.create(_descriptor),
    save: mongodb.universal.save(_descriptor),
    delete: mongodb.universal.delete(_descriptor),
    // remove: mongodb.universal.remove(_descriptor),
    by: {
        query: mongodb.universal.one_query(_descriptor),
        title: mongodb.universal.one_value(_descriptor, "title"),
    },
    list: {
        all: mongodb.universal.list_all(_descriptor),
        query: mongodb.universal.list_query(_descriptor, "year-title-index"),
        year: mongodb.universal.list_value(_descriptor, "year"),
        title: mongodb.universal.list_value(_descriptor, "title"),
    },
}

movie.list.all.year_up = mongodb.universal.list_all(_descriptor, "year-title-index")
movie.list.all.year_down = mongodb.universal.list_all(_descriptor, "-year-title-index")

movie.list.year.title_up = mongodb.universal.list_value(_descriptor, "year", "year-title-index")
movie.list.year.title_down = mongodb.universal.list_value(_descriptor, "year", "year--title-index")

module.exports = {
    movie: movie,
}

