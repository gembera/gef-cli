#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { getVersion, mkdir, cwd } = require('./lib/utils')
const protobuf = require('./lib/protobuf/protobuf')
console.log(`gpb-encode v${getVersion()}`)

let args = process.argv.slice(2)
let root = new protobuf.Root()
let output = 'output.json'
let type
let payload
args.forEach(arg => {
    let pos = arg.indexOf('=')
    if (pos >= 0) {
        let key = arg.substring(0, pos)
        let val = arg.substring(pos + 1)
        if (key === 'proto') {
            val.split(',').forEach(f => {
                let fnpb = path.join(cwd(), f)
                if (fs.existsSync(fnpb)) {
                    protobuf.parse.filename = f;
                    protobuf.parse(fs.readFileSync(fnpb), root);
                } else {
                    console.log(`Proto file ${fnpb} does not exist!`)
                }
            })
        } else if (key === 'input') {
            let fn = path.join(cwd(), val)
            if (fs.existsSync(fn)) {
                payload = fs.readFileSync(fn)
            } else {
                console.log(`Input file ${fn} does not exist!`)
            }
        } else if (key === 'output') {
            output = val
        } else if (key === 'type') {
            type = val
        }
    }
})
if (!type || !payload) {
    console.log('gpb-decode proto=File1,File2,... input=BinFile output=JsonFile type=ProtobufType')
    console.log('example : gpb-encode proto=file1.proto,file2.proto,... input=input.bin output=output.json type=SomeType')
    process.exist(-1)
}
root.resolveAll()
output = path.join(cwd(), output)
let pbtype = root.lookupType(type)
console.log("\x1b[1;34mInput:\x1b[1;0m")
console.log(payload)
let message = pbtype.decode(payload)
let obj = pbtype.toObject(message)
console.log("\x1b[1;34mOutput:\x1b[1;0m")
console.log(obj)
console.log(`Save output to ${output}`)
fs.writeFileSync(output, JSON.stringify(obj, ' ', 2))
