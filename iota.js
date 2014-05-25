
var fs = require('fs');
var path = require('path');

var compile = require('./src/compile');
var lib = require('./src/lib');

var args = process.argv.slice(2);
var filename = args[0];

function compileCode(input, options) {
	options = options || {};

	var result = compile.compile(input);

	result = (options.boilerplate ? boilerplateBefore(options.name) : "") + result + (options.boilerplate ? boilerplateAfter : "");

	return result.trim();
}

function parse(input) {
	return compile.parse(input);
}

if (filename) {
	var code = fs.readFileSync(path.resolve(__dirname, filename), {encoding: 'utf-8'});
	console.log(JSON.stringify(parse(code), null, 4));
}

module.exports = {
	compile: compileCode,
	parse: parse,
	lib: lib
};

function boilerplateBefore (name) {
	name = name || "execute";

	return "function " + name + " () {\n" +
	"	var obj = this || {};\n" +
	"\n" +
	"	var localsProxy = new _io.IoProxy(_io.Lobby, function (message) {\n" +
	"		if (obj.hasOwnProperty(message)) {\n" +
	"			this.stopPrototypePropagation();\n" +
	"			var args = Array.prototype.slice.call(arguments, 1);\n" +
	"			args = args.map(_io.unwrapIoValue);" +
	"			return obj[message].apply(obj, args);\n" +
	"		}\n" +
	"	});\n" +
	"\n" +
	"	var playerProxy = new _io.IoProxy(_io.Lobby, function (message) {\n" +
	"		if (message === 'chooseAction') {\n" +
	"\n" +
	"			this.stopPrototypePropagation();\n" +
	"\n" +
	"			var args = Array.prototype.slice.call(arguments, 1);\n" +
	"			var slot = this.findSlot(message);\n" +
	"			slot.activate.locals = localsProxy;\n" +
	"\n" +
	"			// unwrap arguments\n" +
	"			args = args.map(_io.unwrapIoValue);" +
	"\n" +
	"			return slot.activate.apply(slot, [_io.IoRootObject].concat(args));\n" +
	"		}\n" +
	"	});\n" +
	"\n" +
	"	_io.Lobby.slots['player'] = playerProxy;\n\n";
}

var boilerplateAfter = "\n\n}";
