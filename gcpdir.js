#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { rmdir } = require('./utils')

let args = process.argv.slice(2)
if (args.length == 2){
    let dirSrc = path.join(process.cwd(), args[0])
    let dirDst = path.join(process.cwd(), args[1])
    console.log(`cpdir ${dirSrc} -> ${dirDst}`)
    cpdir(dirSrc, dirDst)
}