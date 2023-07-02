#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { getVersion, mkdir, cwd } = require('./lib/utils')
const protobuf = require('./lib/protobuf/protobuf')
console.log(`gpb-encode v${getVersion()}`)

let args = process.argv.slice(2)
let root = new protobuf.Root()
let output = 'output.bin'
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
                payload = JSON.parse(fs.readFileSync(fn))
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
    console.log('gpb-encode proto=File1,File2,... input=JsonFile output=BinFile type=ProtobufType')
    console.log('example : gpb-encode proto=file1.proto,file2.proto,... input=input.json output=output.bin type=SomeType')
    process.exit(-1)
}
root.resolveAll()
output = path.join(cwd(), output)
let pbtype = root.lookupType(type)
console.log("\x1b[1;34mInput:\x1b[1;0m")
console.log(type, payload)
let message = pbtype.create(payload)
let buffer = pbtype.encode(message).finish()
let hex = Array.from(buffer).map((b) => '0x' + b.toString(16).padStart(2, "0")).join(",");
console.log("\x1b[1;34mOutput:\x1b[1;0m")
console.log('guint8 protobuf[] = { ', hex, '};')
hex = Array.from(buffer).map((b) => b.toString(16).padStart(2, "0")).join("");
console.log('Bin Output : ', hex)
console.log(`Save output to ${output}`)
fs.writeFileSync(output, buffer)
