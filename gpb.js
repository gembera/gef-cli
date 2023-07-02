#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const { getVersion, cpdir, cwd } = require('./lib/utils')
const protobuf = require('./lib/protobuf/protobuf')
console.log(`gpb v${getVersion()}`)

let output = 'output.c'
let args = process.argv.slice(2)
let root = new protobuf.Root()
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
        } else if (key === 'output') {
            output = val
        }
    }
})
root.resolveAll()
const userTypes = {}
function traverseTypes(current) {
    if (current instanceof protobuf.Type || current instanceof protobuf.Enum)
        userTypes[current.name] = current
    if (current.nestedArray)
        current.nestedArray.forEach(function (nested) {
            traverseTypes(nested);
        });
}
traverseTypes(root)
const basicTypes = [
    'int32', 'int64', 'uint32', 'uint64', 'sint32', 'sint64', 'bool', /*enum ,*/
    'fixed64', 'sfixed64', 'double',
    'fixed32', 'sfixed32', 'float',
    'string', 'bytes' /*, embedded messages, packed repeated fields*/
]
const typeMap = {}
basicTypes.forEach(t => typeMap[t] = `PBT_${t.toUpperCase()}`)

const rootType = root.toJSON()
const types = Object.keys(rootType.nested)
let code = ""
types.forEach(tname => {
    const type = rootType.nested[tname]
    const names = Object.keys(type.fields)
    const allDefs = []
    names.forEach(fname => {
        const field = type.fields[fname]
        let ftype = typeMap[field.type]
        let ut = userTypes[field.type]
        const repeated = field.rule === 'repeated'
        if (ut) {
            ftype = ut instanceof protobuf.Enum ? "PBT_ENUM" : "PBT_MESSAGE"
        }
        const defs = [field.id, `"${fname}"`, ftype]
        if (ut) {
            defs.push(`"${field.type}"`)
        }
        if (repeated) {
            if (!defs[3]) defs[3] = 'NULL'
            defs[4] = 'TRUE'
        }
        allDefs.push(`\t\t{${defs.join(',')}}`)
    })
    allDefs.push('\t\t0')
    code += `\tGPbField ${tname.toLowerCase()}_fields[] = {\n${allDefs.join(',\n')}\n\t};\n`
    code += `\tg_pb_message_type_new("${tname}", ${tname.toLowerCase()}_fields);\n\n`
})
code = `#include "gprotobuf.h"\nvoid protobuf_init(){\n${code}}`
console.log("\x1b[1;34mGenerated Code:\x1b[1;0m")
console.log(code)
output = path.join(cwd(), output)
console.log(`\n\nSave output to ${output}`)
fs.writeFileSync(output, code)
