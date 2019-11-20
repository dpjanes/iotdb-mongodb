/*
 *  universal/_descriptor.js
 *
 *  David Janes
 *  IOTDB
 *  2019-02-07
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
 *
 *  THIS IS AN EXAMPLE.
 */

"use strict"

const _ = require("iotdb-helpers")

/**
 *  The name of the module
 */
exports.name = "APPLICATION.db.ROW"

/**
 *  The name of a single record
 */
exports.one = "ROW"

/**
 *  The name of multiple records
 */
exports.many = "ROWs"

/**
 *  Special keys
 */
exports.keys = {
    removed: null, // "removed", // hides record rather than delete
    created: null, // "created", // timestamp of creation
    updated: null, // "updated", // timestamp of last modification
}

/**
 */
exports.setup = _.promise(self => {
    _.promise.validate(self, exports.setup)

    self.table_schema = {
        "name": "ROW",
        "indexes": {},
        "keys": [ "ROW_id" ],
    }
})

exports.setup.method = "APPLICATION.db.ROW._descriptor.setup"
exports.setup.description = `Setup table schema`
exports.setup.requires = {
}
exports.setup.accepts = {
}
exports.setup.produces = {
    table_schema: {
        name: _.is.String,
        keys: _.is.Array,
        indexes: _.is.Dictionary,
    },
}

/**
 *  This cleans up one record, usually
 *  used for upping versions
 */
exports.scrub = _.promise(self => {
    _.promise.validate(self, exports.scrub)

    if (!self.ROW) {
        self.ROW = null
        return
    }

    self.ROW = _.d.clone(self.ROW)
})

exports.scrub.method = "APPLICATION.db.ROW._descriptor.scrub"
exports.scrub.description = `Clean up one ROW`
exports.scrub.requires = {
}
exports.scrub.accepts = {
    ROW: exports.validate,
}
exports.scrub.produces = {
    ROW: exports.validate,
}

/**
 *  This is used to scrub a JSON record 
 *  immediately before writing to the database,
 *  e.g. to remove fields that should never
 *  be saved.
 *
 *  Optional.
 */
exports.scrub_json = _.promise(self => {
    _.promise.validate(self, exports.scrub_json)
})

exports.scrub_json.method = "APPLICATION.db.ROW._descriptor.scrub_json"
exports.scrub_json.description = `Clean up JSON before writing to disk`
exports.scrub_json.requires = {
}
exports.scrub_json.accepts = {
    json: _.is.Dictionary,
}
exports.scrub_json.produces = {
    json: _.is.JSON,
}

/**
 *  This is called after any operation which changes the record.
 */
exports.updated = _.promise(self => {
    _.promise.validate(self, exports.updated)
})

exports.updated.method = "APPLICATION.db.ROW._descriptor.updated"
exports.updated.description = ``
exports.updated.requires = {
}
exports.updated.accepts = {
    ROW: exports.validate,
}
exports.updated.produces = {
    ROW: exports.validate,
}

/**
 *  This is called after any operation which removes the record
 */
exports.removed = _.promise(self => {
    _.promise.validate(self, exports.removed)
})

exports.removed.method = "APPLICATION.db.ROW._descriptor.removed"
exports.removed.description = ``
exports.removed.requires = {
}
exports.removed.accepts = {
    ROW: exports.validate,
}
exports.removed.produces = {
    ROW: exports.validate,
}

/**
 *  This creates a new record.
 *  There will always be a stub record,
 *  but you must set an ID.
 *  You don't need to do anything that
 *  scrub does.
 */
exports.create = _.promise(self => {
    _.promise.validate(self, exports.create)

    self.ROW = _.d.clone(self.ROW)

    // if you want a single random primary key, do something like
    // self.ROW.ROW_id = self.ROW.ROW_id || _.id.uuid.v4()
})

exports.create.method = "APPLICATION.db.ROW._descriptor.create"
exports.create.description = `Finish creating one ROW`
exports.create.requires = {
}
exports.create.accepts = {
    ROW: exports.validate,
}
exports.create.produces = {
    ROW: exports.validate,
}

/**
 */
exports.validate = ROW => _.is.Dictionary;
exports.validate.method = "APPLICATION.db.ROW._descriptor.validate"
exports.validate.description = "Test if ROW is valid"
