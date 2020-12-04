/*
 *  universal/rx_watch.js
 *
 *  David Janes
 *  IOTDB
 *  2020-11-24
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

/**
 */
const rx_watch = (_descriptor, _index) => {
    const rx = require("rxjs")

    assert(_.is.String(_descriptor.name))
    assert(_.is.String(_descriptor.one))
    assert(_.is.String(_descriptor.many))
    assert(_.is.Function(_descriptor.setup))
    assert(_.is.Function(_descriptor.validate))

    const f = _.promise((self, done) => {
        _.promise(self)
            .validate(f)

            .then(_util.setup)
            .then(_descriptor.setup)
            
            .add("query", self.query)
            .then(_util.fix_query(_descriptor))

            .add("table_schema/name:mongodb$collection_name")
            .then(mongodb.collection)

            .make(sd => {
                const mongodb$query = mongodb.util.build_query(sd.query)
                const pipeline = [
                    {
                        "$match": mongodb$query,
                    }
                ]

                sd.observable = new rx.Observable(subscriber => {
                    const change_stream = sd.mongodb$collection.watch(pipeline)
                    change_stream
                        .on("change", event => {
                            const x = event.fullDocument || {}
                            x.__type = event.operationType // XXX - this should be soft
                            delete x._id // likely this is B.S.

                            subscriber.next(x)
                        })

                    return {
                        unsubscribe: () => {
                            try {
                                change_stream.close()
                            } catch (x) {
                            }
                        }
                    }
                })
            })
            .end(done, self, f)
    })

    f.method = `${_descriptor.name}.rx_watch`
    f.description = `Return an Observable watching query`
    f.requires = {
        query: _.is.Dictionary,
    }
    f.accepts = {
    }
    f.produces = {
        observable: _.is.rx.Observable,
    }
    f.params = {
        query: _.p.normal,
    }
    f.p = _.p(f)

    return f
}

/**
 *  API
 */
exports.rx_watch = rx_watch
