#!/usr/bin/env node
const os = require("os")
const { getVersion, cwd, getPlatform } = require('./lib/utils')
console.log(`ginfo v${getVersion()}`)
console.log(`  nodejs: ${process.version}`)
console.log(`  platform: ${getPlatform()}`)
console.log(`  arch: ${process.arch}`)
console.log(`  cwd: ${cwd()}`)
console.log(`  user: ${os.userInfo().username}`)
let args = process.argv.slice(2)
args.forEach(arg => {
    if (arg == '-e' || arg == '--env'){
        console.log('  environment:')
        let vars = Object.entries(process.env).map(function ([key, value], index) {
            return `  > ${key} = ${value}`
        })
        console.log(vars.join('\r\n'))
    }
})