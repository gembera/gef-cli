#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { rmdir, cpdir, cwd, getPackages, getVersion } = require('./lib/utils')

console.log(`gsync v${getVersion()}`)
let args = process.argv.slice(2)
getPackages().forEach(dirSrc => {
    let dirDst = path.join(cwd(), args[0] || 'pkgs', path.basename(dirSrc))
    rmdir(dirDst)
    console.log(`  sync ${dirSrc} -> ${dirDst}`)
    cpdir(dirSrc, dirDst, {
        filter(fn) {
            return fn !== '.git' && fn !== 'node_modules'
        }
    })
})