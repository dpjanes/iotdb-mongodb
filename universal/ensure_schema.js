/*
 *  universal/ensure_schema.js
 *
 *  David Janes
 *  IOTDB
 *  2019-05-28
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

const _ = require("iotdb-helpers")

const _ensured = new Set()

/**
 */
const ensure_schema = _.promise((self, done) => {
    const mongodb = require("..")

    _.promise.validate(self, ensure_schema)

    if (_ensured.has(self.table_schema.name)) {
        return done(null, self) 
    } else {
        _ensured.add(self.table_schema.name)
    }

    _.promise(self)
        .then(mongodb.db.ensure_schema)
        .end(done, self)
})

ensure_schema.method = "db.ledger.ensure_schema"
ensure_schema.requires = {
    table_schema: _.is.Dictionary,
}
ensure_schema.accepts = {
}
ensure_schema.produces = {
}

/**
 *  API
 */
exports.ensure_schema = ensure_schema
