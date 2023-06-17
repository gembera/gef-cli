# Why gef-cli?
When we use `cmake` to build C/C++ projects, we still need some basic command line tools to prepare the environment, recursively copy/delete some folders etc. You may write your shell script for linux. While your team members may suffer under windows. `gef-cli` is originally developped for `gef` family projects to make our lives easier. Of course, `gef-cli` could be used anywhere. 

# How to install `gef-cli`
Make sure you have at least node.js 14.x installed. It's recommended to use `yarn` instead of `npm`.

```shell
yarn global add @gembera/gef-cli
```
You could use above command to install or update `gef-cli` to the latest version. Once it is successfully installed, `yarn` will display something like:
```
yarn global v1.22.19
[1/4] 🔍  Resolving packages...
[2/4] 🚚  Fetching packages...
[3/4] 🔗  Linking dependencies...
[4/4] 🔨  Building fresh packages...
success Installed "@gembera/gef-cli@1.0.1" with binaries:
      - ginfo
      - genv
      - gcpdir
      - gmkdir
      - grmdir
      - gsync
✨  Done in 0.97s.
```

# How to use?
Basicly, after you install gef-cli, several command line tools are ready to use anywhere.
## ginfo
`ginfo` displays some basic infomation about your system:
```
$ ginfo 
ginfo v1.0.1
  nodejs: v16.19.1
  platform: darwin
  arch: x64
  cwd: /Users/jacky/workspace/gembera/gef-cli
  user: jacky
```
Add `-e` or `--env` argument to make `ginfo` display all environment variables.

## genv
`genv` is very powerful to manage complex environment variables. For example:
```
genv CMAKE_BUILD_TYPE=Debug CMAKE_GENERATOR="MinGW Makefiles" cmake .
```
It will be very verbose if there are many variables. `genv` allows to organize them in different config files. Let's say we have three configs:
* common
```
PROJECT=my project
```
* debug
```
CMAKE_BUILD_TYPE=Debug
```
* release
```
CMAKE_BUILD_TYPE=Release
```
They are placed in the `env` folder
```
env
 + common
 + debug
 + release
```
Now you could execute cmake with debug config :
```
genv gload=env/common,debug cmake .
```
which equals to 
```
PROJECT="my project" CMAKE_BUILD_TYPE=Debug cmake .
```
For release version, just replace `debug` with `release`:
```
genv gload=env/common,release cmake .
```
Of course, you could still override some environment variables with direct KEY=VALUE pairs:
```
genv gload=env/common,release CMAKE_BUILD_TYPE=Debug cmake .
```
The above command override `CMAKE_BUILD_TYPE=Release` to `CMAKE_BUILD_TYPE=Debug` again.

At many cases, we have to setup different environment variables for different OS. With `genv` it is pretty easy to do it. For example, We need MinGW cmake generator. We could just add another config with the name `common@win32`
* common@win32
```
CMAKE_GENERATOR=MinGW Makefiles
```
When you execute 
```
genv gload=env/common,debug cmake .
```
It will check if there is an OS specific config exists. In this case, `env/common` has `env/common@win32` peer config. It will be loaded automatically. Thus the full command will be expanded as:
```
PROJECT="my project" CMAKE_BUILD_TYPE=Debug CMAKE_GENERATOR="MinGW Makefiles" cmake .
```
Execute `ginfo` to get your platform name. For MacOS, it will be `darwin`. You could create 
* common@darwin
```
CMAKE_GENERATOR=Xcode
```
In this case, the full command will be
```
PROJECT="my project" CMAKE_BUILD_TYPE=Debug CMAKE_GENERATOR=Xcode cmake .
``` 
## gmkdir {dir1} {dir2} ...
`gmkdir` creates a any deep directory relative to current work directory. 

```
$ cd /tmp
$ gmkdir build/debug build/release
gmkdir v1.0.1
  mkdir /tmp/build/debug
  mkdir /tmp/build/release
```
## grmdir {dir1} {dir2} ...
`grmdir` recursively deletes target directories.
```
$ cd /tmp
$ grmdir build/debug build/release
grmdir v1.0.1
  rmdir /tmp/build/debug
  rmdir /tmp/build/release
```
## gcpdir {dirFrom} {dirTo}
`gcpdir` recursively copies all files in `dirFrom` to `dirTo`

## gsync 
`gsync` is used to copy gembera projects from `node_modules` to `pkgs`
