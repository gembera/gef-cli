const fs = require('fs')
const path = require('path')

const GPLATFORM = 'gplatform'
function mkdir(dir) {
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir, { recursive: true })
}
function rmdir(dir) {
    if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach(fn => {
            fn = path.join(dir, fn)
            if (fs.lstatSync(fn).isDirectory()) {
                rmdir(fn)
            } else {
                fs.unlinkSync(fn)
            }
        })
        fs.rmdirSync(dir)
    }
}
function cpdir(dirSrc, dirDst, options) {
    if (fs.existsSync(dirSrc)) {
        mkdir(dirDst)
        fs.readdirSync(dirSrc).forEach(fn => {
            if (options && options.filter && !options.filter(fn, dirSrc)) return
            let fnSrc = path.join(dirSrc, fn)
            let fnDst = path.join(dirDst, fn)
            if (fs.lstatSync(fnSrc).isDirectory()) {
                cpdir(fnSrc, fnDst)
            } else {
                fs.copyFileSync(fnSrc, fnDst)
            }
        })
    }
}
function getPackages() {
    let dirModules = path.join(cwd(), 'node_modules')
    if (fs.existsSync(dirModules)) {
        let submodules = []
        let modules = fs.readdirSync(dirModules).filter((dir) => {
            let dirCurrent = path.join(dirModules, dir)
            if (!fs.statSync(dirCurrent).isDirectory()) return false;
            let hasSubmodules = dir[0] == '@'
            if (hasSubmodules) {
                submodules = [...submodules, ...fs.readdirSync(dirCurrent).map(dir => path.join(dirCurrent, dir))]
            }
            return !hasSubmodules
        }).map(dir => path.join(dirModules, dir))
        return [...modules, ...submodules]
    }
    return []
}
function cwd(){
    return process.env.INIT_CWD || process.cwd()
}
function getVersion(){
    return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'))).version
}
function getPlatform(){
    return process.env[GPLATFORM] || process.platform
}
module.exports = {
    GPLATFORM,
    cwd,
    mkdir,
    rmdir,
    cpdir,
    getPackages,
    getVersion,
    getPlatform
}