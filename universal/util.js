/*
 *  universal/util.js
 *
 *  David Janes
 *  IOTDB
 *  2019-02-16
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
const assert = require("assert")

/**
 */
const scrub_underscore = _.promise(self => {
    _.promise.validate(self, scrub_underscore)

    self.json = _.d.clone(self.json)

    _.keys(self.json)
        .filter(key => key.startsWith("_"))
        .forEach(key => delete self.json[key]);
})

scrub_underscore.method = "universal.util.scrub_underscore"
scrub_underscore.description = `Remove underscores from JSON record`
scrub_underscore.requires = {
}
scrub_underscore.accepts = {
    json: _.is.Dictionary,
}
scrub_underscore.produces = {
    json: _.is.JSON,
}

/**
 *  Quickly build a database table

    mongodb.universal.util.build({
        name: "question",       // name of table and objects
        keys: "id",             // unique key
        specials: "unit",       // keys that we want to search one
    })

 */
const build = _paramd => {
    const mongodb = require("..")

    /*
     */
    const paramd = _.d.clone(_paramd)
    paramd.keys = _.coerce.list(paramd.keys, [])
    paramd.specials = _.coerce.list(paramd.specials, [])

    assert.ok(paramd.keys.length)
    assert.ok(paramd.name)

    if (!paramd.one) {
        paramd.one = paramd.name
    }
    if (!paramd.many) {
        paramd.many = `${paramd.one}s`
    }
    if (!paramd.create) {
        paramd.create = {}
    }

    /*
     *  Make descriptor
     */
    const _descriptor = {}

    _descriptor.name = paramd.name
    _descriptor.one = paramd.one
    _descriptor.many = paramd.many
    _descriptor.keys = {
        removed: null, 
        created: null, 
        updated: null, 
    }
    _descriptor.validate = d => _.is.Dictionary(d)

    _descriptor.setup = _.promise(self => {
        self.table_schema = {
            "name": paramd.name,
            "indexes": {},
            "keys":  paramd.keys,
        }

        paramd.specials.forEach(special => {
            self.table_schema.indexes[special] = special
        })
    })

    _descriptor.create = _.promise(self => {
        _.promise.validate(self, _descriptor.create)

        self[_descriptor.one] = Object.assign({}, paramd.create, self[_descriptor.one] || {})
    })

    /**
     */
    const db = {
        _descriptor: _descriptor,

        create: mongodb.universal.create(_descriptor),
        save: mongodb.universal.save(_descriptor),
        delete: mongodb.universal.delete(_descriptor),
        upsert: mongodb.universal.upsert(_descriptor),
        by: {
            query: mongodb.universal.by_query(_descriptor),
        },
        list: {
            all: mongodb.universal.list_all(_descriptor),
            unit: mongodb.universal.list_key(_descriptor, "unit"),
        },
    }

    paramd.keys.forEach(key => {
        db.by[key] = mongodb.universal.by_key(_descriptor, key)
    })

    paramd.specials.forEach(special => {
        db.list[special] = mongodb.universal.list_key(_descriptor, special)
    })

    return db
}

/**
 *  API
 */
exports.util = {
    scrub_underscore: scrub_underscore,
    build: build,
}

