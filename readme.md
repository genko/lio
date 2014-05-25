Iota
====

Iota is a source-to-source compiler which accepts [Io](http://iolanguage.org/) code and outputs JavaScript. It was written as an experiment for [CodeCombat's parser challenge](http://codecombat.challengepost.com/).

The project is very much still in its infancy (having been started way too late): only a minimal subset of Io is implemented. A number of core constructs and much of the standard library are not yet done.

Try it out [here](http://dariusf.github.io/iota/).

Features
--------

- messages and objects
- prototype chain
- object methods
- global and local contexts
- infix operators (supporting different precedence levels)
- assignment operators
- primitives: strings, numbers, boolean values, functions

Still to come
-------------

- `self`
- primitives: `nil`, lists
- call introspection
- most library functions
- prototype tree
- proper scope chain
- proper lazy argument evaluation
- defining operators of custom precedence
- defining assignment operators

Dependencies
------------

- [node.js](http://nodejs.org/)
- [Escodegen](https://github.com/Constellation/escodegen)


**Development**

- `make`
- [Jison](http://zaach.github.io/jison/)
- [Browserify](http://browserify.org/)

The AST constructed by the parser complies with the [Mozilla Parser API](https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API) specification.

Installation
------------

- `npm install iota-compiler`

Usage
-----

**node.js**

```js
var iota = require('iota-compiler');
var _io = iota.lib; // make runtime library available

eval(iota.compile('fact := method(n, if (n == 0, 1, n * fact (n - 1))); writeln(fact(5))'), false);
// => 120
```

**Browser**

A demo of Iota running in a web page can be found in `/demos/browser`.

```js
var iota = require('iota-compiler');

eval(iota.compile('fact := method(n, if (n == 0, 1, n * fact (n - 1))); writeln(fact(5))'), false);
// => 120
```
Simply include `iota-browser.js` and `lib.js` in your web page. Usage is the same as with node (complete with `require`, courtesy of Browserify), except that the `_io` binding isn't required.

**CLI**

```
node iota ./demos/node/demo.io
```

API
---

```js
iota.parse(code);
```
Returns a JavaScript object representing the syntax tree.

```js
iota.compile(code, options);
```
Returns a string of compiled JavaScript. `options` is a JavaScript object that allows you to tweak the behaviour of the parser:

- `boilerplate` If true, the compiled output will additionally be wrapped in a function for easier interfacing with the outside world. Defaults to `false`.
- `functionName` The name that will be given to the wrapper function if `boilerplate` is true. Defaults to `execute`.

License
-------
MIT