#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { rmdir, cpdir, getPackages } = require('./utils')


let args = process.argv.slice(2)

getPackages().forEach(dirSrc => {
    let dirDst = path.join(process.cwd(), args[0] || 'pkgs', path.basename(dirSrc))
    rmdir(dirDst)
    cpdir(dirSrc, dirDst, {
        filter(fn) {
            return fn !== '.git' && fn !== 'node_modules'
        }
    })
})