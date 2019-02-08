/*
 *  universal/_util.js
 *
 *  David Janes
 *  IOTDB
 *  2019-01-07
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

/**
 *  The name of the module
 */
exports.name = "APPLICATION.db.movie"

/**
 *  The name of a single movie
 */
exports.one = "movie"

/**
 *  The name of multiple movies
 */
exports.many = "movies"

/**
 *  The name of the primary key in a movie
 */
exports.primary_id = "movie_id"

/**
 */
exports.validate = movie => _.is.Dictionary;
exports.validate.method = "APPLICATION.db.movie._util.validate"
exports.validate.description = "Test if movie is valid"

/**
 *  This sets up the database
 */
exports.setup = _.promise(self => {
    _.promise.validate(self, exports.setup)

    self.table_schema = {
        "name": "movies", 
        "indexes": {
            "year-title-index": [ "year", "title" ],
            "-year-title-index": [ "-year", "title" ]
        },
        "keys": [ "title", "year" ],
    }

    self.table_name = self.table_schema.name

    self.query = null
    self.query_limit = null
    self.index_name = null
    self.projection = null
})

exports.setup.method = "APPLICATION.db.movie._util.setup"
exports.setup.description = `Setup database for movie`
exports.setup.requires = {
}
exports.setup.accepts = {
    movie: exports.validate,
}
exports.setup.produces = {
    movie: exports.validate,
}

/**
 *  This cleans up one movie
 */
exports.scrub = _.promise(self => {
    _.promise.validate(self, exports.scrub)

    if (!self.movie) {
        self.movie = null
        return
    }

    self.movie = _.d.clone(self.movie)
})

exports.scrub.method = "APPLICATION.db.movie._util.scrub"
exports.scrub.description = `Clean up one movie`
exports.scrub.requires = {
}
exports.scrub.accepts = {
    movie: exports.validate,
}
exports.scrub.produces = {
    movie: exports.validate,
}

/**
 *  This is called after any operation which changes the movie.
 */
exports.updated = _.promise(self => {
    _.promise.validate(self, exports.updated)
})

exports.updated.method = "APPLICATION.db.movie._util.updated"
exports.updated.description = ``
exports.updated.requires = {
}
exports.updated.accepts = {
    movie: exports.validate,
}
exports.updated.produces = {
    movie: exports.validate,
}

/**
 *  This is called after any operation which removes the movie
 */
exports.removed = _.promise(self => {
    _.promise.validate(self, exports.removed)
})

exports.removed.method = "APPLICATION.db.movie._util.removed"
exports.removed.description = ``
exports.removed.requires = {
}
exports.removed.accepts = {
    movie: exports.validate,
}
exports.removed.produces = {
    movie: exports.validate,
}

/**
 *  This creates a new movie.
 *  There will always be a stub movie,
 *  but you must set an ID.
 *  You don't need to do anything that
 *  scrub does.
 */
exports.create = _.promise(self => {
    _.promise.validate(self, exports.create)

    self.movie = _.d.clone(self.movie)
    self.movie.movie_id = _.id.uuid.v4()
})

exports.create.method = "APPLICATION.db.movie._util.create"
exports.create.description = `Finish creating one movie`
exports.create.requires = {
}
exports.create.accepts = {
    movie: exports.validate,
}
exports.create.produces = {
    movie: exports.validate,
}
