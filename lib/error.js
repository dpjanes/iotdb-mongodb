/**
 *  error.js
 *
 *  David Janes
 *  IOTDB
 *  2018-01-11
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const assert = require("assert");

const logger = require("../logger")(__filename)

/**
 *  Paramater: error || null
 *  Requires: self.mongodb
 *  Produces: N/A
 *
 *  The `handler` is invoked if redis produces an error.
 *  If there is no handler, we just die
 */
const error = handler => _.promise.make((self, done) => {
    const method = "error";

    assert.ok(self.mongodb, `${method}: expected self.mongodb`);

    self.mongodb.on("error", error => {
        if (!handler) {
            handler = sd => {
                logger.fatal({
                    method: method,
                    error: _.error.message(error),
                }, "MongoDB error die")

                process.nextTick(() => process.exit(1))
                return sd;
            }
        }

        logger.error({
            method: method,
            error: _.error.message(error),
        }, "MongoDB error detected - calling handler")

        _.promise.make(self)
            .then(handler)
            .catch(error => {
                logger.error({
                    method: method,
                    inner_error: _.error.message(inner_error),
                    redis_error: _.error.message(error),
                }, "MongoDB unexpected error handling error - doing nothing")
            })
    })
})

/**
 *  API
 */
exports.error = error;
