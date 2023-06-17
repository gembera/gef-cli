#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { rmdir, cwd } = require('./utils')

let args = process.argv.slice(2)
if (args.length == 2){
    let dirSrc = path.join(cwd(), args[0])
    let dirDst = path.join(cwd(), args[1])
    console.log(`cpdir ${dirSrc} -> ${dirDst}`)
    cpdir(dirSrc, dirDst)
}