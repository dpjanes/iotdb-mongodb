/*
 *  template.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-08-05
 *
 *  Copyright [2013-2018] [David P. Janes]
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

const _ = require("iotdb-helpers");

const assert = require("assert");

const util = require("./util");

/**
 */
const template = (_self, done) => {
    const self = _.d.clone.shallow(_self)
    const method = "template";

    assert.ok(self.mongodb, `${method}: expected self.mongodb`)
    assert.ok(_.is.String(self.table_name) || _.is.String(self.table_schema && self.table_schema.name), 
        `${method}: expected self.table_name to be a String`)

    done(null, self)
}

/**
 *  API
 */
exports.template = _.promise.denodeify(template)
