#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { mkdir, cwd } = require('./utils')

let args = process.argv.slice(2)
args.forEach(dir => {
    dir = path.join(cwd(), dir)
    console.log(`mkdir ${dir}`)
    mkdir(dir)
})