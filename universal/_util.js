/*
 *  universal/_util.js
 *
 *  David Janes
 *  IOTDB
 *  2019-01-09
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
 *
 *  THIS IS AN EXAMPLE.
 */

"use strict"

const _ = require("iotdb-helpers")

/**
 *  This sets up the database. The _descriptor gets a kick at this also
 */
const setup = _.promise(self => {
    _.promise.validate(self, exports.setup)

    self.table_schema = { 
        "name": exports.one,
        "indexes": {},
        "keys": [
            exports.primary_id,
        ]
    } 

    self.table_name = self.table_schema.name

    self.query = null
    self.query_limit = null
    self.index_name = null
    self.projection = null
})

setup.method = "universal._util/setup"
setup.description = `Setup database`
setup.requires = {
}
setup.accepts = {
}
setup.produces = {
}

/**
 *  This is really to do with an oddity of our 
 *  implementation over time
 */
const post_setup = _.promise(self => {
    _.promise.validate(self, exports.post_setup)

    self.table_name = self.table_schema.name
})

post_setup.method = "universal._util/post_setup"
post_setup.description = `Patch setup`
post_setup.requires = {
    table_schema: {
        name: _.is.String,
    },
}
post_setup.accepts = {
}
post_setup.produces = {
    table_name: _.is.String,
}


/**
 *  API
 */
exports.setup = setup
