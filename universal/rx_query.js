/*
 *  universal/rx_query.js
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
const rx_query = (_descriptor, _index) => {
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

            .make(sd => {
                sd.index_name = _index || null
                sd.query_limit = 100
                sd.pager = null

                const _emitter = subscriber => {
                    const _doit = sd => {
                        if (subscriber.isStopped) {
                            console.log("-", "sub not listening any more")
                            return
                        }

                        _.promise(sd)
                            .then(mongodb.db.all)
                            .each({
                                method: _descriptor.scrub || _util.scrub(_descriptor.one),
                                inputs: `jsons:${_descriptor.one}`,
                                outputs: "jsons",
                                output_selector: sd => sd[_descriptor.one],
                                output_filter: x => x,
                            })
                            .make(sd => {
                                if (subscriber.isStopped) {
                                    return
                                }

                                sd.jsons.forEach(json => {
                                    json.__type = "exists"
                                    subscriber.next(json)
                                })

                                if (!sd.cursor.next) {
                                    return subscriber.complete()
                                }

                                sd.pager = sd.cursor.next
                                process.nextTick(() => _doit(sd))
                            })
                            .catch(error => {
                                if (!subscriber.isStopped) {
                                    subscriber.error(error)
                                }
                            })
                    }

                    _doit(sd)
                }

                sd.observable = new rx.Observable(_emitter)
            })

            .end(done, self, f)
    })

    f.method = `${_descriptor.name}.rx_query`
    f.description = `Return an Observable matching query`
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
exports.rx_query = rx_query
