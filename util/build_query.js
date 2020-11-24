/*
 *  util/build_query.js
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
 *  Make a mongodb looking query from a DynamoDB one
 */
const build_query = _query => {
    const query = _.d.clone.shallow(_query || {})

    _.keys(query)
        .filter(query_key => _.is.Array(query[query_key]))
        .forEach(query_key => {
            const parts = query[query_key]

            let position = 0
            while (position < parts.length) {
                let comparitor
                let q

                switch (parts[position].toLowerCase()) {
                case "=":
                case "eq":
                    q = {
                        "$eq": parts[position + 1]
                    }

                    position += 2
                    break
                    
                case "<": case "lt":
                    q = {
                        "$lt": parts[position + 1]
                    }

                    position += 2
                    break
                    
                case "<=": case "le":
                    q = {
                        "$lte": parts[position + 1]
                    }

                    position += 2
                    break
                    
                case ">": case "gt":
                    q = {
                        "$gt": parts[position + 1]
                    }

                    position += 2
                    break
                    
                case ">=": case "ge":
                    q = {
                        "$gte": parts[position + 1]
                    }

                    position += 2
                    break
                    
                case "!=": case "ne":
                    q = {
                        "$ne": parts[position + 1]
                    }

                    position += 2
                    break

                case "between":
                    q = {
                        "$gte": parts[position + 1],
                        "$lte": parts[position + 2],
                    }

                    position += 3
                    break

                case "in":
                case "∈":
                    q = {
                        "$in": parts[position + 1]
                    }

                    position += 2
                    break

                case "find":
                    q = {
                        "$regex": _.coerce.string.resafe(parts[position + 1]),
                        "$options": "i",
                    }

                    position += 2
                    break

                case "regex":
                    q = {
                        "$regex": parts[position + 1]
                    }

                    position += 2
                    break

                default:
                    throw new errors.Invalid("unknown operator: " + parts[position])
                }

                query[query_key] = q
            }
        })

    return query
}

/**
 *  API
 */
exports.build_query = build_query
