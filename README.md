Coyote quiz
============

This is a node-webkit based desktop app to create and run quizzes.

The usage scenarios are described in the [quiz.feature](quiz.feature) file.

Development and Build
----------------------

node_modules/.bin/babel --presets react jsx --watch --out-dir app.nw/js

./nwjs-sdk-v0.13.0-beta4-osx-x64/nwjs.app/Contents/MacOS/nwjs app.nw