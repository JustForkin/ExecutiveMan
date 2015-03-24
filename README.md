![Executive Man Logo](https://raw.githubusercontent.com/CamHenlin/ExecutiveMan/master/images/execmanlogobig.png "executive man logo")

![Executive Man screenshot](https://raw.githubusercontent.com/CamHenlin/ExecutiveMan/master/images/screenshot.png "executive man screenshot")

#### Features
- nearly 100% correct NES MegaMan gameplay
- relatively easy to use touch controls
- chrome, firefox, and internet explorer joystick support
- save game support
- easy to edit Tiled levels

### Playable [here](http://executive-man.com/).

To run locally:
```
git clone https://github.com/CamHenlin/ExecutiveMan.git

cd ExecutiveMan

python -m SimpleHTTPServer
```
Then visit http://localhost:8000/index.html for minified game or http://localhost:8000/testindex.html for unminified game

To build minified game OR update levels after editing level json:
```
git clone https://github.com/CamHenlin/ExecutiveMan.git

cd ExecutiveMan

./compile.sh
```

![made with a mac](http://henlin.org/mac.gif "made with a mac")