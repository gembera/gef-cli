#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { getVersion, cpdir, cwd } = require('./lib/utils')
console.log(`gcpdir v${getVersion()}`)

let args = process.argv.slice(2)
if (args.length == 2) {
    let dirSrc = path.join(cwd(), args[0])
    let dirDst = path.join(cwd(), args[1])
    console.log(`  cpdir ${dirSrc} -> ${dirDst}`)
    cpdir(dirSrc, dirDst)
}