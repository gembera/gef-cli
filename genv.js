#!/usr/bin/env node

console.log(process.argv.slice(2))
console.log("Environment Variables:")
//console.log(process.env)

const fs = require('fs')
const path = require('path')
const { mkdir, rmdir, cpdir, getPackages } = require('./utils')

rmdir(path.join(process.cwd(), 'build'))
mkdir(path.join(process.cwd(), 'build', 'debug'))
mkdir(path.join(process.cwd(), 'build', 'release'))

rmdir(path.join(process.cwd(), 'pkgs'))

getPackages().forEach(dirSrc => {
    let dirDst = path.join(process.cwd(), 'pkgs', path.basename(dirSrc))
    cpdir(dirSrc, dirDst)
})