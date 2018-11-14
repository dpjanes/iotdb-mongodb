/*
 *  initialize.js
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

"use strict"

const _ = require("iotdb-helpers")
const fs = require("iotdb-fs")

const assert = require("assert")

const util = require("./util")

/**
 *  Requires: self.mongodbd
 *  Produces: self.mongodb
 */
const initialize = _.promise((self, done) => {
    const method = "initialize";

    _.promise.validate(self, initialize)

    switch (self.mongodbd.engine || "mongodb") {
    case "mongo":
    case "mongodb":
        assert.ok(_.is.String(self.mongodbd.url), `${initialize.method}: expected self.mongodbd.url to be a String`)

        const mongodb = require("mongodb");
        mongodb.MongoClient.connect(self.mongodbd.url, {
            useNewUrlParser: true,
        }, (error, mongo_client) => {
            if (error) {
                return done(error)
            }

            self.mongodb = mongo_client.db(mongo_client.s.options.dbName)
            self.mongodb.__engine = mongodb;
            self.mongodb.__client = mongo_client;
            self.mongodb.__table_prefix = self.mongodbd.table_prefix || ""

            done(null, self)
        })
        break;

    case "tingo":
    case "tingodb":
        assert.ok(_.is.String(self.mongodbd.path), 
            `${initialize.method}: expected self.mongodbd.path to be a String (in tingodb mode)`)

        const tingodb = require("tingodb")({
            // cacheSize: 1024 * 10,
            // cacheMaxObjSize: 1024 * 10,
        });
        _.promise(self)
            .then(sd => _.d.add(sd, "path", self.mongodbd.path))
            .then(fs.mkdir)
            .then(sd => {
                self.mongodb = new tingodb.Db(self.mongodbd.path, {})
                self.mongodb.__engine = tingodb;
                self.mongodb.__client = null;
                self.mongodb.__table_prefix = self.mongodbd.table_prefix || ""
                
                done(null, self)
            })
            .catch(done)
        break;

    default:
        assert.ok(false, `${initialize.method}: expected self.mongodbd.engine to be "mongodb" or "tingodb"`);
        break;
    }
})

initialize.method = "initialize"
initialize.requires = {
    mongodbd: _.is.Dictionary,
}

/**
 *  API
 */
exports.initialize = initialize
