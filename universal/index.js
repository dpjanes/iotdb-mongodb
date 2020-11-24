/*
 *  universal/index.js
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
 */

"use strict"

module.exports = Object.assign(
    {},
    require("./any_all"),
    require("./any_query"),
    require("./any_key"),
    require("./by_query"),
    require("./by_key"),
    require("./by_keys"),
    require("./configure"),
    require("./count_all"),
    require("./count_query"),
    require("./count_key"),
    require("./create"),
    require("./collection"),
    require("./delete"),
    require("./ensure"),
    require("./ensure_schema"),
    require("./list_all"),
    require("./list_query"),
    require("./list_key"),
    require("./remove"),
    require("./save"),
    require("./upsert"),
    require("./rx_all"),
    require("./rx_query"),
    {}
)
