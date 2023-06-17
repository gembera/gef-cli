#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { rmdir, getVersion, cwd } = require('./lib/utils')

console.log(`grmdir v${getVersion()}`)
let args = process.argv.slice(2)
args.forEach(dir => {
    dir = path.join(cwd(), dir)
    console.log(`  rmdir ${dir}`)
    rmdir(dir)
})