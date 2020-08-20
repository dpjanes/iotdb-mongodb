/*
 *  universal/ensure.js
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

const _ = require("iotdb-helpers")
const mongodb = require("..")

const assert = require("assert")

const _util = require("./_util")
const util = require("../lib/util")

/**
 */
const ensure = _descriptor => {
    assert(_.is.String(_descriptor.name))
    assert(_.is.String(_descriptor.one))
    assert(_.is.String(_descriptor.many))
    assert(_.is.Function(_descriptor.setup))
    assert(_.is.Function(_descriptor.validate))
    assert(_.is.Dictionary(_descriptor.keys))

    const f = _.promise((self, done) => {
        const now = _.timestamp.make()

        _.promise(self)
            .validate(f)

            .then(_util.setup)
            .then(_descriptor.setup)

            .make(sd => {
                sd[_descriptor.one] = _.d.clone(sd[_descriptor.one] || {})
            })

            .then(_util.key(_descriptor, "created", now))
            .then(_util.key(_descriptor, "updated", now))
            .then(_util.key(_descriptor, "removed", null))
            .then(_descriptor.create)
            .then(_descriptor.scrub || _util.scrub(_descriptor.one))

            .make(sd => {
                sd.json = sd[_descriptor.one]
                assert.ok(sd.json)

                sd.table_schema.keys.forEach(key => {
                    assert.ok(!_.is.Undefined(sd.json[key]), `expected to see "${key}" in the record: ${JSON.stringify(sd.json, null, 2)}`)
                })
            })
            .conditional(!!_descriptor.scrub_json, _descriptor.scrub_json)

            .add("table_schema/name:mongodb$collection_name")
            .then(mongodb.collection)

            .make((sd, sdone) => {
                const on_insert = _.d.clone(sd.json)
                const on_update = _.d.clone(sd.json)
                sd.table_schema.keys.forEach(key => {
                    delete on_update[key]
                });

                [ "created", "removed" ]
                    .map(key => _descriptor.keys[key])
                    .filter(key => key)
                    .forEach(key => {
                        delete on_update[key]
                    })

                _.keys(on_update).forEach(key => {
                    delete on_insert[key]
                })

                const update = {
                    "$set": on_update,
                    "$setOnInsert": on_insert,
                }
                const values = sd.table_schema.keys.map(key => sd.json[key] || null)
                sd.query = _.object(sd.table_schema.keys, values)

                // console.log("QUERY", sd.query)
                /* console.log("HERE:XXX", JSON.stringify(update, null, 2)) */

                // we really need to kill TingoDB
                let command = sd.mongodb$collection.updateOne
                if (!command) {
                    command = sd.mongodb$collection.findOneAndReplace
                }
                command = command.bind(sd.mongodb$collection)

                /*
                console.log("MONGO:ENSURE.QUERY", sd.query)
                console.log("MONGO:ENSURE.UDPATE", update)
                */

// console.log("ENSURE:A.1 update", update)
// console.log("ENSURE:A.2 query", sd.query)
                command(_.d.clone(sd.query), update, {
                    multi: false,
                    upsert: true,
                }, (error, doc) => {
                    if (error) {
                        return sdone(error)
                    }

                    /*
                    sd.mongodb$collection.updateOne

                    delete doc.connection
                    delete doc.message
                    console.log("DOC", doc)
                    */

                    sdone(null, sd)
                })
            })

            .make((sd, sdone) => {
                // console.log("B.1 QUERY", sd.query)
                sd.mongodb$collection.findOne(sd.query, (error, result) => {
                    if (error) {
                        return done(util.intercept(sd)(error))
                    }

                    sd.json = util.scrub_ids(result) || null
                    // console.log("B.2 JSON", sd.json)

                    if (sd.table_schema.partials && sd.json) {
                        sd.json.$_original = _.d.clone.deep(sd.json)
                    }

                    sd[_descriptor.one] = sd.json

                    sdone(null, sd)
                })
            })

            .end(done, self, _descriptor.one)
    })

    f.method = `${_descriptor.name}.ensure`
    f.description = `Ensure record ${_descriptor.one} exists. It DOES return the record`
    f.requires = {
    }
    f.accepts = {
        [ _descriptor.one ]: _.is.Object,
    }
    f.produces = {
        [ _descriptor.one ]: [ _descriptor.validate, _.is.Null ],
    }

    /**
     *  Parameterized
     */
    f.p = value => _.promise((self, done) => {
        _.promise(self)
            .add(_descriptor.one, value)
            .then(f)
            .end(done, self, _descriptor.one)
    })

    return f
}

/**
 *  API
 */
exports.ensure = ensure
