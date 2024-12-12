'use strict';

var require$$0 = require('events');
var require$$1$1 = require('child_process');
var require$$2 = require('path');
var require$$0$1 = require('fs');
var require$$4 = require('process');
var require$$0$2 = require('os');
var require$$1$2 = require('tty');
var require$$0$4 = require('assert');
var require$$0$3 = require('readline');
require('console');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
var require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1$1);
var require$$2__default = /*#__PURE__*/_interopDefaultLegacy(require$$2);
var require$$0__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$0$1);
var require$$4__default = /*#__PURE__*/_interopDefaultLegacy(require$$4);
var require$$0__default$2 = /*#__PURE__*/_interopDefaultLegacy(require$$0$2);
var require$$1__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$1$2);
var require$$0__default$4 = /*#__PURE__*/_interopDefaultLegacy(require$$0$4);
var require$$0__default$3 = /*#__PURE__*/_interopDefaultLegacy(require$$0$3);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var main$1 = {};

var commander = {exports: {}};

var argument = {};

var error = {};

// @ts-check

/**
 * CommanderError class
 * @class
 */
class CommanderError$1 extends Error {
  /**
   * Constructs the CommanderError class
   * @param {number} exitCode suggested exit code which could be used with process.exit
   * @param {string} code an id string representing the error
   * @param {string} message human-readable description of the error
   * @constructor
   */
  constructor(exitCode, code, message) {
    super(message);
    // properly capture stack trace in Node.js
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.code = code;
    this.exitCode = exitCode;
    this.nestedError = undefined;
  }
}

/**
 * InvalidArgumentError class
 * @class
 */
class InvalidArgumentError$2 extends CommanderError$1 {
  /**
   * Constructs the InvalidArgumentError class
   * @param {string} [message] explanation of why argument is invalid
   * @constructor
   */
  constructor(message) {
    super(1, 'commander.invalidArgument', message);
    // properly capture stack trace in Node.js
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
  }
}

error.CommanderError = CommanderError$1;
error.InvalidArgumentError = InvalidArgumentError$2;

const { InvalidArgumentError: InvalidArgumentError$1 } = error;

// @ts-check

class Argument$1 {
  /**
   * Initialize a new command argument with the given name and description.
   * The default is that the argument is required, and you can explicitly
   * indicate this with <> around the name. Put [] around the name for an optional argument.
   *
   * @param {string} name
   * @param {string} [description]
   */

  constructor(name, description) {
    this.description = description || '';
    this.variadic = false;
    this.parseArg = undefined;
    this.defaultValue = undefined;
    this.defaultValueDescription = undefined;
    this.argChoices = undefined;

    switch (name[0]) {
      case '<': // e.g. <required>
        this.required = true;
        this._name = name.slice(1, -1);
        break;
      case '[': // e.g. [optional]
        this.required = false;
        this._name = name.slice(1, -1);
        break;
      default:
        this.required = true;
        this._name = name;
        break;
    }

    if (this._name.length > 3 && this._name.slice(-3) === '...') {
      this.variadic = true;
      this._name = this._name.slice(0, -3);
    }
  }

  /**
   * Return argument name.
   *
   * @return {string}
   */

  name() {
    return this._name;
  }

  /**
   * @api private
   */

  _concatValue(value, previous) {
    if (previous === this.defaultValue || !Array.isArray(previous)) {
      return [value];
    }

    return previous.concat(value);
  }

  /**
   * Set the default value, and optionally supply the description to be displayed in the help.
   *
   * @param {any} value
   * @param {string} [description]
   * @return {Argument}
   */

  default(value, description) {
    this.defaultValue = value;
    this.defaultValueDescription = description;
    return this;
  }

  /**
   * Set the custom handler for processing CLI command arguments into argument values.
   *
   * @param {Function} [fn]
   * @return {Argument}
   */

  argParser(fn) {
    this.parseArg = fn;
    return this;
  }

  /**
   * Only allow argument value to be one of choices.
   *
   * @param {string[]} values
   * @return {Argument}
   */

  choices(values) {
    this.argChoices = values.slice();
    this.parseArg = (arg, previous) => {
      if (!this.argChoices.includes(arg)) {
        throw new InvalidArgumentError$1(`Allowed choices are ${this.argChoices.join(', ')}.`);
      }
      if (this.variadic) {
        return this._concatValue(arg, previous);
      }
      return arg;
    };
    return this;
  }

  /**
   * Make argument required.
   */
  argRequired() {
    this.required = true;
    return this;
  }

  /**
   * Make argument optional.
   */
  argOptional() {
    this.required = false;
    return this;
  }
}

/**
 * Takes an argument and returns its human readable equivalent for help usage.
 *
 * @param {Argument} arg
 * @return {string}
 * @api private
 */

function humanReadableArgName$2(arg) {
  const nameOutput = arg.name() + (arg.variadic === true ? '...' : '');

  return arg.required
    ? '<' + nameOutput + '>'
    : '[' + nameOutput + ']';
}

argument.Argument = Argument$1;
argument.humanReadableArgName = humanReadableArgName$2;

var command = {};

var help = {};

const { humanReadableArgName: humanReadableArgName$1 } = argument;

/**
 * TypeScript import types for JSDoc, used by Visual Studio Code IntelliSense and `npm run typescript-checkJS`
 * https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#import-types
 * @typedef { import("./argument.js").Argument } Argument
 * @typedef { import("./command.js").Command } Command
 * @typedef { import("./option.js").Option } Option
 */

// @ts-check

// Although this is a class, methods are static in style to allow override using subclass or just functions.
class Help$1 {
  constructor() {
    this.helpWidth = undefined;
    this.sortSubcommands = false;
    this.sortOptions = false;
    this.showGlobalOptions = false;
  }

  /**
   * Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one.
   *
   * @param {Command} cmd
   * @returns {Command[]}
   */

  visibleCommands(cmd) {
    const visibleCommands = cmd.commands.filter(cmd => !cmd._hidden);
    if (cmd._hasImplicitHelpCommand()) {
      // Create a command matching the implicit help command.
      const [, helpName, helpArgs] = cmd._helpCommandnameAndArgs.match(/([^ ]+) *(.*)/);
      const helpCommand = cmd.createCommand(helpName)
        .helpOption(false);
      helpCommand.description(cmd._helpCommandDescription);
      if (helpArgs) helpCommand.arguments(helpArgs);
      visibleCommands.push(helpCommand);
    }
    if (this.sortSubcommands) {
      visibleCommands.sort((a, b) => {
        // @ts-ignore: overloaded return type
        return a.name().localeCompare(b.name());
      });
    }
    return visibleCommands;
  }

  /**
   * Compare options for sort.
   *
   * @param {Option} a
   * @param {Option} b
   * @returns number
   */
  compareOptions(a, b) {
    const getSortKey = (option) => {
      // WYSIWYG for order displayed in help. Short used for comparison if present. No special handling for negated.
      return option.short ? option.short.replace(/^-/, '') : option.long.replace(/^--/, '');
    };
    return getSortKey(a).localeCompare(getSortKey(b));
  }

  /**
   * Get an array of the visible options. Includes a placeholder for the implicit help option, if there is one.
   *
   * @param {Command} cmd
   * @returns {Option[]}
   */

  visibleOptions(cmd) {
    const visibleOptions = cmd.options.filter((option) => !option.hidden);
    // Implicit help
    const showShortHelpFlag = cmd._hasHelpOption && cmd._helpShortFlag && !cmd._findOption(cmd._helpShortFlag);
    const showLongHelpFlag = cmd._hasHelpOption && !cmd._findOption(cmd._helpLongFlag);
    if (showShortHelpFlag || showLongHelpFlag) {
      let helpOption;
      if (!showShortHelpFlag) {
        helpOption = cmd.createOption(cmd._helpLongFlag, cmd._helpDescription);
      } else if (!showLongHelpFlag) {
        helpOption = cmd.createOption(cmd._helpShortFlag, cmd._helpDescription);
      } else {
        helpOption = cmd.createOption(cmd._helpFlags, cmd._helpDescription);
      }
      visibleOptions.push(helpOption);
    }
    if (this.sortOptions) {
      visibleOptions.sort(this.compareOptions);
    }
    return visibleOptions;
  }

  /**
   * Get an array of the visible global options. (Not including help.)
   *
   * @param {Command} cmd
   * @returns {Option[]}
   */

  visibleGlobalOptions(cmd) {
    if (!this.showGlobalOptions) return [];

    const globalOptions = [];
    for (let parentCmd = cmd.parent; parentCmd; parentCmd = parentCmd.parent) {
      const visibleOptions = parentCmd.options.filter((option) => !option.hidden);
      globalOptions.push(...visibleOptions);
    }
    if (this.sortOptions) {
      globalOptions.sort(this.compareOptions);
    }
    return globalOptions;
  }

  /**
   * Get an array of the arguments if any have a description.
   *
   * @param {Command} cmd
   * @returns {Argument[]}
   */

  visibleArguments(cmd) {
    // Side effect! Apply the legacy descriptions before the arguments are displayed.
    if (cmd._argsDescription) {
      cmd._args.forEach(argument => {
        argument.description = argument.description || cmd._argsDescription[argument.name()] || '';
      });
    }

    // If there are any arguments with a description then return all the arguments.
    if (cmd._args.find(argument => argument.description)) {
      return cmd._args;
    }
    return [];
  }

  /**
   * Get the command term to show in the list of subcommands.
   *
   * @param {Command} cmd
   * @returns {string}
   */

  subcommandTerm(cmd) {
    // Legacy. Ignores custom usage string, and nested commands.
    const args = cmd._args.map(arg => humanReadableArgName$1(arg)).join(' ');
    return cmd._name +
      (cmd._aliases[0] ? '|' + cmd._aliases[0] : '') +
      (cmd.options.length ? ' [options]' : '') + // simplistic check for non-help option
      (args ? ' ' + args : '');
  }

  /**
   * Get the option term to show in the list of options.
   *
   * @param {Option} option
   * @returns {string}
   */

  optionTerm(option) {
    return option.flags;
  }

  /**
   * Get the argument term to show in the list of arguments.
   *
   * @param {Argument} argument
   * @returns {string}
   */

  argumentTerm(argument) {
    return argument.name();
  }

  /**
   * Get the longest command term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */

  longestSubcommandTermLength(cmd, helper) {
    return helper.visibleCommands(cmd).reduce((max, command) => {
      return Math.max(max, helper.subcommandTerm(command).length);
    }, 0);
  }

  /**
   * Get the longest option term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */

  longestOptionTermLength(cmd, helper) {
    return helper.visibleOptions(cmd).reduce((max, option) => {
      return Math.max(max, helper.optionTerm(option).length);
    }, 0);
  }

  /**
   * Get the longest global option term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */

  longestGlobalOptionTermLength(cmd, helper) {
    return helper.visibleGlobalOptions(cmd).reduce((max, option) => {
      return Math.max(max, helper.optionTerm(option).length);
    }, 0);
  }

  /**
   * Get the longest argument term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */

  longestArgumentTermLength(cmd, helper) {
    return helper.visibleArguments(cmd).reduce((max, argument) => {
      return Math.max(max, helper.argumentTerm(argument).length);
    }, 0);
  }

  /**
   * Get the command usage to be displayed at the top of the built-in help.
   *
   * @param {Command} cmd
   * @returns {string}
   */

  commandUsage(cmd) {
    // Usage
    let cmdName = cmd._name;
    if (cmd._aliases[0]) {
      cmdName = cmdName + '|' + cmd._aliases[0];
    }
    let parentCmdNames = '';
    for (let parentCmd = cmd.parent; parentCmd; parentCmd = parentCmd.parent) {
      parentCmdNames = parentCmd.name() + ' ' + parentCmdNames;
    }
    return parentCmdNames + cmdName + ' ' + cmd.usage();
  }

  /**
   * Get the description for the command.
   *
   * @param {Command} cmd
   * @returns {string}
   */

  commandDescription(cmd) {
    // @ts-ignore: overloaded return type
    return cmd.description();
  }

  /**
   * Get the subcommand summary to show in the list of subcommands.
   * (Fallback to description for backwards compatibility.)
   *
   * @param {Command} cmd
   * @returns {string}
   */

  subcommandDescription(cmd) {
    // @ts-ignore: overloaded return type
    return cmd.summary() || cmd.description();
  }

  /**
   * Get the option description to show in the list of options.
   *
   * @param {Option} option
   * @return {string}
   */

  optionDescription(option) {
    const extraInfo = [];

    if (option.argChoices) {
      extraInfo.push(
        // use stringify to match the display of the default value
        `choices: ${option.argChoices.map((choice) => JSON.stringify(choice)).join(', ')}`);
    }
    if (option.defaultValue !== undefined) {
      // default for boolean and negated more for programmer than end user,
      // but show true/false for boolean option as may be for hand-rolled env or config processing.
      const showDefault = option.required || option.optional ||
        (option.isBoolean() && typeof option.defaultValue === 'boolean');
      if (showDefault) {
        extraInfo.push(`default: ${option.defaultValueDescription || JSON.stringify(option.defaultValue)}`);
      }
    }
    // preset for boolean and negated are more for programmer than end user
    if (option.presetArg !== undefined && option.optional) {
      extraInfo.push(`preset: ${JSON.stringify(option.presetArg)}`);
    }
    if (option.envVar !== undefined) {
      extraInfo.push(`env: ${option.envVar}`);
    }
    if (extraInfo.length > 0) {
      return `${option.description} (${extraInfo.join(', ')})`;
    }

    return option.description;
  }

  /**
   * Get the argument description to show in the list of arguments.
   *
   * @param {Argument} argument
   * @return {string}
   */

  argumentDescription(argument) {
    const extraInfo = [];
    if (argument.argChoices) {
      extraInfo.push(
        // use stringify to match the display of the default value
        `choices: ${argument.argChoices.map((choice) => JSON.stringify(choice)).join(', ')}`);
    }
    if (argument.defaultValue !== undefined) {
      extraInfo.push(`default: ${argument.defaultValueDescription || JSON.stringify(argument.defaultValue)}`);
    }
    if (extraInfo.length > 0) {
      const extraDescripton = `(${extraInfo.join(', ')})`;
      if (argument.description) {
        return `${argument.description} ${extraDescripton}`;
      }
      return extraDescripton;
    }
    return argument.description;
  }

  /**
   * Generate the built-in help text.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {string}
   */

  formatHelp(cmd, helper) {
    const termWidth = helper.padWidth(cmd, helper);
    const helpWidth = helper.helpWidth || 80;
    const itemIndentWidth = 2;
    const itemSeparatorWidth = 2; // between term and description
    function formatItem(term, description) {
      if (description) {
        const fullText = `${term.padEnd(termWidth + itemSeparatorWidth)}${description}`;
        return helper.wrap(fullText, helpWidth - itemIndentWidth, termWidth + itemSeparatorWidth);
      }
      return term;
    }
    function formatList(textArray) {
      return textArray.join('\n').replace(/^/gm, ' '.repeat(itemIndentWidth));
    }

    // Usage
    let output = [`Usage: ${helper.commandUsage(cmd)}`, ''];

    // Description
    const commandDescription = helper.commandDescription(cmd);
    if (commandDescription.length > 0) {
      output = output.concat([commandDescription, '']);
    }

    // Arguments
    const argumentList = helper.visibleArguments(cmd).map((argument) => {
      return formatItem(helper.argumentTerm(argument), helper.argumentDescription(argument));
    });
    if (argumentList.length > 0) {
      output = output.concat(['Arguments:', formatList(argumentList), '']);
    }

    // Options
    const optionList = helper.visibleOptions(cmd).map((option) => {
      return formatItem(helper.optionTerm(option), helper.optionDescription(option));
    });
    if (optionList.length > 0) {
      output = output.concat(['Options:', formatList(optionList), '']);
    }

    if (this.showGlobalOptions) {
      const globalOptionList = helper.visibleGlobalOptions(cmd).map((option) => {
        return formatItem(helper.optionTerm(option), helper.optionDescription(option));
      });
      if (globalOptionList.length > 0) {
        output = output.concat(['Global Options:', formatList(globalOptionList), '']);
      }
    }

    // Commands
    const commandList = helper.visibleCommands(cmd).map((cmd) => {
      return formatItem(helper.subcommandTerm(cmd), helper.subcommandDescription(cmd));
    });
    if (commandList.length > 0) {
      output = output.concat(['Commands:', formatList(commandList), '']);
    }

    return output.join('\n');
  }

  /**
   * Calculate the pad width from the maximum term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */

  padWidth(cmd, helper) {
    return Math.max(
      helper.longestOptionTermLength(cmd, helper),
      helper.longestGlobalOptionTermLength(cmd, helper),
      helper.longestSubcommandTermLength(cmd, helper),
      helper.longestArgumentTermLength(cmd, helper)
    );
  }

  /**
   * Wrap the given string to width characters per line, with lines after the first indented.
   * Do not wrap if insufficient room for wrapping (minColumnWidth), or string is manually formatted.
   *
   * @param {string} str
   * @param {number} width
   * @param {number} indent
   * @param {number} [minColumnWidth=40]
   * @return {string}
   *
   */

  wrap(str, width, indent, minColumnWidth = 40) {
    // Detect manually wrapped and indented strings by searching for line breaks
    // followed by multiple spaces/tabs.
    if (str.match(/[\n]\s+/)) return str;
    // Do not wrap if not enough room for a wrapped column of text (as could end up with a word per line).
    const columnWidth = width - indent;
    if (columnWidth < minColumnWidth) return str;

    const leadingStr = str.slice(0, indent);
    const columnText = str.slice(indent);

    const indentString = ' '.repeat(indent);
    const regex = new RegExp('.{1,' + (columnWidth - 1) + '}([\\s\u200B]|$)|[^\\s\u200B]+?([\\s\u200B]|$)', 'g');
    const lines = columnText.match(regex) || [];
    return leadingStr + lines.map((line, i) => {
      if (line.slice(-1) === '\n') {
        line = line.slice(0, line.length - 1);
      }
      return ((i > 0) ? indentString : '') + line.trimRight();
    }).join('\n');
  }
}

help.Help = Help$1;

var option = {};

const { InvalidArgumentError } = error;

// @ts-check

class Option$1 {
  /**
   * Initialize a new `Option` with the given `flags` and `description`.
   *
   * @param {string} flags
   * @param {string} [description]
   */

  constructor(flags, description) {
    this.flags = flags;
    this.description = description || '';

    this.required = flags.includes('<'); // A value must be supplied when the option is specified.
    this.optional = flags.includes('['); // A value is optional when the option is specified.
    // variadic test ignores <value,...> et al which might be used to describe custom splitting of single argument
    this.variadic = /\w\.\.\.[>\]]$/.test(flags); // The option can take multiple values.
    this.mandatory = false; // The option must have a value after parsing, which usually means it must be specified on command line.
    const optionFlags = splitOptionFlags$1(flags);
    this.short = optionFlags.shortFlag;
    this.long = optionFlags.longFlag;
    this.negate = false;
    if (this.long) {
      this.negate = this.long.startsWith('--no-');
    }
    this.defaultValue = undefined;
    this.defaultValueDescription = undefined;
    this.presetArg = undefined;
    this.envVar = undefined;
    this.parseArg = undefined;
    this.hidden = false;
    this.argChoices = undefined;
    this.conflictsWith = [];
    this.implied = undefined;
  }

  /**
   * Set the default value, and optionally supply the description to be displayed in the help.
   *
   * @param {any} value
   * @param {string} [description]
   * @return {Option}
   */

  default(value, description) {
    this.defaultValue = value;
    this.defaultValueDescription = description;
    return this;
  }

  /**
   * Preset to use when option used without option-argument, especially optional but also boolean and negated.
   * The custom processing (parseArg) is called.
   *
   * @example
   * new Option('--color').default('GREYSCALE').preset('RGB');
   * new Option('--donate [amount]').preset('20').argParser(parseFloat);
   *
   * @param {any} arg
   * @return {Option}
   */

  preset(arg) {
    this.presetArg = arg;
    return this;
  }

  /**
   * Add option name(s) that conflict with this option.
   * An error will be displayed if conflicting options are found during parsing.
   *
   * @example
   * new Option('--rgb').conflicts('cmyk');
   * new Option('--js').conflicts(['ts', 'jsx']);
   *
   * @param {string | string[]} names
   * @return {Option}
   */

  conflicts(names) {
    this.conflictsWith = this.conflictsWith.concat(names);
    return this;
  }

  /**
   * Specify implied option values for when this option is set and the implied options are not.
   *
   * The custom processing (parseArg) is not called on the implied values.
   *
   * @example
   * program
   *   .addOption(new Option('--log', 'write logging information to file'))
   *   .addOption(new Option('--trace', 'log extra details').implies({ log: 'trace.txt' }));
   *
   * @param {Object} impliedOptionValues
   * @return {Option}
   */
  implies(impliedOptionValues) {
    this.implied = Object.assign(this.implied || {}, impliedOptionValues);
    return this;
  }

  /**
   * Set environment variable to check for option value.
   *
   * An environment variable is only used if when processed the current option value is
   * undefined, or the source of the current value is 'default' or 'config' or 'env'.
   *
   * @param {string} name
   * @return {Option}
   */

  env(name) {
    this.envVar = name;
    return this;
  }

  /**
   * Set the custom handler for processing CLI option arguments into option values.
   *
   * @param {Function} [fn]
   * @return {Option}
   */

  argParser(fn) {
    this.parseArg = fn;
    return this;
  }

  /**
   * Whether the option is mandatory and must have a value after parsing.
   *
   * @param {boolean} [mandatory=true]
   * @return {Option}
   */

  makeOptionMandatory(mandatory = true) {
    this.mandatory = !!mandatory;
    return this;
  }

  /**
   * Hide option in help.
   *
   * @param {boolean} [hide=true]
   * @return {Option}
   */

  hideHelp(hide = true) {
    this.hidden = !!hide;
    return this;
  }

  /**
   * @api private
   */

  _concatValue(value, previous) {
    if (previous === this.defaultValue || !Array.isArray(previous)) {
      return [value];
    }

    return previous.concat(value);
  }

  /**
   * Only allow option value to be one of choices.
   *
   * @param {string[]} values
   * @return {Option}
   */

  choices(values) {
    this.argChoices = values.slice();
    this.parseArg = (arg, previous) => {
      if (!this.argChoices.includes(arg)) {
        throw new InvalidArgumentError(`Allowed choices are ${this.argChoices.join(', ')}.`);
      }
      if (this.variadic) {
        return this._concatValue(arg, previous);
      }
      return arg;
    };
    return this;
  }

  /**
   * Return option name.
   *
   * @return {string}
   */

  name() {
    if (this.long) {
      return this.long.replace(/^--/, '');
    }
    return this.short.replace(/^-/, '');
  }

  /**
   * Return option name, in a camelcase format that can be used
   * as a object attribute key.
   *
   * @return {string}
   * @api private
   */

  attributeName() {
    return camelcase(this.name().replace(/^no-/, ''));
  }

  /**
   * Check if `arg` matches the short or long flag.
   *
   * @param {string} arg
   * @return {boolean}
   * @api private
   */

  is(arg) {
    return this.short === arg || this.long === arg;
  }

  /**
   * Return whether a boolean option.
   *
   * Options are one of boolean, negated, required argument, or optional argument.
   *
   * @return {boolean}
   * @api private
   */

  isBoolean() {
    return !this.required && !this.optional && !this.negate;
  }
}

/**
 * This class is to make it easier to work with dual options, without changing the existing
 * implementation. We support separate dual options for separate positive and negative options,
 * like `--build` and `--no-build`, which share a single option value. This works nicely for some
 * use cases, but is tricky for others where we want separate behaviours despite
 * the single shared option value.
 */
class DualOptions$1 {
  /**
   * @param {Option[]} options
   */
  constructor(options) {
    this.positiveOptions = new Map();
    this.negativeOptions = new Map();
    this.dualOptions = new Set();
    options.forEach(option => {
      if (option.negate) {
        this.negativeOptions.set(option.attributeName(), option);
      } else {
        this.positiveOptions.set(option.attributeName(), option);
      }
    });
    this.negativeOptions.forEach((value, key) => {
      if (this.positiveOptions.has(key)) {
        this.dualOptions.add(key);
      }
    });
  }

  /**
   * Did the value come from the option, and not from possible matching dual option?
   *
   * @param {any} value
   * @param {Option} option
   * @returns {boolean}
   */
  valueFromOption(value, option) {
    const optionKey = option.attributeName();
    if (!this.dualOptions.has(optionKey)) return true;

    // Use the value to deduce if (probably) came from the option.
    const preset = this.negativeOptions.get(optionKey).presetArg;
    const negativeValue = (preset !== undefined) ? preset : false;
    return option.negate === (negativeValue === value);
  }
}

/**
 * Convert string from kebab-case to camelCase.
 *
 * @param {string} str
 * @return {string}
 * @api private
 */

function camelcase(str) {
  return str.split('-').reduce((str, word) => {
    return str + word[0].toUpperCase() + word.slice(1);
  });
}

/**
 * Split the short and long flag out of something like '-m,--mixed <value>'
 *
 * @api private
 */

function splitOptionFlags$1(flags) {
  let shortFlag;
  let longFlag;
  // Use original very loose parsing to maintain backwards compatibility for now,
  // which allowed for example unintended `-sw, --short-word` [sic].
  const flagParts = flags.split(/[ |,]+/);
  if (flagParts.length > 1 && !/^[[<]/.test(flagParts[1])) shortFlag = flagParts.shift();
  longFlag = flagParts.shift();
  // Add support for lone short flag without significantly changing parsing!
  if (!shortFlag && /^-[^-]$/.test(longFlag)) {
    shortFlag = longFlag;
    longFlag = undefined;
  }
  return { shortFlag, longFlag };
}

option.Option = Option$1;
option.splitOptionFlags = splitOptionFlags$1;
option.DualOptions = DualOptions$1;

var suggestSimilar$2 = {};

const maxDistance = 3;

function editDistance(a, b) {
  // https://en.wikipedia.org/wiki/Damerau–Levenshtein_distance
  // Calculating optimal string alignment distance, no substring is edited more than once.
  // (Simple implementation.)

  // Quick early exit, return worst case.
  if (Math.abs(a.length - b.length) > maxDistance) return Math.max(a.length, b.length);

  // distance between prefix substrings of a and b
  const d = [];

  // pure deletions turn a into empty string
  for (let i = 0; i <= a.length; i++) {
    d[i] = [i];
  }
  // pure insertions turn empty string into b
  for (let j = 0; j <= b.length; j++) {
    d[0][j] = j;
  }

  // fill matrix
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      let cost = 1;
      if (a[i - 1] === b[j - 1]) {
        cost = 0;
      } else {
        cost = 1;
      }
      d[i][j] = Math.min(
        d[i - 1][j] + 1, // deletion
        d[i][j - 1] + 1, // insertion
        d[i - 1][j - 1] + cost // substitution
      );
      // transposition
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }

  return d[a.length][b.length];
}

/**
 * Find close matches, restricted to same number of edits.
 *
 * @param {string} word
 * @param {string[]} candidates
 * @returns {string}
 */

function suggestSimilar$1(word, candidates) {
  if (!candidates || candidates.length === 0) return '';
  // remove possible duplicates
  candidates = Array.from(new Set(candidates));

  const searchingOptions = word.startsWith('--');
  if (searchingOptions) {
    word = word.slice(2);
    candidates = candidates.map(candidate => candidate.slice(2));
  }

  let similar = [];
  let bestDistance = maxDistance;
  const minSimilarity = 0.4;
  candidates.forEach((candidate) => {
    if (candidate.length <= 1) return; // no one character guesses

    const distance = editDistance(word, candidate);
    const length = Math.max(word.length, candidate.length);
    const similarity = (length - distance) / length;
    if (similarity > minSimilarity) {
      if (distance < bestDistance) {
        // better edit distance, throw away previous worse matches
        bestDistance = distance;
        similar = [candidate];
      } else if (distance === bestDistance) {
        similar.push(candidate);
      }
    }
  });

  similar.sort((a, b) => a.localeCompare(b));
  if (searchingOptions) {
    similar = similar.map(candidate => `--${candidate}`);
  }

  if (similar.length > 1) {
    return `\n(Did you mean one of ${similar.join(', ')}?)`;
  }
  if (similar.length === 1) {
    return `\n(Did you mean ${similar[0]}?)`;
  }
  return '';
}

suggestSimilar$2.suggestSimilar = suggestSimilar$1;

const EventEmitter = require$$0__default["default"].EventEmitter;
const childProcess = require$$1__default["default"];
const path$2 = require$$2__default["default"];
const fs$3 = require$$0__default$1["default"];
const process$1 = require$$4__default["default"];

const { Argument, humanReadableArgName } = argument;
const { CommanderError } = error;
const { Help } = help;
const { Option, splitOptionFlags, DualOptions } = option;
const { suggestSimilar } = suggestSimilar$2;

// @ts-check

class Command$1 extends EventEmitter {
  /**
   * Initialize a new `Command`.
   *
   * @param {string} [name]
   */

  constructor(name) {
    super();
    /** @type {Command[]} */
    this.commands = [];
    /** @type {Option[]} */
    this.options = [];
    this.parent = null;
    this._allowUnknownOption = false;
    this._allowExcessArguments = true;
    /** @type {Argument[]} */
    this._args = [];
    /** @type {string[]} */
    this.args = []; // cli args with options removed
    this.rawArgs = [];
    this.processedArgs = []; // like .args but after custom processing and collecting variadic
    this._scriptPath = null;
    this._name = name || '';
    this._optionValues = {};
    this._optionValueSources = {}; // default, env, cli etc
    this._storeOptionsAsProperties = false;
    this._actionHandler = null;
    this._executableHandler = false;
    this._executableFile = null; // custom name for executable
    this._executableDir = null; // custom search directory for subcommands
    this._defaultCommandName = null;
    this._exitCallback = null;
    this._aliases = [];
    this._combineFlagAndOptionalValue = true;
    this._description = '';
    this._summary = '';
    this._argsDescription = undefined; // legacy
    this._enablePositionalOptions = false;
    this._passThroughOptions = false;
    this._lifeCycleHooks = {}; // a hash of arrays
    /** @type {boolean | string} */
    this._showHelpAfterError = false;
    this._showSuggestionAfterError = true;

    // see .configureOutput() for docs
    this._outputConfiguration = {
      writeOut: (str) => process$1.stdout.write(str),
      writeErr: (str) => process$1.stderr.write(str),
      getOutHelpWidth: () => process$1.stdout.isTTY ? process$1.stdout.columns : undefined,
      getErrHelpWidth: () => process$1.stderr.isTTY ? process$1.stderr.columns : undefined,
      outputError: (str, write) => write(str)
    };

    this._hidden = false;
    this._hasHelpOption = true;
    this._helpFlags = '-h, --help';
    this._helpDescription = 'display help for command';
    this._helpShortFlag = '-h';
    this._helpLongFlag = '--help';
    this._addImplicitHelpCommand = undefined; // Deliberately undefined, not decided whether true or false
    this._helpCommandName = 'help';
    this._helpCommandnameAndArgs = 'help [command]';
    this._helpCommandDescription = 'display help for command';
    this._helpConfiguration = {};
  }

  /**
   * Copy settings that are useful to have in common across root command and subcommands.
   *
   * (Used internally when adding a command using `.command()` so subcommands inherit parent settings.)
   *
   * @param {Command} sourceCommand
   * @return {Command} `this` command for chaining
   */
  copyInheritedSettings(sourceCommand) {
    this._outputConfiguration = sourceCommand._outputConfiguration;
    this._hasHelpOption = sourceCommand._hasHelpOption;
    this._helpFlags = sourceCommand._helpFlags;
    this._helpDescription = sourceCommand._helpDescription;
    this._helpShortFlag = sourceCommand._helpShortFlag;
    this._helpLongFlag = sourceCommand._helpLongFlag;
    this._helpCommandName = sourceCommand._helpCommandName;
    this._helpCommandnameAndArgs = sourceCommand._helpCommandnameAndArgs;
    this._helpCommandDescription = sourceCommand._helpCommandDescription;
    this._helpConfiguration = sourceCommand._helpConfiguration;
    this._exitCallback = sourceCommand._exitCallback;
    this._storeOptionsAsProperties = sourceCommand._storeOptionsAsProperties;
    this._combineFlagAndOptionalValue = sourceCommand._combineFlagAndOptionalValue;
    this._allowExcessArguments = sourceCommand._allowExcessArguments;
    this._enablePositionalOptions = sourceCommand._enablePositionalOptions;
    this._showHelpAfterError = sourceCommand._showHelpAfterError;
    this._showSuggestionAfterError = sourceCommand._showSuggestionAfterError;

    return this;
  }

  /**
   * Define a command.
   *
   * There are two styles of command: pay attention to where to put the description.
   *
   * @example
   * // Command implemented using action handler (description is supplied separately to `.command`)
   * program
   *   .command('clone <source> [destination]')
   *   .description('clone a repository into a newly created directory')
   *   .action((source, destination) => {
   *     console.log('clone command called');
   *   });
   *
   * // Command implemented using separate executable file (description is second parameter to `.command`)
   * program
   *   .command('start <service>', 'start named service')
   *   .command('stop [service]', 'stop named service, or all if no name supplied');
   *
   * @param {string} nameAndArgs - command name and arguments, args are `<required>` or `[optional]` and last may also be `variadic...`
   * @param {Object|string} [actionOptsOrExecDesc] - configuration options (for action), or description (for executable)
   * @param {Object} [execOpts] - configuration options (for executable)
   * @return {Command} returns new command for action handler, or `this` for executable command
   */

  command(nameAndArgs, actionOptsOrExecDesc, execOpts) {
    let desc = actionOptsOrExecDesc;
    let opts = execOpts;
    if (typeof desc === 'object' && desc !== null) {
      opts = desc;
      desc = null;
    }
    opts = opts || {};
    const [, name, args] = nameAndArgs.match(/([^ ]+) *(.*)/);

    const cmd = this.createCommand(name);
    if (desc) {
      cmd.description(desc);
      cmd._executableHandler = true;
    }
    if (opts.isDefault) this._defaultCommandName = cmd._name;
    cmd._hidden = !!(opts.noHelp || opts.hidden); // noHelp is deprecated old name for hidden
    cmd._executableFile = opts.executableFile || null; // Custom name for executable file, set missing to null to match constructor
    if (args) cmd.arguments(args);
    this.commands.push(cmd);
    cmd.parent = this;
    cmd.copyInheritedSettings(this);

    if (desc) return this;
    return cmd;
  }

  /**
   * Factory routine to create a new unattached command.
   *
   * See .command() for creating an attached subcommand, which uses this routine to
   * create the command. You can override createCommand to customise subcommands.
   *
   * @param {string} [name]
   * @return {Command} new command
   */

  createCommand(name) {
    return new Command$1(name);
  }

  /**
   * You can customise the help with a subclass of Help by overriding createHelp,
   * or by overriding Help properties using configureHelp().
   *
   * @return {Help}
   */

  createHelp() {
    return Object.assign(new Help(), this.configureHelp());
  }

  /**
   * You can customise the help by overriding Help properties using configureHelp(),
   * or with a subclass of Help by overriding createHelp().
   *
   * @param {Object} [configuration] - configuration options
   * @return {Command|Object} `this` command for chaining, or stored configuration
   */

  configureHelp(configuration) {
    if (configuration === undefined) return this._helpConfiguration;

    this._helpConfiguration = configuration;
    return this;
  }

  /**
   * The default output goes to stdout and stderr. You can customise this for special
   * applications. You can also customise the display of errors by overriding outputError.
   *
   * The configuration properties are all functions:
   *
   *     // functions to change where being written, stdout and stderr
   *     writeOut(str)
   *     writeErr(str)
   *     // matching functions to specify width for wrapping help
   *     getOutHelpWidth()
   *     getErrHelpWidth()
   *     // functions based on what is being written out
   *     outputError(str, write) // used for displaying errors, and not used for displaying help
   *
   * @param {Object} [configuration] - configuration options
   * @return {Command|Object} `this` command for chaining, or stored configuration
   */

  configureOutput(configuration) {
    if (configuration === undefined) return this._outputConfiguration;

    Object.assign(this._outputConfiguration, configuration);
    return this;
  }

  /**
   * Display the help or a custom message after an error occurs.
   *
   * @param {boolean|string} [displayHelp]
   * @return {Command} `this` command for chaining
   */
  showHelpAfterError(displayHelp = true) {
    if (typeof displayHelp !== 'string') displayHelp = !!displayHelp;
    this._showHelpAfterError = displayHelp;
    return this;
  }

  /**
   * Display suggestion of similar commands for unknown commands, or options for unknown options.
   *
   * @param {boolean} [displaySuggestion]
   * @return {Command} `this` command for chaining
   */
  showSuggestionAfterError(displaySuggestion = true) {
    this._showSuggestionAfterError = !!displaySuggestion;
    return this;
  }

  /**
   * Add a prepared subcommand.
   *
   * See .command() for creating an attached subcommand which inherits settings from its parent.
   *
   * @param {Command} cmd - new subcommand
   * @param {Object} [opts] - configuration options
   * @return {Command} `this` command for chaining
   */

  addCommand(cmd, opts) {
    if (!cmd._name) {
      throw new Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
    }

    opts = opts || {};
    if (opts.isDefault) this._defaultCommandName = cmd._name;
    if (opts.noHelp || opts.hidden) cmd._hidden = true; // modifying passed command due to existing implementation

    this.commands.push(cmd);
    cmd.parent = this;
    return this;
  }

  /**
   * Factory routine to create a new unattached argument.
   *
   * See .argument() for creating an attached argument, which uses this routine to
   * create the argument. You can override createArgument to return a custom argument.
   *
   * @param {string} name
   * @param {string} [description]
   * @return {Argument} new argument
   */

  createArgument(name, description) {
    return new Argument(name, description);
  }

  /**
   * Define argument syntax for command.
   *
   * The default is that the argument is required, and you can explicitly
   * indicate this with <> around the name. Put [] around the name for an optional argument.
   *
   * @example
   * program.argument('<input-file>');
   * program.argument('[output-file]');
   *
   * @param {string} name
   * @param {string} [description]
   * @param {Function|*} [fn] - custom argument processing function
   * @param {*} [defaultValue]
   * @return {Command} `this` command for chaining
   */
  argument(name, description, fn, defaultValue) {
    const argument = this.createArgument(name, description);
    if (typeof fn === 'function') {
      argument.default(defaultValue).argParser(fn);
    } else {
      argument.default(fn);
    }
    this.addArgument(argument);
    return this;
  }

  /**
   * Define argument syntax for command, adding multiple at once (without descriptions).
   *
   * See also .argument().
   *
   * @example
   * program.arguments('<cmd> [env]');
   *
   * @param {string} names
   * @return {Command} `this` command for chaining
   */

  arguments(names) {
    names.split(/ +/).forEach((detail) => {
      this.argument(detail);
    });
    return this;
  }

  /**
   * Define argument syntax for command, adding a prepared argument.
   *
   * @param {Argument} argument
   * @return {Command} `this` command for chaining
   */
  addArgument(argument) {
    const previousArgument = this._args.slice(-1)[0];
    if (previousArgument && previousArgument.variadic) {
      throw new Error(`only the last argument can be variadic '${previousArgument.name()}'`);
    }
    if (argument.required && argument.defaultValue !== undefined && argument.parseArg === undefined) {
      throw new Error(`a default value for a required argument is never used: '${argument.name()}'`);
    }
    this._args.push(argument);
    return this;
  }

  /**
   * Override default decision whether to add implicit help command.
   *
   *    addHelpCommand() // force on
   *    addHelpCommand(false); // force off
   *    addHelpCommand('help [cmd]', 'display help for [cmd]'); // force on with custom details
   *
   * @return {Command} `this` command for chaining
   */

  addHelpCommand(enableOrNameAndArgs, description) {
    if (enableOrNameAndArgs === false) {
      this._addImplicitHelpCommand = false;
    } else {
      this._addImplicitHelpCommand = true;
      if (typeof enableOrNameAndArgs === 'string') {
        this._helpCommandName = enableOrNameAndArgs.split(' ')[0];
        this._helpCommandnameAndArgs = enableOrNameAndArgs;
      }
      this._helpCommandDescription = description || this._helpCommandDescription;
    }
    return this;
  }

  /**
   * @return {boolean}
   * @api private
   */

  _hasImplicitHelpCommand() {
    if (this._addImplicitHelpCommand === undefined) {
      return this.commands.length && !this._actionHandler && !this._findCommand('help');
    }
    return this._addImplicitHelpCommand;
  }

  /**
   * Add hook for life cycle event.
   *
   * @param {string} event
   * @param {Function} listener
   * @return {Command} `this` command for chaining
   */

  hook(event, listener) {
    const allowedValues = ['preSubcommand', 'preAction', 'postAction'];
    if (!allowedValues.includes(event)) {
      throw new Error(`Unexpected value for event passed to hook : '${event}'.
Expecting one of '${allowedValues.join("', '")}'`);
    }
    if (this._lifeCycleHooks[event]) {
      this._lifeCycleHooks[event].push(listener);
    } else {
      this._lifeCycleHooks[event] = [listener];
    }
    return this;
  }

  /**
   * Register callback to use as replacement for calling process.exit.
   *
   * @param {Function} [fn] optional callback which will be passed a CommanderError, defaults to throwing
   * @return {Command} `this` command for chaining
   */

  exitOverride(fn) {
    if (fn) {
      this._exitCallback = fn;
    } else {
      this._exitCallback = (err) => {
        if (err.code !== 'commander.executeSubCommandAsync') {
          throw err;
        }
      };
    }
    return this;
  }

  /**
   * Call process.exit, and _exitCallback if defined.
   *
   * @param {number} exitCode exit code for using with process.exit
   * @param {string} code an id string representing the error
   * @param {string} message human-readable description of the error
   * @return never
   * @api private
   */

  _exit(exitCode, code, message) {
    if (this._exitCallback) {
      this._exitCallback(new CommanderError(exitCode, code, message));
      // Expecting this line is not reached.
    }
    process$1.exit(exitCode);
  }

  /**
   * Register callback `fn` for the command.
   *
   * @example
   * program
   *   .command('serve')
   *   .description('start service')
   *   .action(function() {
   *      // do work here
   *   });
   *
   * @param {Function} fn
   * @return {Command} `this` command for chaining
   */

  action(fn) {
    const listener = (args) => {
      // The .action callback takes an extra parameter which is the command or options.
      const expectedArgsCount = this._args.length;
      const actionArgs = args.slice(0, expectedArgsCount);
      if (this._storeOptionsAsProperties) {
        actionArgs[expectedArgsCount] = this; // backwards compatible "options"
      } else {
        actionArgs[expectedArgsCount] = this.opts();
      }
      actionArgs.push(this);

      return fn.apply(this, actionArgs);
    };
    this._actionHandler = listener;
    return this;
  }

  /**
   * Factory routine to create a new unattached option.
   *
   * See .option() for creating an attached option, which uses this routine to
   * create the option. You can override createOption to return a custom option.
   *
   * @param {string} flags
   * @param {string} [description]
   * @return {Option} new option
   */

  createOption(flags, description) {
    return new Option(flags, description);
  }

  /**
   * Add an option.
   *
   * @param {Option} option
   * @return {Command} `this` command for chaining
   */
  addOption(option) {
    const oname = option.name();
    const name = option.attributeName();

    // store default value
    if (option.negate) {
      // --no-foo is special and defaults foo to true, unless a --foo option is already defined
      const positiveLongFlag = option.long.replace(/^--no-/, '--');
      if (!this._findOption(positiveLongFlag)) {
        this.setOptionValueWithSource(name, option.defaultValue === undefined ? true : option.defaultValue, 'default');
      }
    } else if (option.defaultValue !== undefined) {
      this.setOptionValueWithSource(name, option.defaultValue, 'default');
    }

    // register the option
    this.options.push(option);

    // handler for cli and env supplied values
    const handleOptionValue = (val, invalidValueMessage, valueSource) => {
      // val is null for optional option used without an optional-argument.
      // val is undefined for boolean and negated option.
      if (val == null && option.presetArg !== undefined) {
        val = option.presetArg;
      }

      // custom processing
      const oldValue = this.getOptionValue(name);
      if (val !== null && option.parseArg) {
        try {
          val = option.parseArg(val, oldValue);
        } catch (err) {
          if (err.code === 'commander.invalidArgument') {
            const message = `${invalidValueMessage} ${err.message}`;
            this.error(message, { exitCode: err.exitCode, code: err.code });
          }
          throw err;
        }
      } else if (val !== null && option.variadic) {
        val = option._concatValue(val, oldValue);
      }

      // Fill-in appropriate missing values. Long winded but easy to follow.
      if (val == null) {
        if (option.negate) {
          val = false;
        } else if (option.isBoolean() || option.optional) {
          val = true;
        } else {
          val = ''; // not normal, parseArg might have failed or be a mock function for testing
        }
      }
      this.setOptionValueWithSource(name, val, valueSource);
    };

    this.on('option:' + oname, (val) => {
      const invalidValueMessage = `error: option '${option.flags}' argument '${val}' is invalid.`;
      handleOptionValue(val, invalidValueMessage, 'cli');
    });

    if (option.envVar) {
      this.on('optionEnv:' + oname, (val) => {
        const invalidValueMessage = `error: option '${option.flags}' value '${val}' from env '${option.envVar}' is invalid.`;
        handleOptionValue(val, invalidValueMessage, 'env');
      });
    }

    return this;
  }

  /**
   * Internal implementation shared by .option() and .requiredOption()
   *
   * @api private
   */
  _optionEx(config, flags, description, fn, defaultValue) {
    if (typeof flags === 'object' && flags instanceof Option) {
      throw new Error('To add an Option object use addOption() instead of option() or requiredOption()');
    }
    const option = this.createOption(flags, description);
    option.makeOptionMandatory(!!config.mandatory);
    if (typeof fn === 'function') {
      option.default(defaultValue).argParser(fn);
    } else if (fn instanceof RegExp) {
      // deprecated
      const regex = fn;
      fn = (val, def) => {
        const m = regex.exec(val);
        return m ? m[0] : def;
      };
      option.default(defaultValue).argParser(fn);
    } else {
      option.default(fn);
    }

    return this.addOption(option);
  }

  /**
   * Define option with `flags`, `description` and optional
   * coercion `fn`.
   *
   * The `flags` string contains the short and/or long flags,
   * separated by comma, a pipe or space. The following are all valid
   * all will output this way when `--help` is used.
   *
   *     "-p, --pepper"
   *     "-p|--pepper"
   *     "-p --pepper"
   *
   * @example
   * // simple boolean defaulting to undefined
   * program.option('-p, --pepper', 'add pepper');
   *
   * program.pepper
   * // => undefined
   *
   * --pepper
   * program.pepper
   * // => true
   *
   * // simple boolean defaulting to true (unless non-negated option is also defined)
   * program.option('-C, --no-cheese', 'remove cheese');
   *
   * program.cheese
   * // => true
   *
   * --no-cheese
   * program.cheese
   * // => false
   *
   * // required argument
   * program.option('-C, --chdir <path>', 'change the working directory');
   *
   * --chdir /tmp
   * program.chdir
   * // => "/tmp"
   *
   * // optional argument
   * program.option('-c, --cheese [type]', 'add cheese [marble]');
   *
   * @param {string} flags
   * @param {string} [description]
   * @param {Function|*} [fn] - custom option processing function or default value
   * @param {*} [defaultValue]
   * @return {Command} `this` command for chaining
   */

  option(flags, description, fn, defaultValue) {
    return this._optionEx({}, flags, description, fn, defaultValue);
  }

  /**
  * Add a required option which must have a value after parsing. This usually means
  * the option must be specified on the command line. (Otherwise the same as .option().)
  *
  * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space.
  *
  * @param {string} flags
  * @param {string} [description]
  * @param {Function|*} [fn] - custom option processing function or default value
  * @param {*} [defaultValue]
  * @return {Command} `this` command for chaining
  */

  requiredOption(flags, description, fn, defaultValue) {
    return this._optionEx({ mandatory: true }, flags, description, fn, defaultValue);
  }

  /**
   * Alter parsing of short flags with optional values.
   *
   * @example
   * // for `.option('-f,--flag [value]'):
   * program.combineFlagAndOptionalValue(true);  // `-f80` is treated like `--flag=80`, this is the default behaviour
   * program.combineFlagAndOptionalValue(false) // `-fb` is treated like `-f -b`
   *
   * @param {Boolean} [combine=true] - if `true` or omitted, an optional value can be specified directly after the flag.
   */
  combineFlagAndOptionalValue(combine = true) {
    this._combineFlagAndOptionalValue = !!combine;
    return this;
  }

  /**
   * Allow unknown options on the command line.
   *
   * @param {Boolean} [allowUnknown=true] - if `true` or omitted, no error will be thrown
   * for unknown options.
   */
  allowUnknownOption(allowUnknown = true) {
    this._allowUnknownOption = !!allowUnknown;
    return this;
  }

  /**
   * Allow excess command-arguments on the command line. Pass false to make excess arguments an error.
   *
   * @param {Boolean} [allowExcess=true] - if `true` or omitted, no error will be thrown
   * for excess arguments.
   */
  allowExcessArguments(allowExcess = true) {
    this._allowExcessArguments = !!allowExcess;
    return this;
  }

  /**
   * Enable positional options. Positional means global options are specified before subcommands which lets
   * subcommands reuse the same option names, and also enables subcommands to turn on passThroughOptions.
   * The default behaviour is non-positional and global options may appear anywhere on the command line.
   *
   * @param {Boolean} [positional=true]
   */
  enablePositionalOptions(positional = true) {
    this._enablePositionalOptions = !!positional;
    return this;
  }

  /**
   * Pass through options that come after command-arguments rather than treat them as command-options,
   * so actual command-options come before command-arguments. Turning this on for a subcommand requires
   * positional options to have been enabled on the program (parent commands).
   * The default behaviour is non-positional and options may appear before or after command-arguments.
   *
   * @param {Boolean} [passThrough=true]
   * for unknown options.
   */
  passThroughOptions(passThrough = true) {
    this._passThroughOptions = !!passThrough;
    if (!!this.parent && passThrough && !this.parent._enablePositionalOptions) {
      throw new Error('passThroughOptions can not be used without turning on enablePositionalOptions for parent command(s)');
    }
    return this;
  }

  /**
    * Whether to store option values as properties on command object,
    * or store separately (specify false). In both cases the option values can be accessed using .opts().
    *
    * @param {boolean} [storeAsProperties=true]
    * @return {Command} `this` command for chaining
    */

  storeOptionsAsProperties(storeAsProperties = true) {
    this._storeOptionsAsProperties = !!storeAsProperties;
    if (this.options.length) {
      throw new Error('call .storeOptionsAsProperties() before adding options');
    }
    return this;
  }

  /**
   * Retrieve option value.
   *
   * @param {string} key
   * @return {Object} value
   */

  getOptionValue(key) {
    if (this._storeOptionsAsProperties) {
      return this[key];
    }
    return this._optionValues[key];
  }

  /**
   * Store option value.
   *
   * @param {string} key
   * @param {Object} value
   * @return {Command} `this` command for chaining
   */

  setOptionValue(key, value) {
    return this.setOptionValueWithSource(key, value, undefined);
  }

  /**
    * Store option value and where the value came from.
    *
    * @param {string} key
    * @param {Object} value
    * @param {string} source - expected values are default/config/env/cli/implied
    * @return {Command} `this` command for chaining
    */

  setOptionValueWithSource(key, value, source) {
    if (this._storeOptionsAsProperties) {
      this[key] = value;
    } else {
      this._optionValues[key] = value;
    }
    this._optionValueSources[key] = source;
    return this;
  }

  /**
    * Get source of option value.
    * Expected values are default | config | env | cli | implied
    *
    * @param {string} key
    * @return {string}
    */

  getOptionValueSource(key) {
    return this._optionValueSources[key];
  }

  /**
    * Get source of option value. See also .optsWithGlobals().
    * Expected values are default | config | env | cli | implied
    *
    * @param {string} key
    * @return {string}
    */

  getOptionValueSourceWithGlobals(key) {
    // global overwrites local, like optsWithGlobals
    let source;
    getCommandAndParents(this).forEach((cmd) => {
      if (cmd.getOptionValueSource(key) !== undefined) {
        source = cmd.getOptionValueSource(key);
      }
    });
    return source;
  }

  /**
   * Get user arguments from implied or explicit arguments.
   * Side-effects: set _scriptPath if args included script. Used for default program name, and subcommand searches.
   *
   * @api private
   */

  _prepareUserArgs(argv, parseOptions) {
    if (argv !== undefined && !Array.isArray(argv)) {
      throw new Error('first parameter to parse must be array or undefined');
    }
    parseOptions = parseOptions || {};

    // Default to using process.argv
    if (argv === undefined) {
      argv = process$1.argv;
      // @ts-ignore: unknown property
      if (process$1.versions && process$1.versions.electron) {
        parseOptions.from = 'electron';
      }
    }
    this.rawArgs = argv.slice();

    // make it a little easier for callers by supporting various argv conventions
    let userArgs;
    switch (parseOptions.from) {
      case undefined:
      case 'node':
        this._scriptPath = argv[1];
        userArgs = argv.slice(2);
        break;
      case 'electron':
        // @ts-ignore: unknown property
        if (process$1.defaultApp) {
          this._scriptPath = argv[1];
          userArgs = argv.slice(2);
        } else {
          userArgs = argv.slice(1);
        }
        break;
      case 'user':
        userArgs = argv.slice(0);
        break;
      default:
        throw new Error(`unexpected parse option { from: '${parseOptions.from}' }`);
    }

    // Find default name for program from arguments.
    if (!this._name && this._scriptPath) this.nameFromFilename(this._scriptPath);
    this._name = this._name || 'program';

    return userArgs;
  }

  /**
   * Parse `argv`, setting options and invoking commands when defined.
   *
   * The default expectation is that the arguments are from node and have the application as argv[0]
   * and the script being run in argv[1], with user parameters after that.
   *
   * @example
   * program.parse(process.argv);
   * program.parse(); // implicitly use process.argv and auto-detect node vs electron conventions
   * program.parse(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
   *
   * @param {string[]} [argv] - optional, defaults to process.argv
   * @param {Object} [parseOptions] - optionally specify style of options with from: node/user/electron
   * @param {string} [parseOptions.from] - where the args are from: 'node', 'user', 'electron'
   * @return {Command} `this` command for chaining
   */

  parse(argv, parseOptions) {
    const userArgs = this._prepareUserArgs(argv, parseOptions);
    this._parseCommand([], userArgs);

    return this;
  }

  /**
   * Parse `argv`, setting options and invoking commands when defined.
   *
   * Use parseAsync instead of parse if any of your action handlers are async. Returns a Promise.
   *
   * The default expectation is that the arguments are from node and have the application as argv[0]
   * and the script being run in argv[1], with user parameters after that.
   *
   * @example
   * await program.parseAsync(process.argv);
   * await program.parseAsync(); // implicitly use process.argv and auto-detect node vs electron conventions
   * await program.parseAsync(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
   *
   * @param {string[]} [argv]
   * @param {Object} [parseOptions]
   * @param {string} parseOptions.from - where the args are from: 'node', 'user', 'electron'
   * @return {Promise}
   */

  async parseAsync(argv, parseOptions) {
    const userArgs = this._prepareUserArgs(argv, parseOptions);
    await this._parseCommand([], userArgs);

    return this;
  }

  /**
   * Execute a sub-command executable.
   *
   * @api private
   */

  _executeSubCommand(subcommand, args) {
    args = args.slice();
    let launchWithNode = false; // Use node for source targets so do not need to get permissions correct, and on Windows.
    const sourceExt = ['.js', '.ts', '.tsx', '.mjs', '.cjs'];

    function findFile(baseDir, baseName) {
      // Look for specified file
      const localBin = path$2.resolve(baseDir, baseName);
      if (fs$3.existsSync(localBin)) return localBin;

      // Stop looking if candidate already has an expected extension.
      if (sourceExt.includes(path$2.extname(baseName))) return undefined;

      // Try all the extensions.
      const foundExt = sourceExt.find(ext => fs$3.existsSync(`${localBin}${ext}`));
      if (foundExt) return `${localBin}${foundExt}`;

      return undefined;
    }

    // Not checking for help first. Unlikely to have mandatory and executable, and can't robustly test for help flags in external command.
    this._checkForMissingMandatoryOptions();
    this._checkForConflictingOptions();

    // executableFile and executableDir might be full path, or just a name
    let executableFile = subcommand._executableFile || `${this._name}-${subcommand._name}`;
    let executableDir = this._executableDir || '';
    if (this._scriptPath) {
      let resolvedScriptPath; // resolve possible symlink for installed npm binary
      try {
        resolvedScriptPath = fs$3.realpathSync(this._scriptPath);
      } catch (err) {
        resolvedScriptPath = this._scriptPath;
      }
      executableDir = path$2.resolve(path$2.dirname(resolvedScriptPath), executableDir);
    }

    // Look for a local file in preference to a command in PATH.
    if (executableDir) {
      let localFile = findFile(executableDir, executableFile);

      // Legacy search using prefix of script name instead of command name
      if (!localFile && !subcommand._executableFile && this._scriptPath) {
        const legacyName = path$2.basename(this._scriptPath, path$2.extname(this._scriptPath));
        if (legacyName !== this._name) {
          localFile = findFile(executableDir, `${legacyName}-${subcommand._name}`);
        }
      }
      executableFile = localFile || executableFile;
    }

    launchWithNode = sourceExt.includes(path$2.extname(executableFile));

    let proc;
    if (process$1.platform !== 'win32') {
      if (launchWithNode) {
        args.unshift(executableFile);
        // add executable arguments to spawn
        args = incrementNodeInspectorPort(process$1.execArgv).concat(args);

        proc = childProcess.spawn(process$1.argv[0], args, { stdio: 'inherit' });
      } else {
        proc = childProcess.spawn(executableFile, args, { stdio: 'inherit' });
      }
    } else {
      args.unshift(executableFile);
      // add executable arguments to spawn
      args = incrementNodeInspectorPort(process$1.execArgv).concat(args);
      proc = childProcess.spawn(process$1.execPath, args, { stdio: 'inherit' });
    }

    if (!proc.killed) { // testing mainly to avoid leak warnings during unit tests with mocked spawn
      const signals = ['SIGUSR1', 'SIGUSR2', 'SIGTERM', 'SIGINT', 'SIGHUP'];
      signals.forEach((signal) => {
        // @ts-ignore
        process$1.on(signal, () => {
          if (proc.killed === false && proc.exitCode === null) {
            proc.kill(signal);
          }
        });
      });
    }

    // By default terminate process when spawned process terminates.
    // Suppressing the exit if exitCallback defined is a bit messy and of limited use, but does allow process to stay running!
    const exitCallback = this._exitCallback;
    if (!exitCallback) {
      proc.on('close', process$1.exit.bind(process$1));
    } else {
      proc.on('close', () => {
        exitCallback(new CommanderError(process$1.exitCode || 0, 'commander.executeSubCommandAsync', '(close)'));
      });
    }
    proc.on('error', (err) => {
      // @ts-ignore
      if (err.code === 'ENOENT') {
        const executableDirMessage = executableDir
          ? `searched for local subcommand relative to directory '${executableDir}'`
          : 'no directory for search for local subcommand, use .executableDir() to supply a custom directory';
        const executableMissing = `'${executableFile}' does not exist
 - if '${subcommand._name}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${executableDirMessage}`;
        throw new Error(executableMissing);
      // @ts-ignore
      } else if (err.code === 'EACCES') {
        throw new Error(`'${executableFile}' not executable`);
      }
      if (!exitCallback) {
        process$1.exit(1);
      } else {
        const wrappedError = new CommanderError(1, 'commander.executeSubCommandAsync', '(error)');
        wrappedError.nestedError = err;
        exitCallback(wrappedError);
      }
    });

    // Store the reference to the child process
    this.runningCommand = proc;
  }

  /**
   * @api private
   */

  _dispatchSubcommand(commandName, operands, unknown) {
    const subCommand = this._findCommand(commandName);
    if (!subCommand) this.help({ error: true });

    let hookResult;
    hookResult = this._chainOrCallSubCommandHook(hookResult, subCommand, 'preSubcommand');
    hookResult = this._chainOrCall(hookResult, () => {
      if (subCommand._executableHandler) {
        this._executeSubCommand(subCommand, operands.concat(unknown));
      } else {
        return subCommand._parseCommand(operands, unknown);
      }
    });
    return hookResult;
  }

  /**
   * Check this.args against expected this._args.
   *
   * @api private
   */

  _checkNumberOfArguments() {
    // too few
    this._args.forEach((arg, i) => {
      if (arg.required && this.args[i] == null) {
        this.missingArgument(arg.name());
      }
    });
    // too many
    if (this._args.length > 0 && this._args[this._args.length - 1].variadic) {
      return;
    }
    if (this.args.length > this._args.length) {
      this._excessArguments(this.args);
    }
  }

  /**
   * Process this.args using this._args and save as this.processedArgs!
   *
   * @api private
   */

  _processArguments() {
    const myParseArg = (argument, value, previous) => {
      // Extra processing for nice error message on parsing failure.
      let parsedValue = value;
      if (value !== null && argument.parseArg) {
        try {
          parsedValue = argument.parseArg(value, previous);
        } catch (err) {
          if (err.code === 'commander.invalidArgument') {
            const message = `error: command-argument value '${value}' is invalid for argument '${argument.name()}'. ${err.message}`;
            this.error(message, { exitCode: err.exitCode, code: err.code });
          }
          throw err;
        }
      }
      return parsedValue;
    };

    this._checkNumberOfArguments();

    const processedArgs = [];
    this._args.forEach((declaredArg, index) => {
      let value = declaredArg.defaultValue;
      if (declaredArg.variadic) {
        // Collect together remaining arguments for passing together as an array.
        if (index < this.args.length) {
          value = this.args.slice(index);
          if (declaredArg.parseArg) {
            value = value.reduce((processed, v) => {
              return myParseArg(declaredArg, v, processed);
            }, declaredArg.defaultValue);
          }
        } else if (value === undefined) {
          value = [];
        }
      } else if (index < this.args.length) {
        value = this.args[index];
        if (declaredArg.parseArg) {
          value = myParseArg(declaredArg, value, declaredArg.defaultValue);
        }
      }
      processedArgs[index] = value;
    });
    this.processedArgs = processedArgs;
  }

  /**
   * Once we have a promise we chain, but call synchronously until then.
   *
   * @param {Promise|undefined} promise
   * @param {Function} fn
   * @return {Promise|undefined}
   * @api private
   */

  _chainOrCall(promise, fn) {
    // thenable
    if (promise && promise.then && typeof promise.then === 'function') {
      // already have a promise, chain callback
      return promise.then(() => fn());
    }
    // callback might return a promise
    return fn();
  }

  /**
   *
   * @param {Promise|undefined} promise
   * @param {string} event
   * @return {Promise|undefined}
   * @api private
   */

  _chainOrCallHooks(promise, event) {
    let result = promise;
    const hooks = [];
    getCommandAndParents(this)
      .reverse()
      .filter(cmd => cmd._lifeCycleHooks[event] !== undefined)
      .forEach(hookedCommand => {
        hookedCommand._lifeCycleHooks[event].forEach((callback) => {
          hooks.push({ hookedCommand, callback });
        });
      });
    if (event === 'postAction') {
      hooks.reverse();
    }

    hooks.forEach((hookDetail) => {
      result = this._chainOrCall(result, () => {
        return hookDetail.callback(hookDetail.hookedCommand, this);
      });
    });
    return result;
  }

  /**
   *
   * @param {Promise|undefined} promise
   * @param {Command} subCommand
   * @param {string} event
   * @return {Promise|undefined}
   * @api private
   */

  _chainOrCallSubCommandHook(promise, subCommand, event) {
    let result = promise;
    if (this._lifeCycleHooks[event] !== undefined) {
      this._lifeCycleHooks[event].forEach((hook) => {
        result = this._chainOrCall(result, () => {
          return hook(this, subCommand);
        });
      });
    }
    return result;
  }

  /**
   * Process arguments in context of this command.
   * Returns action result, in case it is a promise.
   *
   * @api private
   */

  _parseCommand(operands, unknown) {
    const parsed = this.parseOptions(unknown);
    this._parseOptionsEnv(); // after cli, so parseArg not called on both cli and env
    this._parseOptionsImplied();
    operands = operands.concat(parsed.operands);
    unknown = parsed.unknown;
    this.args = operands.concat(unknown);

    if (operands && this._findCommand(operands[0])) {
      return this._dispatchSubcommand(operands[0], operands.slice(1), unknown);
    }
    if (this._hasImplicitHelpCommand() && operands[0] === this._helpCommandName) {
      if (operands.length === 1) {
        this.help();
      }
      return this._dispatchSubcommand(operands[1], [], [this._helpLongFlag]);
    }
    if (this._defaultCommandName) {
      outputHelpIfRequested(this, unknown); // Run the help for default command from parent rather than passing to default command
      return this._dispatchSubcommand(this._defaultCommandName, operands, unknown);
    }
    if (this.commands.length && this.args.length === 0 && !this._actionHandler && !this._defaultCommandName) {
      // probably missing subcommand and no handler, user needs help (and exit)
      this.help({ error: true });
    }

    outputHelpIfRequested(this, parsed.unknown);
    this._checkForMissingMandatoryOptions();
    this._checkForConflictingOptions();

    // We do not always call this check to avoid masking a "better" error, like unknown command.
    const checkForUnknownOptions = () => {
      if (parsed.unknown.length > 0) {
        this.unknownOption(parsed.unknown[0]);
      }
    };

    const commandEvent = `command:${this.name()}`;
    if (this._actionHandler) {
      checkForUnknownOptions();
      this._processArguments();

      let actionResult;
      actionResult = this._chainOrCallHooks(actionResult, 'preAction');
      actionResult = this._chainOrCall(actionResult, () => this._actionHandler(this.processedArgs));
      if (this.parent) {
        actionResult = this._chainOrCall(actionResult, () => {
          this.parent.emit(commandEvent, operands, unknown); // legacy
        });
      }
      actionResult = this._chainOrCallHooks(actionResult, 'postAction');
      return actionResult;
    }
    if (this.parent && this.parent.listenerCount(commandEvent)) {
      checkForUnknownOptions();
      this._processArguments();
      this.parent.emit(commandEvent, operands, unknown); // legacy
    } else if (operands.length) {
      if (this._findCommand('*')) { // legacy default command
        return this._dispatchSubcommand('*', operands, unknown);
      }
      if (this.listenerCount('command:*')) {
        // skip option check, emit event for possible misspelling suggestion
        this.emit('command:*', operands, unknown);
      } else if (this.commands.length) {
        this.unknownCommand();
      } else {
        checkForUnknownOptions();
        this._processArguments();
      }
    } else if (this.commands.length) {
      checkForUnknownOptions();
      // This command has subcommands and nothing hooked up at this level, so display help (and exit).
      this.help({ error: true });
    } else {
      checkForUnknownOptions();
      this._processArguments();
      // fall through for caller to handle after calling .parse()
    }
  }

  /**
   * Find matching command.
   *
   * @api private
   */
  _findCommand(name) {
    if (!name) return undefined;
    return this.commands.find(cmd => cmd._name === name || cmd._aliases.includes(name));
  }

  /**
   * Return an option matching `arg` if any.
   *
   * @param {string} arg
   * @return {Option}
   * @api private
   */

  _findOption(arg) {
    return this.options.find(option => option.is(arg));
  }

  /**
   * Display an error message if a mandatory option does not have a value.
   * Called after checking for help flags in leaf subcommand.
   *
   * @api private
   */

  _checkForMissingMandatoryOptions() {
    // Walk up hierarchy so can call in subcommand after checking for displaying help.
    for (let cmd = this; cmd; cmd = cmd.parent) {
      cmd.options.forEach((anOption) => {
        if (anOption.mandatory && (cmd.getOptionValue(anOption.attributeName()) === undefined)) {
          cmd.missingMandatoryOptionValue(anOption);
        }
      });
    }
  }

  /**
   * Display an error message if conflicting options are used together in this.
   *
   * @api private
   */
  _checkForConflictingLocalOptions() {
    const definedNonDefaultOptions = this.options.filter(
      (option) => {
        const optionKey = option.attributeName();
        if (this.getOptionValue(optionKey) === undefined) {
          return false;
        }
        return this.getOptionValueSource(optionKey) !== 'default';
      }
    );

    const optionsWithConflicting = definedNonDefaultOptions.filter(
      (option) => option.conflictsWith.length > 0
    );

    optionsWithConflicting.forEach((option) => {
      const conflictingAndDefined = definedNonDefaultOptions.find((defined) =>
        option.conflictsWith.includes(defined.attributeName())
      );
      if (conflictingAndDefined) {
        this._conflictingOption(option, conflictingAndDefined);
      }
    });
  }

  /**
   * Display an error message if conflicting options are used together.
   * Called after checking for help flags in leaf subcommand.
   *
   * @api private
   */
  _checkForConflictingOptions() {
    // Walk up hierarchy so can call in subcommand after checking for displaying help.
    for (let cmd = this; cmd; cmd = cmd.parent) {
      cmd._checkForConflictingLocalOptions();
    }
  }

  /**
   * Parse options from `argv` removing known options,
   * and return argv split into operands and unknown arguments.
   *
   * Examples:
   *
   *     argv => operands, unknown
   *     --known kkk op => [op], []
   *     op --known kkk => [op], []
   *     sub --unknown uuu op => [sub], [--unknown uuu op]
   *     sub -- --unknown uuu op => [sub --unknown uuu op], []
   *
   * @param {String[]} argv
   * @return {{operands: String[], unknown: String[]}}
   */

  parseOptions(argv) {
    const operands = []; // operands, not options or values
    const unknown = []; // first unknown option and remaining unknown args
    let dest = operands;
    const args = argv.slice();

    function maybeOption(arg) {
      return arg.length > 1 && arg[0] === '-';
    }

    // parse options
    let activeVariadicOption = null;
    while (args.length) {
      const arg = args.shift();

      // literal
      if (arg === '--') {
        if (dest === unknown) dest.push(arg);
        dest.push(...args);
        break;
      }

      if (activeVariadicOption && !maybeOption(arg)) {
        this.emit(`option:${activeVariadicOption.name()}`, arg);
        continue;
      }
      activeVariadicOption = null;

      if (maybeOption(arg)) {
        const option = this._findOption(arg);
        // recognised option, call listener to assign value with possible custom processing
        if (option) {
          if (option.required) {
            const value = args.shift();
            if (value === undefined) this.optionMissingArgument(option);
            this.emit(`option:${option.name()}`, value);
          } else if (option.optional) {
            let value = null;
            // historical behaviour is optional value is following arg unless an option
            if (args.length > 0 && !maybeOption(args[0])) {
              value = args.shift();
            }
            this.emit(`option:${option.name()}`, value);
          } else { // boolean flag
            this.emit(`option:${option.name()}`);
          }
          activeVariadicOption = option.variadic ? option : null;
          continue;
        }
      }

      // Look for combo options following single dash, eat first one if known.
      if (arg.length > 2 && arg[0] === '-' && arg[1] !== '-') {
        const option = this._findOption(`-${arg[1]}`);
        if (option) {
          if (option.required || (option.optional && this._combineFlagAndOptionalValue)) {
            // option with value following in same argument
            this.emit(`option:${option.name()}`, arg.slice(2));
          } else {
            // boolean option, emit and put back remainder of arg for further processing
            this.emit(`option:${option.name()}`);
            args.unshift(`-${arg.slice(2)}`);
          }
          continue;
        }
      }

      // Look for known long flag with value, like --foo=bar
      if (/^--[^=]+=/.test(arg)) {
        const index = arg.indexOf('=');
        const option = this._findOption(arg.slice(0, index));
        if (option && (option.required || option.optional)) {
          this.emit(`option:${option.name()}`, arg.slice(index + 1));
          continue;
        }
      }

      // Not a recognised option by this command.
      // Might be a command-argument, or subcommand option, or unknown option, or help command or option.

      // An unknown option means further arguments also classified as unknown so can be reprocessed by subcommands.
      if (maybeOption(arg)) {
        dest = unknown;
      }

      // If using positionalOptions, stop processing our options at subcommand.
      if ((this._enablePositionalOptions || this._passThroughOptions) && operands.length === 0 && unknown.length === 0) {
        if (this._findCommand(arg)) {
          operands.push(arg);
          if (args.length > 0) unknown.push(...args);
          break;
        } else if (arg === this._helpCommandName && this._hasImplicitHelpCommand()) {
          operands.push(arg);
          if (args.length > 0) operands.push(...args);
          break;
        } else if (this._defaultCommandName) {
          unknown.push(arg);
          if (args.length > 0) unknown.push(...args);
          break;
        }
      }

      // If using passThroughOptions, stop processing options at first command-argument.
      if (this._passThroughOptions) {
        dest.push(arg);
        if (args.length > 0) dest.push(...args);
        break;
      }

      // add arg
      dest.push(arg);
    }

    return { operands, unknown };
  }

  /**
   * Return an object containing local option values as key-value pairs.
   *
   * @return {Object}
   */
  opts() {
    if (this._storeOptionsAsProperties) {
      // Preserve original behaviour so backwards compatible when still using properties
      const result = {};
      const len = this.options.length;

      for (let i = 0; i < len; i++) {
        const key = this.options[i].attributeName();
        result[key] = key === this._versionOptionName ? this._version : this[key];
      }
      return result;
    }

    return this._optionValues;
  }

  /**
   * Return an object containing merged local and global option values as key-value pairs.
   *
   * @return {Object}
   */
  optsWithGlobals() {
    // globals overwrite locals
    return getCommandAndParents(this).reduce(
      (combinedOptions, cmd) => Object.assign(combinedOptions, cmd.opts()),
      {}
    );
  }

  /**
   * Display error message and exit (or call exitOverride).
   *
   * @param {string} message
   * @param {Object} [errorOptions]
   * @param {string} [errorOptions.code] - an id string representing the error
   * @param {number} [errorOptions.exitCode] - used with process.exit
   */
  error(message, errorOptions) {
    // output handling
    this._outputConfiguration.outputError(`${message}\n`, this._outputConfiguration.writeErr);
    if (typeof this._showHelpAfterError === 'string') {
      this._outputConfiguration.writeErr(`${this._showHelpAfterError}\n`);
    } else if (this._showHelpAfterError) {
      this._outputConfiguration.writeErr('\n');
      this.outputHelp({ error: true });
    }

    // exit handling
    const config = errorOptions || {};
    const exitCode = config.exitCode || 1;
    const code = config.code || 'commander.error';
    this._exit(exitCode, code, message);
  }

  /**
   * Apply any option related environment variables, if option does
   * not have a value from cli or client code.
   *
   * @api private
   */
  _parseOptionsEnv() {
    this.options.forEach((option) => {
      if (option.envVar && option.envVar in process$1.env) {
        const optionKey = option.attributeName();
        // Priority check. Do not overwrite cli or options from unknown source (client-code).
        if (this.getOptionValue(optionKey) === undefined || ['default', 'config', 'env'].includes(this.getOptionValueSource(optionKey))) {
          if (option.required || option.optional) { // option can take a value
            // keep very simple, optional always takes value
            this.emit(`optionEnv:${option.name()}`, process$1.env[option.envVar]);
          } else { // boolean
            // keep very simple, only care that envVar defined and not the value
            this.emit(`optionEnv:${option.name()}`);
          }
        }
      }
    });
  }

  /**
   * Apply any implied option values, if option is undefined or default value.
   *
   * @api private
   */
  _parseOptionsImplied() {
    const dualHelper = new DualOptions(this.options);
    const hasCustomOptionValue = (optionKey) => {
      return this.getOptionValue(optionKey) !== undefined && !['default', 'implied'].includes(this.getOptionValueSource(optionKey));
    };
    this.options
      .filter(option => (option.implied !== undefined) &&
        hasCustomOptionValue(option.attributeName()) &&
        dualHelper.valueFromOption(this.getOptionValue(option.attributeName()), option))
      .forEach((option) => {
        Object.keys(option.implied)
          .filter(impliedKey => !hasCustomOptionValue(impliedKey))
          .forEach(impliedKey => {
            this.setOptionValueWithSource(impliedKey, option.implied[impliedKey], 'implied');
          });
      });
  }

  /**
   * Argument `name` is missing.
   *
   * @param {string} name
   * @api private
   */

  missingArgument(name) {
    const message = `error: missing required argument '${name}'`;
    this.error(message, { code: 'commander.missingArgument' });
  }

  /**
   * `Option` is missing an argument.
   *
   * @param {Option} option
   * @api private
   */

  optionMissingArgument(option) {
    const message = `error: option '${option.flags}' argument missing`;
    this.error(message, { code: 'commander.optionMissingArgument' });
  }

  /**
   * `Option` does not have a value, and is a mandatory option.
   *
   * @param {Option} option
   * @api private
   */

  missingMandatoryOptionValue(option) {
    const message = `error: required option '${option.flags}' not specified`;
    this.error(message, { code: 'commander.missingMandatoryOptionValue' });
  }

  /**
   * `Option` conflicts with another option.
   *
   * @param {Option} option
   * @param {Option} conflictingOption
   * @api private
   */
  _conflictingOption(option, conflictingOption) {
    // The calling code does not know whether a negated option is the source of the
    // value, so do some work to take an educated guess.
    const findBestOptionFromValue = (option) => {
      const optionKey = option.attributeName();
      const optionValue = this.getOptionValue(optionKey);
      const negativeOption = this.options.find(target => target.negate && optionKey === target.attributeName());
      const positiveOption = this.options.find(target => !target.negate && optionKey === target.attributeName());
      if (negativeOption && (
        (negativeOption.presetArg === undefined && optionValue === false) ||
        (negativeOption.presetArg !== undefined && optionValue === negativeOption.presetArg)
      )) {
        return negativeOption;
      }
      return positiveOption || option;
    };

    const getErrorMessage = (option) => {
      const bestOption = findBestOptionFromValue(option);
      const optionKey = bestOption.attributeName();
      const source = this.getOptionValueSource(optionKey);
      if (source === 'env') {
        return `environment variable '${bestOption.envVar}'`;
      }
      return `option '${bestOption.flags}'`;
    };

    const message = `error: ${getErrorMessage(option)} cannot be used with ${getErrorMessage(conflictingOption)}`;
    this.error(message, { code: 'commander.conflictingOption' });
  }

  /**
   * Unknown option `flag`.
   *
   * @param {string} flag
   * @api private
   */

  unknownOption(flag) {
    if (this._allowUnknownOption) return;
    let suggestion = '';

    if (flag.startsWith('--') && this._showSuggestionAfterError) {
      // Looping to pick up the global options too
      let candidateFlags = [];
      let command = this;
      do {
        const moreFlags = command.createHelp().visibleOptions(command)
          .filter(option => option.long)
          .map(option => option.long);
        candidateFlags = candidateFlags.concat(moreFlags);
        command = command.parent;
      } while (command && !command._enablePositionalOptions);
      suggestion = suggestSimilar(flag, candidateFlags);
    }

    const message = `error: unknown option '${flag}'${suggestion}`;
    this.error(message, { code: 'commander.unknownOption' });
  }

  /**
   * Excess arguments, more than expected.
   *
   * @param {string[]} receivedArgs
   * @api private
   */

  _excessArguments(receivedArgs) {
    if (this._allowExcessArguments) return;

    const expected = this._args.length;
    const s = (expected === 1) ? '' : 's';
    const forSubcommand = this.parent ? ` for '${this.name()}'` : '';
    const message = `error: too many arguments${forSubcommand}. Expected ${expected} argument${s} but got ${receivedArgs.length}.`;
    this.error(message, { code: 'commander.excessArguments' });
  }

  /**
   * Unknown command.
   *
   * @api private
   */

  unknownCommand() {
    const unknownName = this.args[0];
    let suggestion = '';

    if (this._showSuggestionAfterError) {
      const candidateNames = [];
      this.createHelp().visibleCommands(this).forEach((command) => {
        candidateNames.push(command.name());
        // just visible alias
        if (command.alias()) candidateNames.push(command.alias());
      });
      suggestion = suggestSimilar(unknownName, candidateNames);
    }

    const message = `error: unknown command '${unknownName}'${suggestion}`;
    this.error(message, { code: 'commander.unknownCommand' });
  }

  /**
   * Set the program version to `str`.
   *
   * This method auto-registers the "-V, --version" flag
   * which will print the version number when passed.
   *
   * You can optionally supply the  flags and description to override the defaults.
   *
   * @param {string} str
   * @param {string} [flags]
   * @param {string} [description]
   * @return {this | string} `this` command for chaining, or version string if no arguments
   */

  version(str, flags, description) {
    if (str === undefined) return this._version;
    this._version = str;
    flags = flags || '-V, --version';
    description = description || 'output the version number';
    const versionOption = this.createOption(flags, description);
    this._versionOptionName = versionOption.attributeName();
    this.options.push(versionOption);
    this.on('option:' + versionOption.name(), () => {
      this._outputConfiguration.writeOut(`${str}\n`);
      this._exit(0, 'commander.version', str);
    });
    return this;
  }

  /**
   * Set the description.
   *
   * @param {string} [str]
   * @param {Object} [argsDescription]
   * @return {string|Command}
   */
  description(str, argsDescription) {
    if (str === undefined && argsDescription === undefined) return this._description;
    this._description = str;
    if (argsDescription) {
      this._argsDescription = argsDescription;
    }
    return this;
  }

  /**
   * Set the summary. Used when listed as subcommand of parent.
   *
   * @param {string} [str]
   * @return {string|Command}
   */
  summary(str) {
    if (str === undefined) return this._summary;
    this._summary = str;
    return this;
  }

  /**
   * Set an alias for the command.
   *
   * You may call more than once to add multiple aliases. Only the first alias is shown in the auto-generated help.
   *
   * @param {string} [alias]
   * @return {string|Command}
   */

  alias(alias) {
    if (alias === undefined) return this._aliases[0]; // just return first, for backwards compatibility

    /** @type {Command} */
    let command = this;
    if (this.commands.length !== 0 && this.commands[this.commands.length - 1]._executableHandler) {
      // assume adding alias for last added executable subcommand, rather than this
      command = this.commands[this.commands.length - 1];
    }

    if (alias === command._name) throw new Error('Command alias can\'t be the same as its name');

    command._aliases.push(alias);
    return this;
  }

  /**
   * Set aliases for the command.
   *
   * Only the first alias is shown in the auto-generated help.
   *
   * @param {string[]} [aliases]
   * @return {string[]|Command}
   */

  aliases(aliases) {
    // Getter for the array of aliases is the main reason for having aliases() in addition to alias().
    if (aliases === undefined) return this._aliases;

    aliases.forEach((alias) => this.alias(alias));
    return this;
  }

  /**
   * Set / get the command usage `str`.
   *
   * @param {string} [str]
   * @return {String|Command}
   */

  usage(str) {
    if (str === undefined) {
      if (this._usage) return this._usage;

      const args = this._args.map((arg) => {
        return humanReadableArgName(arg);
      });
      return [].concat(
        (this.options.length || this._hasHelpOption ? '[options]' : []),
        (this.commands.length ? '[command]' : []),
        (this._args.length ? args : [])
      ).join(' ');
    }

    this._usage = str;
    return this;
  }

  /**
   * Get or set the name of the command.
   *
   * @param {string} [str]
   * @return {string|Command}
   */

  name(str) {
    if (str === undefined) return this._name;
    this._name = str;
    return this;
  }

  /**
   * Set the name of the command from script filename, such as process.argv[1],
   * or require.main.filename, or __filename.
   *
   * (Used internally and public although not documented in README.)
   *
   * @example
   * program.nameFromFilename(require.main.filename);
   *
   * @param {string} filename
   * @return {Command}
   */

  nameFromFilename(filename) {
    this._name = path$2.basename(filename, path$2.extname(filename));

    return this;
  }

  /**
   * Get or set the directory for searching for executable subcommands of this command.
   *
   * @example
   * program.executableDir(__dirname);
   * // or
   * program.executableDir('subcommands');
   *
   * @param {string} [path]
   * @return {string|Command}
   */

  executableDir(path) {
    if (path === undefined) return this._executableDir;
    this._executableDir = path;
    return this;
  }

  /**
   * Return program help documentation.
   *
   * @param {{ error: boolean }} [contextOptions] - pass {error:true} to wrap for stderr instead of stdout
   * @return {string}
   */

  helpInformation(contextOptions) {
    const helper = this.createHelp();
    if (helper.helpWidth === undefined) {
      helper.helpWidth = (contextOptions && contextOptions.error) ? this._outputConfiguration.getErrHelpWidth() : this._outputConfiguration.getOutHelpWidth();
    }
    return helper.formatHelp(this, helper);
  }

  /**
   * @api private
   */

  _getHelpContext(contextOptions) {
    contextOptions = contextOptions || {};
    const context = { error: !!contextOptions.error };
    let write;
    if (context.error) {
      write = (arg) => this._outputConfiguration.writeErr(arg);
    } else {
      write = (arg) => this._outputConfiguration.writeOut(arg);
    }
    context.write = contextOptions.write || write;
    context.command = this;
    return context;
  }

  /**
   * Output help information for this command.
   *
   * Outputs built-in help, and custom text added using `.addHelpText()`.
   *
   * @param {{ error: boolean } | Function} [contextOptions] - pass {error:true} to write to stderr instead of stdout
   */

  outputHelp(contextOptions) {
    let deprecatedCallback;
    if (typeof contextOptions === 'function') {
      deprecatedCallback = contextOptions;
      contextOptions = undefined;
    }
    const context = this._getHelpContext(contextOptions);

    getCommandAndParents(this).reverse().forEach(command => command.emit('beforeAllHelp', context));
    this.emit('beforeHelp', context);

    let helpInformation = this.helpInformation(context);
    if (deprecatedCallback) {
      helpInformation = deprecatedCallback(helpInformation);
      if (typeof helpInformation !== 'string' && !Buffer.isBuffer(helpInformation)) {
        throw new Error('outputHelp callback must return a string or a Buffer');
      }
    }
    context.write(helpInformation);

    this.emit(this._helpLongFlag); // deprecated
    this.emit('afterHelp', context);
    getCommandAndParents(this).forEach(command => command.emit('afterAllHelp', context));
  }

  /**
   * You can pass in flags and a description to override the help
   * flags and help description for your command. Pass in false to
   * disable the built-in help option.
   *
   * @param {string | boolean} [flags]
   * @param {string} [description]
   * @return {Command} `this` command for chaining
   */

  helpOption(flags, description) {
    if (typeof flags === 'boolean') {
      this._hasHelpOption = flags;
      return this;
    }
    this._helpFlags = flags || this._helpFlags;
    this._helpDescription = description || this._helpDescription;

    const helpFlags = splitOptionFlags(this._helpFlags);
    this._helpShortFlag = helpFlags.shortFlag;
    this._helpLongFlag = helpFlags.longFlag;

    return this;
  }

  /**
   * Output help information and exit.
   *
   * Outputs built-in help, and custom text added using `.addHelpText()`.
   *
   * @param {{ error: boolean }} [contextOptions] - pass {error:true} to write to stderr instead of stdout
   */

  help(contextOptions) {
    this.outputHelp(contextOptions);
    let exitCode = process$1.exitCode || 0;
    if (exitCode === 0 && contextOptions && typeof contextOptions !== 'function' && contextOptions.error) {
      exitCode = 1;
    }
    // message: do not have all displayed text available so only passing placeholder.
    this._exit(exitCode, 'commander.help', '(outputHelp)');
  }

  /**
   * Add additional text to be displayed with the built-in help.
   *
   * Position is 'before' or 'after' to affect just this command,
   * and 'beforeAll' or 'afterAll' to affect this command and all its subcommands.
   *
   * @param {string} position - before or after built-in help
   * @param {string | Function} text - string to add, or a function returning a string
   * @return {Command} `this` command for chaining
   */
  addHelpText(position, text) {
    const allowedValues = ['beforeAll', 'before', 'after', 'afterAll'];
    if (!allowedValues.includes(position)) {
      throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${allowedValues.join("', '")}'`);
    }
    const helpEvent = `${position}Help`;
    this.on(helpEvent, (context) => {
      let helpStr;
      if (typeof text === 'function') {
        helpStr = text({ error: context.error, command: context.command });
      } else {
        helpStr = text;
      }
      // Ignore falsy value when nothing to output.
      if (helpStr) {
        context.write(`${helpStr}\n`);
      }
    });
    return this;
  }
}

/**
 * Output help information if help flags specified
 *
 * @param {Command} cmd - command to output help for
 * @param {Array} args - array of options to search for help flags
 * @api private
 */

function outputHelpIfRequested(cmd, args) {
  const helpOption = cmd._hasHelpOption && args.find(arg => arg === cmd._helpLongFlag || arg === cmd._helpShortFlag);
  if (helpOption) {
    cmd.outputHelp();
    // (Do not have all displayed text available so only passing placeholder.)
    cmd._exit(0, 'commander.helpDisplayed', '(outputHelp)');
  }
}

/**
 * Scan arguments and increment port number for inspect calls (to avoid conflicts when spawning new command).
 *
 * @param {string[]} args - array of arguments from node.execArgv
 * @returns {string[]}
 * @api private
 */

function incrementNodeInspectorPort(args) {
  // Testing for these options:
  //  --inspect[=[host:]port]
  //  --inspect-brk[=[host:]port]
  //  --inspect-port=[host:]port
  return args.map((arg) => {
    if (!arg.startsWith('--inspect')) {
      return arg;
    }
    let debugOption;
    let debugHost = '127.0.0.1';
    let debugPort = '9229';
    let match;
    if ((match = arg.match(/^(--inspect(-brk)?)$/)) !== null) {
      // e.g. --inspect
      debugOption = match[1];
    } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null) {
      debugOption = match[1];
      if (/^\d+$/.test(match[3])) {
        // e.g. --inspect=1234
        debugPort = match[3];
      } else {
        // e.g. --inspect=localhost
        debugHost = match[3];
      }
    } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null) {
      // e.g. --inspect=localhost:1234
      debugOption = match[1];
      debugHost = match[3];
      debugPort = match[4];
    }

    if (debugOption && debugPort !== '0') {
      return `${debugOption}=${debugHost}:${parseInt(debugPort) + 1}`;
    }
    return arg;
  });
}

/**
 * @param {Command} startCommand
 * @returns {Command[]}
 * @api private
 */

function getCommandAndParents(startCommand) {
  const result = [];
  for (let command = startCommand; command; command = command.parent) {
    result.push(command);
  }
  return result;
}

command.Command = Command$1;

(function (module, exports) {
	const { Argument } = argument;
	const { Command } = command;
	const { CommanderError, InvalidArgumentError } = error;
	const { Help } = help;
	const { Option } = option;

	// @ts-check

	/**
	 * Expose the root command.
	 */

	exports = module.exports = new Command();
	exports.program = exports; // More explicit access to global command.
	// Implicit export of createArgument, createCommand, and createOption.

	/**
	 * Expose classes
	 */

	exports.Argument = Argument;
	exports.Command = Command;
	exports.CommanderError = CommanderError;
	exports.Help = Help;
	exports.InvalidArgumentError = InvalidArgumentError;
	exports.InvalidOptionArgumentError = InvalidArgumentError; // Deprecated
	exports.Option = Option;
} (commander, commander.exports));

var name = "ancy-plugin-one";
var version$1 = "1.0.5";
var description = "";
var main = "/src/main.js";
var scripts = {
	"build:rollup": "rollup --config rollup.config.js"
};
var bin = {
	one: "bin/index.js"
};
var keywords = [
];
var author = "";
var license = "ISC";
var dependencies = {
	"@rollup/plugin-commonjs": "^22.0.2",
	"@rollup/plugin-json": "^4.1.0",
	"@rollup/plugin-node-resolve": "^14.1.0",
	chalk: "^4.1.2",
	commander: "^9.4.0",
	enquirer: "^2.3.6",
	"gradient-string": "^2.0.2"
};
var devDependencies = {
	prettier: "^2.7.1",
	rollup: "^2.79.1",
	"rollup-plugin-cleanup": "^3.2.1",
	"rollup-plugin-copy": "^3.4.0",
	"rollup-plugin-delete": "^2.0.0"
};
var require$$1 = {
	name: name,
	version: version$1,
	description: description,
	main: main,
	scripts: scripts,
	bin: bin,
	keywords: keywords,
	author: author,
	license: license,
	dependencies: dependencies,
	devDependencies: devDependencies
};

var generateComs$2 = {};

var ansiStyles$1 = {exports: {}};

var colorName;
var hasRequiredColorName;

function requireColorName () {
	if (hasRequiredColorName) return colorName;
	hasRequiredColorName = 1;

	colorName = {
		"aliceblue": [240, 248, 255],
		"antiquewhite": [250, 235, 215],
		"aqua": [0, 255, 255],
		"aquamarine": [127, 255, 212],
		"azure": [240, 255, 255],
		"beige": [245, 245, 220],
		"bisque": [255, 228, 196],
		"black": [0, 0, 0],
		"blanchedalmond": [255, 235, 205],
		"blue": [0, 0, 255],
		"blueviolet": [138, 43, 226],
		"brown": [165, 42, 42],
		"burlywood": [222, 184, 135],
		"cadetblue": [95, 158, 160],
		"chartreuse": [127, 255, 0],
		"chocolate": [210, 105, 30],
		"coral": [255, 127, 80],
		"cornflowerblue": [100, 149, 237],
		"cornsilk": [255, 248, 220],
		"crimson": [220, 20, 60],
		"cyan": [0, 255, 255],
		"darkblue": [0, 0, 139],
		"darkcyan": [0, 139, 139],
		"darkgoldenrod": [184, 134, 11],
		"darkgray": [169, 169, 169],
		"darkgreen": [0, 100, 0],
		"darkgrey": [169, 169, 169],
		"darkkhaki": [189, 183, 107],
		"darkmagenta": [139, 0, 139],
		"darkolivegreen": [85, 107, 47],
		"darkorange": [255, 140, 0],
		"darkorchid": [153, 50, 204],
		"darkred": [139, 0, 0],
		"darksalmon": [233, 150, 122],
		"darkseagreen": [143, 188, 143],
		"darkslateblue": [72, 61, 139],
		"darkslategray": [47, 79, 79],
		"darkslategrey": [47, 79, 79],
		"darkturquoise": [0, 206, 209],
		"darkviolet": [148, 0, 211],
		"deeppink": [255, 20, 147],
		"deepskyblue": [0, 191, 255],
		"dimgray": [105, 105, 105],
		"dimgrey": [105, 105, 105],
		"dodgerblue": [30, 144, 255],
		"firebrick": [178, 34, 34],
		"floralwhite": [255, 250, 240],
		"forestgreen": [34, 139, 34],
		"fuchsia": [255, 0, 255],
		"gainsboro": [220, 220, 220],
		"ghostwhite": [248, 248, 255],
		"gold": [255, 215, 0],
		"goldenrod": [218, 165, 32],
		"gray": [128, 128, 128],
		"green": [0, 128, 0],
		"greenyellow": [173, 255, 47],
		"grey": [128, 128, 128],
		"honeydew": [240, 255, 240],
		"hotpink": [255, 105, 180],
		"indianred": [205, 92, 92],
		"indigo": [75, 0, 130],
		"ivory": [255, 255, 240],
		"khaki": [240, 230, 140],
		"lavender": [230, 230, 250],
		"lavenderblush": [255, 240, 245],
		"lawngreen": [124, 252, 0],
		"lemonchiffon": [255, 250, 205],
		"lightblue": [173, 216, 230],
		"lightcoral": [240, 128, 128],
		"lightcyan": [224, 255, 255],
		"lightgoldenrodyellow": [250, 250, 210],
		"lightgray": [211, 211, 211],
		"lightgreen": [144, 238, 144],
		"lightgrey": [211, 211, 211],
		"lightpink": [255, 182, 193],
		"lightsalmon": [255, 160, 122],
		"lightseagreen": [32, 178, 170],
		"lightskyblue": [135, 206, 250],
		"lightslategray": [119, 136, 153],
		"lightslategrey": [119, 136, 153],
		"lightsteelblue": [176, 196, 222],
		"lightyellow": [255, 255, 224],
		"lime": [0, 255, 0],
		"limegreen": [50, 205, 50],
		"linen": [250, 240, 230],
		"magenta": [255, 0, 255],
		"maroon": [128, 0, 0],
		"mediumaquamarine": [102, 205, 170],
		"mediumblue": [0, 0, 205],
		"mediumorchid": [186, 85, 211],
		"mediumpurple": [147, 112, 219],
		"mediumseagreen": [60, 179, 113],
		"mediumslateblue": [123, 104, 238],
		"mediumspringgreen": [0, 250, 154],
		"mediumturquoise": [72, 209, 204],
		"mediumvioletred": [199, 21, 133],
		"midnightblue": [25, 25, 112],
		"mintcream": [245, 255, 250],
		"mistyrose": [255, 228, 225],
		"moccasin": [255, 228, 181],
		"navajowhite": [255, 222, 173],
		"navy": [0, 0, 128],
		"oldlace": [253, 245, 230],
		"olive": [128, 128, 0],
		"olivedrab": [107, 142, 35],
		"orange": [255, 165, 0],
		"orangered": [255, 69, 0],
		"orchid": [218, 112, 214],
		"palegoldenrod": [238, 232, 170],
		"palegreen": [152, 251, 152],
		"paleturquoise": [175, 238, 238],
		"palevioletred": [219, 112, 147],
		"papayawhip": [255, 239, 213],
		"peachpuff": [255, 218, 185],
		"peru": [205, 133, 63],
		"pink": [255, 192, 203],
		"plum": [221, 160, 221],
		"powderblue": [176, 224, 230],
		"purple": [128, 0, 128],
		"rebeccapurple": [102, 51, 153],
		"red": [255, 0, 0],
		"rosybrown": [188, 143, 143],
		"royalblue": [65, 105, 225],
		"saddlebrown": [139, 69, 19],
		"salmon": [250, 128, 114],
		"sandybrown": [244, 164, 96],
		"seagreen": [46, 139, 87],
		"seashell": [255, 245, 238],
		"sienna": [160, 82, 45],
		"silver": [192, 192, 192],
		"skyblue": [135, 206, 235],
		"slateblue": [106, 90, 205],
		"slategray": [112, 128, 144],
		"slategrey": [112, 128, 144],
		"snow": [255, 250, 250],
		"springgreen": [0, 255, 127],
		"steelblue": [70, 130, 180],
		"tan": [210, 180, 140],
		"teal": [0, 128, 128],
		"thistle": [216, 191, 216],
		"tomato": [255, 99, 71],
		"turquoise": [64, 224, 208],
		"violet": [238, 130, 238],
		"wheat": [245, 222, 179],
		"white": [255, 255, 255],
		"whitesmoke": [245, 245, 245],
		"yellow": [255, 255, 0],
		"yellowgreen": [154, 205, 50]
	};
	return colorName;
}

/* MIT license */

var conversions;
var hasRequiredConversions;

function requireConversions () {
	if (hasRequiredConversions) return conversions;
	hasRequiredConversions = 1;
	/* eslint-disable no-mixed-operators */
	const cssKeywords = requireColorName();

	// NOTE: conversions should only return primitive values (i.e. arrays, or
	//       values that give correct `typeof` results).
	//       do not use box values types (i.e. Number(), String(), etc.)

	const reverseKeywords = {};
	for (const key of Object.keys(cssKeywords)) {
		reverseKeywords[cssKeywords[key]] = key;
	}

	const convert = {
		rgb: {channels: 3, labels: 'rgb'},
		hsl: {channels: 3, labels: 'hsl'},
		hsv: {channels: 3, labels: 'hsv'},
		hwb: {channels: 3, labels: 'hwb'},
		cmyk: {channels: 4, labels: 'cmyk'},
		xyz: {channels: 3, labels: 'xyz'},
		lab: {channels: 3, labels: 'lab'},
		lch: {channels: 3, labels: 'lch'},
		hex: {channels: 1, labels: ['hex']},
		keyword: {channels: 1, labels: ['keyword']},
		ansi16: {channels: 1, labels: ['ansi16']},
		ansi256: {channels: 1, labels: ['ansi256']},
		hcg: {channels: 3, labels: ['h', 'c', 'g']},
		apple: {channels: 3, labels: ['r16', 'g16', 'b16']},
		gray: {channels: 1, labels: ['gray']}
	};

	conversions = convert;

	// Hide .channels and .labels properties
	for (const model of Object.keys(convert)) {
		if (!('channels' in convert[model])) {
			throw new Error('missing channels property: ' + model);
		}

		if (!('labels' in convert[model])) {
			throw new Error('missing channel labels property: ' + model);
		}

		if (convert[model].labels.length !== convert[model].channels) {
			throw new Error('channel and label counts mismatch: ' + model);
		}

		const {channels, labels} = convert[model];
		delete convert[model].channels;
		delete convert[model].labels;
		Object.defineProperty(convert[model], 'channels', {value: channels});
		Object.defineProperty(convert[model], 'labels', {value: labels});
	}

	convert.rgb.hsl = function (rgb) {
		const r = rgb[0] / 255;
		const g = rgb[1] / 255;
		const b = rgb[2] / 255;
		const min = Math.min(r, g, b);
		const max = Math.max(r, g, b);
		const delta = max - min;
		let h;
		let s;

		if (max === min) {
			h = 0;
		} else if (r === max) {
			h = (g - b) / delta;
		} else if (g === max) {
			h = 2 + (b - r) / delta;
		} else if (b === max) {
			h = 4 + (r - g) / delta;
		}

		h = Math.min(h * 60, 360);

		if (h < 0) {
			h += 360;
		}

		const l = (min + max) / 2;

		if (max === min) {
			s = 0;
		} else if (l <= 0.5) {
			s = delta / (max + min);
		} else {
			s = delta / (2 - max - min);
		}

		return [h, s * 100, l * 100];
	};

	convert.rgb.hsv = function (rgb) {
		let rdif;
		let gdif;
		let bdif;
		let h;
		let s;

		const r = rgb[0] / 255;
		const g = rgb[1] / 255;
		const b = rgb[2] / 255;
		const v = Math.max(r, g, b);
		const diff = v - Math.min(r, g, b);
		const diffc = function (c) {
			return (v - c) / 6 / diff + 1 / 2;
		};

		if (diff === 0) {
			h = 0;
			s = 0;
		} else {
			s = diff / v;
			rdif = diffc(r);
			gdif = diffc(g);
			bdif = diffc(b);

			if (r === v) {
				h = bdif - gdif;
			} else if (g === v) {
				h = (1 / 3) + rdif - bdif;
			} else if (b === v) {
				h = (2 / 3) + gdif - rdif;
			}

			if (h < 0) {
				h += 1;
			} else if (h > 1) {
				h -= 1;
			}
		}

		return [
			h * 360,
			s * 100,
			v * 100
		];
	};

	convert.rgb.hwb = function (rgb) {
		const r = rgb[0];
		const g = rgb[1];
		let b = rgb[2];
		const h = convert.rgb.hsl(rgb)[0];
		const w = 1 / 255 * Math.min(r, Math.min(g, b));

		b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

		return [h, w * 100, b * 100];
	};

	convert.rgb.cmyk = function (rgb) {
		const r = rgb[0] / 255;
		const g = rgb[1] / 255;
		const b = rgb[2] / 255;

		const k = Math.min(1 - r, 1 - g, 1 - b);
		const c = (1 - r - k) / (1 - k) || 0;
		const m = (1 - g - k) / (1 - k) || 0;
		const y = (1 - b - k) / (1 - k) || 0;

		return [c * 100, m * 100, y * 100, k * 100];
	};

	function comparativeDistance(x, y) {
		/*
			See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
		*/
		return (
			((x[0] - y[0]) ** 2) +
			((x[1] - y[1]) ** 2) +
			((x[2] - y[2]) ** 2)
		);
	}

	convert.rgb.keyword = function (rgb) {
		const reversed = reverseKeywords[rgb];
		if (reversed) {
			return reversed;
		}

		let currentClosestDistance = Infinity;
		let currentClosestKeyword;

		for (const keyword of Object.keys(cssKeywords)) {
			const value = cssKeywords[keyword];

			// Compute comparative distance
			const distance = comparativeDistance(rgb, value);

			// Check if its less, if so set as closest
			if (distance < currentClosestDistance) {
				currentClosestDistance = distance;
				currentClosestKeyword = keyword;
			}
		}

		return currentClosestKeyword;
	};

	convert.keyword.rgb = function (keyword) {
		return cssKeywords[keyword];
	};

	convert.rgb.xyz = function (rgb) {
		let r = rgb[0] / 255;
		let g = rgb[1] / 255;
		let b = rgb[2] / 255;

		// Assume sRGB
		r = r > 0.04045 ? (((r + 0.055) / 1.055) ** 2.4) : (r / 12.92);
		g = g > 0.04045 ? (((g + 0.055) / 1.055) ** 2.4) : (g / 12.92);
		b = b > 0.04045 ? (((b + 0.055) / 1.055) ** 2.4) : (b / 12.92);

		const x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
		const y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
		const z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

		return [x * 100, y * 100, z * 100];
	};

	convert.rgb.lab = function (rgb) {
		const xyz = convert.rgb.xyz(rgb);
		let x = xyz[0];
		let y = xyz[1];
		let z = xyz[2];

		x /= 95.047;
		y /= 100;
		z /= 108.883;

		x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
		y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
		z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

		const l = (116 * y) - 16;
		const a = 500 * (x - y);
		const b = 200 * (y - z);

		return [l, a, b];
	};

	convert.hsl.rgb = function (hsl) {
		const h = hsl[0] / 360;
		const s = hsl[1] / 100;
		const l = hsl[2] / 100;
		let t2;
		let t3;
		let val;

		if (s === 0) {
			val = l * 255;
			return [val, val, val];
		}

		if (l < 0.5) {
			t2 = l * (1 + s);
		} else {
			t2 = l + s - l * s;
		}

		const t1 = 2 * l - t2;

		const rgb = [0, 0, 0];
		for (let i = 0; i < 3; i++) {
			t3 = h + 1 / 3 * -(i - 1);
			if (t3 < 0) {
				t3++;
			}

			if (t3 > 1) {
				t3--;
			}

			if (6 * t3 < 1) {
				val = t1 + (t2 - t1) * 6 * t3;
			} else if (2 * t3 < 1) {
				val = t2;
			} else if (3 * t3 < 2) {
				val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
			} else {
				val = t1;
			}

			rgb[i] = val * 255;
		}

		return rgb;
	};

	convert.hsl.hsv = function (hsl) {
		const h = hsl[0];
		let s = hsl[1] / 100;
		let l = hsl[2] / 100;
		let smin = s;
		const lmin = Math.max(l, 0.01);

		l *= 2;
		s *= (l <= 1) ? l : 2 - l;
		smin *= lmin <= 1 ? lmin : 2 - lmin;
		const v = (l + s) / 2;
		const sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

		return [h, sv * 100, v * 100];
	};

	convert.hsv.rgb = function (hsv) {
		const h = hsv[0] / 60;
		const s = hsv[1] / 100;
		let v = hsv[2] / 100;
		const hi = Math.floor(h) % 6;

		const f = h - Math.floor(h);
		const p = 255 * v * (1 - s);
		const q = 255 * v * (1 - (s * f));
		const t = 255 * v * (1 - (s * (1 - f)));
		v *= 255;

		switch (hi) {
			case 0:
				return [v, t, p];
			case 1:
				return [q, v, p];
			case 2:
				return [p, v, t];
			case 3:
				return [p, q, v];
			case 4:
				return [t, p, v];
			case 5:
				return [v, p, q];
		}
	};

	convert.hsv.hsl = function (hsv) {
		const h = hsv[0];
		const s = hsv[1] / 100;
		const v = hsv[2] / 100;
		const vmin = Math.max(v, 0.01);
		let sl;
		let l;

		l = (2 - s) * v;
		const lmin = (2 - s) * vmin;
		sl = s * vmin;
		sl /= (lmin <= 1) ? lmin : 2 - lmin;
		sl = sl || 0;
		l /= 2;

		return [h, sl * 100, l * 100];
	};

	// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
	convert.hwb.rgb = function (hwb) {
		const h = hwb[0] / 360;
		let wh = hwb[1] / 100;
		let bl = hwb[2] / 100;
		const ratio = wh + bl;
		let f;

		// Wh + bl cant be > 1
		if (ratio > 1) {
			wh /= ratio;
			bl /= ratio;
		}

		const i = Math.floor(6 * h);
		const v = 1 - bl;
		f = 6 * h - i;

		if ((i & 0x01) !== 0) {
			f = 1 - f;
		}

		const n = wh + f * (v - wh); // Linear interpolation

		let r;
		let g;
		let b;
		/* eslint-disable max-statements-per-line,no-multi-spaces */
		switch (i) {
			default:
			case 6:
			case 0: r = v;  g = n;  b = wh; break;
			case 1: r = n;  g = v;  b = wh; break;
			case 2: r = wh; g = v;  b = n; break;
			case 3: r = wh; g = n;  b = v; break;
			case 4: r = n;  g = wh; b = v; break;
			case 5: r = v;  g = wh; b = n; break;
		}
		/* eslint-enable max-statements-per-line,no-multi-spaces */

		return [r * 255, g * 255, b * 255];
	};

	convert.cmyk.rgb = function (cmyk) {
		const c = cmyk[0] / 100;
		const m = cmyk[1] / 100;
		const y = cmyk[2] / 100;
		const k = cmyk[3] / 100;

		const r = 1 - Math.min(1, c * (1 - k) + k);
		const g = 1 - Math.min(1, m * (1 - k) + k);
		const b = 1 - Math.min(1, y * (1 - k) + k);

		return [r * 255, g * 255, b * 255];
	};

	convert.xyz.rgb = function (xyz) {
		const x = xyz[0] / 100;
		const y = xyz[1] / 100;
		const z = xyz[2] / 100;
		let r;
		let g;
		let b;

		r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
		g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
		b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

		// Assume sRGB
		r = r > 0.0031308
			? ((1.055 * (r ** (1.0 / 2.4))) - 0.055)
			: r * 12.92;

		g = g > 0.0031308
			? ((1.055 * (g ** (1.0 / 2.4))) - 0.055)
			: g * 12.92;

		b = b > 0.0031308
			? ((1.055 * (b ** (1.0 / 2.4))) - 0.055)
			: b * 12.92;

		r = Math.min(Math.max(0, r), 1);
		g = Math.min(Math.max(0, g), 1);
		b = Math.min(Math.max(0, b), 1);

		return [r * 255, g * 255, b * 255];
	};

	convert.xyz.lab = function (xyz) {
		let x = xyz[0];
		let y = xyz[1];
		let z = xyz[2];

		x /= 95.047;
		y /= 100;
		z /= 108.883;

		x = x > 0.008856 ? (x ** (1 / 3)) : (7.787 * x) + (16 / 116);
		y = y > 0.008856 ? (y ** (1 / 3)) : (7.787 * y) + (16 / 116);
		z = z > 0.008856 ? (z ** (1 / 3)) : (7.787 * z) + (16 / 116);

		const l = (116 * y) - 16;
		const a = 500 * (x - y);
		const b = 200 * (y - z);

		return [l, a, b];
	};

	convert.lab.xyz = function (lab) {
		const l = lab[0];
		const a = lab[1];
		const b = lab[2];
		let x;
		let y;
		let z;

		y = (l + 16) / 116;
		x = a / 500 + y;
		z = y - b / 200;

		const y2 = y ** 3;
		const x2 = x ** 3;
		const z2 = z ** 3;
		y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
		x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
		z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

		x *= 95.047;
		y *= 100;
		z *= 108.883;

		return [x, y, z];
	};

	convert.lab.lch = function (lab) {
		const l = lab[0];
		const a = lab[1];
		const b = lab[2];
		let h;

		const hr = Math.atan2(b, a);
		h = hr * 360 / 2 / Math.PI;

		if (h < 0) {
			h += 360;
		}

		const c = Math.sqrt(a * a + b * b);

		return [l, c, h];
	};

	convert.lch.lab = function (lch) {
		const l = lch[0];
		const c = lch[1];
		const h = lch[2];

		const hr = h / 360 * 2 * Math.PI;
		const a = c * Math.cos(hr);
		const b = c * Math.sin(hr);

		return [l, a, b];
	};

	convert.rgb.ansi16 = function (args, saturation = null) {
		const [r, g, b] = args;
		let value = saturation === null ? convert.rgb.hsv(args)[2] : saturation; // Hsv -> ansi16 optimization

		value = Math.round(value / 50);

		if (value === 0) {
			return 30;
		}

		let ansi = 30
			+ ((Math.round(b / 255) << 2)
			| (Math.round(g / 255) << 1)
			| Math.round(r / 255));

		if (value === 2) {
			ansi += 60;
		}

		return ansi;
	};

	convert.hsv.ansi16 = function (args) {
		// Optimization here; we already know the value and don't need to get
		// it converted for us.
		return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
	};

	convert.rgb.ansi256 = function (args) {
		const r = args[0];
		const g = args[1];
		const b = args[2];

		// We use the extended greyscale palette here, with the exception of
		// black and white. normal palette only has 4 greyscale shades.
		if (r === g && g === b) {
			if (r < 8) {
				return 16;
			}

			if (r > 248) {
				return 231;
			}

			return Math.round(((r - 8) / 247) * 24) + 232;
		}

		const ansi = 16
			+ (36 * Math.round(r / 255 * 5))
			+ (6 * Math.round(g / 255 * 5))
			+ Math.round(b / 255 * 5);

		return ansi;
	};

	convert.ansi16.rgb = function (args) {
		let color = args % 10;

		// Handle greyscale
		if (color === 0 || color === 7) {
			if (args > 50) {
				color += 3.5;
			}

			color = color / 10.5 * 255;

			return [color, color, color];
		}

		const mult = (~~(args > 50) + 1) * 0.5;
		const r = ((color & 1) * mult) * 255;
		const g = (((color >> 1) & 1) * mult) * 255;
		const b = (((color >> 2) & 1) * mult) * 255;

		return [r, g, b];
	};

	convert.ansi256.rgb = function (args) {
		// Handle greyscale
		if (args >= 232) {
			const c = (args - 232) * 10 + 8;
			return [c, c, c];
		}

		args -= 16;

		let rem;
		const r = Math.floor(args / 36) / 5 * 255;
		const g = Math.floor((rem = args % 36) / 6) / 5 * 255;
		const b = (rem % 6) / 5 * 255;

		return [r, g, b];
	};

	convert.rgb.hex = function (args) {
		const integer = ((Math.round(args[0]) & 0xFF) << 16)
			+ ((Math.round(args[1]) & 0xFF) << 8)
			+ (Math.round(args[2]) & 0xFF);

		const string = integer.toString(16).toUpperCase();
		return '000000'.substring(string.length) + string;
	};

	convert.hex.rgb = function (args) {
		const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
		if (!match) {
			return [0, 0, 0];
		}

		let colorString = match[0];

		if (match[0].length === 3) {
			colorString = colorString.split('').map(char => {
				return char + char;
			}).join('');
		}

		const integer = parseInt(colorString, 16);
		const r = (integer >> 16) & 0xFF;
		const g = (integer >> 8) & 0xFF;
		const b = integer & 0xFF;

		return [r, g, b];
	};

	convert.rgb.hcg = function (rgb) {
		const r = rgb[0] / 255;
		const g = rgb[1] / 255;
		const b = rgb[2] / 255;
		const max = Math.max(Math.max(r, g), b);
		const min = Math.min(Math.min(r, g), b);
		const chroma = (max - min);
		let grayscale;
		let hue;

		if (chroma < 1) {
			grayscale = min / (1 - chroma);
		} else {
			grayscale = 0;
		}

		if (chroma <= 0) {
			hue = 0;
		} else
		if (max === r) {
			hue = ((g - b) / chroma) % 6;
		} else
		if (max === g) {
			hue = 2 + (b - r) / chroma;
		} else {
			hue = 4 + (r - g) / chroma;
		}

		hue /= 6;
		hue %= 1;

		return [hue * 360, chroma * 100, grayscale * 100];
	};

	convert.hsl.hcg = function (hsl) {
		const s = hsl[1] / 100;
		const l = hsl[2] / 100;

		const c = l < 0.5 ? (2.0 * s * l) : (2.0 * s * (1.0 - l));

		let f = 0;
		if (c < 1.0) {
			f = (l - 0.5 * c) / (1.0 - c);
		}

		return [hsl[0], c * 100, f * 100];
	};

	convert.hsv.hcg = function (hsv) {
		const s = hsv[1] / 100;
		const v = hsv[2] / 100;

		const c = s * v;
		let f = 0;

		if (c < 1.0) {
			f = (v - c) / (1 - c);
		}

		return [hsv[0], c * 100, f * 100];
	};

	convert.hcg.rgb = function (hcg) {
		const h = hcg[0] / 360;
		const c = hcg[1] / 100;
		const g = hcg[2] / 100;

		if (c === 0.0) {
			return [g * 255, g * 255, g * 255];
		}

		const pure = [0, 0, 0];
		const hi = (h % 1) * 6;
		const v = hi % 1;
		const w = 1 - v;
		let mg = 0;

		/* eslint-disable max-statements-per-line */
		switch (Math.floor(hi)) {
			case 0:
				pure[0] = 1; pure[1] = v; pure[2] = 0; break;
			case 1:
				pure[0] = w; pure[1] = 1; pure[2] = 0; break;
			case 2:
				pure[0] = 0; pure[1] = 1; pure[2] = v; break;
			case 3:
				pure[0] = 0; pure[1] = w; pure[2] = 1; break;
			case 4:
				pure[0] = v; pure[1] = 0; pure[2] = 1; break;
			default:
				pure[0] = 1; pure[1] = 0; pure[2] = w;
		}
		/* eslint-enable max-statements-per-line */

		mg = (1.0 - c) * g;

		return [
			(c * pure[0] + mg) * 255,
			(c * pure[1] + mg) * 255,
			(c * pure[2] + mg) * 255
		];
	};

	convert.hcg.hsv = function (hcg) {
		const c = hcg[1] / 100;
		const g = hcg[2] / 100;

		const v = c + g * (1.0 - c);
		let f = 0;

		if (v > 0.0) {
			f = c / v;
		}

		return [hcg[0], f * 100, v * 100];
	};

	convert.hcg.hsl = function (hcg) {
		const c = hcg[1] / 100;
		const g = hcg[2] / 100;

		const l = g * (1.0 - c) + 0.5 * c;
		let s = 0;

		if (l > 0.0 && l < 0.5) {
			s = c / (2 * l);
		} else
		if (l >= 0.5 && l < 1.0) {
			s = c / (2 * (1 - l));
		}

		return [hcg[0], s * 100, l * 100];
	};

	convert.hcg.hwb = function (hcg) {
		const c = hcg[1] / 100;
		const g = hcg[2] / 100;
		const v = c + g * (1.0 - c);
		return [hcg[0], (v - c) * 100, (1 - v) * 100];
	};

	convert.hwb.hcg = function (hwb) {
		const w = hwb[1] / 100;
		const b = hwb[2] / 100;
		const v = 1 - b;
		const c = v - w;
		let g = 0;

		if (c < 1) {
			g = (v - c) / (1 - c);
		}

		return [hwb[0], c * 100, g * 100];
	};

	convert.apple.rgb = function (apple) {
		return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
	};

	convert.rgb.apple = function (rgb) {
		return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
	};

	convert.gray.rgb = function (args) {
		return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
	};

	convert.gray.hsl = function (args) {
		return [0, 0, args[0]];
	};

	convert.gray.hsv = convert.gray.hsl;

	convert.gray.hwb = function (gray) {
		return [0, 100, gray[0]];
	};

	convert.gray.cmyk = function (gray) {
		return [0, 0, 0, gray[0]];
	};

	convert.gray.lab = function (gray) {
		return [gray[0], 0, 0];
	};

	convert.gray.hex = function (gray) {
		const val = Math.round(gray[0] / 100 * 255) & 0xFF;
		const integer = (val << 16) + (val << 8) + val;

		const string = integer.toString(16).toUpperCase();
		return '000000'.substring(string.length) + string;
	};

	convert.rgb.gray = function (rgb) {
		const val = (rgb[0] + rgb[1] + rgb[2]) / 3;
		return [val / 255 * 100];
	};
	return conversions;
}

var route;
var hasRequiredRoute;

function requireRoute () {
	if (hasRequiredRoute) return route;
	hasRequiredRoute = 1;
	const conversions = requireConversions();

	/*
		This function routes a model to all other models.

		all functions that are routed have a property `.conversion` attached
		to the returned synthetic function. This property is an array
		of strings, each with the steps in between the 'from' and 'to'
		color models (inclusive).

		conversions that are not possible simply are not included.
	*/

	function buildGraph() {
		const graph = {};
		// https://jsperf.com/object-keys-vs-for-in-with-closure/3
		const models = Object.keys(conversions);

		for (let len = models.length, i = 0; i < len; i++) {
			graph[models[i]] = {
				// http://jsperf.com/1-vs-infinity
				// micro-opt, but this is simple.
				distance: -1,
				parent: null
			};
		}

		return graph;
	}

	// https://en.wikipedia.org/wiki/Breadth-first_search
	function deriveBFS(fromModel) {
		const graph = buildGraph();
		const queue = [fromModel]; // Unshift -> queue -> pop

		graph[fromModel].distance = 0;

		while (queue.length) {
			const current = queue.pop();
			const adjacents = Object.keys(conversions[current]);

			for (let len = adjacents.length, i = 0; i < len; i++) {
				const adjacent = adjacents[i];
				const node = graph[adjacent];

				if (node.distance === -1) {
					node.distance = graph[current].distance + 1;
					node.parent = current;
					queue.unshift(adjacent);
				}
			}
		}

		return graph;
	}

	function link(from, to) {
		return function (args) {
			return to(from(args));
		};
	}

	function wrapConversion(toModel, graph) {
		const path = [graph[toModel].parent, toModel];
		let fn = conversions[graph[toModel].parent][toModel];

		let cur = graph[toModel].parent;
		while (graph[cur].parent) {
			path.unshift(graph[cur].parent);
			fn = link(conversions[graph[cur].parent][cur], fn);
			cur = graph[cur].parent;
		}

		fn.conversion = path;
		return fn;
	}

	route = function (fromModel) {
		const graph = deriveBFS(fromModel);
		const conversion = {};

		const models = Object.keys(graph);
		for (let len = models.length, i = 0; i < len; i++) {
			const toModel = models[i];
			const node = graph[toModel];

			if (node.parent === null) {
				// No possible conversion, or this node is the source model.
				continue;
			}

			conversion[toModel] = wrapConversion(toModel, graph);
		}

		return conversion;
	};
	return route;
}

var colorConvert;
var hasRequiredColorConvert;

function requireColorConvert () {
	if (hasRequiredColorConvert) return colorConvert;
	hasRequiredColorConvert = 1;
	const conversions = requireConversions();
	const route = requireRoute();

	const convert = {};

	const models = Object.keys(conversions);

	function wrapRaw(fn) {
		const wrappedFn = function (...args) {
			const arg0 = args[0];
			if (arg0 === undefined || arg0 === null) {
				return arg0;
			}

			if (arg0.length > 1) {
				args = arg0;
			}

			return fn(args);
		};

		// Preserve .conversion property if there is one
		if ('conversion' in fn) {
			wrappedFn.conversion = fn.conversion;
		}

		return wrappedFn;
	}

	function wrapRounded(fn) {
		const wrappedFn = function (...args) {
			const arg0 = args[0];

			if (arg0 === undefined || arg0 === null) {
				return arg0;
			}

			if (arg0.length > 1) {
				args = arg0;
			}

			const result = fn(args);

			// We're assuming the result is an array here.
			// see notice in conversions.js; don't use box types
			// in conversion functions.
			if (typeof result === 'object') {
				for (let len = result.length, i = 0; i < len; i++) {
					result[i] = Math.round(result[i]);
				}
			}

			return result;
		};

		// Preserve .conversion property if there is one
		if ('conversion' in fn) {
			wrappedFn.conversion = fn.conversion;
		}

		return wrappedFn;
	}

	models.forEach(fromModel => {
		convert[fromModel] = {};

		Object.defineProperty(convert[fromModel], 'channels', {value: conversions[fromModel].channels});
		Object.defineProperty(convert[fromModel], 'labels', {value: conversions[fromModel].labels});

		const routes = route(fromModel);
		const routeModels = Object.keys(routes);

		routeModels.forEach(toModel => {
			const fn = routes[toModel];

			convert[fromModel][toModel] = wrapRounded(fn);
			convert[fromModel][toModel].raw = wrapRaw(fn);
		});
	});

	colorConvert = convert;
	return colorConvert;
}

(function (module) {

	const wrapAnsi16 = (fn, offset) => (...args) => {
		const code = fn(...args);
		return `\u001B[${code + offset}m`;
	};

	const wrapAnsi256 = (fn, offset) => (...args) => {
		const code = fn(...args);
		return `\u001B[${38 + offset};5;${code}m`;
	};

	const wrapAnsi16m = (fn, offset) => (...args) => {
		const rgb = fn(...args);
		return `\u001B[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`;
	};

	const ansi2ansi = n => n;
	const rgb2rgb = (r, g, b) => [r, g, b];

	const setLazyProperty = (object, property, get) => {
		Object.defineProperty(object, property, {
			get: () => {
				const value = get();

				Object.defineProperty(object, property, {
					value,
					enumerable: true,
					configurable: true
				});

				return value;
			},
			enumerable: true,
			configurable: true
		});
	};

	/** @type {typeof import('color-convert')} */
	let colorConvert;
	const makeDynamicStyles = (wrap, targetSpace, identity, isBackground) => {
		if (colorConvert === undefined) {
			colorConvert = requireColorConvert();
		}

		const offset = isBackground ? 10 : 0;
		const styles = {};

		for (const [sourceSpace, suite] of Object.entries(colorConvert)) {
			const name = sourceSpace === 'ansi16' ? 'ansi' : sourceSpace;
			if (sourceSpace === targetSpace) {
				styles[name] = wrap(identity, offset);
			} else if (typeof suite === 'object') {
				styles[name] = wrap(suite[targetSpace], offset);
			}
		}

		return styles;
	};

	function assembleStyles() {
		const codes = new Map();
		const styles = {
			modifier: {
				reset: [0, 0],
				// 21 isn't widely supported and 22 does the same thing
				bold: [1, 22],
				dim: [2, 22],
				italic: [3, 23],
				underline: [4, 24],
				inverse: [7, 27],
				hidden: [8, 28],
				strikethrough: [9, 29]
			},
			color: {
				black: [30, 39],
				red: [31, 39],
				green: [32, 39],
				yellow: [33, 39],
				blue: [34, 39],
				magenta: [35, 39],
				cyan: [36, 39],
				white: [37, 39],

				// Bright color
				blackBright: [90, 39],
				redBright: [91, 39],
				greenBright: [92, 39],
				yellowBright: [93, 39],
				blueBright: [94, 39],
				magentaBright: [95, 39],
				cyanBright: [96, 39],
				whiteBright: [97, 39]
			},
			bgColor: {
				bgBlack: [40, 49],
				bgRed: [41, 49],
				bgGreen: [42, 49],
				bgYellow: [43, 49],
				bgBlue: [44, 49],
				bgMagenta: [45, 49],
				bgCyan: [46, 49],
				bgWhite: [47, 49],

				// Bright color
				bgBlackBright: [100, 49],
				bgRedBright: [101, 49],
				bgGreenBright: [102, 49],
				bgYellowBright: [103, 49],
				bgBlueBright: [104, 49],
				bgMagentaBright: [105, 49],
				bgCyanBright: [106, 49],
				bgWhiteBright: [107, 49]
			}
		};

		// Alias bright black as gray (and grey)
		styles.color.gray = styles.color.blackBright;
		styles.bgColor.bgGray = styles.bgColor.bgBlackBright;
		styles.color.grey = styles.color.blackBright;
		styles.bgColor.bgGrey = styles.bgColor.bgBlackBright;

		for (const [groupName, group] of Object.entries(styles)) {
			for (const [styleName, style] of Object.entries(group)) {
				styles[styleName] = {
					open: `\u001B[${style[0]}m`,
					close: `\u001B[${style[1]}m`
				};

				group[styleName] = styles[styleName];

				codes.set(style[0], style[1]);
			}

			Object.defineProperty(styles, groupName, {
				value: group,
				enumerable: false
			});
		}

		Object.defineProperty(styles, 'codes', {
			value: codes,
			enumerable: false
		});

		styles.color.close = '\u001B[39m';
		styles.bgColor.close = '\u001B[49m';

		setLazyProperty(styles.color, 'ansi', () => makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, false));
		setLazyProperty(styles.color, 'ansi256', () => makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, false));
		setLazyProperty(styles.color, 'ansi16m', () => makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, false));
		setLazyProperty(styles.bgColor, 'ansi', () => makeDynamicStyles(wrapAnsi16, 'ansi16', ansi2ansi, true));
		setLazyProperty(styles.bgColor, 'ansi256', () => makeDynamicStyles(wrapAnsi256, 'ansi256', ansi2ansi, true));
		setLazyProperty(styles.bgColor, 'ansi16m', () => makeDynamicStyles(wrapAnsi16m, 'rgb', rgb2rgb, true));

		return styles;
	}

	// Make the export immutable
	Object.defineProperty(module, 'exports', {
		enumerable: true,
		get: assembleStyles
	});
} (ansiStyles$1));

var hasFlag$1 = (flag, argv = process.argv) => {
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const position = argv.indexOf(prefix + flag);
	const terminatorPosition = argv.indexOf('--');
	return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};

const os = require$$0__default$2["default"];
const tty = require$$1__default$1["default"];
const hasFlag = hasFlag$1;

const {env} = process;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false') ||
	hasFlag('color=never')) {
	forceColor = 0;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = 1;
}

if ('FORCE_COLOR' in env) {
	if (env.FORCE_COLOR === 'true') {
		forceColor = 1;
	} else if (env.FORCE_COLOR === 'false') {
		forceColor = 0;
	} else {
		forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
	}
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(haveStream, streamIsTTY) {
	if (forceColor === 0) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (haveStream && !streamIsTTY && forceColor === undefined) {
		return 0;
	}

	const min = forceColor || 0;

	if (env.TERM === 'dumb') {
		return min;
	}

	if (process.platform === 'win32') {
		// Windows 10 build 10586 is the first Windows release that supports 256 colors.
		// Windows 10 build 14931 is the first release that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI', 'GITHUB_ACTIONS', 'BUILDKITE'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream, stream && stream.isTTY);
	return translateLevel(level);
}

var supportsColor_1 = {
	supportsColor: getSupportLevel,
	stdout: translateLevel(supportsColor(true, tty.isatty(1))),
	stderr: translateLevel(supportsColor(true, tty.isatty(2)))
};

const stringReplaceAll$1 = (string, substring, replacer) => {
	let index = string.indexOf(substring);
	if (index === -1) {
		return string;
	}

	const substringLength = substring.length;
	let endIndex = 0;
	let returnValue = '';
	do {
		returnValue += string.substr(endIndex, index - endIndex) + substring + replacer;
		endIndex = index + substringLength;
		index = string.indexOf(substring, endIndex);
	} while (index !== -1);

	returnValue += string.substr(endIndex);
	return returnValue;
};

const stringEncaseCRLFWithFirstIndex$1 = (string, prefix, postfix, index) => {
	let endIndex = 0;
	let returnValue = '';
	do {
		const gotCR = string[index - 1] === '\r';
		returnValue += string.substr(endIndex, (gotCR ? index - 1 : index) - endIndex) + prefix + (gotCR ? '\r\n' : '\n') + postfix;
		endIndex = index + 1;
		index = string.indexOf('\n', endIndex);
	} while (index !== -1);

	returnValue += string.substr(endIndex);
	return returnValue;
};

var util = {
	stringReplaceAll: stringReplaceAll$1,
	stringEncaseCRLFWithFirstIndex: stringEncaseCRLFWithFirstIndex$1
};

var templates;
var hasRequiredTemplates;

function requireTemplates () {
	if (hasRequiredTemplates) return templates;
	hasRequiredTemplates = 1;
	const TEMPLATE_REGEX = /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi;
	const STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g;
	const STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/;
	const ESCAPE_REGEX = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi;

	const ESCAPES = new Map([
		['n', '\n'],
		['r', '\r'],
		['t', '\t'],
		['b', '\b'],
		['f', '\f'],
		['v', '\v'],
		['0', '\0'],
		['\\', '\\'],
		['e', '\u001B'],
		['a', '\u0007']
	]);

	function unescape(c) {
		const u = c[0] === 'u';
		const bracket = c[1] === '{';

		if ((u && !bracket && c.length === 5) || (c[0] === 'x' && c.length === 3)) {
			return String.fromCharCode(parseInt(c.slice(1), 16));
		}

		if (u && bracket) {
			return String.fromCodePoint(parseInt(c.slice(2, -1), 16));
		}

		return ESCAPES.get(c) || c;
	}

	function parseArguments(name, arguments_) {
		const results = [];
		const chunks = arguments_.trim().split(/\s*,\s*/g);
		let matches;

		for (const chunk of chunks) {
			const number = Number(chunk);
			if (!Number.isNaN(number)) {
				results.push(number);
			} else if ((matches = chunk.match(STRING_REGEX))) {
				results.push(matches[2].replace(ESCAPE_REGEX, (m, escape, character) => escape ? unescape(escape) : character));
			} else {
				throw new Error(`Invalid Chalk template style argument: ${chunk} (in style '${name}')`);
			}
		}

		return results;
	}

	function parseStyle(style) {
		STYLE_REGEX.lastIndex = 0;

		const results = [];
		let matches;

		while ((matches = STYLE_REGEX.exec(style)) !== null) {
			const name = matches[1];

			if (matches[2]) {
				const args = parseArguments(name, matches[2]);
				results.push([name].concat(args));
			} else {
				results.push([name]);
			}
		}

		return results;
	}

	function buildStyle(chalk, styles) {
		const enabled = {};

		for (const layer of styles) {
			for (const style of layer.styles) {
				enabled[style[0]] = layer.inverse ? null : style.slice(1);
			}
		}

		let current = chalk;
		for (const [styleName, styles] of Object.entries(enabled)) {
			if (!Array.isArray(styles)) {
				continue;
			}

			if (!(styleName in current)) {
				throw new Error(`Unknown Chalk style: ${styleName}`);
			}

			current = styles.length > 0 ? current[styleName](...styles) : current[styleName];
		}

		return current;
	}

	templates = (chalk, temporary) => {
		const styles = [];
		const chunks = [];
		let chunk = [];

		// eslint-disable-next-line max-params
		temporary.replace(TEMPLATE_REGEX, (m, escapeCharacter, inverse, style, close, character) => {
			if (escapeCharacter) {
				chunk.push(unescape(escapeCharacter));
			} else if (style) {
				const string = chunk.join('');
				chunk = [];
				chunks.push(styles.length === 0 ? string : buildStyle(chalk, styles)(string));
				styles.push({inverse, styles: parseStyle(style)});
			} else if (close) {
				if (styles.length === 0) {
					throw new Error('Found extraneous } in Chalk template literal');
				}

				chunks.push(buildStyle(chalk, styles)(chunk.join('')));
				chunk = [];
				styles.pop();
			} else {
				chunk.push(character);
			}
		});

		chunks.push(chunk.join(''));

		if (styles.length > 0) {
			const errMessage = `Chalk template literal is missing ${styles.length} closing bracket${styles.length === 1 ? '' : 's'} (\`}\`)`;
			throw new Error(errMessage);
		}

		return chunks.join('');
	};
	return templates;
}

const ansiStyles = ansiStyles$1.exports;
const {stdout: stdoutColor, stderr: stderrColor} = supportsColor_1;
const {
	stringReplaceAll,
	stringEncaseCRLFWithFirstIndex
} = util;

const {isArray} = Array;

// `supportsColor.level` → `ansiStyles.color[name]` mapping
const levelMapping = [
	'ansi',
	'ansi',
	'ansi256',
	'ansi16m'
];

const styles = Object.create(null);

const applyOptions = (object, options = {}) => {
	if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
		throw new Error('The `level` option should be an integer from 0 to 3');
	}

	// Detect level if not set manually
	const colorLevel = stdoutColor ? stdoutColor.level : 0;
	object.level = options.level === undefined ? colorLevel : options.level;
};

class ChalkClass {
	constructor(options) {
		// eslint-disable-next-line no-constructor-return
		return chalkFactory(options);
	}
}

const chalkFactory = options => {
	const chalk = {};
	applyOptions(chalk, options);

	chalk.template = (...arguments_) => chalkTag(chalk.template, ...arguments_);

	Object.setPrototypeOf(chalk, Chalk.prototype);
	Object.setPrototypeOf(chalk.template, chalk);

	chalk.template.constructor = () => {
		throw new Error('`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead.');
	};

	chalk.template.Instance = ChalkClass;

	return chalk.template;
};

function Chalk(options) {
	return chalkFactory(options);
}

for (const [styleName, style] of Object.entries(ansiStyles)) {
	styles[styleName] = {
		get() {
			const builder = createBuilder(this, createStyler(style.open, style.close, this._styler), this._isEmpty);
			Object.defineProperty(this, styleName, {value: builder});
			return builder;
		}
	};
}

styles.visible = {
	get() {
		const builder = createBuilder(this, this._styler, true);
		Object.defineProperty(this, 'visible', {value: builder});
		return builder;
	}
};

const usedModels = ['rgb', 'hex', 'keyword', 'hsl', 'hsv', 'hwb', 'ansi', 'ansi256'];

for (const model of usedModels) {
	styles[model] = {
		get() {
			const {level} = this;
			return function (...arguments_) {
				const styler = createStyler(ansiStyles.color[levelMapping[level]][model](...arguments_), ansiStyles.color.close, this._styler);
				return createBuilder(this, styler, this._isEmpty);
			};
		}
	};
}

for (const model of usedModels) {
	const bgModel = 'bg' + model[0].toUpperCase() + model.slice(1);
	styles[bgModel] = {
		get() {
			const {level} = this;
			return function (...arguments_) {
				const styler = createStyler(ansiStyles.bgColor[levelMapping[level]][model](...arguments_), ansiStyles.bgColor.close, this._styler);
				return createBuilder(this, styler, this._isEmpty);
			};
		}
	};
}

const proto = Object.defineProperties(() => {}, {
	...styles,
	level: {
		enumerable: true,
		get() {
			return this._generator.level;
		},
		set(level) {
			this._generator.level = level;
		}
	}
});

const createStyler = (open, close, parent) => {
	let openAll;
	let closeAll;
	if (parent === undefined) {
		openAll = open;
		closeAll = close;
	} else {
		openAll = parent.openAll + open;
		closeAll = close + parent.closeAll;
	}

	return {
		open,
		close,
		openAll,
		closeAll,
		parent
	};
};

const createBuilder = (self, _styler, _isEmpty) => {
	const builder = (...arguments_) => {
		if (isArray(arguments_[0]) && isArray(arguments_[0].raw)) {
			// Called as a template literal, for example: chalk.red`2 + 3 = {bold ${2+3}}`
			return applyStyle(builder, chalkTag(builder, ...arguments_));
		}

		// Single argument is hot path, implicit coercion is faster than anything
		// eslint-disable-next-line no-implicit-coercion
		return applyStyle(builder, (arguments_.length === 1) ? ('' + arguments_[0]) : arguments_.join(' '));
	};

	// We alter the prototype because we must return a function, but there is
	// no way to create a function with a different prototype
	Object.setPrototypeOf(builder, proto);

	builder._generator = self;
	builder._styler = _styler;
	builder._isEmpty = _isEmpty;

	return builder;
};

const applyStyle = (self, string) => {
	if (self.level <= 0 || !string) {
		return self._isEmpty ? '' : string;
	}

	let styler = self._styler;

	if (styler === undefined) {
		return string;
	}

	const {openAll, closeAll} = styler;
	if (string.indexOf('\u001B') !== -1) {
		while (styler !== undefined) {
			// Replace any instances already present with a re-opening code
			// otherwise only the part of the string until said closing code
			// will be colored, and the rest will simply be 'plain'.
			string = stringReplaceAll(string, styler.close, styler.open);

			styler = styler.parent;
		}
	}

	// We can move both next actions out of loop, because remaining actions in loop won't have
	// any/visible effect on parts we add here. Close the styling before a linebreak and reopen
	// after next line to fix a bleed issue on macOS: https://github.com/chalk/chalk/pull/92
	const lfIndex = string.indexOf('\n');
	if (lfIndex !== -1) {
		string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
	}

	return openAll + string + closeAll;
};

let template;
const chalkTag = (chalk, ...strings) => {
	const [firstString] = strings;

	if (!isArray(firstString) || !isArray(firstString.raw)) {
		// If chalk() was called by itself or with a string,
		// return the string itself as a string.
		return strings.join(' ');
	}

	const arguments_ = strings.slice(1);
	const parts = [firstString.raw[0]];

	for (let i = 1; i < firstString.length; i++) {
		parts.push(
			String(arguments_[i - 1]).replace(/[{}\\]/g, '\\$&'),
			String(firstString.raw[i])
		);
	}

	if (template === undefined) {
		template = requireTemplates();
	}

	return template(chalk, parts.join(''));
};

Object.defineProperties(Chalk.prototype, styles);

const chalk$4 = Chalk(); // eslint-disable-line new-cap
chalk$4.supportsColor = stdoutColor;
chalk$4.stderr = Chalk({level: stderrColor ? stderrColor.level : 0}); // eslint-disable-line new-cap
chalk$4.stderr.supportsColor = stderrColor;

var source = chalk$4;

var utils$2 = {};

var ansiColors = {exports: {}};

var symbols = {exports: {}};

var hasRequiredSymbols$1;

function requireSymbols$1 () {
	if (hasRequiredSymbols$1) return symbols.exports;
	hasRequiredSymbols$1 = 1;
	(function (module) {

		const isHyper = typeof process !== 'undefined' && process.env.TERM_PROGRAM === 'Hyper';
		const isWindows = typeof process !== 'undefined' && process.platform === 'win32';
		const isLinux = typeof process !== 'undefined' && process.platform === 'linux';

		const common = {
		  ballotDisabled: '☒',
		  ballotOff: '☐',
		  ballotOn: '☑',
		  bullet: '•',
		  bulletWhite: '◦',
		  fullBlock: '█',
		  heart: '❤',
		  identicalTo: '≡',
		  line: '─',
		  mark: '※',
		  middot: '·',
		  minus: '－',
		  multiplication: '×',
		  obelus: '÷',
		  pencilDownRight: '✎',
		  pencilRight: '✏',
		  pencilUpRight: '✐',
		  percent: '%',
		  pilcrow2: '❡',
		  pilcrow: '¶',
		  plusMinus: '±',
		  question: '?',
		  section: '§',
		  starsOff: '☆',
		  starsOn: '★',
		  upDownArrow: '↕'
		};

		const windows = Object.assign({}, common, {
		  check: '√',
		  cross: '×',
		  ellipsisLarge: '...',
		  ellipsis: '...',
		  info: 'i',
		  questionSmall: '?',
		  pointer: '>',
		  pointerSmall: '»',
		  radioOff: '( )',
		  radioOn: '(*)',
		  warning: '‼'
		});

		const other = Object.assign({}, common, {
		  ballotCross: '✘',
		  check: '✔',
		  cross: '✖',
		  ellipsisLarge: '⋯',
		  ellipsis: '…',
		  info: 'ℹ',
		  questionFull: '？',
		  questionSmall: '﹖',
		  pointer: isLinux ? '▸' : '❯',
		  pointerSmall: isLinux ? '‣' : '›',
		  radioOff: '◯',
		  radioOn: '◉',
		  warning: '⚠'
		});

		module.exports = (isWindows && !isHyper) ? windows : other;
		Reflect.defineProperty(module.exports, 'common', { enumerable: false, value: common });
		Reflect.defineProperty(module.exports, 'windows', { enumerable: false, value: windows });
		Reflect.defineProperty(module.exports, 'other', { enumerable: false, value: other });
} (symbols));
	return symbols.exports;
}

const isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);

/* eslint-disable no-control-regex */
// this is a modified version of https://github.com/chalk/ansi-regex (MIT License)
const ANSI_REGEX = /[\u001b\u009b][[\]#;?()]*(?:(?:(?:[^\W_]*;?[^\W_]*)\u0007)|(?:(?:[0-9]{1,4}(;[0-9]{0,4})*)?[~0-9=<>cf-nqrtyA-PRZ]))/g;

const hasColor = () => {
  if (typeof process !== 'undefined') {
    return process.env.FORCE_COLOR !== '0';
  }
  return false;
};

const create = () => {
  const colors = {
    enabled: hasColor(),
    visible: true,
    styles: {},
    keys: {}
  };

  const ansi = style => {
    let open = style.open = `\u001b[${style.codes[0]}m`;
    let close = style.close = `\u001b[${style.codes[1]}m`;
    let regex = style.regex = new RegExp(`\\u001b\\[${style.codes[1]}m`, 'g');
    style.wrap = (input, newline) => {
      if (input.includes(close)) input = input.replace(regex, close + open);
      let output = open + input + close;
      // see https://github.com/chalk/chalk/pull/92, thanks to the
      // chalk contributors for this fix. However, we've confirmed that
      // this issue is also present in Windows terminals
      return newline ? output.replace(/\r*\n/g, `${close}$&${open}`) : output;
    };
    return style;
  };

  const wrap = (style, input, newline) => {
    return typeof style === 'function' ? style(input) : style.wrap(input, newline);
  };

  const style = (input, stack) => {
    if (input === '' || input == null) return '';
    if (colors.enabled === false) return input;
    if (colors.visible === false) return '';
    let str = '' + input;
    let nl = str.includes('\n');
    let n = stack.length;
    if (n > 0 && stack.includes('unstyle')) {
      stack = [...new Set(['unstyle', ...stack])].reverse();
    }
    while (n-- > 0) str = wrap(colors.styles[stack[n]], str, nl);
    return str;
  };

  const define = (name, codes, type) => {
    colors.styles[name] = ansi({ name, codes });
    let keys = colors.keys[type] || (colors.keys[type] = []);
    keys.push(name);

    Reflect.defineProperty(colors, name, {
      configurable: true,
      enumerable: true,
      set(value) {
        colors.alias(name, value);
      },
      get() {
        let color = input => style(input, color.stack);
        Reflect.setPrototypeOf(color, colors);
        color.stack = this.stack ? this.stack.concat(name) : [name];
        return color;
      }
    });
  };

  define('reset', [0, 0], 'modifier');
  define('bold', [1, 22], 'modifier');
  define('dim', [2, 22], 'modifier');
  define('italic', [3, 23], 'modifier');
  define('underline', [4, 24], 'modifier');
  define('inverse', [7, 27], 'modifier');
  define('hidden', [8, 28], 'modifier');
  define('strikethrough', [9, 29], 'modifier');

  define('black', [30, 39], 'color');
  define('red', [31, 39], 'color');
  define('green', [32, 39], 'color');
  define('yellow', [33, 39], 'color');
  define('blue', [34, 39], 'color');
  define('magenta', [35, 39], 'color');
  define('cyan', [36, 39], 'color');
  define('white', [37, 39], 'color');
  define('gray', [90, 39], 'color');
  define('grey', [90, 39], 'color');

  define('bgBlack', [40, 49], 'bg');
  define('bgRed', [41, 49], 'bg');
  define('bgGreen', [42, 49], 'bg');
  define('bgYellow', [43, 49], 'bg');
  define('bgBlue', [44, 49], 'bg');
  define('bgMagenta', [45, 49], 'bg');
  define('bgCyan', [46, 49], 'bg');
  define('bgWhite', [47, 49], 'bg');

  define('blackBright', [90, 39], 'bright');
  define('redBright', [91, 39], 'bright');
  define('greenBright', [92, 39], 'bright');
  define('yellowBright', [93, 39], 'bright');
  define('blueBright', [94, 39], 'bright');
  define('magentaBright', [95, 39], 'bright');
  define('cyanBright', [96, 39], 'bright');
  define('whiteBright', [97, 39], 'bright');

  define('bgBlackBright', [100, 49], 'bgBright');
  define('bgRedBright', [101, 49], 'bgBright');
  define('bgGreenBright', [102, 49], 'bgBright');
  define('bgYellowBright', [103, 49], 'bgBright');
  define('bgBlueBright', [104, 49], 'bgBright');
  define('bgMagentaBright', [105, 49], 'bgBright');
  define('bgCyanBright', [106, 49], 'bgBright');
  define('bgWhiteBright', [107, 49], 'bgBright');

  colors.ansiRegex = ANSI_REGEX;
  colors.hasColor = colors.hasAnsi = str => {
    colors.ansiRegex.lastIndex = 0;
    return typeof str === 'string' && str !== '' && colors.ansiRegex.test(str);
  };

  colors.alias = (name, color) => {
    let fn = typeof color === 'string' ? colors[color] : color;

    if (typeof fn !== 'function') {
      throw new TypeError('Expected alias to be the name of an existing color (string) or a function');
    }

    if (!fn.stack) {
      Reflect.defineProperty(fn, 'name', { value: name });
      colors.styles[name] = fn;
      fn.stack = [name];
    }

    Reflect.defineProperty(colors, name, {
      configurable: true,
      enumerable: true,
      set(value) {
        colors.alias(name, value);
      },
      get() {
        let color = input => style(input, color.stack);
        Reflect.setPrototypeOf(color, colors);
        color.stack = this.stack ? this.stack.concat(fn.stack) : fn.stack;
        return color;
      }
    });
  };

  colors.theme = custom => {
    if (!isObject(custom)) throw new TypeError('Expected theme to be an object');
    for (let name of Object.keys(custom)) {
      colors.alias(name, custom[name]);
    }
    return colors;
  };

  colors.alias('unstyle', str => {
    if (typeof str === 'string' && str !== '') {
      colors.ansiRegex.lastIndex = 0;
      return str.replace(colors.ansiRegex, '');
    }
    return '';
  });

  colors.alias('noop', str => str);
  colors.none = colors.clear = colors.noop;

  colors.stripColor = colors.unstyle;
  colors.symbols = requireSymbols$1();
  colors.define = define;
  return colors;
};

ansiColors.exports = create();
ansiColors.exports.create = create;

(function (exports) {

	const toString = Object.prototype.toString;
	const colors = ansiColors.exports;
	let called = false;
	let fns = [];

	const complements = {
	  'yellow': 'blue',
	  'cyan': 'red',
	  'green': 'magenta',
	  'black': 'white',
	  'blue': 'yellow',
	  'red': 'cyan',
	  'magenta': 'green',
	  'white': 'black'
	};

	exports.longest = (arr, prop) => {
	  return arr.reduce((a, v) => Math.max(a, prop ? v[prop].length : v.length), 0);
	};

	exports.hasColor = str => !!str && colors.hasColor(str);

	const isObject = exports.isObject = val => {
	  return val !== null && typeof val === 'object' && !Array.isArray(val);
	};

	exports.nativeType = val => {
	  return toString.call(val).slice(8, -1).toLowerCase().replace(/\s/g, '');
	};

	exports.isAsyncFn = val => {
	  return exports.nativeType(val) === 'asyncfunction';
	};

	exports.isPrimitive = val => {
	  return val != null && typeof val !== 'object' && typeof val !== 'function';
	};

	exports.resolve = (context, value, ...rest) => {
	  if (typeof value === 'function') {
	    return value.call(context, ...rest);
	  }
	  return value;
	};

	exports.scrollDown = (choices = []) => [...choices.slice(1), choices[0]];
	exports.scrollUp = (choices = []) => [choices.pop(), ...choices];

	exports.reorder = (arr = []) => {
	  let res = arr.slice();
	  res.sort((a, b) => {
	    if (a.index > b.index) return 1;
	    if (a.index < b.index) return -1;
	    return 0;
	  });
	  return res;
	};

	exports.swap = (arr, index, pos) => {
	  let len = arr.length;
	  let idx = pos === len ? 0 : pos < 0 ? len - 1 : pos;
	  let choice = arr[index];
	  arr[index] = arr[idx];
	  arr[idx] = choice;
	};

	exports.width = (stream, fallback = 80) => {
	  let columns = (stream && stream.columns) ? stream.columns : fallback;
	  if (stream && typeof stream.getWindowSize === 'function') {
	    columns = stream.getWindowSize()[0];
	  }
	  if (process.platform === 'win32') {
	    return columns - 1;
	  }
	  return columns;
	};

	exports.height = (stream, fallback = 20) => {
	  let rows = (stream && stream.rows) ? stream.rows : fallback;
	  if (stream && typeof stream.getWindowSize === 'function') {
	    rows = stream.getWindowSize()[1];
	  }
	  return rows;
	};

	exports.wordWrap = (str, options = {}) => {
	  if (!str) return str;

	  if (typeof options === 'number') {
	    options = { width: options };
	  }

	  let { indent = '', newline = ('\n' + indent), width = 80 } = options;
	  let spaces = (newline + indent).match(/[^\S\n]/g) || [];
	  width -= spaces.length;
	  let source = `.{1,${width}}([\\s\\u200B]+|$)|[^\\s\\u200B]+?([\\s\\u200B]+|$)`;
	  let output = str.trim();
	  let regex = new RegExp(source, 'g');
	  let lines = output.match(regex) || [];
	  lines = lines.map(line => line.replace(/\n$/, ''));
	  if (options.padEnd) lines = lines.map(line => line.padEnd(width, ' '));
	  if (options.padStart) lines = lines.map(line => line.padStart(width, ' '));
	  return indent + lines.join(newline);
	};

	exports.unmute = color => {
	  let name = color.stack.find(n => colors.keys.color.includes(n));
	  if (name) {
	    return colors[name];
	  }
	  let bg = color.stack.find(n => n.slice(2) === 'bg');
	  if (bg) {
	    return colors[name.slice(2)];
	  }
	  return str => str;
	};

	exports.pascal = str => str ? str[0].toUpperCase() + str.slice(1) : '';

	exports.inverse = color => {
	  if (!color || !color.stack) return color;
	  let name = color.stack.find(n => colors.keys.color.includes(n));
	  if (name) {
	    let col = colors['bg' + exports.pascal(name)];
	    return col ? col.black : color;
	  }
	  let bg = color.stack.find(n => n.slice(0, 2) === 'bg');
	  if (bg) {
	    return colors[bg.slice(2).toLowerCase()] || color;
	  }
	  return colors.none;
	};

	exports.complement = color => {
	  if (!color || !color.stack) return color;
	  let name = color.stack.find(n => colors.keys.color.includes(n));
	  let bg = color.stack.find(n => n.slice(0, 2) === 'bg');
	  if (name && !bg) {
	    return colors[complements[name] || name];
	  }
	  if (bg) {
	    let lower = bg.slice(2).toLowerCase();
	    let comp = complements[lower];
	    if (!comp) return color;
	    return colors['bg' + exports.pascal(comp)] || color;
	  }
	  return colors.none;
	};

	exports.meridiem = date => {
	  let hours = date.getHours();
	  let minutes = date.getMinutes();
	  let ampm = hours >= 12 ? 'pm' : 'am';
	  hours = hours % 12;
	  let hrs = hours === 0 ? 12 : hours;
	  let min = minutes < 10 ? '0' + minutes : minutes;
	  return hrs + ':' + min + ' ' + ampm;
	};

	/**
	 * Set a value on the given object.
	 * @param {Object} obj
	 * @param {String} prop
	 * @param {any} value
	 */

	exports.set = (obj = {}, prop = '', val) => {
	  return prop.split('.').reduce((acc, k, i, arr) => {
	    let value = arr.length - 1 > i ? (acc[k] || {}) : val;
	    if (!exports.isObject(value) && i < arr.length - 1) value = {};
	    return (acc[k] = value);
	  }, obj);
	};

	/**
	 * Get a value from the given object.
	 * @param {Object} obj
	 * @param {String} prop
	 */

	exports.get = (obj = {}, prop = '', fallback) => {
	  let value = obj[prop] == null
	    ? prop.split('.').reduce((acc, k) => acc && acc[k], obj)
	    : obj[prop];
	  return value == null ? fallback : value;
	};

	exports.mixin = (target, b) => {
	  if (!isObject(target)) return b;
	  if (!isObject(b)) return target;
	  for (let key of Object.keys(b)) {
	    let desc = Object.getOwnPropertyDescriptor(b, key);
	    if (desc.hasOwnProperty('value')) {
	      if (target.hasOwnProperty(key) && isObject(desc.value)) {
	        let existing = Object.getOwnPropertyDescriptor(target, key);
	        if (isObject(existing.value)) {
	          target[key] = exports.merge({}, target[key], b[key]);
	        } else {
	          Reflect.defineProperty(target, key, desc);
	        }
	      } else {
	        Reflect.defineProperty(target, key, desc);
	      }
	    } else {
	      Reflect.defineProperty(target, key, desc);
	    }
	  }
	  return target;
	};

	exports.merge = (...args) => {
	  let target = {};
	  for (let ele of args) exports.mixin(target, ele);
	  return target;
	};

	exports.mixinEmitter = (obj, emitter) => {
	  let proto = emitter.constructor.prototype;
	  for (let key of Object.keys(proto)) {
	    let val = proto[key];
	    if (typeof val === 'function') {
	      exports.define(obj, key, val.bind(emitter));
	    } else {
	      exports.define(obj, key, val);
	    }
	  }
	};

	exports.onExit = callback => {
	  const onExit = (quit, code) => {
	    if (called) return;

	    called = true;
	    fns.forEach(fn => fn());

	    if (quit === true) {
	      process.exit(128 + code);
	    }
	  };

	  if (fns.length === 0) {
	    process.once('SIGTERM', onExit.bind(null, true, 15));
	    process.once('SIGINT', onExit.bind(null, true, 2));
	    process.once('exit', onExit);
	  }

	  fns.push(callback);
	};

	exports.define = (obj, key, value) => {
	  Reflect.defineProperty(obj, key, { value });
	};

	exports.defineExport = (obj, key, fn) => {
	  let custom;
	  Reflect.defineProperty(obj, key, {
	    enumerable: true,
	    configurable: true,
	    set(val) {
	      custom = val;
	    },
	    get() {
	      return custom ? custom() : fn();
	    }
	  });
	};
} (utils$2));

var combos = {};

var hasRequiredCombos;

function requireCombos () {
	if (hasRequiredCombos) return combos;
	hasRequiredCombos = 1;

	/**
	 * Actions are mappings from keypress event names to method names
	 * in the prompts.
	 */

	combos.ctrl = {
	  a: 'first',
	  b: 'backward',
	  c: 'cancel',
	  d: 'deleteForward',
	  e: 'last',
	  f: 'forward',
	  g: 'reset',
	  i: 'tab',
	  k: 'cutForward',
	  l: 'reset',
	  n: 'newItem',
	  m: 'cancel',
	  j: 'submit',
	  p: 'search',
	  r: 'remove',
	  s: 'save',
	  u: 'undo',
	  w: 'cutLeft',
	  x: 'toggleCursor',
	  v: 'paste'
	};

	combos.shift = {
	  up: 'shiftUp',
	  down: 'shiftDown',
	  left: 'shiftLeft',
	  right: 'shiftRight',
	  tab: 'prev'
	};

	combos.fn = {
	  up: 'pageUp',
	  down: 'pageDown',
	  left: 'pageLeft',
	  right: 'pageRight',
	  delete: 'deleteForward'
	};

	// <alt> on Windows
	combos.option = {
	  b: 'backward',
	  f: 'forward',
	  d: 'cutRight',
	  left: 'cutLeft',
	  up: 'altUp',
	  down: 'altDown'
	};

	combos.keys = {
	  pageup: 'pageUp', // <fn>+<up> (mac), <Page Up> (windows)
	  pagedown: 'pageDown', // <fn>+<down> (mac), <Page Down> (windows)
	  home: 'home', // <fn>+<left> (mac), <home> (windows)
	  end: 'end', // <fn>+<right> (mac), <end> (windows)
	  cancel: 'cancel',
	  delete: 'deleteForward',
	  backspace: 'delete',
	  down: 'down',
	  enter: 'submit',
	  escape: 'cancel',
	  left: 'left',
	  space: 'space',
	  number: 'number',
	  return: 'submit',
	  right: 'right',
	  tab: 'next',
	  up: 'up'
	};
	return combos;
}

var keypress_1;
var hasRequiredKeypress;

function requireKeypress () {
	if (hasRequiredKeypress) return keypress_1;
	hasRequiredKeypress = 1;

	const readline = require$$0__default$3["default"];
	const combos = requireCombos();

	/* eslint-disable no-control-regex */
	const metaKeyCodeRe = /^(?:\x1b)([a-zA-Z0-9])$/;
	const fnKeyRe = /^(?:\x1b+)(O|N|\[|\[\[)(?:(\d+)(?:;(\d+))?([~^$])|(?:1;)?(\d+)?([a-zA-Z]))/;
	const keyName = {
	    /* xterm/gnome ESC O letter */
	    'OP': 'f1',
	    'OQ': 'f2',
	    'OR': 'f3',
	    'OS': 'f4',
	    /* xterm/rxvt ESC [ number ~ */
	    '[11~': 'f1',
	    '[12~': 'f2',
	    '[13~': 'f3',
	    '[14~': 'f4',
	    /* from Cygwin and used in libuv */
	    '[[A': 'f1',
	    '[[B': 'f2',
	    '[[C': 'f3',
	    '[[D': 'f4',
	    '[[E': 'f5',
	    /* common */
	    '[15~': 'f5',
	    '[17~': 'f6',
	    '[18~': 'f7',
	    '[19~': 'f8',
	    '[20~': 'f9',
	    '[21~': 'f10',
	    '[23~': 'f11',
	    '[24~': 'f12',
	    /* xterm ESC [ letter */
	    '[A': 'up',
	    '[B': 'down',
	    '[C': 'right',
	    '[D': 'left',
	    '[E': 'clear',
	    '[F': 'end',
	    '[H': 'home',
	    /* xterm/gnome ESC O letter */
	    'OA': 'up',
	    'OB': 'down',
	    'OC': 'right',
	    'OD': 'left',
	    'OE': 'clear',
	    'OF': 'end',
	    'OH': 'home',
	    /* xterm/rxvt ESC [ number ~ */
	    '[1~': 'home',
	    '[2~': 'insert',
	    '[3~': 'delete',
	    '[4~': 'end',
	    '[5~': 'pageup',
	    '[6~': 'pagedown',
	    /* putty */
	    '[[5~': 'pageup',
	    '[[6~': 'pagedown',
	    /* rxvt */
	    '[7~': 'home',
	    '[8~': 'end',
	    /* rxvt keys with modifiers */
	    '[a': 'up',
	    '[b': 'down',
	    '[c': 'right',
	    '[d': 'left',
	    '[e': 'clear',

	    '[2$': 'insert',
	    '[3$': 'delete',
	    '[5$': 'pageup',
	    '[6$': 'pagedown',
	    '[7$': 'home',
	    '[8$': 'end',

	    'Oa': 'up',
	    'Ob': 'down',
	    'Oc': 'right',
	    'Od': 'left',
	    'Oe': 'clear',

	    '[2^': 'insert',
	    '[3^': 'delete',
	    '[5^': 'pageup',
	    '[6^': 'pagedown',
	    '[7^': 'home',
	    '[8^': 'end',
	    /* misc. */
	    '[Z': 'tab',
	};

	function isShiftKey(code) {
	    return ['[a', '[b', '[c', '[d', '[e', '[2$', '[3$', '[5$', '[6$', '[7$', '[8$', '[Z'].includes(code)
	}

	function isCtrlKey(code) {
	    return [ 'Oa', 'Ob', 'Oc', 'Od', 'Oe', '[2^', '[3^', '[5^', '[6^', '[7^', '[8^'].includes(code)
	}

	const keypress = (s = '', event = {}) => {
	  let parts;
	  let key = {
	    name: event.name,
	    ctrl: false,
	    meta: false,
	    shift: false,
	    option: false,
	    sequence: s,
	    raw: s,
	    ...event
	  };

	  if (Buffer.isBuffer(s)) {
	    if (s[0] > 127 && s[1] === void 0) {
	      s[0] -= 128;
	      s = '\x1b' + String(s);
	    } else {
	      s = String(s);
	    }
	  } else if (s !== void 0 && typeof s !== 'string') {
	    s = String(s);
	  } else if (!s) {
	    s = key.sequence || '';
	  }

	  key.sequence = key.sequence || s || key.name;

	  if (s === '\r') {
	    // carriage return
	    key.raw = void 0;
	    key.name = 'return';
	  } else if (s === '\n') {
	    // enter, should have been called linefeed
	    key.name = 'enter';
	  } else if (s === '\t') {
	    // tab
	    key.name = 'tab';
	  } else if (s === '\b' || s === '\x7f' || s === '\x1b\x7f' || s === '\x1b\b') {
	    // backspace or ctrl+h
	    key.name = 'backspace';
	    key.meta = s.charAt(0) === '\x1b';
	  } else if (s === '\x1b' || s === '\x1b\x1b') {
	    // escape key
	    key.name = 'escape';
	    key.meta = s.length === 2;
	  } else if (s === ' ' || s === '\x1b ') {
	    key.name = 'space';
	    key.meta = s.length === 2;
	  } else if (s <= '\x1a') {
	    // ctrl+letter
	    key.name = String.fromCharCode(s.charCodeAt(0) + 'a'.charCodeAt(0) - 1);
	    key.ctrl = true;
	  } else if (s.length === 1 && s >= '0' && s <= '9') {
	    // number
	    key.name = 'number';
	  } else if (s.length === 1 && s >= 'a' && s <= 'z') {
	    // lowercase letter
	    key.name = s;
	  } else if (s.length === 1 && s >= 'A' && s <= 'Z') {
	    // shift+letter
	    key.name = s.toLowerCase();
	    key.shift = true;
	  } else if ((parts = metaKeyCodeRe.exec(s))) {
	    // meta+character key
	    key.meta = true;
	    key.shift = /^[A-Z]$/.test(parts[1]);
	  } else if ((parts = fnKeyRe.exec(s))) {
	    let segs = [...s];

	    if (segs[0] === '\u001b' && segs[1] === '\u001b') {
	      key.option = true;
	    }

	    // ansi escape sequence
	    // reassemble the key code leaving out leading \x1b's,
	    // the modifier key bitflag and any meaningless "1;" sequence
	    let code = [parts[1], parts[2], parts[4], parts[6]].filter(Boolean).join('');
	    let modifier = (parts[3] || parts[5] || 1) - 1;

	    // Parse the key modifier
	    key.ctrl = !!(modifier & 4);
	    key.meta = !!(modifier & 10);
	    key.shift = !!(modifier & 1);
	    key.code = code;

	    key.name = keyName[code];
	    key.shift = isShiftKey(code) || key.shift;
	    key.ctrl = isCtrlKey(code) || key.ctrl;
	  }
	  return key;
	};

	keypress.listen = (options = {}, onKeypress) => {
	  let { stdin } = options;

	  if (!stdin || (stdin !== process.stdin && !stdin.isTTY)) {
	    throw new Error('Invalid stream passed');
	  }

	  let rl = readline.createInterface({ terminal: true, input: stdin });
	  readline.emitKeypressEvents(stdin, rl);

	  let on = (buf, key) => onKeypress(buf, keypress(buf, key), rl);
	  let isRaw = stdin.isRaw;

	  if (stdin.isTTY) stdin.setRawMode(true);
	  stdin.on('keypress', on);
	  rl.resume();

	  let off = () => {
	    if (stdin.isTTY) stdin.setRawMode(isRaw);
	    stdin.removeListener('keypress', on);
	    rl.pause();
	    rl.close();
	  };

	  return off;
	};

	keypress.action = (buf, key, customActions) => {
	  let obj = { ...combos, ...customActions };
	  if (key.ctrl) {
	    key.action = obj.ctrl[key.name];
	    return key;
	  }

	  if (key.option && obj.option) {
	    key.action = obj.option[key.name];
	    return key;
	  }

	  if (key.shift) {
	    key.action = obj.shift[key.name];
	    return key;
	  }

	  key.action = obj.keys[key.name];
	  return key;
	};

	keypress_1 = keypress;
	return keypress_1;
}

var timer;
var hasRequiredTimer;

function requireTimer () {
	if (hasRequiredTimer) return timer;
	hasRequiredTimer = 1;

	timer = prompt => {
	  prompt.timers = prompt.timers || {};

	  let timers = prompt.options.timers;
	  if (!timers) return;

	  for (let key of Object.keys(timers)) {
	    let opts = timers[key];
	    if (typeof opts === 'number') {
	      opts = { interval: opts };
	    }
	    create(prompt, key, opts);
	  }
	};

	function create(prompt, name, options = {}) {
	  let timer = prompt.timers[name] = { name, start: Date.now(), ms: 0, tick: 0 };
	  let ms = options.interval || 120;
	  timer.frames = options.frames || [];
	  timer.loading = true;

	  let interval = setInterval(() => {
	    timer.ms = Date.now() - timer.start;
	    timer.tick++;
	    prompt.render();
	  }, ms);

	  timer.stop = () => {
	    timer.loading = false;
	    clearInterval(interval);
	  };

	  Reflect.defineProperty(timer, 'interval', { value: interval });
	  prompt.once('close', () => timer.stop());
	  return timer.stop;
	}
	return timer;
}

var state;
var hasRequiredState;

function requireState () {
	if (hasRequiredState) return state;
	hasRequiredState = 1;

	const { define, width } = utils$2;

	class State {
	  constructor(prompt) {
	    let options = prompt.options;
	    define(this, '_prompt', prompt);
	    this.type = prompt.type;
	    this.name = prompt.name;
	    this.message = '';
	    this.header = '';
	    this.footer = '';
	    this.error = '';
	    this.hint = '';
	    this.input = '';
	    this.cursor = 0;
	    this.index = 0;
	    this.lines = 0;
	    this.tick = 0;
	    this.prompt = '';
	    this.buffer = '';
	    this.width = width(options.stdout || process.stdout);
	    Object.assign(this, options);
	    this.name = this.name || this.message;
	    this.message = this.message || this.name;
	    this.symbols = prompt.symbols;
	    this.styles = prompt.styles;
	    this.required = new Set();
	    this.cancelled = false;
	    this.submitted = false;
	  }

	  clone() {
	    let state = { ...this };
	    state.status = this.status;
	    state.buffer = Buffer.from(state.buffer);
	    delete state.clone;
	    return state;
	  }

	  set color(val) {
	    this._color = val;
	  }
	  get color() {
	    let styles = this.prompt.styles;
	    if (this.cancelled) return styles.cancelled;
	    if (this.submitted) return styles.submitted;
	    let color = this._color || styles[this.status];
	    return typeof color === 'function' ? color : styles.pending;
	  }

	  set loading(value) {
	    this._loading = value;
	  }
	  get loading() {
	    if (typeof this._loading === 'boolean') return this._loading;
	    if (this.loadingChoices) return 'choices';
	    return false;
	  }

	  get status() {
	    if (this.cancelled) return 'cancelled';
	    if (this.submitted) return 'submitted';
	    return 'pending';
	  }
	}

	state = State;
	return state;
}

var styles_1;
var hasRequiredStyles;

function requireStyles () {
	if (hasRequiredStyles) return styles_1;
	hasRequiredStyles = 1;

	const utils = utils$2;
	const colors = ansiColors.exports;

	const styles = {
	  default: colors.noop,
	  noop: colors.noop,

	  /**
	   * Modifiers
	   */

	  set inverse(custom) {
	    this._inverse = custom;
	  },
	  get inverse() {
	    return this._inverse || utils.inverse(this.primary);
	  },

	  set complement(custom) {
	    this._complement = custom;
	  },
	  get complement() {
	    return this._complement || utils.complement(this.primary);
	  },

	  /**
	   * Main color
	   */

	  primary: colors.cyan,

	  /**
	   * Main palette
	   */

	  success: colors.green,
	  danger: colors.magenta,
	  strong: colors.bold,
	  warning: colors.yellow,
	  muted: colors.dim,
	  disabled: colors.gray,
	  dark: colors.dim.gray,
	  underline: colors.underline,

	  set info(custom) {
	    this._info = custom;
	  },
	  get info() {
	    return this._info || this.primary;
	  },

	  set em(custom) {
	    this._em = custom;
	  },
	  get em() {
	    return this._em || this.primary.underline;
	  },

	  set heading(custom) {
	    this._heading = custom;
	  },
	  get heading() {
	    return this._heading || this.muted.underline;
	  },

	  /**
	   * Statuses
	   */

	  set pending(custom) {
	    this._pending = custom;
	  },
	  get pending() {
	    return this._pending || this.primary;
	  },

	  set submitted(custom) {
	    this._submitted = custom;
	  },
	  get submitted() {
	    return this._submitted || this.success;
	  },

	  set cancelled(custom) {
	    this._cancelled = custom;
	  },
	  get cancelled() {
	    return this._cancelled || this.danger;
	  },

	  /**
	   * Special styling
	   */

	  set typing(custom) {
	    this._typing = custom;
	  },
	  get typing() {
	    return this._typing || this.dim;
	  },

	  set placeholder(custom) {
	    this._placeholder = custom;
	  },
	  get placeholder() {
	    return this._placeholder || this.primary.dim;
	  },

	  set highlight(custom) {
	    this._highlight = custom;
	  },
	  get highlight() {
	    return this._highlight || this.inverse;
	  }
	};

	styles.merge = (options = {}) => {
	  if (options.styles && typeof options.styles.enabled === 'boolean') {
	    colors.enabled = options.styles.enabled;
	  }
	  if (options.styles && typeof options.styles.visible === 'boolean') {
	    colors.visible = options.styles.visible;
	  }

	  let result = utils.merge({}, styles, options.styles);
	  delete result.merge;

	  for (let key of Object.keys(colors)) {
	    if (!result.hasOwnProperty(key)) {
	      Reflect.defineProperty(result, key, { get: () => colors[key] });
	    }
	  }

	  for (let key of Object.keys(colors.styles)) {
	    if (!result.hasOwnProperty(key)) {
	      Reflect.defineProperty(result, key, { get: () => colors[key] });
	    }
	  }
	  return result;
	};

	styles_1 = styles;
	return styles_1;
}

var symbols_1;
var hasRequiredSymbols;

function requireSymbols () {
	if (hasRequiredSymbols) return symbols_1;
	hasRequiredSymbols = 1;

	const isWindows = process.platform === 'win32';
	const colors = ansiColors.exports;
	const utils = utils$2;

	const symbols = {
	  ...colors.symbols,
	  upDownDoubleArrow: '⇕',
	  upDownDoubleArrow2: '⬍',
	  upDownArrow: '↕',
	  asterisk: '*',
	  asterism: '⁂',
	  bulletWhite: '◦',
	  electricArrow: '⌁',
	  ellipsisLarge: '⋯',
	  ellipsisSmall: '…',
	  fullBlock: '█',
	  identicalTo: '≡',
	  indicator: colors.symbols.check,
	  leftAngle: '‹',
	  mark: '※',
	  minus: '−',
	  multiplication: '×',
	  obelus: '÷',
	  percent: '%',
	  pilcrow: '¶',
	  pilcrow2: '❡',
	  pencilUpRight: '✐',
	  pencilDownRight: '✎',
	  pencilRight: '✏',
	  plus: '+',
	  plusMinus: '±',
	  pointRight: '☞',
	  rightAngle: '›',
	  section: '§',
	  hexagon: { off: '⬡', on: '⬢', disabled: '⬢' },
	  ballot: { on: '☑', off: '☐', disabled: '☒' },
	  stars: { on: '★', off: '☆', disabled: '☆' },
	  folder: { on: '▼', off: '▶', disabled: '▶' },
	  prefix: {
	    pending: colors.symbols.question,
	    submitted: colors.symbols.check,
	    cancelled: colors.symbols.cross
	  },
	  separator: {
	    pending: colors.symbols.pointerSmall,
	    submitted: colors.symbols.middot,
	    cancelled: colors.symbols.middot
	  },
	  radio: {
	    off: isWindows ? '( )' : '◯',
	    on: isWindows ? '(*)' : '◉',
	    disabled: isWindows ? '(|)' : 'Ⓘ'
	  },
	  numbers: ['⓪', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳', '㉑', '㉒', '㉓', '㉔', '㉕', '㉖', '㉗', '㉘', '㉙', '㉚', '㉛', '㉜', '㉝', '㉞', '㉟', '㊱', '㊲', '㊳', '㊴', '㊵', '㊶', '㊷', '㊸', '㊹', '㊺', '㊻', '㊼', '㊽', '㊾', '㊿']
	};

	symbols.merge = options => {
	  let result = utils.merge({}, colors.symbols, symbols, options.symbols);
	  delete result.merge;
	  return result;
	};

	symbols_1 = symbols;
	return symbols_1;
}

var theme;
var hasRequiredTheme;

function requireTheme () {
	if (hasRequiredTheme) return theme;
	hasRequiredTheme = 1;

	const styles = requireStyles();
	const symbols = requireSymbols();
	const utils = utils$2;

	theme = prompt => {
	  prompt.options = utils.merge({}, prompt.options.theme, prompt.options);
	  prompt.symbols = symbols.merge(prompt.options);
	  prompt.styles = styles.merge(prompt.options);
	};
	return theme;
}

var ansi = {exports: {}};

var hasRequiredAnsi;

function requireAnsi () {
	if (hasRequiredAnsi) return ansi.exports;
	hasRequiredAnsi = 1;
	(function (module, exports) {

		const isTerm = process.env.TERM_PROGRAM === 'Apple_Terminal';
		const colors = ansiColors.exports;
		const utils = utils$2;
		const ansi = module.exports = exports;
		const ESC = '\u001b[';
		const BEL = '\u0007';
		let hidden = false;

		const code = ansi.code = {
		  bell: BEL,
		  beep: BEL,
		  beginning: `${ESC}G`,
		  down: `${ESC}J`,
		  esc: ESC,
		  getPosition: `${ESC}6n`,
		  hide: `${ESC}?25l`,
		  line: `${ESC}2K`,
		  lineEnd: `${ESC}K`,
		  lineStart: `${ESC}1K`,
		  restorePosition: ESC + (isTerm ? '8' : 'u'),
		  savePosition: ESC + (isTerm ? '7' : 's'),
		  screen: `${ESC}2J`,
		  show: `${ESC}?25h`,
		  up: `${ESC}1J`
		};

		const cursor = ansi.cursor = {
		  get hidden() {
		    return hidden;
		  },

		  hide() {
		    hidden = true;
		    return code.hide;
		  },
		  show() {
		    hidden = false;
		    return code.show;
		  },

		  forward: (count = 1) => `${ESC}${count}C`,
		  backward: (count = 1) => `${ESC}${count}D`,
		  nextLine: (count = 1) => `${ESC}E`.repeat(count),
		  prevLine: (count = 1) => `${ESC}F`.repeat(count),

		  up: (count = 1) => count ? `${ESC}${count}A` : '',
		  down: (count = 1) => count ? `${ESC}${count}B` : '',
		  right: (count = 1) => count ? `${ESC}${count}C` : '',
		  left: (count = 1) => count ? `${ESC}${count}D` : '',

		  to(x, y) {
		    return y ? `${ESC}${y + 1};${x + 1}H` : `${ESC}${x + 1}G`;
		  },

		  move(x = 0, y = 0) {
		    let res = '';
		    res += (x < 0) ? cursor.left(-x) : (x > 0) ? cursor.right(x) : '';
		    res += (y < 0) ? cursor.up(-y) : (y > 0) ? cursor.down(y) : '';
		    return res;
		  },

		  restore(state = {}) {
		    let { after, cursor, initial, input, prompt, size, value } = state;
		    initial = utils.isPrimitive(initial) ? String(initial) : '';
		    input = utils.isPrimitive(input) ? String(input) : '';
		    value = utils.isPrimitive(value) ? String(value) : '';

		    if (size) {
		      let codes = ansi.cursor.up(size) + ansi.cursor.to(prompt.length);
		      let diff = input.length - cursor;
		      if (diff > 0) {
		        codes += ansi.cursor.left(diff);
		      }
		      return codes;
		    }

		    if (value || after) {
		      let pos = (!input && !!initial) ? -initial.length : -input.length + cursor;
		      if (after) pos -= after.length;
		      if (input === '' && initial && !prompt.includes(initial)) {
		        pos += initial.length;
		      }
		      return ansi.cursor.move(pos);
		    }
		  }
		};

		const erase = ansi.erase = {
		  screen: code.screen,
		  up: code.up,
		  down: code.down,
		  line: code.line,
		  lineEnd: code.lineEnd,
		  lineStart: code.lineStart,
		  lines(n) {
		    let str = '';
		    for (let i = 0; i < n; i++) {
		      str += ansi.erase.line + (i < n - 1 ? ansi.cursor.up(1) : '');
		    }
		    if (n) str += ansi.code.beginning;
		    return str;
		  }
		};

		ansi.clear = (input = '', columns = process.stdout.columns) => {
		  if (!columns) return erase.line + cursor.to(0);
		  let width = str => [...colors.unstyle(str)].length;
		  let lines = input.split(/\r?\n/);
		  let rows = 0;
		  for (let line of lines) {
		    rows += 1 + Math.floor(Math.max(width(line) - 1, 0) / columns);
		  }
		  return (erase.line + cursor.prevLine()).repeat(rows - 1) + erase.line + cursor.to(0);
		};
} (ansi, ansi.exports));
	return ansi.exports;
}

var prompt;
var hasRequiredPrompt;

function requirePrompt () {
	if (hasRequiredPrompt) return prompt;
	hasRequiredPrompt = 1;

	const Events = require$$0__default["default"];
	const colors = ansiColors.exports;
	const keypress = requireKeypress();
	const timer = requireTimer();
	const State = requireState();
	const theme = requireTheme();
	const utils = utils$2;
	const ansi = requireAnsi();

	/**
	 * Base class for creating a new Prompt.
	 * @param {Object} `options` Question object.
	 */

	class Prompt extends Events {
	  constructor(options = {}) {
	    super();
	    this.name = options.name;
	    this.type = options.type;
	    this.options = options;
	    theme(this);
	    timer(this);
	    this.state = new State(this);
	    this.initial = [options.initial, options.default].find(v => v != null);
	    this.stdout = options.stdout || process.stdout;
	    this.stdin = options.stdin || process.stdin;
	    this.scale = options.scale || 1;
	    this.term = this.options.term || process.env.TERM_PROGRAM;
	    this.margin = margin(this.options.margin);
	    this.setMaxListeners(0);
	    setOptions(this);
	  }

	  async keypress(input, event = {}) {
	    this.keypressed = true;
	    let key = keypress.action(input, keypress(input, event), this.options.actions);
	    this.state.keypress = key;
	    this.emit('keypress', input, key);
	    this.emit('state', this.state.clone());
	    let fn = this.options[key.action] || this[key.action] || this.dispatch;
	    if (typeof fn === 'function') {
	      return await fn.call(this, input, key);
	    }
	    this.alert();
	  }

	  alert() {
	    delete this.state.alert;
	    if (this.options.show === false) {
	      this.emit('alert');
	    } else {
	      this.stdout.write(ansi.code.beep);
	    }
	  }

	  cursorHide() {
	    this.stdout.write(ansi.cursor.hide());
	    utils.onExit(() => this.cursorShow());
	  }

	  cursorShow() {
	    this.stdout.write(ansi.cursor.show());
	  }

	  write(str) {
	    if (!str) return;
	    if (this.stdout && this.state.show !== false) {
	      this.stdout.write(str);
	    }
	    this.state.buffer += str;
	  }

	  clear(lines = 0) {
	    let buffer = this.state.buffer;
	    this.state.buffer = '';
	    if ((!buffer && !lines) || this.options.show === false) return;
	    this.stdout.write(ansi.cursor.down(lines) + ansi.clear(buffer, this.width));
	  }

	  restore() {
	    if (this.state.closed || this.options.show === false) return;

	    let { prompt, after, rest } = this.sections();
	    let { cursor, initial = '', input = '', value = '' } = this;

	    let size = this.state.size = rest.length;
	    let state = { after, cursor, initial, input, prompt, size, value };
	    let codes = ansi.cursor.restore(state);
	    if (codes) {
	      this.stdout.write(codes);
	    }
	  }

	  sections() {
	    let { buffer, input, prompt } = this.state;
	    prompt = colors.unstyle(prompt);
	    let buf = colors.unstyle(buffer);
	    let idx = buf.indexOf(prompt);
	    let header = buf.slice(0, idx);
	    let rest = buf.slice(idx);
	    let lines = rest.split('\n');
	    let first = lines[0];
	    let last = lines[lines.length - 1];
	    let promptLine = prompt + (input ? ' ' + input : '');
	    let len = promptLine.length;
	    let after = len < first.length ? first.slice(len + 1) : '';
	    return { header, prompt: first, after, rest: lines.slice(1), last };
	  }

	  async submit() {
	    this.state.submitted = true;
	    this.state.validating = true;

	    // this will only be called when the prompt is directly submitted
	    // without initializing, i.e. when the prompt is skipped, etc. Otherwize,
	    // "options.onSubmit" is will be handled by the "initialize()" method.
	    if (this.options.onSubmit) {
	      await this.options.onSubmit.call(this, this.name, this.value, this);
	    }

	    let result = this.state.error || await this.validate(this.value, this.state);
	    if (result !== true) {
	      let error = '\n' + this.symbols.pointer + ' ';

	      if (typeof result === 'string') {
	        error += result.trim();
	      } else {
	        error += 'Invalid input';
	      }

	      this.state.error = '\n' + this.styles.danger(error);
	      this.state.submitted = false;
	      await this.render();
	      await this.alert();
	      this.state.validating = false;
	      this.state.error = void 0;
	      return;
	    }

	    this.state.validating = false;
	    await this.render();
	    await this.close();

	    this.value = await this.result(this.value);
	    this.emit('submit', this.value);
	  }

	  async cancel(err) {
	    this.state.cancelled = this.state.submitted = true;

	    await this.render();
	    await this.close();

	    if (typeof this.options.onCancel === 'function') {
	      await this.options.onCancel.call(this, this.name, this.value, this);
	    }

	    this.emit('cancel', await this.error(err));
	  }

	  async close() {
	    this.state.closed = true;

	    try {
	      let sections = this.sections();
	      let lines = Math.ceil(sections.prompt.length / this.width);
	      if (sections.rest) {
	        this.write(ansi.cursor.down(sections.rest.length));
	      }
	      this.write('\n'.repeat(lines));
	    } catch (err) { /* do nothing */ }

	    this.emit('close');
	  }

	  start() {
	    if (!this.stop && this.options.show !== false) {
	      this.stop = keypress.listen(this, this.keypress.bind(this));
	      this.once('close', this.stop);
	    }
	  }

	  async skip() {
	    this.skipped = this.options.skip === true;
	    if (typeof this.options.skip === 'function') {
	      this.skipped = await this.options.skip.call(this, this.name, this.value);
	    }
	    return this.skipped;
	  }

	  async initialize() {
	    let { format, options, result } = this;

	    this.format = () => format.call(this, this.value);
	    this.result = () => result.call(this, this.value);

	    if (typeof options.initial === 'function') {
	      this.initial = await options.initial.call(this, this);
	    }

	    if (typeof options.onRun === 'function') {
	      await options.onRun.call(this, this);
	    }

	    // if "options.onSubmit" is defined, we wrap the "submit" method to guarantee
	    // that "onSubmit" will always called first thing inside the submit
	    // method, regardless of how it's handled in inheriting prompts.
	    if (typeof options.onSubmit === 'function') {
	      let onSubmit = options.onSubmit.bind(this);
	      let submit = this.submit.bind(this);
	      delete this.options.onSubmit;
	      this.submit = async() => {
	        await onSubmit(this.name, this.value, this);
	        return submit();
	      };
	    }

	    await this.start();
	    await this.render();
	  }

	  render() {
	    throw new Error('expected prompt to have a custom render method');
	  }

	  run() {
	    return new Promise(async(resolve, reject) => {
	      this.once('submit', resolve);
	      this.once('cancel', reject);
	      if (await this.skip()) {
	        this.render = () => {};
	        return this.submit();
	      }
	      await this.initialize();
	      this.emit('run');
	    });
	  }

	  async element(name, choice, i) {
	    let { options, state, symbols, timers } = this;
	    let timer = timers && timers[name];
	    state.timer = timer;
	    let value = options[name] || state[name] || symbols[name];
	    let val = choice && choice[name] != null ? choice[name] : await value;
	    if (val === '') return val;

	    let res = await this.resolve(val, state, choice, i);
	    if (!res && choice && choice[name]) {
	      return this.resolve(value, state, choice, i);
	    }
	    return res;
	  }

	  async prefix() {
	    let element = await this.element('prefix') || this.symbols;
	    let timer = this.timers && this.timers.prefix;
	    let state = this.state;
	    state.timer = timer;
	    if (utils.isObject(element)) element = element[state.status] || element.pending;
	    if (!utils.hasColor(element)) {
	      let style = this.styles[state.status] || this.styles.pending;
	      return style(element);
	    }
	    return element;
	  }

	  async message() {
	    let message = await this.element('message');
	    if (!utils.hasColor(message)) {
	      return this.styles.strong(message);
	    }
	    return message;
	  }

	  async separator() {
	    let element = await this.element('separator') || this.symbols;
	    let timer = this.timers && this.timers.separator;
	    let state = this.state;
	    state.timer = timer;
	    let value = element[state.status] || element.pending || state.separator;
	    let ele = await this.resolve(value, state);
	    if (utils.isObject(ele)) ele = ele[state.status] || ele.pending;
	    if (!utils.hasColor(ele)) {
	      return this.styles.muted(ele);
	    }
	    return ele;
	  }

	  async pointer(choice, i) {
	    let val = await this.element('pointer', choice, i);

	    if (typeof val === 'string' && utils.hasColor(val)) {
	      return val;
	    }

	    if (val) {
	      let styles = this.styles;
	      let focused = this.index === i;
	      let style = focused ? styles.primary : val => val;
	      let ele = await this.resolve(val[focused ? 'on' : 'off'] || val, this.state);
	      let styled = !utils.hasColor(ele) ? style(ele) : ele;
	      return focused ? styled : ' '.repeat(ele.length);
	    }
	  }

	  async indicator(choice, i) {
	    let val = await this.element('indicator', choice, i);
	    if (typeof val === 'string' && utils.hasColor(val)) {
	      return val;
	    }
	    if (val) {
	      let styles = this.styles;
	      let enabled = choice.enabled === true;
	      let style = enabled ? styles.success : styles.dark;
	      let ele = val[enabled ? 'on' : 'off'] || val;
	      return !utils.hasColor(ele) ? style(ele) : ele;
	    }
	    return '';
	  }

	  body() {
	    return null;
	  }

	  footer() {
	    if (this.state.status === 'pending') {
	      return this.element('footer');
	    }
	  }

	  header() {
	    if (this.state.status === 'pending') {
	      return this.element('header');
	    }
	  }

	  async hint() {
	    if (this.state.status === 'pending' && !this.isValue(this.state.input)) {
	      let hint = await this.element('hint');
	      if (!utils.hasColor(hint)) {
	        return this.styles.muted(hint);
	      }
	      return hint;
	    }
	  }

	  error(err) {
	    return !this.state.submitted ? (err || this.state.error) : '';
	  }

	  format(value) {
	    return value;
	  }

	  result(value) {
	    return value;
	  }

	  validate(value) {
	    if (this.options.required === true) {
	      return this.isValue(value);
	    }
	    return true;
	  }

	  isValue(value) {
	    return value != null && value !== '';
	  }

	  resolve(value, ...args) {
	    return utils.resolve(this, value, ...args);
	  }

	  get base() {
	    return Prompt.prototype;
	  }

	  get style() {
	    return this.styles[this.state.status];
	  }

	  get height() {
	    return this.options.rows || utils.height(this.stdout, 25);
	  }
	  get width() {
	    return this.options.columns || utils.width(this.stdout, 80);
	  }
	  get size() {
	    return { width: this.width, height: this.height };
	  }

	  set cursor(value) {
	    this.state.cursor = value;
	  }
	  get cursor() {
	    return this.state.cursor;
	  }

	  set input(value) {
	    this.state.input = value;
	  }
	  get input() {
	    return this.state.input;
	  }

	  set value(value) {
	    this.state.value = value;
	  }
	  get value() {
	    let { input, value } = this.state;
	    let result = [value, input].find(this.isValue.bind(this));
	    return this.isValue(result) ? result : this.initial;
	  }

	  static get prompt() {
	    return options => new this(options).run();
	  }
	}

	function setOptions(prompt) {
	  let isValidKey = key => {
	    return prompt[key] === void 0 || typeof prompt[key] === 'function';
	  };

	  let ignore = [
	    'actions',
	    'choices',
	    'initial',
	    'margin',
	    'roles',
	    'styles',
	    'symbols',
	    'theme',
	    'timers',
	    'value'
	  ];

	  let ignoreFn = [
	    'body',
	    'footer',
	    'error',
	    'header',
	    'hint',
	    'indicator',
	    'message',
	    'prefix',
	    'separator',
	    'skip'
	  ];

	  for (let key of Object.keys(prompt.options)) {
	    if (ignore.includes(key)) continue;
	    if (/^on[A-Z]/.test(key)) continue;
	    let option = prompt.options[key];
	    if (typeof option === 'function' && isValidKey(key)) {
	      if (!ignoreFn.includes(key)) {
	        prompt[key] = option.bind(prompt);
	      }
	    } else if (typeof prompt[key] !== 'function') {
	      prompt[key] = option;
	    }
	  }
	}

	function margin(value) {
	  if (typeof value === 'number') {
	    value = [value, value, value, value];
	  }
	  let arr = [].concat(value || []);
	  let pad = i => i % 2 === 0 ? '\n' : ' ';
	  let res = [];
	  for (let i = 0; i < 4; i++) {
	    let char = pad(i);
	    if (arr[i]) {
	      res.push(char.repeat(arr[i]));
	    } else {
	      res.push('');
	    }
	  }
	  return res;
	}

	prompt = Prompt;
	return prompt;
}

var prompts$1 = {};

var roles_1;
var hasRequiredRoles;

function requireRoles () {
	if (hasRequiredRoles) return roles_1;
	hasRequiredRoles = 1;

	const utils = utils$2;
	const roles = {
	  default(prompt, choice) {
	    return choice;
	  },
	  checkbox(prompt, choice) {
	    throw new Error('checkbox role is not implemented yet');
	  },
	  editable(prompt, choice) {
	    throw new Error('editable role is not implemented yet');
	  },
	  expandable(prompt, choice) {
	    throw new Error('expandable role is not implemented yet');
	  },
	  heading(prompt, choice) {
	    choice.disabled = '';
	    choice.indicator = [choice.indicator, ' '].find(v => v != null);
	    choice.message = choice.message || '';
	    return choice;
	  },
	  input(prompt, choice) {
	    throw new Error('input role is not implemented yet');
	  },
	  option(prompt, choice) {
	    return roles.default(prompt, choice);
	  },
	  radio(prompt, choice) {
	    throw new Error('radio role is not implemented yet');
	  },
	  separator(prompt, choice) {
	    choice.disabled = '';
	    choice.indicator = [choice.indicator, ' '].find(v => v != null);
	    choice.message = choice.message || prompt.symbols.line.repeat(5);
	    return choice;
	  },
	  spacer(prompt, choice) {
	    return choice;
	  }
	};

	roles_1 = (name, options = {}) => {
	  let role = utils.merge({}, roles, options.roles);
	  return role[name] || role.default;
	};
	return roles_1;
}

var array;
var hasRequiredArray;

function requireArray () {
	if (hasRequiredArray) return array;
	hasRequiredArray = 1;

	const colors = ansiColors.exports;
	const Prompt = requirePrompt();
	const roles = requireRoles();
	const utils = utils$2;
	const { reorder, scrollUp, scrollDown, isObject, swap } = utils;

	class ArrayPrompt extends Prompt {
	  constructor(options) {
	    super(options);
	    this.cursorHide();
	    this.maxSelected = options.maxSelected || Infinity;
	    this.multiple = options.multiple || false;
	    this.initial = options.initial || 0;
	    this.delay = options.delay || 0;
	    this.longest = 0;
	    this.num = '';
	  }

	  async initialize() {
	    if (typeof this.options.initial === 'function') {
	      this.initial = await this.options.initial.call(this);
	    }
	    await this.reset(true);
	    await super.initialize();
	  }

	  async reset() {
	    let { choices, initial, autofocus, suggest } = this.options;
	    this.state._choices = [];
	    this.state.choices = [];

	    this.choices = await Promise.all(await this.toChoices(choices));
	    this.choices.forEach(ch => (ch.enabled = false));

	    if (typeof suggest !== 'function' && this.selectable.length === 0) {
	      throw new Error('At least one choice must be selectable');
	    }

	    if (isObject(initial)) initial = Object.keys(initial);
	    if (Array.isArray(initial)) {
	      if (autofocus != null) this.index = this.findIndex(autofocus);
	      initial.forEach(v => this.enable(this.find(v)));
	      await this.render();
	    } else {
	      if (autofocus != null) initial = autofocus;
	      if (typeof initial === 'string') initial = this.findIndex(initial);
	      if (typeof initial === 'number' && initial > -1) {
	        this.index = Math.max(0, Math.min(initial, this.choices.length));
	        this.enable(this.find(this.index));
	      }
	    }

	    if (this.isDisabled(this.focused)) {
	      await this.down();
	    }
	  }

	  async toChoices(value, parent) {
	    this.state.loadingChoices = true;
	    let choices = [];
	    let index = 0;

	    let toChoices = async(items, parent) => {
	      if (typeof items === 'function') items = await items.call(this);
	      if (items instanceof Promise) items = await items;

	      for (let i = 0; i < items.length; i++) {
	        let choice = items[i] = await this.toChoice(items[i], index++, parent);
	        choices.push(choice);

	        if (choice.choices) {
	          await toChoices(choice.choices, choice);
	        }
	      }
	      return choices;
	    };

	    return toChoices(value, parent)
	      .then(choices => {
	        this.state.loadingChoices = false;
	        return choices;
	      });
	  }

	  async toChoice(ele, i, parent) {
	    if (typeof ele === 'function') ele = await ele.call(this, this);
	    if (ele instanceof Promise) ele = await ele;
	    if (typeof ele === 'string') ele = { name: ele };

	    if (ele.normalized) return ele;
	    ele.normalized = true;

	    let origVal = ele.value;
	    let role = roles(ele.role, this.options);
	    ele = role(this, ele);

	    if (typeof ele.disabled === 'string' && !ele.hint) {
	      ele.hint = ele.disabled;
	      ele.disabled = true;
	    }

	    if (ele.disabled === true && ele.hint == null) {
	      ele.hint = '(disabled)';
	    }

	    // if the choice was already normalized, return it
	    if (ele.index != null) return ele;
	    ele.name = ele.name || ele.key || ele.title || ele.value || ele.message;
	    ele.message = ele.message || ele.name || '';
	    ele.value = [ele.value, ele.name].find(this.isValue.bind(this));

	    ele.input = '';
	    ele.index = i;
	    ele.cursor = 0;

	    utils.define(ele, 'parent', parent);
	    ele.level = parent ? parent.level + 1 : 1;
	    if (ele.indent == null) {
	      ele.indent = parent ? parent.indent + '  ' : (ele.indent || '');
	    }

	    ele.path = parent ? parent.path + '.' + ele.name : ele.name;
	    ele.enabled = !!(this.multiple && !this.isDisabled(ele) && (ele.enabled || this.isSelected(ele)));

	    if (!this.isDisabled(ele)) {
	      this.longest = Math.max(this.longest, colors.unstyle(ele.message).length);
	    }

	    // shallow clone the choice first
	    let choice = { ...ele };

	    // then allow the choice to be reset using the "original" values
	    ele.reset = (input = choice.input, value = choice.value) => {
	      for (let key of Object.keys(choice)) ele[key] = choice[key];
	      ele.input = input;
	      ele.value = value;
	    };

	    if (origVal == null && typeof ele.initial === 'function') {
	      ele.input = await ele.initial.call(this, this.state, ele, i);
	    }

	    return ele;
	  }

	  async onChoice(choice, i) {
	    this.emit('choice', choice, i, this);

	    if (typeof choice.onChoice === 'function') {
	      await choice.onChoice.call(this, this.state, choice, i);
	    }
	  }

	  async addChoice(ele, i, parent) {
	    let choice = await this.toChoice(ele, i, parent);
	    this.choices.push(choice);
	    this.index = this.choices.length - 1;
	    this.limit = this.choices.length;
	    return choice;
	  }

	  async newItem(item, i, parent) {
	    let ele = { name: 'New choice name?', editable: true, newChoice: true, ...item };
	    let choice = await this.addChoice(ele, i, parent);

	    choice.updateChoice = () => {
	      delete choice.newChoice;
	      choice.name = choice.message = choice.input;
	      choice.input = '';
	      choice.cursor = 0;
	    };

	    return this.render();
	  }

	  indent(choice) {
	    if (choice.indent == null) {
	      return choice.level > 1 ? '  '.repeat(choice.level - 1) : '';
	    }
	    return choice.indent;
	  }

	  dispatch(s, key) {
	    if (this.multiple && this[key.name]) return this[key.name]();
	    this.alert();
	  }

	  focus(choice, enabled) {
	    if (typeof enabled !== 'boolean') enabled = choice.enabled;
	    if (enabled && !choice.enabled && this.selected.length >= this.maxSelected) {
	      return this.alert();
	    }
	    this.index = choice.index;
	    choice.enabled = enabled && !this.isDisabled(choice);
	    return choice;
	  }

	  space() {
	    if (!this.multiple) return this.alert();
	    this.toggle(this.focused);
	    return this.render();
	  }

	  a() {
	    if (this.maxSelected < this.choices.length) return this.alert();
	    let enabled = this.selectable.every(ch => ch.enabled);
	    this.choices.forEach(ch => (ch.enabled = !enabled));
	    return this.render();
	  }

	  i() {
	    // don't allow choices to be inverted if it will result in
	    // more than the maximum number of allowed selected items.
	    if (this.choices.length - this.selected.length > this.maxSelected) {
	      return this.alert();
	    }
	    this.choices.forEach(ch => (ch.enabled = !ch.enabled));
	    return this.render();
	  }

	  g(choice = this.focused) {
	    if (!this.choices.some(ch => !!ch.parent)) return this.a();
	    this.toggle((choice.parent && !choice.choices) ? choice.parent : choice);
	    return this.render();
	  }

	  toggle(choice, enabled) {
	    if (!choice.enabled && this.selected.length >= this.maxSelected) {
	      return this.alert();
	    }

	    if (typeof enabled !== 'boolean') enabled = !choice.enabled;
	    choice.enabled = enabled;

	    if (choice.choices) {
	      choice.choices.forEach(ch => this.toggle(ch, enabled));
	    }

	    let parent = choice.parent;
	    while (parent) {
	      let choices = parent.choices.filter(ch => this.isDisabled(ch));
	      parent.enabled = choices.every(ch => ch.enabled === true);
	      parent = parent.parent;
	    }

	    reset(this, this.choices);
	    this.emit('toggle', choice, this);
	    return choice;
	  }

	  enable(choice) {
	    if (this.selected.length >= this.maxSelected) return this.alert();
	    choice.enabled = !this.isDisabled(choice);
	    choice.choices && choice.choices.forEach(this.enable.bind(this));
	    return choice;
	  }

	  disable(choice) {
	    choice.enabled = false;
	    choice.choices && choice.choices.forEach(this.disable.bind(this));
	    return choice;
	  }

	  number(n) {
	    this.num += n;

	    let number = num => {
	      let i = Number(num);
	      if (i > this.choices.length - 1) return this.alert();

	      let focused = this.focused;
	      let choice = this.choices.find(ch => i === ch.index);

	      if (!choice.enabled && this.selected.length >= this.maxSelected) {
	        return this.alert();
	      }

	      if (this.visible.indexOf(choice) === -1) {
	        let choices = reorder(this.choices);
	        let actualIdx = choices.indexOf(choice);

	        if (focused.index > actualIdx) {
	          let start = choices.slice(actualIdx, actualIdx + this.limit);
	          let end = choices.filter(ch => !start.includes(ch));
	          this.choices = start.concat(end);
	        } else {
	          let pos = actualIdx - this.limit + 1;
	          this.choices = choices.slice(pos).concat(choices.slice(0, pos));
	        }
	      }

	      this.index = this.choices.indexOf(choice);
	      this.toggle(this.focused);
	      return this.render();
	    };

	    clearTimeout(this.numberTimeout);

	    return new Promise(resolve => {
	      let len = this.choices.length;
	      let num = this.num;

	      let handle = (val = false, res) => {
	        clearTimeout(this.numberTimeout);
	        if (val) res = number(num);
	        this.num = '';
	        resolve(res);
	      };

	      if (num === '0' || (num.length === 1 && Number(num + '0') > len)) {
	        return handle(true);
	      }

	      if (Number(num) > len) {
	        return handle(false, this.alert());
	      }

	      this.numberTimeout = setTimeout(() => handle(true), this.delay);
	    });
	  }

	  home() {
	    this.choices = reorder(this.choices);
	    this.index = 0;
	    return this.render();
	  }

	  end() {
	    let pos = this.choices.length - this.limit;
	    let choices = reorder(this.choices);
	    this.choices = choices.slice(pos).concat(choices.slice(0, pos));
	    this.index = this.limit - 1;
	    return this.render();
	  }

	  first() {
	    this.index = 0;
	    return this.render();
	  }

	  last() {
	    this.index = this.visible.length - 1;
	    return this.render();
	  }

	  prev() {
	    if (this.visible.length <= 1) return this.alert();
	    return this.up();
	  }

	  next() {
	    if (this.visible.length <= 1) return this.alert();
	    return this.down();
	  }

	  right() {
	    if (this.cursor >= this.input.length) return this.alert();
	    this.cursor++;
	    return this.render();
	  }

	  left() {
	    if (this.cursor <= 0) return this.alert();
	    this.cursor--;
	    return this.render();
	  }

	  up() {
	    let len = this.choices.length;
	    let vis = this.visible.length;
	    let idx = this.index;
	    if (this.options.scroll === false && idx === 0) {
	      return this.alert();
	    }
	    if (len > vis && idx === 0) {
	      return this.scrollUp();
	    }
	    this.index = ((idx - 1 % len) + len) % len;
	    if (this.isDisabled()) {
	      return this.up();
	    }
	    return this.render();
	  }

	  down() {
	    let len = this.choices.length;
	    let vis = this.visible.length;
	    let idx = this.index;
	    if (this.options.scroll === false && idx === vis - 1) {
	      return this.alert();
	    }
	    if (len > vis && idx === vis - 1) {
	      return this.scrollDown();
	    }
	    this.index = (idx + 1) % len;
	    if (this.isDisabled()) {
	      return this.down();
	    }
	    return this.render();
	  }

	  scrollUp(i = 0) {
	    this.choices = scrollUp(this.choices);
	    this.index = i;
	    if (this.isDisabled()) {
	      return this.up();
	    }
	    return this.render();
	  }

	  scrollDown(i = this.visible.length - 1) {
	    this.choices = scrollDown(this.choices);
	    this.index = i;
	    if (this.isDisabled()) {
	      return this.down();
	    }
	    return this.render();
	  }

	  async shiftUp() {
	    if (this.options.sort === true) {
	      this.sorting = true;
	      this.swap(this.index - 1);
	      await this.up();
	      this.sorting = false;
	      return;
	    }
	    return this.scrollUp(this.index);
	  }

	  async shiftDown() {
	    if (this.options.sort === true) {
	      this.sorting = true;
	      this.swap(this.index + 1);
	      await this.down();
	      this.sorting = false;
	      return;
	    }
	    return this.scrollDown(this.index);
	  }

	  pageUp() {
	    if (this.visible.length <= 1) return this.alert();
	    this.limit = Math.max(this.limit - 1, 0);
	    this.index = Math.min(this.limit - 1, this.index);
	    this._limit = this.limit;
	    if (this.isDisabled()) {
	      return this.up();
	    }
	    return this.render();
	  }

	  pageDown() {
	    if (this.visible.length >= this.choices.length) return this.alert();
	    this.index = Math.max(0, this.index);
	    this.limit = Math.min(this.limit + 1, this.choices.length);
	    this._limit = this.limit;
	    if (this.isDisabled()) {
	      return this.down();
	    }
	    return this.render();
	  }

	  swap(pos) {
	    swap(this.choices, this.index, pos);
	  }

	  isDisabled(choice = this.focused) {
	    let keys = ['disabled', 'collapsed', 'hidden', 'completing', 'readonly'];
	    if (choice && keys.some(key => choice[key] === true)) {
	      return true;
	    }
	    return choice && choice.role === 'heading';
	  }

	  isEnabled(choice = this.focused) {
	    if (Array.isArray(choice)) return choice.every(ch => this.isEnabled(ch));
	    if (choice.choices) {
	      let choices = choice.choices.filter(ch => !this.isDisabled(ch));
	      return choice.enabled && choices.every(ch => this.isEnabled(ch));
	    }
	    return choice.enabled && !this.isDisabled(choice);
	  }

	  isChoice(choice, value) {
	    return choice.name === value || choice.index === Number(value);
	  }

	  isSelected(choice) {
	    if (Array.isArray(this.initial)) {
	      return this.initial.some(value => this.isChoice(choice, value));
	    }
	    return this.isChoice(choice, this.initial);
	  }

	  map(names = [], prop = 'value') {
	    return [].concat(names || []).reduce((acc, name) => {
	      acc[name] = this.find(name, prop);
	      return acc;
	    }, {});
	  }

	  filter(value, prop) {
	    let isChoice = (ele, i) => [ele.name, i].includes(value);
	    let fn = typeof value === 'function' ? value : isChoice;
	    let choices = this.options.multiple ? this.state._choices : this.choices;
	    let result = choices.filter(fn);
	    if (prop) {
	      return result.map(ch => ch[prop]);
	    }
	    return result;
	  }

	  find(value, prop) {
	    if (isObject(value)) return prop ? value[prop] : value;
	    let isChoice = (ele, i) => [ele.name, i].includes(value);
	    let fn = typeof value === 'function' ? value : isChoice;
	    let choice = this.choices.find(fn);
	    if (choice) {
	      return prop ? choice[prop] : choice;
	    }
	  }

	  findIndex(value) {
	    return this.choices.indexOf(this.find(value));
	  }

	  async submit() {
	    let choice = this.focused;
	    if (!choice) return this.alert();

	    if (choice.newChoice) {
	      if (!choice.input) return this.alert();
	      choice.updateChoice();
	      return this.render();
	    }

	    if (this.choices.some(ch => ch.newChoice)) {
	      return this.alert();
	    }

	    let { reorder, sort } = this.options;
	    let multi = this.multiple === true;
	    let value = this.selected;
	    if (value === void 0) {
	      return this.alert();
	    }

	    // re-sort choices to original order
	    if (Array.isArray(value) && reorder !== false && sort !== true) {
	      value = utils.reorder(value);
	    }

	    this.value = multi ? value.map(ch => ch.name) : value.name;
	    return super.submit();
	  }

	  set choices(choices = []) {
	    this.state._choices = this.state._choices || [];
	    this.state.choices = choices;

	    for (let choice of choices) {
	      if (!this.state._choices.some(ch => ch.name === choice.name)) {
	        this.state._choices.push(choice);
	      }
	    }

	    if (!this._initial && this.options.initial) {
	      this._initial = true;
	      let init = this.initial;
	      if (typeof init === 'string' || typeof init === 'number') {
	        let choice = this.find(init);
	        if (choice) {
	          this.initial = choice.index;
	          this.focus(choice, true);
	        }
	      }
	    }
	  }
	  get choices() {
	    return reset(this, this.state.choices || []);
	  }

	  set visible(visible) {
	    this.state.visible = visible;
	  }
	  get visible() {
	    return (this.state.visible || this.choices).slice(0, this.limit);
	  }

	  set limit(num) {
	    this.state.limit = num;
	  }
	  get limit() {
	    let { state, options, choices } = this;
	    let limit = state.limit || this._limit || options.limit || choices.length;
	    return Math.min(limit, this.height);
	  }

	  set value(value) {
	    super.value = value;
	  }
	  get value() {
	    if (typeof super.value !== 'string' && super.value === this.initial) {
	      return this.input;
	    }
	    return super.value;
	  }

	  set index(i) {
	    this.state.index = i;
	  }
	  get index() {
	    return Math.max(0, this.state ? this.state.index : 0);
	  }

	  get enabled() {
	    return this.filter(this.isEnabled.bind(this));
	  }

	  get focused() {
	    let choice = this.choices[this.index];
	    if (choice && this.state.submitted && this.multiple !== true) {
	      choice.enabled = true;
	    }
	    return choice;
	  }

	  get selectable() {
	    return this.choices.filter(choice => !this.isDisabled(choice));
	  }

	  get selected() {
	    return this.multiple ? this.enabled : this.focused;
	  }
	}

	function reset(prompt, choices) {
	  if (choices instanceof Promise) return choices;
	  if (typeof choices === 'function') {
	    if (utils.isAsyncFn(choices)) return choices;
	    choices = choices.call(prompt, prompt);
	  }
	  for (let choice of choices) {
	    if (Array.isArray(choice.choices)) {
	      let items = choice.choices.filter(ch => !prompt.isDisabled(ch));
	      choice.enabled = items.every(ch => ch.enabled === true);
	    }
	    if (prompt.isDisabled(choice) === true) {
	      delete choice.enabled;
	    }
	  }
	  return choices;
	}

	array = ArrayPrompt;
	return array;
}

var select;
var hasRequiredSelect;

function requireSelect () {
	if (hasRequiredSelect) return select;
	hasRequiredSelect = 1;

	const ArrayPrompt = requireArray();
	const utils = utils$2;

	class SelectPrompt extends ArrayPrompt {
	  constructor(options) {
	    super(options);
	    this.emptyError = this.options.emptyError || 'No items were selected';
	  }

	  async dispatch(s, key) {
	    if (this.multiple) {
	      return this[key.name] ? await this[key.name](s, key) : await super.dispatch(s, key);
	    }
	    this.alert();
	  }

	  separator() {
	    if (this.options.separator) return super.separator();
	    let sep = this.styles.muted(this.symbols.ellipsis);
	    return this.state.submitted ? super.separator() : sep;
	  }

	  pointer(choice, i) {
	    return (!this.multiple || this.options.pointer) ? super.pointer(choice, i) : '';
	  }

	  indicator(choice, i) {
	    return this.multiple ? super.indicator(choice, i) : '';
	  }

	  choiceMessage(choice, i) {
	    let message = this.resolve(choice.message, this.state, choice, i);
	    if (choice.role === 'heading' && !utils.hasColor(message)) {
	      message = this.styles.strong(message);
	    }
	    return this.resolve(message, this.state, choice, i);
	  }

	  choiceSeparator() {
	    return ':';
	  }

	  async renderChoice(choice, i) {
	    await this.onChoice(choice, i);

	    let focused = this.index === i;
	    let pointer = await this.pointer(choice, i);
	    let check = await this.indicator(choice, i) + (choice.pad || '');
	    let hint = await this.resolve(choice.hint, this.state, choice, i);

	    if (hint && !utils.hasColor(hint)) {
	      hint = this.styles.muted(hint);
	    }

	    let ind = this.indent(choice);
	    let msg = await this.choiceMessage(choice, i);
	    let line = () => [this.margin[3], ind + pointer + check, msg, this.margin[1], hint].filter(Boolean).join(' ');

	    if (choice.role === 'heading') {
	      return line();
	    }

	    if (choice.disabled) {
	      if (!utils.hasColor(msg)) {
	        msg = this.styles.disabled(msg);
	      }
	      return line();
	    }

	    if (focused) {
	      msg = this.styles.em(msg);
	    }

	    return line();
	  }

	  async renderChoices() {
	    if (this.state.loading === 'choices') {
	      return this.styles.warning('Loading choices');
	    }

	    if (this.state.submitted) return '';
	    let choices = this.visible.map(async(ch, i) => await this.renderChoice(ch, i));
	    let visible = await Promise.all(choices);
	    if (!visible.length) visible.push(this.styles.danger('No matching choices'));
	    let result = this.margin[0] + visible.join('\n');
	    let header;

	    if (this.options.choicesHeader) {
	      header = await this.resolve(this.options.choicesHeader, this.state);
	    }

	    return [header, result].filter(Boolean).join('\n');
	  }

	  format() {
	    if (!this.state.submitted || this.state.cancelled) return '';
	    if (Array.isArray(this.selected)) {
	      return this.selected.map(choice => this.styles.primary(choice.name)).join(', ');
	    }
	    return this.styles.primary(this.selected.name);
	  }

	  async render() {
	    let { submitted, size } = this.state;

	    let prompt = '';
	    let header = await this.header();
	    let prefix = await this.prefix();
	    let separator = await this.separator();
	    let message = await this.message();

	    if (this.options.promptLine !== false) {
	      prompt = [prefix, message, separator, ''].join(' ');
	      this.state.prompt = prompt;
	    }

	    let output = await this.format();
	    let help = (await this.error()) || (await this.hint());
	    let body = await this.renderChoices();
	    let footer = await this.footer();

	    if (output) prompt += output;
	    if (help && !prompt.includes(help)) prompt += ' ' + help;

	    if (submitted && !output && !body.trim() && this.multiple && this.emptyError != null) {
	      prompt += this.styles.danger(this.emptyError);
	    }

	    this.clear(size);
	    this.write([header, prompt, body, footer].filter(Boolean).join('\n'));
	    this.write(this.margin[2]);
	    this.restore();
	  }
	}

	select = SelectPrompt;
	return select;
}

var autocomplete;
var hasRequiredAutocomplete;

function requireAutocomplete () {
	if (hasRequiredAutocomplete) return autocomplete;
	hasRequiredAutocomplete = 1;

	const Select = requireSelect();

	const highlight = (input, color) => {
	  let val = input.toLowerCase();
	  return str => {
	    let s = str.toLowerCase();
	    let i = s.indexOf(val);
	    let colored = color(str.slice(i, i + val.length));
	    return i >= 0 ? str.slice(0, i) + colored + str.slice(i + val.length) : str;
	  };
	};

	class AutoComplete extends Select {
	  constructor(options) {
	    super(options);
	    this.cursorShow();
	  }

	  moveCursor(n) {
	    this.state.cursor += n;
	  }

	  dispatch(ch) {
	    return this.append(ch);
	  }

	  space(ch) {
	    return this.options.multiple ? super.space(ch) : this.append(ch);
	  }

	  append(ch) {
	    let { cursor, input } = this.state;
	    this.input = input.slice(0, cursor) + ch + input.slice(cursor);
	    this.moveCursor(1);
	    return this.complete();
	  }

	  delete() {
	    let { cursor, input } = this.state;
	    if (!input) return this.alert();
	    this.input = input.slice(0, cursor - 1) + input.slice(cursor);
	    this.moveCursor(-1);
	    return this.complete();
	  }

	  deleteForward() {
	    let { cursor, input } = this.state;
	    if (input[cursor] === void 0) return this.alert();
	    this.input = `${input}`.slice(0, cursor) + `${input}`.slice(cursor + 1);
	    return this.complete();
	  }

	  number(ch) {
	    return this.append(ch);
	  }

	  async complete() {
	    this.completing = true;
	    this.choices = await this.suggest(this.input, this.state._choices);
	    this.state.limit = void 0; // allow getter/setter to reset limit
	    this.index = Math.min(Math.max(this.visible.length - 1, 0), this.index);
	    await this.render();
	    this.completing = false;
	  }

	  suggest(input = this.input, choices = this.state._choices) {
	    if (typeof this.options.suggest === 'function') {
	      return this.options.suggest.call(this, input, choices);
	    }
	    let str = input.toLowerCase();
	    return choices.filter(ch => ch.message.toLowerCase().includes(str));
	  }

	  pointer() {
	    return '';
	  }

	  format() {
	    if (!this.focused) return this.input;
	    if (this.options.multiple && this.state.submitted) {
	      return this.selected.map(ch => this.styles.primary(ch.message)).join(', ');
	    }
	    if (this.state.submitted) {
	      let value = this.value = this.input = this.focused.value;
	      return this.styles.primary(value);
	    }
	    return this.input;
	  }

	  async render() {
	    if (this.state.status !== 'pending') return super.render();
	    let style = this.options.highlight
	      ? this.options.highlight.bind(this)
	      : this.styles.placeholder;

	    let color = highlight(this.input, style);
	    let choices = this.choices;
	    this.choices = choices.map(ch => ({ ...ch, message: color(ch.message) }));
	    await super.render();
	    this.choices = choices;
	  }

	  submit() {
	    if (this.options.multiple) {
	      this.value = this.selected.map(ch => ch.name);
	    }
	    return super.submit();
	  }
	}

	autocomplete = AutoComplete;
	return autocomplete;
}

var placeholder;
var hasRequiredPlaceholder;

function requirePlaceholder () {
	if (hasRequiredPlaceholder) return placeholder;
	hasRequiredPlaceholder = 1;

	const utils = utils$2;

	/**
	 * Render a placeholder value with cursor and styling based on the
	 * position of the cursor.
	 *
	 * @param {Object} `prompt` Prompt instance.
	 * @param {String} `input` Input string.
	 * @param {String} `initial` The initial user-provided value.
	 * @param {Number} `pos` Current cursor position.
	 * @param {Boolean} `showCursor` Render a simulated cursor using the inverse primary style.
	 * @return {String} Returns the styled placeholder string.
	 * @api public
	 */

	placeholder = (prompt, options = {}) => {
	  prompt.cursorHide();

	  let { input = '', initial = '', pos, showCursor = true, color } = options;
	  let style = color || prompt.styles.placeholder;
	  let inverse = utils.inverse(prompt.styles.primary);
	  let blinker = str => inverse(prompt.styles.black(str));
	  let output = input;
	  let char = ' ';
	  let reverse = blinker(char);

	  if (prompt.blink && prompt.blink.off === true) {
	    blinker = str => str;
	    reverse = '';
	  }

	  if (showCursor && pos === 0 && initial === '' && input === '') {
	    return blinker(char);
	  }

	  if (showCursor && pos === 0 && (input === initial || input === '')) {
	    return blinker(initial[0]) + style(initial.slice(1));
	  }

	  initial = utils.isPrimitive(initial) ? `${initial}` : '';
	  input = utils.isPrimitive(input) ? `${input}` : '';

	  let placeholder = initial && initial.startsWith(input) && initial !== input;
	  let cursor = placeholder ? blinker(initial[input.length]) : reverse;

	  if (pos !== input.length && showCursor === true) {
	    output = input.slice(0, pos) + blinker(input[pos]) + input.slice(pos + 1);
	    cursor = '';
	  }

	  if (showCursor === false) {
	    cursor = '';
	  }

	  if (placeholder) {
	    let raw = prompt.styles.unstyle(output + cursor);
	    return output + cursor + style(initial.slice(raw.length));
	  }

	  return output + cursor;
	};
	return placeholder;
}

var form;
var hasRequiredForm;

function requireForm () {
	if (hasRequiredForm) return form;
	hasRequiredForm = 1;

	const colors = ansiColors.exports;
	const SelectPrompt = requireSelect();
	const placeholder = requirePlaceholder();

	class FormPrompt extends SelectPrompt {
	  constructor(options) {
	    super({ ...options, multiple: true });
	    this.type = 'form';
	    this.initial = this.options.initial;
	    this.align = [this.options.align, 'right'].find(v => v != null);
	    this.emptyError = '';
	    this.values = {};
	  }

	  async reset(first) {
	    await super.reset();
	    if (first === true) this._index = this.index;
	    this.index = this._index;
	    this.values = {};
	    this.choices.forEach(choice => choice.reset && choice.reset());
	    return this.render();
	  }

	  dispatch(char) {
	    return !!char && this.append(char);
	  }

	  append(char) {
	    let choice = this.focused;
	    if (!choice) return this.alert();
	    let { cursor, input } = choice;
	    choice.value = choice.input = input.slice(0, cursor) + char + input.slice(cursor);
	    choice.cursor++;
	    return this.render();
	  }

	  delete() {
	    let choice = this.focused;
	    if (!choice || choice.cursor <= 0) return this.alert();
	    let { cursor, input } = choice;
	    choice.value = choice.input = input.slice(0, cursor - 1) + input.slice(cursor);
	    choice.cursor--;
	    return this.render();
	  }

	  deleteForward() {
	    let choice = this.focused;
	    if (!choice) return this.alert();
	    let { cursor, input } = choice;
	    if (input[cursor] === void 0) return this.alert();
	    let str = `${input}`.slice(0, cursor) + `${input}`.slice(cursor + 1);
	    choice.value = choice.input = str;
	    return this.render();
	  }

	  right() {
	    let choice = this.focused;
	    if (!choice) return this.alert();
	    if (choice.cursor >= choice.input.length) return this.alert();
	    choice.cursor++;
	    return this.render();
	  }

	  left() {
	    let choice = this.focused;
	    if (!choice) return this.alert();
	    if (choice.cursor <= 0) return this.alert();
	    choice.cursor--;
	    return this.render();
	  }

	  space(ch, key) {
	    return this.dispatch(ch, key);
	  }

	  number(ch, key) {
	    return this.dispatch(ch, key);
	  }

	  next() {
	    let ch = this.focused;
	    if (!ch) return this.alert();
	    let { initial, input } = ch;
	    if (initial && initial.startsWith(input) && input !== initial) {
	      ch.value = ch.input = initial;
	      ch.cursor = ch.value.length;
	      return this.render();
	    }
	    return super.next();
	  }

	  prev() {
	    let ch = this.focused;
	    if (!ch) return this.alert();
	    if (ch.cursor === 0) return super.prev();
	    ch.value = ch.input = '';
	    ch.cursor = 0;
	    return this.render();
	  }

	  separator() {
	    return '';
	  }

	  format(value) {
	    return !this.state.submitted ? super.format(value) : '';
	  }

	  pointer() {
	    return '';
	  }

	  indicator(choice) {
	    return choice.input ? '⦿' : '⊙';
	  }

	  async choiceSeparator(choice, i) {
	    let sep = await this.resolve(choice.separator, this.state, choice, i) || ':';
	    return sep ? ' ' + this.styles.disabled(sep) : '';
	  }

	  async renderChoice(choice, i) {
	    await this.onChoice(choice, i);

	    let { state, styles } = this;
	    let { cursor, initial = '', name, hint, input = '' } = choice;
	    let { muted, submitted, primary, danger } = styles;

	    let help = hint;
	    let focused = this.index === i;
	    let validate = choice.validate || (() => true);
	    let sep = await this.choiceSeparator(choice, i);
	    let msg = choice.message;

	    if (this.align === 'right') msg = msg.padStart(this.longest + 1, ' ');
	    if (this.align === 'left') msg = msg.padEnd(this.longest + 1, ' ');

	    // re-populate the form values (answers) object
	    let value = this.values[name] = (input || initial);
	    let color = input ? 'success' : 'dark';

	    if ((await validate.call(choice, value, this.state)) !== true) {
	      color = 'danger';
	    }

	    let style = styles[color];
	    let indicator = style(await this.indicator(choice, i)) + (choice.pad || '');

	    let indent = this.indent(choice);
	    let line = () => [indent, indicator, msg + sep, input, help].filter(Boolean).join(' ');

	    if (state.submitted) {
	      msg = colors.unstyle(msg);
	      input = submitted(input);
	      help = '';
	      return line();
	    }

	    if (choice.format) {
	      input = await choice.format.call(this, input, choice, i);
	    } else {
	      let color = this.styles.muted;
	      let options = { input, initial, pos: cursor, showCursor: focused, color };
	      input = placeholder(this, options);
	    }

	    if (!this.isValue(input)) {
	      input = this.styles.muted(this.symbols.ellipsis);
	    }

	    if (choice.result) {
	      this.values[name] = await choice.result.call(this, value, choice, i);
	    }

	    if (focused) {
	      msg = primary(msg);
	    }

	    if (choice.error) {
	      input += (input ? ' ' : '') + danger(choice.error.trim());
	    } else if (choice.hint) {
	      input += (input ? ' ' : '') + muted(choice.hint.trim());
	    }

	    return line();
	  }

	  async submit() {
	    this.value = this.values;
	    return super.base.submit.call(this);
	  }
	}

	form = FormPrompt;
	return form;
}

var auth;
var hasRequiredAuth;

function requireAuth () {
	if (hasRequiredAuth) return auth;
	hasRequiredAuth = 1;

	const FormPrompt = requireForm();

	const defaultAuthenticate = () => {
	  throw new Error('expected prompt to have a custom authenticate method');
	};

	const factory = (authenticate = defaultAuthenticate) => {

	  class AuthPrompt extends FormPrompt {
	    constructor(options) {
	      super(options);
	    }

	    async submit() {
	      this.value = await authenticate.call(this, this.values, this.state);
	      super.base.submit.call(this);
	    }

	    static create(authenticate) {
	      return factory(authenticate);
	    }
	  }

	  return AuthPrompt;
	};

	auth = factory();
	return auth;
}

var basicauth;
var hasRequiredBasicauth;

function requireBasicauth () {
	if (hasRequiredBasicauth) return basicauth;
	hasRequiredBasicauth = 1;

	const AuthPrompt = requireAuth();

	function defaultAuthenticate(value, state) {
	  if (value.username === this.options.username && value.password === this.options.password) {
	    return true;
	  }
	  return false;
	}

	const factory = (authenticate = defaultAuthenticate) => {
	  const choices = [
	    { name: 'username', message: 'username' },
	    {
	      name: 'password',
	      message: 'password',
	      format(input) {
	        if (this.options.showPassword) {
	          return input;
	        }
	        let color = this.state.submitted ? this.styles.primary : this.styles.muted;
	        return color(this.symbols.asterisk.repeat(input.length));
	      }
	    }
	  ];

	  class BasicAuthPrompt extends AuthPrompt.create(authenticate) {
	    constructor(options) {
	      super({ ...options, choices });
	    }

	    static create(authenticate) {
	      return factory(authenticate);
	    }
	  }

	  return BasicAuthPrompt;
	};

	basicauth = factory();
	return basicauth;
}

var boolean;
var hasRequiredBoolean;

function requireBoolean () {
	if (hasRequiredBoolean) return boolean;
	hasRequiredBoolean = 1;

	const Prompt = requirePrompt();
	const { isPrimitive, hasColor } = utils$2;

	class BooleanPrompt extends Prompt {
	  constructor(options) {
	    super(options);
	    this.cursorHide();
	  }

	  async initialize() {
	    let initial = await this.resolve(this.initial, this.state);
	    this.input = await this.cast(initial);
	    await super.initialize();
	  }

	  dispatch(ch) {
	    if (!this.isValue(ch)) return this.alert();
	    this.input = ch;
	    return this.submit();
	  }

	  format(value) {
	    let { styles, state } = this;
	    return !state.submitted ? styles.primary(value) : styles.success(value);
	  }

	  cast(input) {
	    return this.isTrue(input);
	  }

	  isTrue(input) {
	    return /^[ty1]/i.test(input);
	  }

	  isFalse(input) {
	    return /^[fn0]/i.test(input);
	  }

	  isValue(value) {
	    return isPrimitive(value) && (this.isTrue(value) || this.isFalse(value));
	  }

	  async hint() {
	    if (this.state.status === 'pending') {
	      let hint = await this.element('hint');
	      if (!hasColor(hint)) {
	        return this.styles.muted(hint);
	      }
	      return hint;
	    }
	  }

	  async render() {
	    let { input, size } = this.state;

	    let prefix = await this.prefix();
	    let sep = await this.separator();
	    let msg = await this.message();
	    let hint = this.styles.muted(this.default);

	    let promptLine = [prefix, msg, hint, sep].filter(Boolean).join(' ');
	    this.state.prompt = promptLine;

	    let header = await this.header();
	    let value = this.value = this.cast(input);
	    let output = await this.format(value);
	    let help = (await this.error()) || (await this.hint());
	    let footer = await this.footer();

	    if (help && !promptLine.includes(help)) output += ' ' + help;
	    promptLine += ' ' + output;

	    this.clear(size);
	    this.write([header, promptLine, footer].filter(Boolean).join('\n'));
	    this.restore();
	  }

	  set value(value) {
	    super.value = value;
	  }
	  get value() {
	    return this.cast(super.value);
	  }
	}

	boolean = BooleanPrompt;
	return boolean;
}

var confirm;
var hasRequiredConfirm;

function requireConfirm () {
	if (hasRequiredConfirm) return confirm;
	hasRequiredConfirm = 1;

	const BooleanPrompt = requireBoolean();

	class ConfirmPrompt extends BooleanPrompt {
	  constructor(options) {
	    super(options);
	    this.default = this.options.default || (this.initial ? '(Y/n)' : '(y/N)');
	  }
	}

	confirm = ConfirmPrompt;
	return confirm;
}

var editable;
var hasRequiredEditable;

function requireEditable () {
	if (hasRequiredEditable) return editable;
	hasRequiredEditable = 1;

	const Select = requireSelect();
	const Form = requireForm();
	const form = Form.prototype;

	class Editable extends Select {
	  constructor(options) {
	    super({ ...options, multiple: true });
	    this.align = [this.options.align, 'left'].find(v => v != null);
	    this.emptyError = '';
	    this.values = {};
	  }

	  dispatch(char, key) {
	    let choice = this.focused;
	    let parent = choice.parent || {};
	    if (!choice.editable && !parent.editable) {
	      if (char === 'a' || char === 'i') return super[char]();
	    }
	    return form.dispatch.call(this, char, key);
	  }

	  append(char, key) {
	    return form.append.call(this, char, key);
	  }

	  delete(char, key) {
	    return form.delete.call(this, char, key);
	  }

	  space(char) {
	    return this.focused.editable ? this.append(char) : super.space();
	  }

	  number(char) {
	    return this.focused.editable ? this.append(char) : super.number(char);
	  }

	  next() {
	    return this.focused.editable ? form.next.call(this) : super.next();
	  }

	  prev() {
	    return this.focused.editable ? form.prev.call(this) : super.prev();
	  }

	  async indicator(choice, i) {
	    let symbol = choice.indicator || '';
	    let value = choice.editable ? symbol : super.indicator(choice, i);
	    return await this.resolve(value, this.state, choice, i) || '';
	  }

	  indent(choice) {
	    return choice.role === 'heading' ? '' : (choice.editable ? ' ' : '  ');
	  }

	  async renderChoice(choice, i) {
	    choice.indent = '';
	    if (choice.editable) return form.renderChoice.call(this, choice, i);
	    return super.renderChoice(choice, i);
	  }

	  error() {
	    return '';
	  }

	  footer() {
	    return this.state.error;
	  }

	  async validate() {
	    let result = true;

	    for (let choice of this.choices) {
	      if (typeof choice.validate !== 'function') {
	        continue;
	      }

	      if (choice.role === 'heading') {
	        continue;
	      }

	      let val = choice.parent ? this.value[choice.parent.name] : this.value;

	      if (choice.editable) {
	        val = choice.value === choice.name ? choice.initial || '' : choice.value;
	      } else if (!this.isDisabled(choice)) {
	        val = choice.enabled === true;
	      }

	      result = await choice.validate(val, this.state);

	      if (result !== true) {
	        break;
	      }
	    }

	    if (result !== true) {
	      this.state.error = typeof result === 'string' ? result : 'Invalid Input';
	    }

	    return result;
	  }

	  submit() {
	    if (this.focused.newChoice === true) return super.submit();
	    if (this.choices.some(ch => ch.newChoice)) {
	      return this.alert();
	    }

	    this.value = {};

	    for (let choice of this.choices) {
	      let val = choice.parent ? this.value[choice.parent.name] : this.value;

	      if (choice.role === 'heading') {
	        this.value[choice.name] = {};
	        continue;
	      }

	      if (choice.editable) {
	        val[choice.name] = choice.value === choice.name
	          ? (choice.initial || '')
	          : choice.value;

	      } else if (!this.isDisabled(choice)) {
	        val[choice.name] = choice.enabled === true;
	      }
	    }

	    return this.base.submit.call(this);
	  }
	}

	editable = Editable;
	return editable;
}

var string;
var hasRequiredString;

function requireString () {
	if (hasRequiredString) return string;
	hasRequiredString = 1;

	const Prompt = requirePrompt();
	const placeholder = requirePlaceholder();
	const { isPrimitive } = utils$2;

	class StringPrompt extends Prompt {
	  constructor(options) {
	    super(options);
	    this.initial = isPrimitive(this.initial) ? String(this.initial) : '';
	    if (this.initial) this.cursorHide();
	    this.state.prevCursor = 0;
	    this.state.clipboard = [];
	  }

	  async keypress(input, key = {}) {
	    let prev = this.state.prevKeypress;
	    this.state.prevKeypress = key;
	    if (this.options.multiline === true && key.name === 'return') {
	      if (!prev || prev.name !== 'return') {
	        return this.append('\n', key);
	      }
	    }
	    return super.keypress(input, key);
	  }

	  moveCursor(n) {
	    this.cursor += n;
	  }

	  reset() {
	    this.input = this.value = '';
	    this.cursor = 0;
	    return this.render();
	  }

	  dispatch(ch, key) {
	    if (!ch || key.ctrl || key.code) return this.alert();
	    this.append(ch);
	  }

	  append(ch) {
	    let { cursor, input } = this.state;
	    this.input = `${input}`.slice(0, cursor) + ch + `${input}`.slice(cursor);
	    this.moveCursor(String(ch).length);
	    this.render();
	  }

	  insert(str) {
	    this.append(str);
	  }

	  delete() {
	    let { cursor, input } = this.state;
	    if (cursor <= 0) return this.alert();
	    this.input = `${input}`.slice(0, cursor - 1) + `${input}`.slice(cursor);
	    this.moveCursor(-1);
	    this.render();
	  }

	  deleteForward() {
	    let { cursor, input } = this.state;
	    if (input[cursor] === void 0) return this.alert();
	    this.input = `${input}`.slice(0, cursor) + `${input}`.slice(cursor + 1);
	    this.render();
	  }

	  cutForward() {
	    let pos = this.cursor;
	    if (this.input.length <= pos) return this.alert();
	    this.state.clipboard.push(this.input.slice(pos));
	    this.input = this.input.slice(0, pos);
	    this.render();
	  }

	  cutLeft() {
	    let pos = this.cursor;
	    if (pos === 0) return this.alert();
	    let before = this.input.slice(0, pos);
	    let after = this.input.slice(pos);
	    let words = before.split(' ');
	    this.state.clipboard.push(words.pop());
	    this.input = words.join(' ');
	    this.cursor = this.input.length;
	    this.input += after;
	    this.render();
	  }

	  paste() {
	    if (!this.state.clipboard.length) return this.alert();
	    this.insert(this.state.clipboard.pop());
	    this.render();
	  }

	  toggleCursor() {
	    if (this.state.prevCursor) {
	      this.cursor = this.state.prevCursor;
	      this.state.prevCursor = 0;
	    } else {
	      this.state.prevCursor = this.cursor;
	      this.cursor = 0;
	    }
	    this.render();
	  }

	  first() {
	    this.cursor = 0;
	    this.render();
	  }

	  last() {
	    this.cursor = this.input.length - 1;
	    this.render();
	  }

	  next() {
	    let init = this.initial != null ? String(this.initial) : '';
	    if (!init || !init.startsWith(this.input)) return this.alert();
	    this.input = this.initial;
	    this.cursor = this.initial.length;
	    this.render();
	  }

	  prev() {
	    if (!this.input) return this.alert();
	    this.reset();
	  }

	  backward() {
	    return this.left();
	  }

	  forward() {
	    return this.right();
	  }

	  right() {
	    if (this.cursor >= this.input.length) return this.alert();
	    this.moveCursor(1);
	    return this.render();
	  }

	  left() {
	    if (this.cursor <= 0) return this.alert();
	    this.moveCursor(-1);
	    return this.render();
	  }

	  isValue(value) {
	    return !!value;
	  }

	  async format(input = this.value) {
	    let initial = await this.resolve(this.initial, this.state);
	    if (!this.state.submitted) {
	      return placeholder(this, { input, initial, pos: this.cursor });
	    }
	    return this.styles.submitted(input || initial);
	  }

	  async render() {
	    let size = this.state.size;

	    let prefix = await this.prefix();
	    let separator = await this.separator();
	    let message = await this.message();

	    let prompt = [prefix, message, separator].filter(Boolean).join(' ');
	    this.state.prompt = prompt;

	    let header = await this.header();
	    let output = await this.format();
	    let help = (await this.error()) || (await this.hint());
	    let footer = await this.footer();

	    if (help && !output.includes(help)) output += ' ' + help;
	    prompt += ' ' + output;

	    this.clear(size);
	    this.write([header, prompt, footer].filter(Boolean).join('\n'));
	    this.restore();
	  }
	}

	string = StringPrompt;
	return string;
}

var completer;
var hasRequiredCompleter;

function requireCompleter () {
	if (hasRequiredCompleter) return completer;
	hasRequiredCompleter = 1;

	const unique = arr => arr.filter((v, i) => arr.lastIndexOf(v) === i);
	const compact = arr => unique(arr).filter(Boolean);

	completer = (action, data = {}, value = '') => {
	  let { past = [], present = '' } = data;
	  let rest, prev;

	  switch (action) {
	    case 'prev':
	    case 'undo':
	      rest = past.slice(0, past.length - 1);
	      prev = past[past.length - 1] || '';
	      return {
	        past: compact([value, ...rest]),
	        present: prev
	      };

	    case 'next':
	    case 'redo':
	      rest = past.slice(1);
	      prev = past[0] || '';
	      return {
	        past: compact([...rest, value]),
	        present: prev
	      };

	    case 'save':
	      return {
	        past: compact([...past, value]),
	        present: ''
	      };

	    case 'remove':
	      prev = compact(past.filter(v => v !== value));
	      present = '';

	      if (prev.length) {
	        present = prev.pop();
	      }

	      return {
	        past: prev,
	        present
	      };

	    default: {
	      throw new Error(`Invalid action: "${action}"`);
	    }
	  }
	};
	return completer;
}

var input;
var hasRequiredInput;

function requireInput () {
	if (hasRequiredInput) return input;
	hasRequiredInput = 1;

	const Prompt = requireString();
	const completer = requireCompleter();

	class Input extends Prompt {
	  constructor(options) {
	    super(options);
	    let history = this.options.history;
	    if (history && history.store) {
	      let initial = history.values || this.initial;
	      this.autosave = !!history.autosave;
	      this.store = history.store;
	      this.data = this.store.get('values') || { past: [], present: initial };
	      this.initial = this.data.present || this.data.past[this.data.past.length - 1];
	    }
	  }

	  completion(action) {
	    if (!this.store) return this.alert();
	    this.data = completer(action, this.data, this.input);
	    if (!this.data.present) return this.alert();
	    this.input = this.data.present;
	    this.cursor = this.input.length;
	    return this.render();
	  }

	  altUp() {
	    return this.completion('prev');
	  }

	  altDown() {
	    return this.completion('next');
	  }

	  prev() {
	    this.save();
	    return super.prev();
	  }

	  save() {
	    if (!this.store) return;
	    this.data = completer('save', this.data, this.input);
	    this.store.set('values', this.data);
	  }

	  submit() {
	    if (this.store && this.autosave === true) {
	      this.save();
	    }
	    return super.submit();
	  }
	}

	input = Input;
	return input;
}

var invisible;
var hasRequiredInvisible;

function requireInvisible () {
	if (hasRequiredInvisible) return invisible;
	hasRequiredInvisible = 1;

	const StringPrompt = requireString();

	class InvisiblePrompt extends StringPrompt {
	  format() {
	    return '';
	  }
	}

	invisible = InvisiblePrompt;
	return invisible;
}

var list;
var hasRequiredList;

function requireList () {
	if (hasRequiredList) return list;
	hasRequiredList = 1;

	const StringPrompt = requireString();

	class ListPrompt extends StringPrompt {
	  constructor(options = {}) {
	    super(options);
	    this.sep = this.options.separator || /, */;
	    this.initial = options.initial || '';
	  }

	  split(input = this.value) {
	    return input ? String(input).split(this.sep) : [];
	  }

	  format() {
	    let style = this.state.submitted ? this.styles.primary : val => val;
	    return this.list.map(style).join(', ');
	  }

	  async submit(value) {
	    let result = this.state.error || await this.validate(this.list, this.state);
	    if (result !== true) {
	      this.state.error = result;
	      return super.submit();
	    }
	    this.value = this.list;
	    return super.submit();
	  }

	  get list() {
	    return this.split();
	  }
	}

	list = ListPrompt;
	return list;
}

var multiselect;
var hasRequiredMultiselect;

function requireMultiselect () {
	if (hasRequiredMultiselect) return multiselect;
	hasRequiredMultiselect = 1;

	const Select = requireSelect();

	class MultiSelect extends Select {
	  constructor(options) {
	    super({ ...options, multiple: true });
	  }
	}

	multiselect = MultiSelect;
	return multiselect;
}

var numeral = {exports: {}};

var number;
var hasRequiredNumber;

function requireNumber () {
	if (hasRequiredNumber) return number;
	hasRequiredNumber = 1;

	const StringPrompt = requireString();

	class NumberPrompt extends StringPrompt {
	  constructor(options = {}) {
	    super({ style: 'number', ...options });
	    this.min = this.isValue(options.min) ? this.toNumber(options.min) : -Infinity;
	    this.max = this.isValue(options.max) ? this.toNumber(options.max) : Infinity;
	    this.delay = options.delay != null ? options.delay : 1000;
	    this.float = options.float !== false;
	    this.round = options.round === true || options.float === false;
	    this.major = options.major || 10;
	    this.minor = options.minor || 1;
	    this.initial = options.initial != null ? options.initial : '';
	    this.input = String(this.initial);
	    this.cursor = this.input.length;
	    this.cursorShow();
	  }

	  append(ch) {
	    if (!/[-+.]/.test(ch) || (ch === '.' && this.input.includes('.'))) {
	      return this.alert('invalid number');
	    }
	    return super.append(ch);
	  }

	  number(ch) {
	    return super.append(ch);
	  }

	  next() {
	    if (this.input && this.input !== this.initial) return this.alert();
	    if (!this.isValue(this.initial)) return this.alert();
	    this.input = this.initial;
	    this.cursor = String(this.initial).length;
	    return this.render();
	  }

	  up(number) {
	    let step = number || this.minor;
	    let num = this.toNumber(this.input);
	    if (num > this.max + step) return this.alert();
	    this.input = `${num + step}`;
	    return this.render();
	  }

	  down(number) {
	    let step = number || this.minor;
	    let num = this.toNumber(this.input);
	    if (num < this.min - step) return this.alert();
	    this.input = `${num - step}`;
	    return this.render();
	  }

	  shiftDown() {
	    return this.down(this.major);
	  }

	  shiftUp() {
	    return this.up(this.major);
	  }

	  format(input = this.input) {
	    if (typeof this.options.format === 'function') {
	      return this.options.format.call(this, input);
	    }
	    return this.styles.info(input);
	  }

	  toNumber(value = '') {
	    return this.float ? +value : Math.round(+value);
	  }

	  isValue(value) {
	    return /^[-+]?[0-9]+((\.)|(\.[0-9]+))?$/.test(value);
	  }

	  submit() {
	    let value = [this.input, this.initial].find(v => this.isValue(v));
	    this.value = this.toNumber(value || 0);
	    return super.submit();
	  }
	}

	number = NumberPrompt;
	return number;
}

var hasRequiredNumeral;

function requireNumeral () {
	if (hasRequiredNumeral) return numeral.exports;
	hasRequiredNumeral = 1;
	(function (module) {
		module.exports = requireNumber();
} (numeral));
	return numeral.exports;
}

var password;
var hasRequiredPassword;

function requirePassword () {
	if (hasRequiredPassword) return password;
	hasRequiredPassword = 1;

	const StringPrompt = requireString();

	class PasswordPrompt extends StringPrompt {
	  constructor(options) {
	    super(options);
	    this.cursorShow();
	  }

	  format(input = this.input) {
	    if (!this.keypressed) return '';
	    let color = this.state.submitted ? this.styles.primary : this.styles.muted;
	    return color(this.symbols.asterisk.repeat(input.length));
	  }
	}

	password = PasswordPrompt;
	return password;
}

var scale;
var hasRequiredScale;

function requireScale () {
	if (hasRequiredScale) return scale;
	hasRequiredScale = 1;

	const colors = ansiColors.exports;
	const ArrayPrompt = requireArray();
	const utils = utils$2;

	class LikertScale extends ArrayPrompt {
	  constructor(options = {}) {
	    super(options);
	    this.widths = [].concat(options.messageWidth || 50);
	    this.align = [].concat(options.align || 'left');
	    this.linebreak = options.linebreak || false;
	    this.edgeLength = options.edgeLength || 3;
	    this.newline = options.newline || '\n   ';
	    let start = options.startNumber || 1;
	    if (typeof this.scale === 'number') {
	      this.scaleKey = false;
	      this.scale = Array(this.scale).fill(0).map((v, i) => ({ name: i + start }));
	    }
	  }

	  async reset() {
	    this.tableized = false;
	    await super.reset();
	    return this.render();
	  }

	  tableize() {
	    if (this.tableized === true) return;
	    this.tableized = true;
	    let longest = 0;

	    for (let ch of this.choices) {
	      longest = Math.max(longest, ch.message.length);
	      ch.scaleIndex = ch.initial || 2;
	      ch.scale = [];

	      for (let i = 0; i < this.scale.length; i++) {
	        ch.scale.push({ index: i });
	      }
	    }
	    this.widths[0] = Math.min(this.widths[0], longest + 3);
	  }

	  async dispatch(s, key) {
	    if (this.multiple) {
	      return this[key.name] ? await this[key.name](s, key) : await super.dispatch(s, key);
	    }
	    this.alert();
	  }

	  heading(msg, item, i) {
	    return this.styles.strong(msg);
	  }

	  separator() {
	    return this.styles.muted(this.symbols.ellipsis);
	  }

	  right() {
	    let choice = this.focused;
	    if (choice.scaleIndex >= this.scale.length - 1) return this.alert();
	    choice.scaleIndex++;
	    return this.render();
	  }

	  left() {
	    let choice = this.focused;
	    if (choice.scaleIndex <= 0) return this.alert();
	    choice.scaleIndex--;
	    return this.render();
	  }

	  indent() {
	    return '';
	  }

	  format() {
	    if (this.state.submitted) {
	      let values = this.choices.map(ch => this.styles.info(ch.index));
	      return values.join(', ');
	    }
	    return '';
	  }

	  pointer() {
	    return '';
	  }

	  /**
	   * Render the scale "Key". Something like:
	   * @return {String}
	   */

	  renderScaleKey() {
	    if (this.scaleKey === false) return '';
	    if (this.state.submitted) return '';
	    let scale = this.scale.map(item => `   ${item.name} - ${item.message}`);
	    let key = ['', ...scale].map(item => this.styles.muted(item));
	    return key.join('\n');
	  }

	  /**
	   * Render the heading row for the scale.
	   * @return {String}
	   */

	  renderScaleHeading(max) {
	    let keys = this.scale.map(ele => ele.name);
	    if (typeof this.options.renderScaleHeading === 'function') {
	      keys = this.options.renderScaleHeading.call(this, max);
	    }
	    let diff = this.scaleLength - keys.join('').length;
	    let spacing = Math.round(diff / (keys.length - 1));
	    let names = keys.map(key => this.styles.strong(key));
	    let headings = names.join(' '.repeat(spacing));
	    let padding = ' '.repeat(this.widths[0]);
	    return this.margin[3] + padding + this.margin[1] + headings;
	  }

	  /**
	   * Render a scale indicator => ◯ or ◉ by default
	   */

	  scaleIndicator(choice, item, i) {
	    if (typeof this.options.scaleIndicator === 'function') {
	      return this.options.scaleIndicator.call(this, choice, item, i);
	    }
	    let enabled = choice.scaleIndex === item.index;
	    if (item.disabled) return this.styles.hint(this.symbols.radio.disabled);
	    if (enabled) return this.styles.success(this.symbols.radio.on);
	    return this.symbols.radio.off;
	  }

	  /**
	   * Render the actual scale => ◯────◯────◉────◯────◯
	   */

	  renderScale(choice, i) {
	    let scale = choice.scale.map(item => this.scaleIndicator(choice, item, i));
	    let padding = this.term === 'Hyper' ? '' : ' ';
	    return scale.join(padding + this.symbols.line.repeat(this.edgeLength));
	  }

	  /**
	   * Render a choice, including scale =>
	   *   "The website is easy to navigate. ◯───◯───◉───◯───◯"
	   */

	  async renderChoice(choice, i) {
	    await this.onChoice(choice, i);

	    let focused = this.index === i;
	    let pointer = await this.pointer(choice, i);
	    let hint = await choice.hint;

	    if (hint && !utils.hasColor(hint)) {
	      hint = this.styles.muted(hint);
	    }

	    let pad = str => this.margin[3] + str.replace(/\s+$/, '').padEnd(this.widths[0], ' ');
	    let newline = this.newline;
	    let ind = this.indent(choice);
	    let message = await this.resolve(choice.message, this.state, choice, i);
	    let scale = await this.renderScale(choice, i);
	    let margin = this.margin[1] + this.margin[3];
	    this.scaleLength = colors.unstyle(scale).length;
	    this.widths[0] = Math.min(this.widths[0], this.width - this.scaleLength - margin.length);
	    let msg = utils.wordWrap(message, { width: this.widths[0], newline });
	    let lines = msg.split('\n').map(line => pad(line) + this.margin[1]);

	    if (focused) {
	      scale = this.styles.info(scale);
	      lines = lines.map(line => this.styles.info(line));
	    }

	    lines[0] += scale;

	    if (this.linebreak) lines.push('');
	    return [ind + pointer, lines.join('\n')].filter(Boolean);
	  }

	  async renderChoices() {
	    if (this.state.submitted) return '';
	    this.tableize();
	    let choices = this.visible.map(async(ch, i) => await this.renderChoice(ch, i));
	    let visible = await Promise.all(choices);
	    let heading = await this.renderScaleHeading();
	    return this.margin[0] + [heading, ...visible.map(v => v.join(' '))].join('\n');
	  }

	  async render() {
	    let { submitted, size } = this.state;

	    let prefix = await this.prefix();
	    let separator = await this.separator();
	    let message = await this.message();

	    let prompt = '';
	    if (this.options.promptLine !== false) {
	      prompt = [prefix, message, separator, ''].join(' ');
	      this.state.prompt = prompt;
	    }

	    let header = await this.header();
	    let output = await this.format();
	    let key = await this.renderScaleKey();
	    let help = await this.error() || await this.hint();
	    let body = await this.renderChoices();
	    let footer = await this.footer();
	    let err = this.emptyError;

	    if (output) prompt += output;
	    if (help && !prompt.includes(help)) prompt += ' ' + help;

	    if (submitted && !output && !body.trim() && this.multiple && err != null) {
	      prompt += this.styles.danger(err);
	    }

	    this.clear(size);
	    this.write([header, prompt, key, body, footer].filter(Boolean).join('\n'));
	    if (!this.state.submitted) {
	      this.write(this.margin[2]);
	    }
	    this.restore();
	  }

	  submit() {
	    this.value = {};
	    for (let choice of this.choices) {
	      this.value[choice.name] = choice.scaleIndex;
	    }
	    return this.base.submit.call(this);
	  }
	}

	scale = LikertScale;
	return scale;
}

var interpolate$1;
var hasRequiredInterpolate;

function requireInterpolate () {
	if (hasRequiredInterpolate) return interpolate$1;
	hasRequiredInterpolate = 1;

	const colors = ansiColors.exports;
	const clean = (str = '') => {
	  return typeof str === 'string' ? str.replace(/^['"]|['"]$/g, '') : '';
	};

	/**
	 * This file contains the interpolation and rendering logic for
	 * the Snippet prompt.
	 */

	class Item {
	  constructor(token) {
	    this.name = token.key;
	    this.field = token.field || {};
	    this.value = clean(token.initial || this.field.initial || '');
	    this.message = token.message || this.name;
	    this.cursor = 0;
	    this.input = '';
	    this.lines = [];
	  }
	}

	const tokenize = async(options = {}, defaults = {}, fn = token => token) => {
	  let unique = new Set();
	  let fields = options.fields || [];
	  let input = options.template;
	  let tabstops = [];
	  let items = [];
	  let keys = [];
	  let line = 1;

	  if (typeof input === 'function') {
	    input = await input();
	  }

	  let i = -1;
	  let next = () => input[++i];
	  let peek = () => input[i + 1];
	  let push = token => {
	    token.line = line;
	    tabstops.push(token);
	  };

	  push({ type: 'bos', value: '' });

	  while (i < input.length - 1) {
	    let value = next();

	    if (/^[^\S\n ]$/.test(value)) {
	      push({ type: 'text', value });
	      continue;
	    }

	    if (value === '\n') {
	      push({ type: 'newline', value });
	      line++;
	      continue;
	    }

	    if (value === '\\') {
	      value += next();
	      push({ type: 'text', value });
	      continue;
	    }

	    if ((value === '$' || value === '#' || value === '{') && peek() === '{') {
	      let n = next();
	      value += n;

	      let token = { type: 'template', open: value, inner: '', close: '', value };
	      let ch;

	      while ((ch = next())) {
	        if (ch === '}') {
	          if (peek() === '}') ch += next();
	          token.value += ch;
	          token.close = ch;
	          break;
	        }

	        if (ch === ':') {
	          token.initial = '';
	          token.key = token.inner;
	        } else if (token.initial !== void 0) {
	          token.initial += ch;
	        }

	        token.value += ch;
	        token.inner += ch;
	      }

	      token.template = token.open + (token.initial || token.inner) + token.close;
	      token.key = token.key || token.inner;

	      if (defaults.hasOwnProperty(token.key)) {
	        token.initial = defaults[token.key];
	      }

	      token = fn(token);
	      push(token);

	      keys.push(token.key);
	      unique.add(token.key);

	      let item = items.find(item => item.name === token.key);
	      token.field = fields.find(ch => ch.name === token.key);

	      if (!item) {
	        item = new Item(token);
	        items.push(item);
	      }

	      item.lines.push(token.line - 1);
	      continue;
	    }

	    let last = tabstops[tabstops.length - 1];
	    if (last.type === 'text' && last.line === line) {
	      last.value += value;
	    } else {
	      push({ type: 'text', value });
	    }
	  }

	  push({ type: 'eos', value: '' });
	  return { input, tabstops, unique, keys, items };
	};

	interpolate$1 = async prompt => {
	  let options = prompt.options;
	  let required = new Set(options.required === true ? [] : (options.required || []));
	  let defaults = { ...options.values, ...options.initial };
	  let { tabstops, items, keys } = await tokenize(options, defaults);

	  let result = createFn('result', prompt);
	  let format = createFn('format', prompt);
	  let isValid = createFn('validate', prompt, options, true);
	  let isVal = prompt.isValue.bind(prompt);

	  return async(state = {}, submitted = false) => {
	    let index = 0;

	    state.required = required;
	    state.items = items;
	    state.keys = keys;
	    state.output = '';

	    let validate = async(value, state, item, index) => {
	      let error = await isValid(value, state, item, index);
	      if (error === false) {
	        return 'Invalid field ' + item.name;
	      }
	      return error;
	    };

	    for (let token of tabstops) {
	      let value = token.value;
	      let key = token.key;

	      if (token.type !== 'template') {
	        if (value) state.output += value;
	        continue;
	      }

	      if (token.type === 'template') {
	        let item = items.find(ch => ch.name === key);

	        if (options.required === true) {
	          state.required.add(item.name);
	        }

	        let val = [item.input, state.values[item.value], item.value, value].find(isVal);
	        let field = item.field || {};
	        let message = field.message || token.inner;

	        if (submitted) {
	          let error = await validate(state.values[key], state, item, index);
	          if ((error && typeof error === 'string') || error === false) {
	            state.invalid.set(key, error);
	            continue;
	          }

	          state.invalid.delete(key);
	          let res = await result(state.values[key], state, item, index);
	          state.output += colors.unstyle(res);
	          continue;
	        }

	        item.placeholder = false;

	        let before = value;
	        value = await format(value, state, item, index);

	        if (val !== value) {
	          state.values[key] = val;
	          value = prompt.styles.typing(val);
	          state.missing.delete(message);

	        } else {
	          state.values[key] = void 0;
	          val = `<${message}>`;
	          value = prompt.styles.primary(val);
	          item.placeholder = true;

	          if (state.required.has(key)) {
	            state.missing.add(message);
	          }
	        }

	        if (state.missing.has(message) && state.validating) {
	          value = prompt.styles.warning(val);
	        }

	        if (state.invalid.has(key) && state.validating) {
	          value = prompt.styles.danger(val);
	        }

	        if (index === state.index) {
	          if (before !== value) {
	            value = prompt.styles.underline(value);
	          } else {
	            value = prompt.styles.heading(colors.unstyle(value));
	          }
	        }

	        index++;
	      }

	      if (value) {
	        state.output += value;
	      }
	    }

	    let lines = state.output.split('\n').map(l => ' ' + l);
	    let len = items.length;
	    let done = 0;

	    for (let item of items) {
	      if (state.invalid.has(item.name)) {
	        item.lines.forEach(i => {
	          if (lines[i][0] !== ' ') return;
	          lines[i] = state.styles.danger(state.symbols.bullet) + lines[i].slice(1);
	        });
	      }

	      if (prompt.isValue(state.values[item.name])) {
	        done++;
	      }
	    }

	    state.completed = ((done / len) * 100).toFixed(0);
	    state.output = lines.join('\n');
	    return state.output;
	  };
	};

	function createFn(prop, prompt, options, fallback) {
	  return (value, state, item, index) => {
	    if (typeof item.field[prop] === 'function') {
	      return item.field[prop].call(prompt, value, state, item, index);
	    }
	    return [fallback, value].find(v => prompt.isValue(v));
	  };
	}
	return interpolate$1;
}

var snippet;
var hasRequiredSnippet;

function requireSnippet () {
	if (hasRequiredSnippet) return snippet;
	hasRequiredSnippet = 1;

	const colors = ansiColors.exports;
	const interpolate = requireInterpolate();
	const Prompt = requirePrompt();

	class SnippetPrompt extends Prompt {
	  constructor(options) {
	    super(options);
	    this.cursorHide();
	    this.reset(true);
	  }

	  async initialize() {
	    this.interpolate = await interpolate(this);
	    await super.initialize();
	  }

	  async reset(first) {
	    this.state.keys = [];
	    this.state.invalid = new Map();
	    this.state.missing = new Set();
	    this.state.completed = 0;
	    this.state.values = {};

	    if (first !== true) {
	      await this.initialize();
	      await this.render();
	    }
	  }

	  moveCursor(n) {
	    let item = this.getItem();
	    this.cursor += n;
	    item.cursor += n;
	  }

	  dispatch(ch, key) {
	    if (!key.code && !key.ctrl && ch != null && this.getItem()) {
	      this.append(ch, key);
	      return;
	    }
	    this.alert();
	  }

	  append(ch, key) {
	    let item = this.getItem();
	    let prefix = item.input.slice(0, this.cursor);
	    let suffix = item.input.slice(this.cursor);
	    this.input = item.input = `${prefix}${ch}${suffix}`;
	    this.moveCursor(1);
	    this.render();
	  }

	  delete() {
	    let item = this.getItem();
	    if (this.cursor <= 0 || !item.input) return this.alert();
	    let suffix = item.input.slice(this.cursor);
	    let prefix = item.input.slice(0, this.cursor - 1);
	    this.input = item.input = `${prefix}${suffix}`;
	    this.moveCursor(-1);
	    this.render();
	  }

	  increment(i) {
	    return i >= this.state.keys.length - 1 ? 0 : i + 1;
	  }

	  decrement(i) {
	    return i <= 0 ? this.state.keys.length - 1 : i - 1;
	  }

	  first() {
	    this.state.index = 0;
	    this.render();
	  }

	  last() {
	    this.state.index = this.state.keys.length - 1;
	    this.render();
	  }

	  right() {
	    if (this.cursor >= this.input.length) return this.alert();
	    this.moveCursor(1);
	    this.render();
	  }

	  left() {
	    if (this.cursor <= 0) return this.alert();
	    this.moveCursor(-1);
	    this.render();
	  }

	  prev() {
	    this.state.index = this.decrement(this.state.index);
	    this.getItem();
	    this.render();
	  }

	  next() {
	    this.state.index = this.increment(this.state.index);
	    this.getItem();
	    this.render();
	  }

	  up() {
	    this.prev();
	  }

	  down() {
	    this.next();
	  }

	  format(value) {
	    let color = this.state.completed < 100 ? this.styles.warning : this.styles.success;
	    if (this.state.submitted === true && this.state.completed !== 100) {
	      color = this.styles.danger;
	    }
	    return color(`${this.state.completed}% completed`);
	  }

	  async render() {
	    let { index, keys = [], submitted, size } = this.state;

	    let newline = [this.options.newline, '\n'].find(v => v != null);
	    let prefix = await this.prefix();
	    let separator = await this.separator();
	    let message = await this.message();

	    let prompt = [prefix, message, separator].filter(Boolean).join(' ');
	    this.state.prompt = prompt;

	    let header = await this.header();
	    let error = (await this.error()) || '';
	    let hint = (await this.hint()) || '';
	    let body = submitted ? '' : await this.interpolate(this.state);

	    let key = this.state.key = keys[index] || '';
	    let input = await this.format(key);
	    let footer = await this.footer();
	    if (input) prompt += ' ' + input;
	    if (hint && !input && this.state.completed === 0) prompt += ' ' + hint;

	    this.clear(size);
	    let lines = [header, prompt, body, footer, error.trim()];
	    this.write(lines.filter(Boolean).join(newline));
	    this.restore();
	  }

	  getItem(name) {
	    let { items, keys, index } = this.state;
	    let item = items.find(ch => ch.name === keys[index]);
	    if (item && item.input != null) {
	      this.input = item.input;
	      this.cursor = item.cursor;
	    }
	    return item;
	  }

	  async submit() {
	    if (typeof this.interpolate !== 'function') await this.initialize();
	    await this.interpolate(this.state, true);

	    let { invalid, missing, output, values } = this.state;
	    if (invalid.size) {
	      let err = '';
	      for (let [key, value] of invalid) err += `Invalid ${key}: ${value}\n`;
	      this.state.error = err;
	      return super.submit();
	    }

	    if (missing.size) {
	      this.state.error = 'Required: ' + [...missing.keys()].join(', ');
	      return super.submit();
	    }

	    let lines = colors.unstyle(output).split('\n');
	    let result = lines.map(v => v.slice(1)).join('\n');
	    this.value = { values, result };
	    return super.submit();
	  }
	}

	snippet = SnippetPrompt;
	return snippet;
}

var sort;
var hasRequiredSort;

function requireSort () {
	if (hasRequiredSort) return sort;
	hasRequiredSort = 1;

	const hint = '(Use <shift>+<up/down> to sort)';
	const Prompt = requireSelect();

	class Sort extends Prompt {
	  constructor(options) {
	    super({ ...options, reorder: false, sort: true, multiple: true });
	    this.state.hint = [this.options.hint, hint].find(this.isValue.bind(this));
	  }

	  indicator() {
	    return '';
	  }

	  async renderChoice(choice, i) {
	    let str = await super.renderChoice(choice, i);
	    let sym = this.symbols.identicalTo + ' ';
	    let pre = (this.index === i && this.sorting) ? this.styles.muted(sym) : '  ';
	    if (this.options.drag === false) pre = '';
	    if (this.options.numbered === true) {
	      return pre + `${i + 1} - ` + str;
	    }
	    return pre + str;
	  }

	  get selected() {
	    return this.choices;
	  }

	  submit() {
	    this.value = this.choices.map(choice => choice.value);
	    return super.submit();
	  }
	}

	sort = Sort;
	return sort;
}

var survey;
var hasRequiredSurvey;

function requireSurvey () {
	if (hasRequiredSurvey) return survey;
	hasRequiredSurvey = 1;

	const ArrayPrompt = requireArray();

	class Survey extends ArrayPrompt {
	  constructor(options = {}) {
	    super(options);
	    this.emptyError = options.emptyError || 'No items were selected';
	    this.term = process.env.TERM_PROGRAM;

	    if (!this.options.header) {
	      let header = ['', '4 - Strongly Agree', '3 - Agree', '2 - Neutral', '1 - Disagree', '0 - Strongly Disagree', ''];
	      header = header.map(ele => this.styles.muted(ele));
	      this.state.header = header.join('\n   ');
	    }
	  }

	  async toChoices(...args) {
	    if (this.createdScales) return false;
	    this.createdScales = true;
	    let choices = await super.toChoices(...args);
	    for (let choice of choices) {
	      choice.scale = createScale(5, this.options);
	      choice.scaleIdx = 2;
	    }
	    return choices;
	  }

	  dispatch() {
	    this.alert();
	  }

	  space() {
	    let choice = this.focused;
	    let ele = choice.scale[choice.scaleIdx];
	    let selected = ele.selected;
	    choice.scale.forEach(e => (e.selected = false));
	    ele.selected = !selected;
	    return this.render();
	  }

	  indicator() {
	    return '';
	  }

	  pointer() {
	    return '';
	  }

	  separator() {
	    return this.styles.muted(this.symbols.ellipsis);
	  }

	  right() {
	    let choice = this.focused;
	    if (choice.scaleIdx >= choice.scale.length - 1) return this.alert();
	    choice.scaleIdx++;
	    return this.render();
	  }

	  left() {
	    let choice = this.focused;
	    if (choice.scaleIdx <= 0) return this.alert();
	    choice.scaleIdx--;
	    return this.render();
	  }

	  indent() {
	    return '   ';
	  }

	  async renderChoice(item, i) {
	    await this.onChoice(item, i);
	    let focused = this.index === i;
	    let isHyper = this.term === 'Hyper';
	    let n = !isHyper ? 8 : 9;
	    let s = !isHyper ? ' ' : '';
	    let ln = this.symbols.line.repeat(n);
	    let sp = ' '.repeat(n + (isHyper ? 0 : 1));
	    let dot = enabled => (enabled ? this.styles.success('◉') : '◯') + s;

	    let num = i + 1 + '.';
	    let color = focused ? this.styles.heading : this.styles.noop;
	    let msg = await this.resolve(item.message, this.state, item, i);
	    let indent = this.indent(item);
	    let scale = indent + item.scale.map((e, i) => dot(i === item.scaleIdx)).join(ln);
	    let val = i => i === item.scaleIdx ? color(i) : i;
	    let next = indent + item.scale.map((e, i) => val(i)).join(sp);

	    let line = () => [num, msg].filter(Boolean).join(' ');
	    let lines = () => [line(), scale, next, ' '].filter(Boolean).join('\n');

	    if (focused) {
	      scale = this.styles.cyan(scale);
	      next = this.styles.cyan(next);
	    }

	    return lines();
	  }

	  async renderChoices() {
	    if (this.state.submitted) return '';
	    let choices = this.visible.map(async(ch, i) => await this.renderChoice(ch, i));
	    let visible = await Promise.all(choices);
	    if (!visible.length) visible.push(this.styles.danger('No matching choices'));
	    return visible.join('\n');
	  }

	  format() {
	    if (this.state.submitted) {
	      let values = this.choices.map(ch => this.styles.info(ch.scaleIdx));
	      return values.join(', ');
	    }
	    return '';
	  }

	  async render() {
	    let { submitted, size } = this.state;

	    let prefix = await this.prefix();
	    let separator = await this.separator();
	    let message = await this.message();

	    let prompt = [prefix, message, separator].filter(Boolean).join(' ');
	    this.state.prompt = prompt;

	    let header = await this.header();
	    let output = await this.format();
	    let help = await this.error() || await this.hint();
	    let body = await this.renderChoices();
	    let footer = await this.footer();

	    if (output || !help) prompt += ' ' + output;
	    if (help && !prompt.includes(help)) prompt += ' ' + help;

	    if (submitted && !output && !body && this.multiple && this.type !== 'form') {
	      prompt += this.styles.danger(this.emptyError);
	    }

	    this.clear(size);
	    this.write([prompt, header, body, footer].filter(Boolean).join('\n'));
	    this.restore();
	  }

	  submit() {
	    this.value = {};
	    for (let choice of this.choices) {
	      this.value[choice.name] = choice.scaleIdx;
	    }
	    return this.base.submit.call(this);
	  }
	}

	function createScale(n, options = {}) {
	  if (Array.isArray(options.scale)) {
	    return options.scale.map(ele => ({ ...ele }));
	  }
	  let scale = [];
	  for (let i = 1; i < n + 1; i++) scale.push({ i, selected: false });
	  return scale;
	}

	survey = Survey;
	return survey;
}

var text = {exports: {}};

var hasRequiredText;

function requireText () {
	if (hasRequiredText) return text.exports;
	hasRequiredText = 1;
	(function (module) {
		module.exports = requireInput();
} (text));
	return text.exports;
}

var toggle;
var hasRequiredToggle;

function requireToggle () {
	if (hasRequiredToggle) return toggle;
	hasRequiredToggle = 1;

	const BooleanPrompt = requireBoolean();

	class TogglePrompt extends BooleanPrompt {
	  async initialize() {
	    await super.initialize();
	    this.value = this.initial = !!this.options.initial;
	    this.disabled = this.options.disabled || 'no';
	    this.enabled = this.options.enabled || 'yes';
	    await this.render();
	  }

	  reset() {
	    this.value = this.initial;
	    this.render();
	  }

	  delete() {
	    this.alert();
	  }

	  toggle() {
	    this.value = !this.value;
	    this.render();
	  }

	  enable() {
	    if (this.value === true) return this.alert();
	    this.value = true;
	    this.render();
	  }
	  disable() {
	    if (this.value === false) return this.alert();
	    this.value = false;
	    this.render();
	  }

	  up() {
	    this.toggle();
	  }
	  down() {
	    this.toggle();
	  }
	  right() {
	    this.toggle();
	  }
	  left() {
	    this.toggle();
	  }
	  next() {
	    this.toggle();
	  }
	  prev() {
	    this.toggle();
	  }

	  dispatch(ch = '', key) {
	    switch (ch.toLowerCase()) {
	      case ' ':
	        return this.toggle();
	      case '1':
	      case 'y':
	      case 't':
	        return this.enable();
	      case '0':
	      case 'n':
	      case 'f':
	        return this.disable();
	      default: {
	        return this.alert();
	      }
	    }
	  }

	  format() {
	    let active = str => this.styles.primary.underline(str);
	    let value = [
	      this.value ? this.disabled : active(this.disabled),
	      this.value ? active(this.enabled) : this.enabled
	    ];
	    return value.join(this.styles.muted(' / '));
	  }

	  async render() {
	    let { size } = this.state;

	    let header = await this.header();
	    let prefix = await this.prefix();
	    let separator = await this.separator();
	    let message = await this.message();

	    let output = await this.format();
	    let help = (await this.error()) || (await this.hint());
	    let footer = await this.footer();

	    let prompt = [prefix, message, separator, output].join(' ');
	    this.state.prompt = prompt;

	    if (help && !prompt.includes(help)) prompt += ' ' + help;

	    this.clear(size);
	    this.write([header, prompt, footer].filter(Boolean).join('\n'));
	    this.write(this.margin[2]);
	    this.restore();
	  }
	}

	toggle = TogglePrompt;
	return toggle;
}

var quiz;
var hasRequiredQuiz;

function requireQuiz () {
	if (hasRequiredQuiz) return quiz;
	hasRequiredQuiz = 1;

	const SelectPrompt = requireSelect();

	class Quiz extends SelectPrompt {
	  constructor(options) {
	    super(options);
	    if (typeof this.options.correctChoice !== 'number' || this.options.correctChoice < 0) {
	      throw new Error('Please specify the index of the correct answer from the list of choices');
	    }
	  }

	  async toChoices(value, parent) {
	    let choices = await super.toChoices(value, parent);
	    if (choices.length < 2) {
	      throw new Error('Please give at least two choices to the user');
	    }
	    if (this.options.correctChoice > choices.length) {
	      throw new Error('Please specify the index of the correct answer from the list of choices');
	    }
	    return choices;
	  }

	  check(state) {
	    return state.index === this.options.correctChoice;
	  }

	  async result(selected) {
	    return {
	      selectedAnswer: selected,
	      correctAnswer: this.options.choices[this.options.correctChoice].value,
	      correct: await this.check(this.state)
	    };
	  }
	}

	quiz = Quiz;
	return quiz;
}

var hasRequiredPrompts;

function requirePrompts () {
	if (hasRequiredPrompts) return prompts$1;
	hasRequiredPrompts = 1;
	(function (exports) {

		const utils = utils$2;

		const define = (key, fn) => {
		  utils.defineExport(exports, key, fn);
		  utils.defineExport(exports, key.toLowerCase(), fn);
		};

		define('AutoComplete', () => requireAutocomplete());
		define('BasicAuth', () => requireBasicauth());
		define('Confirm', () => requireConfirm());
		define('Editable', () => requireEditable());
		define('Form', () => requireForm());
		define('Input', () => requireInput());
		define('Invisible', () => requireInvisible());
		define('List', () => requireList());
		define('MultiSelect', () => requireMultiselect());
		define('Numeral', () => requireNumeral());
		define('Password', () => requirePassword());
		define('Scale', () => requireScale());
		define('Select', () => requireSelect());
		define('Snippet', () => requireSnippet());
		define('Sort', () => requireSort());
		define('Survey', () => requireSurvey());
		define('Text', () => requireText());
		define('Toggle', () => requireToggle());
		define('Quiz', () => requireQuiz());
} (prompts$1));
	return prompts$1;
}

var types;
var hasRequiredTypes;

function requireTypes () {
	if (hasRequiredTypes) return types;
	hasRequiredTypes = 1;
	types = {
	  ArrayPrompt: requireArray(),
	  AuthPrompt: requireAuth(),
	  BooleanPrompt: requireBoolean(),
	  NumberPrompt: requireNumber(),
	  StringPrompt: requireString()
	};
	return types;
}

const assert = require$$0__default$4["default"];
const Events = require$$0__default["default"];
const utils$1 = utils$2;

/**
 * Create an instance of `Enquirer`.
 *
 * ```js
 * const Enquirer = require('enquirer');
 * const enquirer = new Enquirer();
 * ```
 * @name Enquirer
 * @param {Object} `options` (optional) Options to use with all prompts.
 * @param {Object} `answers` (optional) Answers object to initialize with.
 * @api public
 */

class Enquirer extends Events {
  constructor(options, answers) {
    super();
    this.options = utils$1.merge({}, options);
    this.answers = { ...answers };
  }

  /**
   * Register a custom prompt type.
   *
   * ```js
   * const Enquirer = require('enquirer');
   * const enquirer = new Enquirer();
   * enquirer.register('customType', require('./custom-prompt'));
   * ```
   * @name register()
   * @param {String} `type`
   * @param {Function|Prompt} `fn` `Prompt` class, or a function that returns a `Prompt` class.
   * @return {Object} Returns the Enquirer instance
   * @api public
   */

  register(type, fn) {
    if (utils$1.isObject(type)) {
      for (let key of Object.keys(type)) this.register(key, type[key]);
      return this;
    }
    assert.equal(typeof fn, 'function', 'expected a function');
    let name = type.toLowerCase();
    if (fn.prototype instanceof this.Prompt) {
      this.prompts[name] = fn;
    } else {
      this.prompts[name] = fn(this.Prompt, this);
    }
    return this;
  }

  /**
   * Prompt function that takes a "question" object or array of question objects,
   * and returns an object with responses from the user.
   *
   * ```js
   * const Enquirer = require('enquirer');
   * const enquirer = new Enquirer();
   *
   * const response = await enquirer.prompt({
   *   type: 'input',
   *   name: 'username',
   *   message: 'What is your username?'
   * });
   * console.log(response);
   * ```
   * @name prompt()
   * @param {Array|Object} `questions` Options objects for one or more prompts to run.
   * @return {Promise} Promise that returns an "answers" object with the user's responses.
   * @api public
   */

  async prompt(questions = []) {
    for (let question of [].concat(questions)) {
      try {
        if (typeof question === 'function') question = await question.call(this);
        await this.ask(utils$1.merge({}, this.options, question));
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return this.answers;
  }

  async ask(question) {
    if (typeof question === 'function') {
      question = await question.call(this);
    }

    let opts = utils$1.merge({}, this.options, question);
    let { type, name } = question;
    let { set, get } = utils$1;

    if (typeof type === 'function') {
      type = await type.call(this, question, this.answers);
    }

    if (!type) return this.answers[name];

    assert(this.prompts[type], `Prompt "${type}" is not registered`);

    let prompt = new this.prompts[type](opts);
    let value = get(this.answers, name);

    prompt.state.answers = this.answers;
    prompt.enquirer = this;

    if (name) {
      prompt.on('submit', value => {
        this.emit('answer', name, value, prompt);
        set(this.answers, name, value);
      });
    }

    // bubble events
    let emit = prompt.emit.bind(prompt);
    prompt.emit = (...args) => {
      this.emit.call(this, ...args);
      return emit(...args);
    };

    this.emit('prompt', prompt, this);

    if (opts.autofill && value != null) {
      prompt.value = prompt.input = value;

      // if "autofill=show" render the prompt, otherwise stay "silent"
      if (opts.autofill === 'show') {
        await prompt.submit();
      }
    } else {
      value = prompt.value = await prompt.run();
    }

    return value;
  }

  /**
   * Use an enquirer plugin.
   *
   * ```js
   * const Enquirer = require('enquirer');
   * const enquirer = new Enquirer();
   * const plugin = enquirer => {
   *   // do stuff to enquire instance
   * };
   * enquirer.use(plugin);
   * ```
   * @name use()
   * @param {Function} `plugin` Plugin function that takes an instance of Enquirer.
   * @return {Object} Returns the Enquirer instance.
   * @api public
   */

  use(plugin) {
    plugin.call(this, this);
    return this;
  }

  set Prompt(value) {
    this._Prompt = value;
  }
  get Prompt() {
    return this._Prompt || this.constructor.Prompt;
  }

  get prompts() {
    return this.constructor.prompts;
  }

  static set Prompt(value) {
    this._Prompt = value;
  }
  static get Prompt() {
    return this._Prompt || requirePrompt();
  }

  static get prompts() {
    return requirePrompts();
  }

  static get types() {
    return requireTypes();
  }

  /**
   * Prompt function that takes a "question" object or array of question objects,
   * and returns an object with responses from the user.
   *
   * ```js
   * const { prompt } = require('enquirer');
   * const response = await prompt({
   *   type: 'input',
   *   name: 'username',
   *   message: 'What is your username?'
   * });
   * console.log(response);
   * ```
   * @name Enquirer#prompt
   * @param {Array|Object} `questions` Options objects for one or more prompts to run.
   * @return {Promise} Promise that returns an "answers" object with the user's responses.
   * @api public
   */

  static get prompt() {
    const fn = (questions, ...rest) => {
      let enquirer = new this(...rest);
      let emit = enquirer.emit.bind(enquirer);
      enquirer.emit = (...args) => {
        fn.emit(...args);
        return emit(...args);
      };
      return enquirer.prompt(questions);
    };
    utils$1.mixinEmitter(fn, new Events());
    return fn;
  }
}

utils$1.mixinEmitter(Enquirer, new Events());
const prompts = Enquirer.prompts;

for (let name of Object.keys(prompts)) {
  let key = name.toLowerCase();

  let run = options => new prompts[name](options).run();
  Enquirer.prompt[key] = run;
  Enquirer[key] = run;

  if (!Enquirer[name]) {
    Reflect.defineProperty(Enquirer, name, { get: () => prompts[name] });
  }
}

const exp = name => {
  utils$1.defineExport(Enquirer, name, () => Enquirer.types[name]);
};

exp('ArrayPrompt');
exp('AuthPrompt');
exp('BooleanPrompt');
exp('NumberPrompt');
exp('StringPrompt');

var enquirer = Enquirer;

var utils = {};

const path$1 = require$$2__default["default"];

const getAbsoutePath$3 = (dirname,pathName) => {
  return path$1.join(dirname, pathName)
};
utils.getAbsoutePath = getAbsoutePath$3;

/*
生成Vue SFC
*/

const fs$2 = require$$0__default$1["default"];
const chalk$3 = source;
const { Confirm, Input, Select } = enquirer;
const { getAbsoutePath: getAbsoutePath$2 } = utils;
const path = require$$2__default["default"];

const generateComs$1 = () => {
  // 生成在 components 文件夹下 还是当前目录下
  new Select({
    name: 'needUnderComs',
    message: '请选择生成位置([./components文件夹下] or [当前文件夹下])',
    choices: ['./components', './']
  })
    .run()
    .then((needUnderComs) => {
      needUnderComs = needUnderComs === './components';
      // 要生成在components 文件夹下
      if (needUnderComs) {
        // 没有 components 文件夹 先创建components文件夹
        if (!fs$2.existsSync(path.resolve('./components'))) {
          new Confirm({
            name: 'createComsFolder',
            message: '当前目录下不存在components文件夹，是否自动创建？'
          })
            .run()
            .then((createComsFolder) => {
              if (createComsFolder) {
                fs$2.mkdirSync(path.resolve('./components'));
                _createComs(true);
              } else {
                console.log(chalk$3.red('请手动创建components文件夹'));
              }
            }).catch((err) => {});
        } else {
          // 有 components 文件夹 直接创建
          _createComs(true);
        }
      } else {
        // 生成在当前目录下
        _createComs(false);
      }
    })
    .catch((err) => {});
};
/*
 @params{needUnderComs} Boolean   是否需要生成在 components 文件夹下
*/
function _createComs(needUnderComs = true) {
  new Input({
    name: 'SFCName',
    message: '请输入组件名字(请不要带文件后缀)',
    validate: (value) => {  // 校验
      if (!value) {
        return '请输入组件名字'
      }
      if (fs$2.existsSync(`${needUnderComs ? './components' : './'}/${value}.vue`)) {
        return '组件已经存在,请更换组件名字'
      }
      return true
    }
  })
    .run()
    .then((SFCName) => {
      if (!SFCName) return console.log(chalk$3.red('请输入组件名字'))
      new Select({
        name: 'SFCType',
        message: '请选择组件风格',
        choices: ['compostion-api', 'options-api']
      })
        .run()
        .then((SFCType) => {
          const type = SFCType === 'compostion-api' ? 'compostion' : 'options';
          try {
            fs$2.copyFileSync(
              getAbsoutePath$2(__dirname,`../template/components/vue-${type}.vue`),
              // `./src/template/vue-${type}.vue`,
              `${needUnderComs ? './components/' : './'}${SFCName}.vue`
            );
            console.log(chalk$3.green('组件生成成功'));
          } catch (error) {
            console.log(error);
            console.log(chalk$3.red('组件生成失败'));
          }

        }).catch((err) => {});
    }).catch((err) => {});
}
generateComs$2.generateComs = generateComs$1;

var generateConfig$2 = {};

/*
生成config文件
*/

const fs$1 = require$$0__default$1["default"];
const chalk$2 = source;
const { MultiSelect: MultiSelect$1 } = enquirer;
const { getAbsoutePath: getAbsoutePath$1 } = utils;

const generateConfig$1 = () => {
  new MultiSelect$1({
    name: 'configName',
    message: '请选择配置文件(可多选),文件会生成在当前目录下',
    choices: ['.prettierrc.js', 'vite.config.js'],
    validate: (value) =>{
      if(value.length === 0){
        return '至少选择一个(请使用空格键选择或取消)'
      }
      return true
    }
  })
    .run()
    .then((answers) => {
      answers.forEach((item) => {
        if (fs$1.existsSync(`./${item}`)) {
          console.log(chalk$2.red(`当前文件夹下已存在 ${item} 文件, 已跳过`));
        } else {
          try {
            fs$1.copyFileSync(getAbsoutePath$1(__dirname,`../template/config/${item}`), `./${item}`);
            console.log(chalk$2.green(`${item} 文件生成成功`));
          } catch (error) {
            console.log(chalk$2.red(`${item} 文件生成失败`));
            console.error(error.message);
          }
        }
      });
    });
};

generateConfig$2.generateConfig = generateConfig$1;

var generateTemp$2 = {};

/* 生成一些常用的模板组件 */

const fs = require$$0__default$1["default"];
const { getAbsoutePath } = utils;
const {MultiSelect} = enquirer;
const chalk$1 = source;
const generateTemp$1 = () => {
  //遍历 template下满 comsponents文件夹下的文件
  let temps = [];
  fs.readdirSync(getAbsoutePath(__dirname,'../template/common-temp')).forEach((item) => {
    console.log(item);
    temps.push(item);
  });
  new MultiSelect({
    name: 'tempName',
    message: '请选择模板组件',
    choices: temps,
  }).run().then((answers) => {
    answers.forEach((item) => {
      if(fs.existsSync(`./${item}`)){
        console.log(chalk$1.red(`当前文件夹下已存在 ${item} 文件,已跳过`));
      }else {
        fs.copyFileSync(getAbsoutePath(__dirname,`../template/common-temp/${item}`), `./${item}`);
        console.log(chalk$1.green(`${item} 文件生成成功`));
      }
    });
  }).catch(err =>{console.log(err);});
};
generateTemp$2.generateTemp = generateTemp$1;

var gradientString = {exports: {}};

var tinycolor$1 = {exports: {}};

(function (module, exports) {
	// This file is autogenerated. It's used to publish CJS to npm.
	(function (global, factory) {
	  module.exports = factory() ;
	})(commonjsGlobal, (function () {
	  function _typeof(obj) {
	    "@babel/helpers - typeof";

	    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
	      return typeof obj;
	    } : function (obj) {
	      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	    }, _typeof(obj);
	  }

	  // https://github.com/bgrins/TinyColor
	  // Brian Grinstead, MIT License

	  var trimLeft = /^\s+/;
	  var trimRight = /\s+$/;
	  function tinycolor(color, opts) {
	    color = color ? color : "";
	    opts = opts || {};

	    // If input is already a tinycolor, return itself
	    if (color instanceof tinycolor) {
	      return color;
	    }
	    // If we are called as a function, call using new instead
	    if (!(this instanceof tinycolor)) {
	      return new tinycolor(color, opts);
	    }
	    var rgb = inputToRGB(color);
	    this._originalInput = color, this._r = rgb.r, this._g = rgb.g, this._b = rgb.b, this._a = rgb.a, this._roundA = Math.round(100 * this._a) / 100, this._format = opts.format || rgb.format;
	    this._gradientType = opts.gradientType;

	    // Don't let the range of [0,255] come back in [0,1].
	    // Potentially lose a little bit of precision here, but will fix issues where
	    // .5 gets interpreted as half of the total, instead of half of 1
	    // If it was supposed to be 128, this was already taken care of by `inputToRgb`
	    if (this._r < 1) this._r = Math.round(this._r);
	    if (this._g < 1) this._g = Math.round(this._g);
	    if (this._b < 1) this._b = Math.round(this._b);
	    this._ok = rgb.ok;
	  }
	  tinycolor.prototype = {
	    isDark: function isDark() {
	      return this.getBrightness() < 128;
	    },
	    isLight: function isLight() {
	      return !this.isDark();
	    },
	    isValid: function isValid() {
	      return this._ok;
	    },
	    getOriginalInput: function getOriginalInput() {
	      return this._originalInput;
	    },
	    getFormat: function getFormat() {
	      return this._format;
	    },
	    getAlpha: function getAlpha() {
	      return this._a;
	    },
	    getBrightness: function getBrightness() {
	      //http://www.w3.org/TR/AERT#color-contrast
	      var rgb = this.toRgb();
	      return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
	    },
	    getLuminance: function getLuminance() {
	      //http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
	      var rgb = this.toRgb();
	      var RsRGB, GsRGB, BsRGB, R, G, B;
	      RsRGB = rgb.r / 255;
	      GsRGB = rgb.g / 255;
	      BsRGB = rgb.b / 255;
	      if (RsRGB <= 0.03928) R = RsRGB / 12.92;else R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
	      if (GsRGB <= 0.03928) G = GsRGB / 12.92;else G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
	      if (BsRGB <= 0.03928) B = BsRGB / 12.92;else B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
	      return 0.2126 * R + 0.7152 * G + 0.0722 * B;
	    },
	    setAlpha: function setAlpha(value) {
	      this._a = boundAlpha(value);
	      this._roundA = Math.round(100 * this._a) / 100;
	      return this;
	    },
	    toHsv: function toHsv() {
	      var hsv = rgbToHsv(this._r, this._g, this._b);
	      return {
	        h: hsv.h * 360,
	        s: hsv.s,
	        v: hsv.v,
	        a: this._a
	      };
	    },
	    toHsvString: function toHsvString() {
	      var hsv = rgbToHsv(this._r, this._g, this._b);
	      var h = Math.round(hsv.h * 360),
	        s = Math.round(hsv.s * 100),
	        v = Math.round(hsv.v * 100);
	      return this._a == 1 ? "hsv(" + h + ", " + s + "%, " + v + "%)" : "hsva(" + h + ", " + s + "%, " + v + "%, " + this._roundA + ")";
	    },
	    toHsl: function toHsl() {
	      var hsl = rgbToHsl(this._r, this._g, this._b);
	      return {
	        h: hsl.h * 360,
	        s: hsl.s,
	        l: hsl.l,
	        a: this._a
	      };
	    },
	    toHslString: function toHslString() {
	      var hsl = rgbToHsl(this._r, this._g, this._b);
	      var h = Math.round(hsl.h * 360),
	        s = Math.round(hsl.s * 100),
	        l = Math.round(hsl.l * 100);
	      return this._a == 1 ? "hsl(" + h + ", " + s + "%, " + l + "%)" : "hsla(" + h + ", " + s + "%, " + l + "%, " + this._roundA + ")";
	    },
	    toHex: function toHex(allow3Char) {
	      return rgbToHex(this._r, this._g, this._b, allow3Char);
	    },
	    toHexString: function toHexString(allow3Char) {
	      return "#" + this.toHex(allow3Char);
	    },
	    toHex8: function toHex8(allow4Char) {
	      return rgbaToHex(this._r, this._g, this._b, this._a, allow4Char);
	    },
	    toHex8String: function toHex8String(allow4Char) {
	      return "#" + this.toHex8(allow4Char);
	    },
	    toRgb: function toRgb() {
	      return {
	        r: Math.round(this._r),
	        g: Math.round(this._g),
	        b: Math.round(this._b),
	        a: this._a
	      };
	    },
	    toRgbString: function toRgbString() {
	      return this._a == 1 ? "rgb(" + Math.round(this._r) + ", " + Math.round(this._g) + ", " + Math.round(this._b) + ")" : "rgba(" + Math.round(this._r) + ", " + Math.round(this._g) + ", " + Math.round(this._b) + ", " + this._roundA + ")";
	    },
	    toPercentageRgb: function toPercentageRgb() {
	      return {
	        r: Math.round(bound01(this._r, 255) * 100) + "%",
	        g: Math.round(bound01(this._g, 255) * 100) + "%",
	        b: Math.round(bound01(this._b, 255) * 100) + "%",
	        a: this._a
	      };
	    },
	    toPercentageRgbString: function toPercentageRgbString() {
	      return this._a == 1 ? "rgb(" + Math.round(bound01(this._r, 255) * 100) + "%, " + Math.round(bound01(this._g, 255) * 100) + "%, " + Math.round(bound01(this._b, 255) * 100) + "%)" : "rgba(" + Math.round(bound01(this._r, 255) * 100) + "%, " + Math.round(bound01(this._g, 255) * 100) + "%, " + Math.round(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
	    },
	    toName: function toName() {
	      if (this._a === 0) {
	        return "transparent";
	      }
	      if (this._a < 1) {
	        return false;
	      }
	      return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
	    },
	    toFilter: function toFilter(secondColor) {
	      var hex8String = "#" + rgbaToArgbHex(this._r, this._g, this._b, this._a);
	      var secondHex8String = hex8String;
	      var gradientType = this._gradientType ? "GradientType = 1, " : "";
	      if (secondColor) {
	        var s = tinycolor(secondColor);
	        secondHex8String = "#" + rgbaToArgbHex(s._r, s._g, s._b, s._a);
	      }
	      return "progid:DXImageTransform.Microsoft.gradient(" + gradientType + "startColorstr=" + hex8String + ",endColorstr=" + secondHex8String + ")";
	    },
	    toString: function toString(format) {
	      var formatSet = !!format;
	      format = format || this._format;
	      var formattedString = false;
	      var hasAlpha = this._a < 1 && this._a >= 0;
	      var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "hex4" || format === "hex8" || format === "name");
	      if (needsAlphaFormat) {
	        // Special case for "transparent", all other non-alpha formats
	        // will return rgba when there is transparency.
	        if (format === "name" && this._a === 0) {
	          return this.toName();
	        }
	        return this.toRgbString();
	      }
	      if (format === "rgb") {
	        formattedString = this.toRgbString();
	      }
	      if (format === "prgb") {
	        formattedString = this.toPercentageRgbString();
	      }
	      if (format === "hex" || format === "hex6") {
	        formattedString = this.toHexString();
	      }
	      if (format === "hex3") {
	        formattedString = this.toHexString(true);
	      }
	      if (format === "hex4") {
	        formattedString = this.toHex8String(true);
	      }
	      if (format === "hex8") {
	        formattedString = this.toHex8String();
	      }
	      if (format === "name") {
	        formattedString = this.toName();
	      }
	      if (format === "hsl") {
	        formattedString = this.toHslString();
	      }
	      if (format === "hsv") {
	        formattedString = this.toHsvString();
	      }
	      return formattedString || this.toHexString();
	    },
	    clone: function clone() {
	      return tinycolor(this.toString());
	    },
	    _applyModification: function _applyModification(fn, args) {
	      var color = fn.apply(null, [this].concat([].slice.call(args)));
	      this._r = color._r;
	      this._g = color._g;
	      this._b = color._b;
	      this.setAlpha(color._a);
	      return this;
	    },
	    lighten: function lighten() {
	      return this._applyModification(_lighten, arguments);
	    },
	    brighten: function brighten() {
	      return this._applyModification(_brighten, arguments);
	    },
	    darken: function darken() {
	      return this._applyModification(_darken, arguments);
	    },
	    desaturate: function desaturate() {
	      return this._applyModification(_desaturate, arguments);
	    },
	    saturate: function saturate() {
	      return this._applyModification(_saturate, arguments);
	    },
	    greyscale: function greyscale() {
	      return this._applyModification(_greyscale, arguments);
	    },
	    spin: function spin() {
	      return this._applyModification(_spin, arguments);
	    },
	    _applyCombination: function _applyCombination(fn, args) {
	      return fn.apply(null, [this].concat([].slice.call(args)));
	    },
	    analogous: function analogous() {
	      return this._applyCombination(_analogous, arguments);
	    },
	    complement: function complement() {
	      return this._applyCombination(_complement, arguments);
	    },
	    monochromatic: function monochromatic() {
	      return this._applyCombination(_monochromatic, arguments);
	    },
	    splitcomplement: function splitcomplement() {
	      return this._applyCombination(_splitcomplement, arguments);
	    },
	    // Disabled until https://github.com/bgrins/TinyColor/issues/254
	    // polyad: function (number) {
	    //   return this._applyCombination(polyad, [number]);
	    // },
	    triad: function triad() {
	      return this._applyCombination(polyad, [3]);
	    },
	    tetrad: function tetrad() {
	      return this._applyCombination(polyad, [4]);
	    }
	  };

	  // If input is an object, force 1 into "1.0" to handle ratios properly
	  // String input requires "1.0" as input, so 1 will be treated as 1
	  tinycolor.fromRatio = function (color, opts) {
	    if (_typeof(color) == "object") {
	      var newColor = {};
	      for (var i in color) {
	        if (color.hasOwnProperty(i)) {
	          if (i === "a") {
	            newColor[i] = color[i];
	          } else {
	            newColor[i] = convertToPercentage(color[i]);
	          }
	        }
	      }
	      color = newColor;
	    }
	    return tinycolor(color, opts);
	  };

	  // Given a string or object, convert that input to RGB
	  // Possible string inputs:
	  //
	  //     "red"
	  //     "#f00" or "f00"
	  //     "#ff0000" or "ff0000"
	  //     "#ff000000" or "ff000000"
	  //     "rgb 255 0 0" or "rgb (255, 0, 0)"
	  //     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
	  //     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
	  //     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
	  //     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
	  //     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
	  //     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
	  //
	  function inputToRGB(color) {
	    var rgb = {
	      r: 0,
	      g: 0,
	      b: 0
	    };
	    var a = 1;
	    var s = null;
	    var v = null;
	    var l = null;
	    var ok = false;
	    var format = false;
	    if (typeof color == "string") {
	      color = stringInputToObject(color);
	    }
	    if (_typeof(color) == "object") {
	      if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
	        rgb = rgbToRgb(color.r, color.g, color.b);
	        ok = true;
	        format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
	      } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
	        s = convertToPercentage(color.s);
	        v = convertToPercentage(color.v);
	        rgb = hsvToRgb(color.h, s, v);
	        ok = true;
	        format = "hsv";
	      } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
	        s = convertToPercentage(color.s);
	        l = convertToPercentage(color.l);
	        rgb = hslToRgb(color.h, s, l);
	        ok = true;
	        format = "hsl";
	      }
	      if (color.hasOwnProperty("a")) {
	        a = color.a;
	      }
	    }
	    a = boundAlpha(a);
	    return {
	      ok: ok,
	      format: color.format || format,
	      r: Math.min(255, Math.max(rgb.r, 0)),
	      g: Math.min(255, Math.max(rgb.g, 0)),
	      b: Math.min(255, Math.max(rgb.b, 0)),
	      a: a
	    };
	  }

	  // Conversion Functions
	  // --------------------

	  // `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
	  // <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

	  // `rgbToRgb`
	  // Handle bounds / percentage checking to conform to CSS color spec
	  // <http://www.w3.org/TR/css3-color/>
	  // *Assumes:* r, g, b in [0, 255] or [0, 1]
	  // *Returns:* { r, g, b } in [0, 255]
	  function rgbToRgb(r, g, b) {
	    return {
	      r: bound01(r, 255) * 255,
	      g: bound01(g, 255) * 255,
	      b: bound01(b, 255) * 255
	    };
	  }

	  // `rgbToHsl`
	  // Converts an RGB color value to HSL.
	  // *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
	  // *Returns:* { h, s, l } in [0,1]
	  function rgbToHsl(r, g, b) {
	    r = bound01(r, 255);
	    g = bound01(g, 255);
	    b = bound01(b, 255);
	    var max = Math.max(r, g, b),
	      min = Math.min(r, g, b);
	    var h,
	      s,
	      l = (max + min) / 2;
	    if (max == min) {
	      h = s = 0; // achromatic
	    } else {
	      var d = max - min;
	      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
	      switch (max) {
	        case r:
	          h = (g - b) / d + (g < b ? 6 : 0);
	          break;
	        case g:
	          h = (b - r) / d + 2;
	          break;
	        case b:
	          h = (r - g) / d + 4;
	          break;
	      }
	      h /= 6;
	    }
	    return {
	      h: h,
	      s: s,
	      l: l
	    };
	  }

	  // `hslToRgb`
	  // Converts an HSL color value to RGB.
	  // *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
	  // *Returns:* { r, g, b } in the set [0, 255]
	  function hslToRgb(h, s, l) {
	    var r, g, b;
	    h = bound01(h, 360);
	    s = bound01(s, 100);
	    l = bound01(l, 100);
	    function hue2rgb(p, q, t) {
	      if (t < 0) t += 1;
	      if (t > 1) t -= 1;
	      if (t < 1 / 6) return p + (q - p) * 6 * t;
	      if (t < 1 / 2) return q;
	      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
	      return p;
	    }
	    if (s === 0) {
	      r = g = b = l; // achromatic
	    } else {
	      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
	      var p = 2 * l - q;
	      r = hue2rgb(p, q, h + 1 / 3);
	      g = hue2rgb(p, q, h);
	      b = hue2rgb(p, q, h - 1 / 3);
	    }
	    return {
	      r: r * 255,
	      g: g * 255,
	      b: b * 255
	    };
	  }

	  // `rgbToHsv`
	  // Converts an RGB color value to HSV
	  // *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
	  // *Returns:* { h, s, v } in [0,1]
	  function rgbToHsv(r, g, b) {
	    r = bound01(r, 255);
	    g = bound01(g, 255);
	    b = bound01(b, 255);
	    var max = Math.max(r, g, b),
	      min = Math.min(r, g, b);
	    var h,
	      s,
	      v = max;
	    var d = max - min;
	    s = max === 0 ? 0 : d / max;
	    if (max == min) {
	      h = 0; // achromatic
	    } else {
	      switch (max) {
	        case r:
	          h = (g - b) / d + (g < b ? 6 : 0);
	          break;
	        case g:
	          h = (b - r) / d + 2;
	          break;
	        case b:
	          h = (r - g) / d + 4;
	          break;
	      }
	      h /= 6;
	    }
	    return {
	      h: h,
	      s: s,
	      v: v
	    };
	  }

	  // `hsvToRgb`
	  // Converts an HSV color value to RGB.
	  // *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
	  // *Returns:* { r, g, b } in the set [0, 255]
	  function hsvToRgb(h, s, v) {
	    h = bound01(h, 360) * 6;
	    s = bound01(s, 100);
	    v = bound01(v, 100);
	    var i = Math.floor(h),
	      f = h - i,
	      p = v * (1 - s),
	      q = v * (1 - f * s),
	      t = v * (1 - (1 - f) * s),
	      mod = i % 6,
	      r = [v, q, p, p, t, v][mod],
	      g = [t, v, v, q, p, p][mod],
	      b = [p, p, t, v, v, q][mod];
	    return {
	      r: r * 255,
	      g: g * 255,
	      b: b * 255
	    };
	  }

	  // `rgbToHex`
	  // Converts an RGB color to hex
	  // Assumes r, g, and b are contained in the set [0, 255]
	  // Returns a 3 or 6 character hex
	  function rgbToHex(r, g, b, allow3Char) {
	    var hex = [pad2(Math.round(r).toString(16)), pad2(Math.round(g).toString(16)), pad2(Math.round(b).toString(16))];

	    // Return a 3 character hex if possible
	    if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
	      return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
	    }
	    return hex.join("");
	  }

	  // `rgbaToHex`
	  // Converts an RGBA color plus alpha transparency to hex
	  // Assumes r, g, b are contained in the set [0, 255] and
	  // a in [0, 1]. Returns a 4 or 8 character rgba hex
	  function rgbaToHex(r, g, b, a, allow4Char) {
	    var hex = [pad2(Math.round(r).toString(16)), pad2(Math.round(g).toString(16)), pad2(Math.round(b).toString(16)), pad2(convertDecimalToHex(a))];

	    // Return a 4 character hex if possible
	    if (allow4Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1)) {
	      return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
	    }
	    return hex.join("");
	  }

	  // `rgbaToArgbHex`
	  // Converts an RGBA color to an ARGB Hex8 string
	  // Rarely used, but required for "toFilter()"
	  function rgbaToArgbHex(r, g, b, a) {
	    var hex = [pad2(convertDecimalToHex(a)), pad2(Math.round(r).toString(16)), pad2(Math.round(g).toString(16)), pad2(Math.round(b).toString(16))];
	    return hex.join("");
	  }

	  // `equals`
	  // Can be called with any tinycolor input
	  tinycolor.equals = function (color1, color2) {
	    if (!color1 || !color2) return false;
	    return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
	  };
	  tinycolor.random = function () {
	    return tinycolor.fromRatio({
	      r: Math.random(),
	      g: Math.random(),
	      b: Math.random()
	    });
	  };

	  // Modification Functions
	  // ----------------------
	  // Thanks to less.js for some of the basics here
	  // <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

	  function _desaturate(color, amount) {
	    amount = amount === 0 ? 0 : amount || 10;
	    var hsl = tinycolor(color).toHsl();
	    hsl.s -= amount / 100;
	    hsl.s = clamp01(hsl.s);
	    return tinycolor(hsl);
	  }
	  function _saturate(color, amount) {
	    amount = amount === 0 ? 0 : amount || 10;
	    var hsl = tinycolor(color).toHsl();
	    hsl.s += amount / 100;
	    hsl.s = clamp01(hsl.s);
	    return tinycolor(hsl);
	  }
	  function _greyscale(color) {
	    return tinycolor(color).desaturate(100);
	  }
	  function _lighten(color, amount) {
	    amount = amount === 0 ? 0 : amount || 10;
	    var hsl = tinycolor(color).toHsl();
	    hsl.l += amount / 100;
	    hsl.l = clamp01(hsl.l);
	    return tinycolor(hsl);
	  }
	  function _brighten(color, amount) {
	    amount = amount === 0 ? 0 : amount || 10;
	    var rgb = tinycolor(color).toRgb();
	    rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
	    rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
	    rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
	    return tinycolor(rgb);
	  }
	  function _darken(color, amount) {
	    amount = amount === 0 ? 0 : amount || 10;
	    var hsl = tinycolor(color).toHsl();
	    hsl.l -= amount / 100;
	    hsl.l = clamp01(hsl.l);
	    return tinycolor(hsl);
	  }

	  // Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
	  // Values outside of this range will be wrapped into this range.
	  function _spin(color, amount) {
	    var hsl = tinycolor(color).toHsl();
	    var hue = (hsl.h + amount) % 360;
	    hsl.h = hue < 0 ? 360 + hue : hue;
	    return tinycolor(hsl);
	  }

	  // Combination Functions
	  // ---------------------
	  // Thanks to jQuery xColor for some of the ideas behind these
	  // <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

	  function _complement(color) {
	    var hsl = tinycolor(color).toHsl();
	    hsl.h = (hsl.h + 180) % 360;
	    return tinycolor(hsl);
	  }
	  function polyad(color, number) {
	    if (isNaN(number) || number <= 0) {
	      throw new Error("Argument to polyad must be a positive number");
	    }
	    var hsl = tinycolor(color).toHsl();
	    var result = [tinycolor(color)];
	    var step = 360 / number;
	    for (var i = 1; i < number; i++) {
	      result.push(tinycolor({
	        h: (hsl.h + i * step) % 360,
	        s: hsl.s,
	        l: hsl.l
	      }));
	    }
	    return result;
	  }
	  function _splitcomplement(color) {
	    var hsl = tinycolor(color).toHsl();
	    var h = hsl.h;
	    return [tinycolor(color), tinycolor({
	      h: (h + 72) % 360,
	      s: hsl.s,
	      l: hsl.l
	    }), tinycolor({
	      h: (h + 216) % 360,
	      s: hsl.s,
	      l: hsl.l
	    })];
	  }
	  function _analogous(color, results, slices) {
	    results = results || 6;
	    slices = slices || 30;
	    var hsl = tinycolor(color).toHsl();
	    var part = 360 / slices;
	    var ret = [tinycolor(color)];
	    for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results;) {
	      hsl.h = (hsl.h + part) % 360;
	      ret.push(tinycolor(hsl));
	    }
	    return ret;
	  }
	  function _monochromatic(color, results) {
	    results = results || 6;
	    var hsv = tinycolor(color).toHsv();
	    var h = hsv.h,
	      s = hsv.s,
	      v = hsv.v;
	    var ret = [];
	    var modification = 1 / results;
	    while (results--) {
	      ret.push(tinycolor({
	        h: h,
	        s: s,
	        v: v
	      }));
	      v = (v + modification) % 1;
	    }
	    return ret;
	  }

	  // Utility Functions
	  // ---------------------

	  tinycolor.mix = function (color1, color2, amount) {
	    amount = amount === 0 ? 0 : amount || 50;
	    var rgb1 = tinycolor(color1).toRgb();
	    var rgb2 = tinycolor(color2).toRgb();
	    var p = amount / 100;
	    var rgba = {
	      r: (rgb2.r - rgb1.r) * p + rgb1.r,
	      g: (rgb2.g - rgb1.g) * p + rgb1.g,
	      b: (rgb2.b - rgb1.b) * p + rgb1.b,
	      a: (rgb2.a - rgb1.a) * p + rgb1.a
	    };
	    return tinycolor(rgba);
	  };

	  // Readability Functions
	  // ---------------------
	  // <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)

	  // `contrast`
	  // Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
	  tinycolor.readability = function (color1, color2) {
	    var c1 = tinycolor(color1);
	    var c2 = tinycolor(color2);
	    return (Math.max(c1.getLuminance(), c2.getLuminance()) + 0.05) / (Math.min(c1.getLuminance(), c2.getLuminance()) + 0.05);
	  };

	  // `isReadable`
	  // Ensure that foreground and background color combinations meet WCAG2 guidelines.
	  // The third argument is an optional Object.
	  //      the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
	  //      the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
	  // If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.

	  // *Example*
	  //    tinycolor.isReadable("#000", "#111") => false
	  //    tinycolor.isReadable("#000", "#111",{level:"AA",size:"large"}) => false
	  tinycolor.isReadable = function (color1, color2, wcag2) {
	    var readability = tinycolor.readability(color1, color2);
	    var wcag2Parms, out;
	    out = false;
	    wcag2Parms = validateWCAG2Parms(wcag2);
	    switch (wcag2Parms.level + wcag2Parms.size) {
	      case "AAsmall":
	      case "AAAlarge":
	        out = readability >= 4.5;
	        break;
	      case "AAlarge":
	        out = readability >= 3;
	        break;
	      case "AAAsmall":
	        out = readability >= 7;
	        break;
	    }
	    return out;
	  };

	  // `mostReadable`
	  // Given a base color and a list of possible foreground or background
	  // colors for that base, returns the most readable color.
	  // Optionally returns Black or White if the most readable color is unreadable.
	  // *Example*
	  //    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
	  //    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
	  //    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"large"}).toHexString(); // "#faf3f3"
	  //    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"small"}).toHexString(); // "#ffffff"
	  tinycolor.mostReadable = function (baseColor, colorList, args) {
	    var bestColor = null;
	    var bestScore = 0;
	    var readability;
	    var includeFallbackColors, level, size;
	    args = args || {};
	    includeFallbackColors = args.includeFallbackColors;
	    level = args.level;
	    size = args.size;
	    for (var i = 0; i < colorList.length; i++) {
	      readability = tinycolor.readability(baseColor, colorList[i]);
	      if (readability > bestScore) {
	        bestScore = readability;
	        bestColor = tinycolor(colorList[i]);
	      }
	    }
	    if (tinycolor.isReadable(baseColor, bestColor, {
	      level: level,
	      size: size
	    }) || !includeFallbackColors) {
	      return bestColor;
	    } else {
	      args.includeFallbackColors = false;
	      return tinycolor.mostReadable(baseColor, ["#fff", "#000"], args);
	    }
	  };

	  // Big List of Colors
	  // ------------------
	  // <https://www.w3.org/TR/css-color-4/#named-colors>
	  var names = tinycolor.names = {
	    aliceblue: "f0f8ff",
	    antiquewhite: "faebd7",
	    aqua: "0ff",
	    aquamarine: "7fffd4",
	    azure: "f0ffff",
	    beige: "f5f5dc",
	    bisque: "ffe4c4",
	    black: "000",
	    blanchedalmond: "ffebcd",
	    blue: "00f",
	    blueviolet: "8a2be2",
	    brown: "a52a2a",
	    burlywood: "deb887",
	    burntsienna: "ea7e5d",
	    cadetblue: "5f9ea0",
	    chartreuse: "7fff00",
	    chocolate: "d2691e",
	    coral: "ff7f50",
	    cornflowerblue: "6495ed",
	    cornsilk: "fff8dc",
	    crimson: "dc143c",
	    cyan: "0ff",
	    darkblue: "00008b",
	    darkcyan: "008b8b",
	    darkgoldenrod: "b8860b",
	    darkgray: "a9a9a9",
	    darkgreen: "006400",
	    darkgrey: "a9a9a9",
	    darkkhaki: "bdb76b",
	    darkmagenta: "8b008b",
	    darkolivegreen: "556b2f",
	    darkorange: "ff8c00",
	    darkorchid: "9932cc",
	    darkred: "8b0000",
	    darksalmon: "e9967a",
	    darkseagreen: "8fbc8f",
	    darkslateblue: "483d8b",
	    darkslategray: "2f4f4f",
	    darkslategrey: "2f4f4f",
	    darkturquoise: "00ced1",
	    darkviolet: "9400d3",
	    deeppink: "ff1493",
	    deepskyblue: "00bfff",
	    dimgray: "696969",
	    dimgrey: "696969",
	    dodgerblue: "1e90ff",
	    firebrick: "b22222",
	    floralwhite: "fffaf0",
	    forestgreen: "228b22",
	    fuchsia: "f0f",
	    gainsboro: "dcdcdc",
	    ghostwhite: "f8f8ff",
	    gold: "ffd700",
	    goldenrod: "daa520",
	    gray: "808080",
	    green: "008000",
	    greenyellow: "adff2f",
	    grey: "808080",
	    honeydew: "f0fff0",
	    hotpink: "ff69b4",
	    indianred: "cd5c5c",
	    indigo: "4b0082",
	    ivory: "fffff0",
	    khaki: "f0e68c",
	    lavender: "e6e6fa",
	    lavenderblush: "fff0f5",
	    lawngreen: "7cfc00",
	    lemonchiffon: "fffacd",
	    lightblue: "add8e6",
	    lightcoral: "f08080",
	    lightcyan: "e0ffff",
	    lightgoldenrodyellow: "fafad2",
	    lightgray: "d3d3d3",
	    lightgreen: "90ee90",
	    lightgrey: "d3d3d3",
	    lightpink: "ffb6c1",
	    lightsalmon: "ffa07a",
	    lightseagreen: "20b2aa",
	    lightskyblue: "87cefa",
	    lightslategray: "789",
	    lightslategrey: "789",
	    lightsteelblue: "b0c4de",
	    lightyellow: "ffffe0",
	    lime: "0f0",
	    limegreen: "32cd32",
	    linen: "faf0e6",
	    magenta: "f0f",
	    maroon: "800000",
	    mediumaquamarine: "66cdaa",
	    mediumblue: "0000cd",
	    mediumorchid: "ba55d3",
	    mediumpurple: "9370db",
	    mediumseagreen: "3cb371",
	    mediumslateblue: "7b68ee",
	    mediumspringgreen: "00fa9a",
	    mediumturquoise: "48d1cc",
	    mediumvioletred: "c71585",
	    midnightblue: "191970",
	    mintcream: "f5fffa",
	    mistyrose: "ffe4e1",
	    moccasin: "ffe4b5",
	    navajowhite: "ffdead",
	    navy: "000080",
	    oldlace: "fdf5e6",
	    olive: "808000",
	    olivedrab: "6b8e23",
	    orange: "ffa500",
	    orangered: "ff4500",
	    orchid: "da70d6",
	    palegoldenrod: "eee8aa",
	    palegreen: "98fb98",
	    paleturquoise: "afeeee",
	    palevioletred: "db7093",
	    papayawhip: "ffefd5",
	    peachpuff: "ffdab9",
	    peru: "cd853f",
	    pink: "ffc0cb",
	    plum: "dda0dd",
	    powderblue: "b0e0e6",
	    purple: "800080",
	    rebeccapurple: "663399",
	    red: "f00",
	    rosybrown: "bc8f8f",
	    royalblue: "4169e1",
	    saddlebrown: "8b4513",
	    salmon: "fa8072",
	    sandybrown: "f4a460",
	    seagreen: "2e8b57",
	    seashell: "fff5ee",
	    sienna: "a0522d",
	    silver: "c0c0c0",
	    skyblue: "87ceeb",
	    slateblue: "6a5acd",
	    slategray: "708090",
	    slategrey: "708090",
	    snow: "fffafa",
	    springgreen: "00ff7f",
	    steelblue: "4682b4",
	    tan: "d2b48c",
	    teal: "008080",
	    thistle: "d8bfd8",
	    tomato: "ff6347",
	    turquoise: "40e0d0",
	    violet: "ee82ee",
	    wheat: "f5deb3",
	    white: "fff",
	    whitesmoke: "f5f5f5",
	    yellow: "ff0",
	    yellowgreen: "9acd32"
	  };

	  // Make it easy to access colors via `hexNames[hex]`
	  var hexNames = tinycolor.hexNames = flip(names);

	  // Utilities
	  // ---------

	  // `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
	  function flip(o) {
	    var flipped = {};
	    for (var i in o) {
	      if (o.hasOwnProperty(i)) {
	        flipped[o[i]] = i;
	      }
	    }
	    return flipped;
	  }

	  // Return a valid alpha value [0,1] with all invalid values being set to 1
	  function boundAlpha(a) {
	    a = parseFloat(a);
	    if (isNaN(a) || a < 0 || a > 1) {
	      a = 1;
	    }
	    return a;
	  }

	  // Take input from [0, n] and return it as [0, 1]
	  function bound01(n, max) {
	    if (isOnePointZero(n)) n = "100%";
	    var processPercent = isPercentage(n);
	    n = Math.min(max, Math.max(0, parseFloat(n)));

	    // Automatically convert percentage into number
	    if (processPercent) {
	      n = parseInt(n * max, 10) / 100;
	    }

	    // Handle floating point rounding errors
	    if (Math.abs(n - max) < 0.000001) {
	      return 1;
	    }

	    // Convert into [0, 1] range if it isn't already
	    return n % max / parseFloat(max);
	  }

	  // Force a number between 0 and 1
	  function clamp01(val) {
	    return Math.min(1, Math.max(0, val));
	  }

	  // Parse a base-16 hex value into a base-10 integer
	  function parseIntFromHex(val) {
	    return parseInt(val, 16);
	  }

	  // Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
	  // <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
	  function isOnePointZero(n) {
	    return typeof n == "string" && n.indexOf(".") != -1 && parseFloat(n) === 1;
	  }

	  // Check to see if string passed in is a percentage
	  function isPercentage(n) {
	    return typeof n === "string" && n.indexOf("%") != -1;
	  }

	  // Force a hex value to have 2 characters
	  function pad2(c) {
	    return c.length == 1 ? "0" + c : "" + c;
	  }

	  // Replace a decimal with it's percentage value
	  function convertToPercentage(n) {
	    if (n <= 1) {
	      n = n * 100 + "%";
	    }
	    return n;
	  }

	  // Converts a decimal to a hex value
	  function convertDecimalToHex(d) {
	    return Math.round(parseFloat(d) * 255).toString(16);
	  }
	  // Converts a hex value to a decimal
	  function convertHexToDecimal(h) {
	    return parseIntFromHex(h) / 255;
	  }
	  var matchers = function () {
	    // <http://www.w3.org/TR/css3-values/#integers>
	    var CSS_INTEGER = "[-\\+]?\\d+%?";

	    // <http://www.w3.org/TR/css3-values/#number-value>
	    var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

	    // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
	    var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

	    // Actual matching.
	    // Parentheses and commas are optional, but not required.
	    // Whitespace can take the place of commas or opening paren
	    var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
	    var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
	    return {
	      CSS_UNIT: new RegExp(CSS_UNIT),
	      rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
	      rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
	      hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
	      hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
	      hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
	      hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
	      hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
	      hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
	      hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
	      hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
	    };
	  }();

	  // `isValidCSSUnit`
	  // Take in a single string / number and check to see if it looks like a CSS unit
	  // (see `matchers` above for definition).
	  function isValidCSSUnit(color) {
	    return !!matchers.CSS_UNIT.exec(color);
	  }

	  // `stringInputToObject`
	  // Permissive string parsing.  Take in a number of formats, and output an object
	  // based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
	  function stringInputToObject(color) {
	    color = color.replace(trimLeft, "").replace(trimRight, "").toLowerCase();
	    var named = false;
	    if (names[color]) {
	      color = names[color];
	      named = true;
	    } else if (color == "transparent") {
	      return {
	        r: 0,
	        g: 0,
	        b: 0,
	        a: 0,
	        format: "name"
	      };
	    }

	    // Try to match string input using regular expressions.
	    // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
	    // Just return an object and let the conversion functions handle that.
	    // This way the result will be the same whether the tinycolor is initialized with string or object.
	    var match;
	    if (match = matchers.rgb.exec(color)) {
	      return {
	        r: match[1],
	        g: match[2],
	        b: match[3]
	      };
	    }
	    if (match = matchers.rgba.exec(color)) {
	      return {
	        r: match[1],
	        g: match[2],
	        b: match[3],
	        a: match[4]
	      };
	    }
	    if (match = matchers.hsl.exec(color)) {
	      return {
	        h: match[1],
	        s: match[2],
	        l: match[3]
	      };
	    }
	    if (match = matchers.hsla.exec(color)) {
	      return {
	        h: match[1],
	        s: match[2],
	        l: match[3],
	        a: match[4]
	      };
	    }
	    if (match = matchers.hsv.exec(color)) {
	      return {
	        h: match[1],
	        s: match[2],
	        v: match[3]
	      };
	    }
	    if (match = matchers.hsva.exec(color)) {
	      return {
	        h: match[1],
	        s: match[2],
	        v: match[3],
	        a: match[4]
	      };
	    }
	    if (match = matchers.hex8.exec(color)) {
	      return {
	        r: parseIntFromHex(match[1]),
	        g: parseIntFromHex(match[2]),
	        b: parseIntFromHex(match[3]),
	        a: convertHexToDecimal(match[4]),
	        format: named ? "name" : "hex8"
	      };
	    }
	    if (match = matchers.hex6.exec(color)) {
	      return {
	        r: parseIntFromHex(match[1]),
	        g: parseIntFromHex(match[2]),
	        b: parseIntFromHex(match[3]),
	        format: named ? "name" : "hex"
	      };
	    }
	    if (match = matchers.hex4.exec(color)) {
	      return {
	        r: parseIntFromHex(match[1] + "" + match[1]),
	        g: parseIntFromHex(match[2] + "" + match[2]),
	        b: parseIntFromHex(match[3] + "" + match[3]),
	        a: convertHexToDecimal(match[4] + "" + match[4]),
	        format: named ? "name" : "hex8"
	      };
	    }
	    if (match = matchers.hex3.exec(color)) {
	      return {
	        r: parseIntFromHex(match[1] + "" + match[1]),
	        g: parseIntFromHex(match[2] + "" + match[2]),
	        b: parseIntFromHex(match[3] + "" + match[3]),
	        format: named ? "name" : "hex"
	      };
	    }
	    return false;
	  }
	  function validateWCAG2Parms(parms) {
	    // return valid WCAG2 parms for isReadable.
	    // If input parms are invalid, return {"level":"AA", "size":"small"}
	    var level, size;
	    parms = parms || {
	      level: "AA",
	      size: "small"
	    };
	    level = (parms.level || "AA").toUpperCase();
	    size = (parms.size || "small").toLowerCase();
	    if (level !== "AA" && level !== "AAA") {
	      level = "AA";
	    }
	    if (size !== "small" && size !== "large") {
	      size = "small";
	    }
	    return {
	      level: level,
	      size: size
	    };
	  }

	  return tinycolor;

	}));
} (tinycolor$1));

const tinycolor = tinycolor$1.exports;

/**
 * @typedef {Object} TinyGradient.StopInput
 * @property {ColorInput} color
 * @property {number} pos
 */

/**
 * @typedef {Object} TinyGradient.StepValue
 * @type {number} [r]
 * @type {number} [g]
 * @type {number} [b]
 * @type {number} [h]
 * @type {number} [s]
 * @type {number} [v]
 * @type {number} [a]
 */

/**
 * @type {StepValue}
 */
const RGBA_MAX = { r: 256, g: 256, b: 256, a: 1 };

/**
 * @type {StepValue}
 */
const HSVA_MAX = { h: 360, s: 1, v: 1, a: 1 };

/**
 * Linearly compute the step size between start and end (not normalized)
 * @param {StepValue} start
 * @param {StepValue} end
 * @param {number} steps - number of desired steps
 * @return {StepValue}
 */
function stepize(start, end, steps) {
    let step = {};

    for (let k in start) {
        if (start.hasOwnProperty(k)) {
            step[k] = steps === 0 ? 0 : (end[k] - start[k]) / steps;
        }
    }

    return step;
}

/**
 * Compute the final step color
 * @param {StepValue} step - from `stepize`
 * @param {StepValue} start
 * @param {number} i - color index
 * @param {StepValue} max - rgba or hsva of maximum values for each channel
 * @return {StepValue}
 */
function interpolate(step, start, i, max) {
    let color = {};

    for (let k in start) {
        if (start.hasOwnProperty(k)) {
            color[k] = step[k] * i + start[k];
            color[k] = color[k] < 0 ? color[k] + max[k] : (max[k] !== 1 ? color[k] % max[k] : color[k]);
        }
    }

    return color;
}

/**
 * Generate gradient with RGBa interpolation
 * @param {StopInput} stop1
 * @param {StopInput} stop2
 * @param {number} steps
 * @return {tinycolor[]} color1 included, color2 excluded
 */
function interpolateRgb(stop1, stop2, steps) {
    const start = stop1.color.toRgb();
    const end = stop2.color.toRgb();
    const step = stepize(start, end, steps);
    let gradient = [stop1.color];

    for (let i = 1; i < steps; i++) {
        const color = interpolate(step, start, i, RGBA_MAX);
        gradient.push(tinycolor(color));
    }

    return gradient;
}

/**
 * Generate gradient with HSVa interpolation
 * @param {StopInput} stop1
 * @param {StopInput} stop2
 * @param {number} steps
 * @param {boolean|'long'|'short'} mode
 * @return {tinycolor[]} color1 included, color2 excluded
 */
function interpolateHsv(stop1, stop2, steps, mode) {
    const start = stop1.color.toHsv();
    const end = stop2.color.toHsv();

    // rgb interpolation if one of the steps in grayscale
    if (start.s === 0 || end.s === 0) {
        return interpolateRgb(stop1, stop2, steps);
    }

    let trigonometric;
    if (typeof mode === 'boolean') {
        trigonometric = mode;
    }
    else {
        const trigShortest = (start.h < end.h && end.h - start.h < 180) || (start.h > end.h && start.h - end.h > 180);
        trigonometric = (mode === 'long' && trigShortest) || (mode === 'short' && !trigShortest);
    }

    const step = stepize(start, end, steps);
    let gradient = [stop1.color];

    // recompute hue
    let diff;
    if ((start.h <= end.h && !trigonometric) || (start.h >= end.h && trigonometric)) {
        diff = end.h - start.h;
    }
    else if (trigonometric) {
        diff = 360 - end.h + start.h;
    }
    else {
        diff = 360 - start.h + end.h;
    }
    step.h = Math.pow(-1, trigonometric ? 1 : 0) * Math.abs(diff) / steps;

    for (let i = 1; i < steps; i++) {
        const color = interpolate(step, start, i, HSVA_MAX);
        gradient.push(tinycolor(color));
    }

    return gradient;
}

/**
 * Compute substeps between each stops
 * @param {StopInput[]} stops
 * @param {number} steps
 * @return {number[]}
 */
function computeSubsteps(stops, steps) {
    const l = stops.length;

    // validation
    steps = parseInt(steps, 10);

    if (isNaN(steps) || steps < 2) {
        throw new Error('Invalid number of steps (< 2)');
    }
    if (steps < l) {
        throw new Error('Number of steps cannot be inferior to number of stops');
    }

    // compute substeps from stop positions
    let substeps = [];

    for (let i = 1; i < l; i++) {
        const step = (steps - 1) * (stops[i].pos - stops[i - 1].pos);
        substeps.push(Math.max(1, Math.round(step)));
    }

    // adjust number of steps
    let totalSubsteps = 1;
    for (let n = l - 1; n--;) totalSubsteps += substeps[n];

    while (totalSubsteps !== steps) {
        if (totalSubsteps < steps) {
            const min = Math.min.apply(null, substeps);
            substeps[substeps.indexOf(min)]++;
            totalSubsteps++;
        }
        else {
            const max = Math.max.apply(null, substeps);
            substeps[substeps.indexOf(max)]--;
            totalSubsteps--;
        }
    }

    return substeps;
}

/**
 * Compute the color at a specific position
 * @param {StopInput[]} stops
 * @param {number} pos
 * @param {string} method
 * @param {StepValue} max
 * @returns {tinycolor}
 */
function computeAt(stops, pos, method, max) {
    if (pos < 0 || pos > 1) {
        throw new Error('Position must be between 0 and 1');
    }

    let start, end;
    for (let i = 0, l = stops.length; i < l - 1; i++) {
        if (pos >= stops[i].pos && pos < stops[i + 1].pos) {
            start = stops[i];
            end = stops[i + 1];
            break;
        }
    }

    if (!start) {
        start = end = stops[stops.length - 1];
    }

    const step = stepize(start.color[method](), end.color[method](), (end.pos - start.pos) * 100);
    const color = interpolate(step, start.color[method](), (pos - start.pos) * 100, max);
    return tinycolor(color);
}

class TinyGradient {
    /**
     * @param {StopInput[]|ColorInput[]} stops
     * @returns {TinyGradient}
     */
    constructor(stops) {
        // validation
        if (stops.length < 2) {
            throw new Error('Invalid number of stops (< 2)');
        }

        const havingPositions = stops[0].pos !== undefined;
        let l = stops.length;
        let p = -1;
        let lastColorLess = false;
        // create tinycolor objects and clean positions
        this.stops = stops.map((stop, i) => {
            const hasPosition = stop.pos !== undefined;
            if (havingPositions ^ hasPosition) {
                throw new Error('Cannot mix positionned and not posionned color stops');
            }

            if (hasPosition) {
                const hasColor = stop.color !== undefined;
                if (!hasColor && (lastColorLess || i === 0 || i === l - 1)) {
                    throw new Error('Cannot define two consecutive position-only stops');
                }
                lastColorLess = !hasColor;

                stop = {
                    color    : hasColor ? tinycolor(stop.color) : null,
                    colorLess: !hasColor,
                    pos      : stop.pos
                };

                if (stop.pos < 0 || stop.pos > 1) {
                    throw new Error('Color stops positions must be between 0 and 1');
                }
                else if (stop.pos < p) {
                    throw new Error('Color stops positions are not ordered');
                }
                p = stop.pos;
            }
            else {
                stop = {
                    color: tinycolor(stop.color !== undefined ? stop.color : stop),
                    pos  : i / (l - 1)
                };
            }

            return stop;
        });

        if (this.stops[0].pos !== 0) {
            this.stops.unshift({
                color: this.stops[0].color,
                pos  : 0
            });
            l++;
        }
        if (this.stops[l - 1].pos !== 1) {
            this.stops.push({
                color: this.stops[l - 1].color,
                pos  : 1
            });
        }
    }

    /**
     * Return new instance with reversed stops
     * @return {TinyGradient}
     */
    reverse() {
        let stops = [];

        this.stops.forEach(function (stop) {
            stops.push({
                color: stop.color,
                pos  : 1 - stop.pos
            });
        });

        return new TinyGradient(stops.reverse());
    }

    /**
     * Return new instance with looped stops
     * @return {TinyGradient}
     */
    loop() {
        let stops1 = [];
        let stops2 = [];

        this.stops.forEach((stop) => {
            stops1.push({
                color: stop.color,
                pos  : stop.pos / 2
            });
        });

        this.stops.slice(0, -1).forEach((stop) => {
            stops2.push({
                color: stop.color,
                pos  : 1 - stop.pos / 2
            });
        });

        return new TinyGradient(stops1.concat(stops2.reverse()));
    }

    /**
     * Generate gradient with RGBa interpolation
     * @param {number} steps
     * @return {tinycolor[]}
     */
    rgb(steps) {
        const substeps = computeSubsteps(this.stops, steps);
        let gradient = [];

        this.stops.forEach((stop, i) => {
            if (stop.colorLess) {
                stop.color = interpolateRgb(this.stops[i - 1], this.stops[i + 1], 2)[1];
            }
        });

        for (let i = 0, l = this.stops.length; i < l - 1; i++) {
            const rgb = interpolateRgb(this.stops[i], this.stops[i + 1], substeps[i]);
            gradient.splice(gradient.length, 0, ...rgb);
        }

        gradient.push(this.stops[this.stops.length - 1].color);

        return gradient;
    }

    /**
     * Generate gradient with HSVa interpolation
     * @param {number} steps
     * @param {boolean|'long'|'short'} [mode=false]
     *    - false to step in clockwise
     *    - true to step in trigonometric order
     *    - 'short' to use the shortest way
     *    - 'long' to use the longest way
     * @return {tinycolor[]}
     */
    hsv(steps, mode) {
        const substeps = computeSubsteps(this.stops, steps);
        let gradient = [];

        this.stops.forEach((stop, i) => {
            if (stop.colorLess) {
                stop.color = interpolateHsv(this.stops[i - 1], this.stops[i + 1], 2, mode)[1];
            }
        });

        for (let i = 0, l = this.stops.length; i < l - 1; i++) {
            const hsv = interpolateHsv(this.stops[i], this.stops[i + 1], substeps[i], mode);
            gradient.splice(gradient.length, 0, ...hsv);
        }

        gradient.push(this.stops[this.stops.length - 1].color);

        return gradient;
    }

    /**
     * Generate CSS3 command (no prefix) for this gradient
     * @param {String} [mode=linear] - 'linear' or 'radial'
     * @param {String} [direction] - default is 'to right' or 'ellipse at center'
     * @return {String}
     */
    css(mode, direction) {
        mode = mode || 'linear';
        direction = direction || (mode === 'linear' ? 'to right' : 'ellipse at center');

        let css = mode + '-gradient(' + direction;
        this.stops.forEach(function (stop) {
            css += ', ' + (stop.colorLess ? '' : stop.color.toRgbString() + ' ') + (stop.pos * 100) + '%';
        });
        css += ')';
        return css;
    }

    /**
     * Returns the color at specific position with RGBa interpolation
     * @param {number} pos, between 0 and 1
     * @return {tinycolor}
     */
    rgbAt(pos) {
        return computeAt(this.stops, pos, 'toRgb', RGBA_MAX);
    }

    /**
     * Returns the color at specific position with HSVa interpolation
     * @param {number} pos, between 0 and 1
     * @return {tinycolor}
     */
    hsvAt(pos) {
        return computeAt(this.stops, pos, 'toHsv', HSVA_MAX);
    }
}

/**
 * @param {StopInput[]|ColorInput[]|StopInput...|ColorInput...} stops
 * @returns {TinyGradient}
 */
var tinygradient = function (stops) {
    // varargs
    if (arguments.length === 1) {
        if (!Array.isArray(arguments[0])) {
            throw new Error('"stops" is not an array');
        }
        stops = arguments[0];
    }
    else {
        stops = Array.prototype.slice.call(arguments);
    }

    return new TinyGradient(stops);
};

(function (module) {

	const chalk = source;
	const tinygradient$1 = tinygradient;

	const forbiddenChars = /\s/g;

	function InitGradient(...args) {
		const grad = tinygradient$1.apply(this, args);
		const ret = (str, opts) => applyGradient(str ? str.toString() : '', grad, opts);
		ret.multiline = (str, opts) => multilineGradient(str ? str.toString() : '', grad, opts);
		return ret;
	}

	const getColors = (gradient, options, count) => options.interpolation.toLowerCase() === 'hsv' ?
		gradient.hsv(count, options.hsvSpin.toLowerCase()) : gradient.rgb(count);

	function applyGradient(str, gradient, opts) {
		const options = validateOptions(opts);
		const colorsCount = Math.max(str.replace(forbiddenChars, '').length, gradient.stops.length);
		const colors = getColors(gradient, options, colorsCount);
		let result = '';
		for (const s of str) {
			result += s.match(forbiddenChars) ? s : chalk.hex(colors.shift().toHex())(s);
		}
		return result;
	}

	function multilineGradient(str, gradient, opts) {
		const options = validateOptions(opts);
		const lines = str.split('\n');
		const maxLength = Math.max.apply(null, lines.map(l => l.length).concat([gradient.stops.length]));
		const colors = getColors(gradient, options, maxLength);
		const results = [];
		for (const line of lines) {
			const lineColors = colors.slice(0);
			let lineResult = '';
			for (const l of line) {
				lineResult += chalk.hex(lineColors.shift().toHex())(l);
			}
			results.push(lineResult);
		}
		return results.join('\n');
	}

	function validateOptions(opts) {
		const options = {interpolation: 'rgb', hsvSpin: 'short', ...opts};
		if (opts !== undefined && typeof opts !== 'object') {
			throw new TypeError(`Expected \`options\` to be an \`object\`, got \`${typeof opts}\``);
		}

		if (typeof options.interpolation !== 'string') {
			throw new TypeError(`Expected \`options.interpolation\` to be a \`string\`, got \`${typeof options.interpolation}\``);
		}

		if (options.interpolation.toLowerCase() === 'hsv' && typeof options.hsvSpin !== 'string') {
			throw new TypeError(`Expected \`options.hsvSpin\` to be a \`string\`, got \`${typeof options.hsvSpin}\``);
		}
		return options;
	}

	const aliases = {
		atlas: {colors: ['#feac5e', '#c779d0', '#4bc0c8'], options: {}},
		cristal: {colors: ['#bdfff3', '#4ac29a'], options: {}},
		teen: {colors: ['#77a1d3', '#79cbca', '#e684ae'], options: {}},
		mind: {colors: ['#473b7b', '#3584a7', '#30d2be'], options: {}},
		morning: {colors: ['#ff5f6d', '#ffc371'], options: {interpolation: 'hsv'}},
		vice: {colors: ['#5ee7df', '#b490ca'], options: {interpolation: 'hsv'}},
		passion: {colors: ['#f43b47', '#453a94'], options: {}},
		fruit: {colors: ['#ff4e50', '#f9d423'], options: {}},
		instagram: {colors: ['#833ab4', '#fd1d1d', '#fcb045'], options: {}},
		retro: {colors: ['#3f51b1', '#5a55ae', '#7b5fac', '#8f6aae', '#a86aa4', '#cc6b8e', '#f18271', '#f3a469', '#f7c978'], options: {}},
		summer: {colors: ['#fdbb2d', '#22c1c3'], options: {}},
		rainbow: {colors: ['#ff0000', '#ff0100'], options: {interpolation: 'hsv', hsvSpin: 'long'}},
		pastel: {colors: ['#74ebd5', '#74ecd5'], options: {interpolation: 'hsv', hsvSpin: 'long'}}
	};

	module.exports = InitGradient;
	for (const a in aliases) { // eslint-disable-line guard-for-in
		module.exports[a] = str => new InitGradient(aliases[a].colors)(str, aliases[a].options);
		module.exports[a].multiline = str => new InitGradient(aliases[a].colors).multiline(str, aliases[a].options);
	}
} (gradientString));

const { Command } = commander.exports;
const { version, name: packageName } = require$$1;

const { generateComs } = generateComs$2;
const { generateConfig } = generateConfig$2;
const { generateTemp } = generateTemp$2;

// 控制输出样式
const chalk = source;
// 字体颜色渐变
const gradient = gradientString.exports;

const program = new Command();
program
  .description('An application for one plugin')
  .option('-V, --version', '查看版本')
  .helpOption('-h, --help', '查看使用帮助');

program
  .command('gen')
  .description('生成组件/配置文件')
  .option('-com, --component ', '生成SFC')
  .option('-con, --config', '生成配置文件')
  .option('-temp, --template', '生成某些常用的模板组件')
  .addHelpCommand()
  .action((options, command) => {
    // generateComs
    // console.log(command)
    if (options.component) {
      generateComs();
    } else if (options.config) {
      generateConfig();
    } else if (options.template) {
      generateTemp();
    } else {
      // 提示用户输入参数
      let output = '';
      command.options.forEach((item) => {
        output = output + `gen ${item.short} ${item.description} \n`;
      });
      console.log(chalk.red(output));
    }
  });

// 这一句要放在命令的最后
program.parse();

let opts = program.opts();

if (opts.version) {
  console.log(chalk.bold(gradient.morning(`${packageName} ${version}`)));
}

module.exports = main$1;
