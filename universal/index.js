/*
 *  universal/index.js
 *
 *  David Janes
 *  Consensas
 *  2019-01-07
 */

"use strict"

module.exports = Object.assign(
    {},
    require("./all"),
    require("./create"),
    require("./by"),
    require("./remove"),
    require("./save"),
    require("./upsert"),
    {}
)
