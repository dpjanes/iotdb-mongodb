/*
 *  test/util/updated.js
 *
 *  David Janes
 *  IOTDB.org
 *  2020-01-04
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
const mongodb = require("../..")
const assert = require("assert")

describe("util.updated", function() {
    it("no old", function() {
        const nd = {}
        const od = null
        const got = mongodb.util.updated(nd, od)
        const want = {
            "$set": {},
        }

        assert.deepEqual(got, want)
    })
    it("simple add", function() {
        const nd = {
            "a": 1,
            "b": 2,
        }
        const od = {
            "a": 1,
        }
        const got = mongodb.util.updated(nd, od)
        const want = {
            "$set": {
                "b": 2,
            },
        }

        assert.deepEqual(got, want)
    })
    it("simple replace", function() {
        const nd = {
            "a": 1,
        }
        const od = {
            "a": 2,
        }
        const got = mongodb.util.updated(nd, od)
        const want = {
            "$set": {
                "a": 1,
            },
        }

        assert.deepEqual(got, want)
    })
    it("simple remove", function() {
        const nd = {
        }
        const od = {
            "a": 2,
        }
        const got = mongodb.util.updated(nd, od)
        const want = {
            "$unset": {
                "a": "",
            },
        }

        assert.deepEqual(got, want)
    })

    it("deep add", function() {
        const nd = {
            "child": {
                "a": 1,
                "b": 2,
            }
        }
        const od = {
            "child": {
                "a": 1,
            },
        }
        const got = mongodb.util.updated(nd, od)
        const want = {
            "$set": {
                "child.b": 2,
            },
        }

        assert.deepEqual(got, want)
    })
    it("deep replace", function() {
        const nd = {
            "child": {
                "a": 1,
            },
        }
        const od = {
            "child": {
                "a": 2,
            },
        }
        const got = mongodb.util.updated(nd, od)
        const want = {
            "$set": {
                "child.a": 1,
            },
        }

        assert.deepEqual(got, want)
    })
    it("deep remove", function() {
        const nd = {
            "child": {
            },
        }
        const od = {
            "child": {
                "a": 2,
            },
        }
        const got = mongodb.util.updated(nd, od)
        const want = {
            "$unset": {
                "child.a": "",
            },
        }

        assert.deepEqual(got, want)
    })
})
