/*
 *  logger.js
 *
 *  David Janes
 *  IOTDB.org
 *  2017-01-11
 *
 *  Copyright (2013-2018) David Janes
 */

"use strict";

const _ = require("iotdb-helpers");

const path = require("path");

const _root = path.dirname(path.dirname(__filename));

const logger = (source) => _.logger.make({
    name: "iotdb-mongodb",
    source: source.substring(_root.length + 1).replace(/[.]js$/, ""),
})

/**
 *  API
 */
module.exports = logger;
