/*
 *  lib/create_user.js
 *
 *  David Janes
 *  IOTDB.org
 *  2018-03-04
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

/**
 */
const create_user = _.promise((self, done) => {
    _.promise.validate(self, create_user)

    const options = Object.assign(
        {},
        self.user.options || {}
    )
    if (self.user.roles) {
        options.roles = self.user.roles
    }

    self.mongodb
        .admin()
        .addUser(self.user.username, self.user.password, options, (error, result) => {
            if (error) {
                return done(error)
            }

            console.log("RESULT", result)
            return done(null, self)
        })
})

create_user.method = "create_user"
create_user.description = `
    Create user`
create_user.requires = {
    mongodb: _.is.Object,
    user: {
        username: _.is.String,
        password: _.is.String,
    },
}
create_user.accepts = {
    user: {
        options: _.is.Dictionary,
        roles: _.is.Array.of.Dictionary,
    },
}
create_user.produces = {
}

/**
 */
const readwrite = _.promise((self, done) => {
    _.promise(self)
        .validate(readwrite)

        .make(sd => {
            sd.user = _.d.clone(sd.user)
            sd.user.roles = [
                {
                    role: "readWrite",
                    db: sd.mongodb.s.databaseName,
                },
            ]
        })
        .then(create_user)

        .end(done, self)
})

readwrite.method = "create_user.readwrite"
readwrite.description = `
    Create user with read/write access to the current Database`
readwrite.requires = {
    mongodb: {
        s: {
            databaseName: _.is.String,
        },
    },
    user: {
        username: _.is.String,
        password: _.is.String,
    },
}
readwrite.produces = {
}

/**
 */
const read = _.promise((self, done) => {
    _.promise(self)
        .validate(read)

        .make(sd => {
            sd.user = _.d.clone(sd.user)
            sd.user.roles = [
                {
                    role: "read",
                    db: sd.mongodb.s.databaseName,
                },
            ]
        })
        .then(create_user)

        .end(done, self)
})

read.method = "create_user.read"
read.description = `
    Create user with read access to the current Database`
read.requires = {
    mongodb: {
        s: {
            databaseName: _.is.String,
        },
    },
    user: {
        username: _.is.String,
        password: _.is.String,
    },
}
read.produces = {
}

/**
 *  API
 */
exports.create_user = create_user
exports.create_user.read = read
exports.create_user.readwrite = readwrite
