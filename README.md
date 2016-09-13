Coyote quiz
============

This is a node-webkit based desktop app to create and run quizzes.

The usage scenarios are described in the [quiz.feature](quiz.feature) file.

Technologies used:

- nwjs
- react for view handling
- backbone for data handling

Development and Build
----------------------

Dev setup

    npm install
    cd app.nw
    npm install
    cd ..
    node_modules/.bin/babel --presets react jsx --watch --out-dir app.nw/js/components/


Build:

    npm run build

Run:

    npm start
