/*
 *  universal/index.js
 *
 *  David Janes
 *  IOTDB
 *  2019-01-07
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

module.exports = Object.assign(
    {},
    require("./create"),
    require("./any_all"),
    require("./any_query"),
    require("./any_value"),
    require("./count_all"),
    require("./count_query"),
    require("./count_value"),
    require("./list_all"),
    require("./list_query"),
    require("./list_value"),
    require("./one_value"),
    require("./one_query"),
    require("./delete"),
    require("./remove"),
    require("./save"),
    require("./upsert"),
    {}
)
