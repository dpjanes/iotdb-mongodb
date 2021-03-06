/*
 *  universal/_util.js
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

    self.query = null
    self.query_limit = null
    self.index_name = null
})

setup.method = "universal._util/setup"
setup.description = `Setup database`
setup.requires = {
}
setup.accepts = {
}
setup.produces = {
    query: _.is.Null,
    query_limit: _.is.Null,
    index_name: _.is.Null,
}

/**
 *  remove === undefined: no removes
 *  remove === null: all items, including removes
 *  remove === true: only removed items
 *  remove === false: no removes
 *  otherwise: pass through to query
 */
const fix_query = (_descriptor, _query) => _.promise(self => {
    _.promise.validate(self, exports.fix_query)

    if (_descriptor.keys.removed) {
        self.query = _.d.clone(self.query)

        const removed_value = self.query[_descriptor.keys.removed]
        if (_.is.Null(removed_value)) {
            delete self.query[_descriptor.keys.removed]
        } else if (_.is.Undefined(removed_value)) {
            self.query[_descriptor.keys.removed] = null
        } else if (removed_value === true) {
            self.query[_descriptor.keys.removed] = [ "!=", null ]
        } else if (removed_value === false) {
            self.query[_descriptor.keys.removed] = null
        }
    }
})

fix_query.method = "universal._util/fix_query"
fix_query.description = `Patch setup`
fix_query.requires = {
    query: {},
}
fix_query.accepts = {
}
fix_query.produces = {
    query: {},
}

/**
 */
const key = (_descriptor, _key, _value) => _.promise(self => {
    _.promise.validate(self, exports.key)

    if (!_descriptor.keys[_key]) {
        return
    }

    self[_descriptor.one][_key] = _value
})

key.method = "universal._util/key"
key.description = `Set a special key/value`
key.requires = {
}
key.accepts = {
}
key.produces = {
}

/**
 */
const scrub = _key => _.promise(self => {
    if (!self[_key]) {
        self[_key] = null
    } else {
        self[_key] = _.d.clone(self[_key])
    }
})

/**
 *  API
 */
exports.setup = setup
exports.fix_query = fix_query
exports.key = key
exports.scrub = scrub
