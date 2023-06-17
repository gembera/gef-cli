const fs = require('fs')
const path = require('path')

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
        return [...modules, ...submodules].map(dir => {
            let fn = path.join(dir, 'package.json')
            if (!fs.existsSync(fn)) return false;
            let info = JSON.parse(fs.readFileSync(fn))
            return info.gembera ? dir : false
        }).filter(Boolean)
    }
    return []
}
function cwd(){
    return process.env.INIT_CWD || process.cwd()
}
module.exports = {
    cwd,
    mkdir,
    rmdir,
    cpdir,
    getPackages
}