#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { cwd, getVersion, GPLATFORM } = require('./lib/utils')
const crossEnv = require('./lib/cross-env')
const PREFIX_GENV = 'gload='
const PREFIX_GPLATFORM = `${GPLATFORM}=`

console.log(`genv v${getVersion()}`)

let args = process.argv.slice(2)
let extra = []
let platform = process.platform
let envFiles = []
args.forEach(arg => {
    if (arg.indexOf(PREFIX_GENV) == 0) {
        arg.substring(PREFIX_GENV.length).split(';').forEach(fn => {
            let parts = fn.split(',')
            envFiles.push(path.join(cwd(), parts[0]))
            let pos = parts[0].lastIndexOf('/')
            for (let i = 1; i < parts.length; i++) {
                envFiles.push(path.join(cwd(), pos == -1 ? parts[i] : parts[0].substring(0, pos + 1) + parts[i]))
            }
        })
    } else if (arg.indexOf(PREFIX_GPLATFORM) == 0) {
        platform = arg.substring(PREFIX_GPLATFORM.length)
    }
})

function loadEnvFile(fn){
    return fs.readFileSync(fn).toString().split('\n').map(s => s.trim()).filter(s => s && s[0] !== '#')
}
envFiles.forEach(fn => {
    if (fs.existsSync(fn)) {
        extra = [...extra, ...loadEnvFile(fn)]
    }
    fn += '@' + platform
    if (fs.existsSync(fn)) {
        extra = [...extra, ...loadEnvFile(fn)]
    }
})

let exists = {}
let indexToRemove = {}
extra.forEach((s, i)=> {
    let pos = s.indexOf('=')
    if (pos == -1) return 
    let key = s.substring(0, pos)
    if (undefined !== exists[key]){
        indexToRemove[exists[key]] = true
    }
    exists[key] = i
})
extra = extra.filter((s, i) => !indexToRemove[i])

console.log('  command: ' + [...extra, ...args].join(' '))
let proc = crossEnv([...extra, ...args])
let debug = proc.$env['glog'] == 'debug'
if (debug) {
    console.log(proc.$command, proc.$args)
    console.log(proc.$env)
}