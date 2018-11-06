/*
 *  gridfs/parse_path.js
 *
 *  David Janes
 *  IOTDB.org
 *  2018-11-06
 *
 *  Copyright [2013-2019] [David P. Janes]
 *
 *  Licensed under the Apache License, Version 2.0 (the "License")
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

const assert = require("assert")
const path = require("path")
const url = require("url")

const logger = require("../logger")(__filename)

/**
 *  gridfs:/hello/ => (fs/hello .)
 *  gridfs:/hello/bla.txt => (fs/hello bla.txt)
 *  gridfs:/foo.txt => (fs foo.txt)
 *  gridfs: => (fs .)
 */
const parse_path = _.promise(self => {
    assert.ok(_.is.String(self.path), `${parse_path.method}: self.path must be a String`);

    const urlp = url.parse(self.path)
    assert.ok(urlp.protocol === "gridfs:", `${parse_path.method}: self.path: protocol must be "gridfs:"`);
    assert.ok(urlp.hostname.length === 0, `${parse_path.method}: self.path: no hostname allowed yet`)

    console.log(urlp)

    let scrubbed = "fs/" + (urlp.pathname || "").replace(/^\//, '')
    if (scrubbed.endsWith("/")) {
        scrubbed += "."
    }

    self.bucket = path.dirname(scrubbed)
    self.filename = path.basename(scrubbed)
})

parse_path.method = "gridfs.parse_path"
parse_path.required = {
    path: _.is.String,
}

/**
 *  API
 */
exports.parse_path = parse_path

/*
_.promise({
    path: "gridfs:/hello/",
    path: "gridfs:/hello/bla.txt",
    path: "gridfs:",
    path: "gridfs:/foo.txt",
})
    .then(parse_path)
    .make(sd => {
        console.log(`${sd.path} => (${sd.bucket} ${sd.filename})`)
    })
    .except(error => {
        delete error.self
        console.log(error)
    })
*/
