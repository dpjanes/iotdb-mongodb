/*
 *  util/build_sort.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-06
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
const errors = require("iotdb-errors")

/**
 */
const build_sort = (_table_schema, _index_name, _sort) => {
    let keys = _table_schema.keys
    if (_index_name) {
        keys = _table_schema.indexes[_index_name]

        if (!keys) {
            throw new errors.Invalid(`no index_name=${_index_name}`)
        }
    }

    let sort = keys.map(key => [ key.replace(/^[-+]/, ""), key.startsWith("-") ? -1 : 1 ])

    if (_sort) {
        sort = _.coerce.list(_sort, []).map(key => [ key.replace(/^[-+]/, ""), key.startsWith("-") ? -1 : 1 ])
    }

    return sort
}

/**
 *  API
 */
exports.build_sort = build_sort
