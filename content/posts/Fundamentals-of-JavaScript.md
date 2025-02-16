---
title: Fundamentals of JavaScript
draft: false
date: 2025-01-20
description: JavaScript is a versatile language that powers the modern web. Learn about its history, design philosophy, and key features. 
categories:
  - tech 👨🏻‍💻
  - web 🌐
tags:
  - tech
  - JavaScript
  - web
Author: Ahmad Hassan
---

![JS Image](/posts/assets/web/JS/js.webp)

JavaScript was originally created to bring static web pages to life, enabling them to respond dynamically to user interactions. Its code, known as scripts, is directly embedded within HTML documents and executed by the browser as soon as the page loads. Because these scripts are delivered and interpreted as plain text, they bypass the need for a separate compilation process—this makes development swift and flexible.

This interpretive nature is a key characteristic of JavaScript and distinguishes it from compiled languages like Java. Whereas Java requires a compile step to transform code into bytecode before execution, JavaScript’s immediate execution model facilitates rapid testing and iterative development. Over time, JavaScript has evolved from a simple tool for adding interactivity to a robust language capable of handling complex web applications, manipulating the Document Object Model (DOM), and even running on servers through environments like Node.js.

In essence, JavaScript’s design philosophy—enabling live, responsive web experiences with minimal overhead—continues to shape the modern, dynamic web.

*Tip:* **Brendan Eich** is the original developer of JavaScript

> Why is it called JavaScript?
> 
> When JavaScript was created, it initially had another name: “LiveScript”. But Java was very popular at that time, so it was decided that positioning a new language as a “younger brother” of Java would help.
> 
> But as it evolved, JavaScript became a fully independent language with its own specification called [ECMAScript](http://en.wikipedia.org/wiki/ECMAScript), and now it has no relation to Java at all.


Today, JavaScript can execute not only in the browser, but also on the server, or actually on any device that has a special program called [the JavaScript engine](https://en.wikipedia.org/wiki/JavaScript_engine).

The browser has an embedded engine sometimes called a “JavaScript virtual machine”.

Different engines have different “codenames”. For example:

- [V8](https://en.wikipedia.org/wiki/V8_\(JavaScript_engine\)) – in Chrome, Opera and Edge.
- [SpiderMonkey](https://en.wikipedia.org/wiki/SpiderMonkey) – in Firefox.
- …There are other codenames like “Chakra” for IE, “[JavaScriptCore]()”, “Nitro” and “SquirrelFish” for Safari, etc.

The terms above are good to remember because they are used in developer articles on the internet. We’ll use them too. For instance, if “a feature X is supported by V8”, then it probably works in Chrome, Opera and Edge.


> How do engines work?
> 
> Engines are complicated. But the basics are easy.
> 
> 1. The engine (embedded if it’s a browser) reads (“parses”) the script.
> 2. Then it converts (“compiles”) the script to machine code.
> 3. And then the machine code runs, pretty fast.
> 
> The engine applies optimizations at each step of the process. It even watches the compiled script as it runs, analyzes the data that flows through it, and further optimizes the machine code based on that knowledge.

### What makes JavaScript unique?
There are at least three great things about JavaScript:

- Full integration with HTML/CSS.
- Simple things are done simply.
- Supported by all major browsers and enabled by default.

### Link JavaScript to HTML

- We can use a `<script>` tag to add JavaScript code to a page.
- The `type` and `language` attributes are not required.
- A script in an external file can be inserted with `<script src="path/to/script.js"></script>`.

> Please note:
> As a rule, only the simplest scripts are put into HTML. More complex ones reside in separate files.
> 
> The benefit of a separate file is that the browser will download it and store it in its cache.
> 
> Other pages that reference the same script will take it from the cache instead of downloading it, so the file is actually downloaded only once.
> 
> That reduces traffic and makes pages faster.

## Semicolons
A semicolon may be omitted in most cases when a line break exists.
This would also work:

```js
console.log('Hello')
console.log('World')
```

Here, JavaScript interprets the line break as an “implicit” semicolon. This is called an automatic semicolon insertion.

In most cases, a newline implies a semicolon. But “in most cases” does not mean “always”!

There are cases when a newline does not mean a semicolon. For example:

```js
console.log(3 +
1
+ 2);
```

The code outputs 6 because JavaScript does not insert semicolons here. It is intuitively obvious that if the line ends with a plus "+", then it is an “incomplete expression”, so a semicolon there would be incorrect. And in this case, that works as intended.

But there are situations where JavaScript “fails” to assume a semicolon where it is really needed.

Errors which occur in such cases are quite hard to find and fix.

An example of an error

If you’re curious to see a concrete example of such an error, check this code out:

```js
console.log("Hello");

[1, 2].forEach(console.log);
```

Now let’s remove the semicolon after the console.log:

```js
console.log("Hello")

[1, 2].forEach(console.log);
```

The difference compared to the code above is only one character: the semicolon at the end of the first line is gone.

If we run this code, only the first `Hello` shows (and there’s an error, you may need to open the console to see it). There are no numbers any more.

That’s because JavaScript does not assume a semicolon before square brackets `[...]`. So, the code in the last example is treated as a single statement.

Here’s how the engine sees it:

```js
console.log("Hello")[1, 2].forEach(console.log);
```

It's recommend putting semicolons between statements even if they are separated by newlines. This rule is widely adopted by the community. Let’s note once again – it is possible to leave out semicolons most of the time. But it’s safer – especially for a beginner – to use them.

#### Comments
As time goes on, programs become more and more complex. It becomes necessary to add comments which describe what the code does and why.

Comments can be put into any place of a script. They don’t affect its execution because the engine simply ignores them.

##### One-line comments start with two forward slash characters //.

The rest of the line is a comment. It may occupy a full line of its own or follow a statement.
Like here:

```js
// This comment occupies a line of its own
console.log('Hello');

console.log('World'); // This comment follows the statement
```

##### Multiline comments start with a forward slash and an asterisk /* and end with an asterisk and a forward slash */.

```js
/* An example with two messages.
This is a multiline comment.
*/
console.log('Hello');
console.log('World');
```

> Nested comments are not supported!
> There may not be /*...*/ inside another /*...*/.
> 
> Such code will die with an error:

```js
/*
  /* nested comment ?!? */ not allowed
*/
console.log( 'World' );
```


## The modern mode, "use strict"
The directive looks like a string: `"use strict"` or `'use strict'`. When it is located at the top of a script, the whole script works the “modern” way.

```js
"use strict";

// this code works the modern way
...
```

Advance that `"use strict"` can be put at the beginning of a function. Doing that enables strict mode in that function only. But usually people use it for the whole script.

**Ensure that “use strict” is at the top**

Please make sure that `"use strict"` is at the top of your scripts, otherwise strict mode may not be enabled.
Strict mode isn’t enabled here:

```js
console.log("some code");
// "use strict" below is ignored--it must be at the top

"use strict";

// strict mode is not activated
```


#### Should we “use strict”?
The question may sound obvious, but it’s not so.

One could recommend to start scripts with "use strict"… But you know what’s cool?

Modern JavaScript supports “classes” and “modules” – advanced language structures (we’ll surely get to them), that enable use strict automatically. So we don’t need to add the "use strict" directive, if we use them.

So, for now "use strict"; is a welcome guest at the top of your scripts. Later, when your code is all in classes and modules, you may omit it.

As of now, we’ve got to know about use strict in general.

In the next chapters, as we learn language features, we’ll see the differences between the strict and old modes. Luckily, there aren’t many and they actually make our lives better.

The purpose of `"use strict"` is to indicate that the code should be executed in "strict mode".

With strict mode, you can not, for example, use undeclared variables.




## JavaScript Window - The Browser Object Model

In JavaScript, `window` is a global object that represents the browser window or tab. It is the top-level object in the browser's client-side execution environment and provides access to various properties and methods for controlling the browser window.

## console

The console object provides access to the browser's debugging console.

```js
console.log("Hello, World!");
console.warn("Be carefull");
console.error("You made a mistake");
```

- `log()`: Outputs a message to the console.
- `warn()`: Outputs a warning message to the console.
- `error()`: Outputs an error message to the console.
- `clear()`: Clears the console.

# Interaction: alert, prompt, confirm

As we’ll be using the browser as our demo environment, let’s see a couple of functions to interact with the user: `alert`, `prompt` and `confirm`.
## alert()

The `alert()` method displays an alert box with a message and an OK button.

The `alert()` method is used when you want information to come through to the user.

```js
alert("Hello\nHow are you?");
```

## prompt()

The `prompt()` method displays a dialog box that prompts the user for input.

The `prompt()` method returns the input value if the user clicks "OK", otherwise it returns `null`.

> A prompt box is used if you want the user to input a value.
> 
> When a prompt box pops up, the user will have to click either "OK" or "Cancel" to proceed.
> 
> Do not overuse this method. It prevents the user from accessing other parts of the page until the box is closed.

```js
result = prompt(title, [default]);
```

```js
let age = prompt('How old are you?', 100);

console.log(`You are ${age} years old!`); // You are 100 years old!
```


## confirm()

The `confirm()` method displays a dialog box with a message, an OK button, and a Cancel button.

The `confirm()` method returns `true` if the user clicked "OK", otherwise `false`.

> A confirm box is often used if you want the user to verify or accept something.
> 
> A confirm box takes the focus away from the current window, and forces the user to read the message.
> 
> Do not overuse this method. It prevents the user from accessing other parts of the page until the box is closed.


# Variables

A [variable](https://en.wikipedia.org/wiki/Variable_\(computer_science\)) is a “named storage” for data. We can use variables to store goodies, visitors, and other data.

To create a variable in JavaScript, use the `let` keyword.

The statement below creates (in other words: _declares_) a variable with the name “message”:

```js
let message;
```

Now, we can put some data into it by using the assignment operator `=`:

```js
let message;

message = 'Hello'; // store the string 'Hello' in the variable named message
```

The string is now saved into the memory area associated with the variable. We can access it using the variable name:

```js
let message;
message = 'Hello!';

console.log(message); // shows the variable content
```


To be concise, we can combine the variable declaration and assignment into a single line:

```js
let message = 'Hello!'; // define the variable and assign the value

console.log(message); // Hello!
```

We can also declare multiple variables in one line:

```js
let user = 'John', age = 25, message = 'Hello';
```

That might seem shorter, but we don’t recommend it. For the sake of better readability, please use a single line per variable.

The multiline variant is a bit longer, but easier to read:

```js
let user = 'John';
let age = 25;
let message = 'Hello';
```

Technically, all these variants do the same thing. So, it’s a matter of personal taste and aesthetics.

> `var` instead of `let`
> 
> In older scripts, you may also find another keyword: `var` instead of `let`:
> 
> ``` `_var_` message `=` `'Hello'``;` ```
> 
> The `var` keyword is _almost_ the same as `let`. It also declares a variable but in a slightly different, “old-school” way.
> 
> but the main difference Variables, declared with `var`, are either function-scoped or global-scoped. They are visible through blocks.
> 
> There are subtle differences between `let` and `var`, but they do not matter to us yet. We’ll cover them in detail in the chapter [The old "var"](https://javascript.info/var).


> Functional languages
> 
> It’s interesting to note that there exist so-called [pure functional](https://en.wikipedia.org/wiki/Purely_functional_programming) programming languages, such as [Haskell](https://en.wikipedia.org/wiki/Haskell), that forbid changing variable values.
> 
> In such languages, once the value is stored “in the box”, it’s there forever. If we need to store something else, the language forces us to create a new box (declare a new variable). We can’t reuse the old one.
> 
> Though it may seem a little odd at first sight, these languages are quite capable of serious development. More than that, there are areas like parallel computations where this limitation confers certain benefits.


## Constants

To declare a constant (unchanging) variable, use `const` instead of `let`:

```js
const myBirthday = '18.04.1982';
```

Variables declared using `const` are called “constants”. They cannot be reassigned. An attempt to do so would cause an error:

```js
const myBirthday = '18.04.1982';

myBirthday = '01.01.2001'; // error, can't reassign the constant!
```

When a programmer is sure that a variable will never change, they can declare it with `const` to guarantee and communicate that fact to everyone.
### Uppercase constants

There is a widespread practice to use constants as aliases for difficult-to-remember values that are known before execution.

Such constants are named using capital letters and underscores.

For instance, let’s make constants for colors in so-called “web” (hexadecimal) format:

```js
const COLOR_RED = "#F00";
const COLOR_GREEN = "#0F0";
const COLOR_BLUE = "#00F";
const COLOR_ORANGE = "#FF7F00";

// ...when we need to pick a color
let color = COLOR_ORANGE;
console.log(color); // #FF7F00
```

- `COLOR_ORANGE` is much easier to remember than `"#FF7F00"`.
- It is much easier to mistype `"#FF7F00"` than `COLOR_ORANGE`.
- When reading the code, `COLOR_ORANGE` is much more meaningful than `#FF7F00`.

When should we use capitals for a constant and when should we name it normally? Let’s make that clear.

Being a “constant” just means that a variable’s value never changes. But some constants are known before execution (like a hexadecimal value for red) and some constants are _calculated_ in run-time, during the execution, but do not change after their initial assignment.

```js
const pageLoadTime = /* time taken by a webpage to load */;
```


The value of `pageLoadTime` is not known before the page load, so it’s named normally. But it’s still a constant because it doesn’t change after the assignment.

In other words, capital-named constants are only used as aliases for “hard-coded” values.


# Data types

A value in JavaScript is always of a certain type. For example, a string or a number.

We can put any type in a variable. For example, a variable can at one moment be a string and then store a number:

```js
// no error
let message = "hello";
message = 123456;
```

Programming languages that allow such things, such as JavaScript, are called *“dynamically typed”*, meaning that there exist data types, but variables are not bound to any of them.

### 1. Number:

The _number_ type represents both integer and floating point numbers.

```js
let n = 123;
n = 12.345;
```


There are many operations for numbers, e.g. multiplication `*`, division `/`, addition `+`, subtraction `-`, and so on.

Besides regular numbers, there are so-called “special numeric values” which also belong to this data type: `Infinity`, `-Infinity` and `NaN`.

- `Infinity` represents the mathematical [Infinity](https://en.wikipedia.org/wiki/Infinity) ∞. It is a special value that’s greater than any number.

```js
console.log( 1 / 0 ); // Infinity
```

Or just reference it directly:

- `NaN` represents a computational error. It is a result of an incorrect or an undefined mathematical operation, for instance:

```js
console.log( "not a number" / 2 ); // NaN, such division is erroneous
```


`NaN` is sticky. Any further mathematical operation on `NaN` returns `NaN`:

```js
console.log( NaN + 1 ); // NaN
console.log( 3 * NaN ); // NaN
console.log( "not a number" / 2 - 1 ); // NaN
```

So, if there’s a `NaN` somewhere in a mathematical expression, it propagates to the whole result (there’s only one exception to that: `NaN ** 0` is `1`).


#### BigInt

In JavaScript, the “number” type cannot safely represent integer values larger than `(253-1)` (that’s `9007199254740991`), or less than `-(253-1)` for negatives.

To be really precise, the “number” type can store larger integers (up to `1.7976931348623157 * 10308`), but outside of the safe integer range `±(253-1)` there’ll be a precision error, because not all digits fit into the fixed 64-bit storage. So an “approximate” value may be stored.

```js
console.log(9007199254740991 + 1); // 9007199254740992
console.log(9007199254740991 + 2); // 9007199254740992
```


So to say, all odd integers greater than `(253-1)` can’t be stored at all in the “number” type.

For most purposes `±(253-1)` range is quite enough, but sometimes we need the entire range of really big integers, e.g. for cryptography or microsecond-precision timestamps.

`BigInt` type was recently added to the language to represent integers of arbitrary length.

A `BigInt` value is created by appending `n` to the end of an integer:


```js
// the "n" at the end means it's a BigInt
const bigInt = 1234567890123456789012345678901234567890n;
```


## 2. String

A string in JavaScript must be surrounded by quotes.

```js
let str = "Hello";
let str2 = 'Single quotes are ok too';
let phrase = `can embed another ${str}`;
```


In JavaScript, there are 3 types of quotes.

1. Double quotes: `"Hello"`.
2. Single quotes: `'Hello'`.
3. Backticks: `` `Hello` ``.

Double and single quotes are “simple” quotes. There’s practically no difference between them in JavaScript.

Backticks are “extended functionality” quotes. They allow us to embed variables and expressions into a string by wrapping them in `${…}`, for example:

```js
let name = "John";

// embed a variable
console.log( `Hello, ${name}!` ); // Hello, John!

// embed an expression
console.log( `the result is ${1 + 2}` ); // the result is 3
```


> There is no _character_ type.
> 
> In some languages, there is a special “character” type for a single character. For example, in the C language and in Java it is called “char”.
> 
> In JavaScript, there is no such type. There’s only one type: `string`. A string may consist of zero characters (be empty), one character or many of them.


## 3. Boolean (logical type)

The boolean type has only two values: `true` and `false`.

This type is commonly used to store yes/no values: `true` means “yes, correct”, and `false` means “no, incorrect”.

For instance:

```js
let nameFieldChecked = true; // yes, name field is checked
let ageFieldChecked = false; // no, age field is not checked
```


## 4. The “null” value

The special `null` value does not belong to any of the types described above.

It forms a separate type of its own which contains only the `null` value:


```js
let age = null;
```

In JavaScript, `null` is not a “reference to a non-existing object” or a “null pointer” like in some other languages.

It’s just a special value which represents “nothing”, “empty” or “value unknown”.

The code above states that `age` is unknown.


## The "undefined" value

The special value `undefined` also stands apart. It makes a type of its own, just like `null`.

The meaning of `undefined` is “value is not assigned”.

If a variable is declared, but not assigned, then its value is `undefined`:

```js
let age;

console.log(age); // shows "undefined"
```

Technically, it is possible to explicitly assign `undefined` to a variable:

```js
let age = 100;

// change the value to undefined
age = undefined;

console.log(age); // "undefined"
```


…But it's don’t recommend doing that. Normally, one uses `null` to assign an “empty” or “unknown” value to a variable, while `undefined` is reserved as a default initial value for unassigned things.

## Objects and Symbols

The `object` type is special.

All other types are called “primitive” because their values can contain only a single thing (be it a string or a number or whatever). In contrast, objects are used to store collections of data and more complex entities.

Being that important, objects deserve a special treatment. Deal with them later in the chapter [Objects](https://javascript.info/object), after we learn more about primitives.

The `symbol` type is used to create unique identifiers for objects. We have to mention it here for the sake of completeness, but also postpone the details till we know objects.

## The typeof operator

The `typeof` operator returns the type of the operand. It’s useful when we want to process values of different types differently or just want to do a quick check.

A call to `typeof x` returns a string with the type name:

```js
typeof undefined // "undefined"

typeof 0 // "number"

typeof 10n // "bigint"

typeof true // "boolean"

typeof "foo" // "string"

typeof Symbol("id") // "symbol"

typeof Math // "object"  (1)

typeof null // "object"  (2)

typeof alert// "function"  (3)
```


> The `typeof(x)` syntax
> 
> You may also come across another syntax: `typeof(x)`. It’s the same as `typeof x`.
> 
> To put it clear: `typeof` is an operator, not a function. The parentheses here aren’t a part of `typeof`. It’s the kind of parentheses used for mathematical grouping.
> 
> Usually, such parentheses contain a mathematical expression, such as `(2 + 2)`, but here they contain only one argument `(x)`. Syntactically, they allow to avoid a space between the `typeof` operator and its argument, and some people like it.
> 
> Some people prefer `typeof(x)`, although the `typeof x` syntax is much more common.


# Type Conversions

Most of the time, operators and functions automatically convert the values given to them to the right type.

For example, `console.log` automatically converts any value to a string to show it. Mathematical operations convert values to numbers.

There are also cases when we need to explicitly convert a value to the expected type.

## String Conversion

String conversion happens when we need the string form of a value.

For example, `console.log(value)` does it to show the value.

We can also call the `String(value)` function to convert a value to a string:

```js
let value = true;
console.log(typeof value); // boolean

value = String(value); // now value is a string "true"
console.log(typeof value); // string
```

String conversion is mostly obvious. A `false` becomes `"false"`, `null` becomes `"null"`, etc.

## Numeric Conversion

Numeric conversion in mathematical functions and expressions happens automatically.

For example, when division `/` is applied to non-numbers:

```js
console.log( "6" / "2" ); // 3, strings are converted to numbers
```

We can use the `Number(value)` function to explicitly convert a `value` to a number:

```js
let str = "123";
console.log(typeof str); // string

let num = Number(str); // becomes a number 123

console.log(typeof num); // number
```


Explicit conversion is usually required when we read a value from a string-based source like a text form but expect a number to be entered.

If the string is not a valid number, the result of such a conversion is `NaN`. For instance:

```js
let age = Number("an arbitrary string instead of a number");

console.log(age); // NaN, conversion failed
```

Numeric conversion rules:
  
| Value            | Becomes…                                                                                                                                                                                                                     |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `undefined`      | `NaN`                                                                                                                                                                                                                        |
| `null`           | `0`                                                                                                                                                                                                                          |
| `true and false` | `1` and `0`                                                                                                                                                                                                                  |
| `string`         | Whitespaces (includes spaces, tabs `\t`, newlines `\n` etc.) from the start and end are removed. If the remaining string is empty, the result is `0`. Otherwise, the number is “read” from the string. An error gives `NaN`. |


```js
console.log( Number("   123   ") ); // 123
console.log( Number("123z") );      // NaN (error reading a number at "z")
console.log( Number(true) );        // 1
console.log( Number(false) );       // 0
```

## Boolean Conversion

Boolean conversion is the simplest one.

It happens in logical operations (later we’ll meet condition tests and other similar things) but can also be performed explicitly with a call to `Boolean(value)`.

The conversion rule:

- Values that are intuitively “empty”, like `0`, an empty string, `null`, `undefined`, and `NaN`, become `false`.
- Other values become `true`.

```js
console.log( Boolean(1) ); // true
console.log( Boolean(0) ); // false

console.log( Boolean("hello") ); // true
console.log( Boolean("") ); // false
```


**Please note:** the string with zero `"0"` is `true`

Some languages (namely PHP) treat `"0"` as `false`. But in JavaScript, a non-empty string is always `true`.

```js
alert( Boolean("0") ); // true
alert( Boolean(" ") ); // spaces, also true (any non-empty string is true)
```


# Basic operators, maths

We know many operators from school. They are things like addition `+`, multiplication `*`, subtraction `-`, and so on.

In this chapter, we’ll start with simple operators, then concentrate on JavaScript-specific aspects, not covered by school arithmetic.

## Maths

The following math operations are supported:

- Addition `+`,
- Subtraction `-`,
- Multiplication `*`,
- Division `/`,
- Remainder `%`,
- Exponentiation `**`.


### Remainder

The remainder operator `%`, despite its appearance, is not related to percents.

The result of `a % b` is the [remainder](https://en.wikipedia.org/wiki/Remainder) of the integer division of `a` by `b`.

For instance:

```js
console.log(5 % 2); // 1, the remainder of 5 divided by 2
console.log(8 % 3); // 2, the remainder of 8 divided by 3
console.log(8 % 4); // 0, the remainder of 8 divided by 4
```

### Exponentiation:

The exponentiation operator `a ** b` raises `a` to the power of `b`.

In school maths, we write that as ab.

For instance:

```js
console.log(2 ** 2); // 2² = 4
console.log(2 ** 3); // 2³ = 8
console.log(2 ** 4); // 2⁴ = 16
```

Just like in maths, the exponentiation operator is defined for non-integer numbers as well.

For example, a square root is an exponentiation by ½:

```js
console.log(4 ** (1 / 2)); // 2 (power of 1/2 is the same as a square root)
console.log(8 ** (1 / 3)); // 2 (power of 1/3 is the same as a cubic root)
```


## String concatenation with binary

Let’s meet the features of JavaScript operators that are beyond school arithmetics.

Usually, the plus operator `+` sums numbers.

But, if the binary `+` is applied to strings, it merges (concatenates) them:


```js
let s = "my" + "string";
console.log(s); // mystring
```

Note that if any of the operands is a string, then the other one is converted to a string too.

```js
console.log( '1' + 2 ); // "12"
console.log( 2 + '1' ); // "21"
```


See, it doesn’t matter whether the first operand is a string or the second one.

Here’s a more complex example:

```js
console.log(2 + 2 + '1' ); // "41" and not "221"
```

Here, operators work one after another. The first `+` sums two numbers, so it returns `4`, then the next `+` adds the string `1` to it, so it’s like `4 + '1' = '41'`.

```javascript
console.log('1' + 2 + 2); // "122" and not "14"
```

The binary `+` is the only operator that supports strings in such a way. Other arithmetic operators work only with numbers and always convert their operands to numbers.

Here’s the demo for subtraction and division:

```javascript
console.log( 6 - '2' ); // 4, converts '2' to a number
console.log( '6' / '2' ); // 3, converts both operands to numbers
```

## Numeric conversion, unary

The plus `+` exists in two forms: the binary form that we used above and the unary form.

The unary plus or, in other words, the plus operator `+` applied to a single value, doesn’t do anything to numbers. But if the operand is not a number, the unary plus converts it into a number.

For example:

```js
// No effect on numbers
let x = 1;
console.log( +x ); // 1

let y = -2;
console.log( +y ); // -2

// Converts non-numbers
console.log( +true ); // 1
console.log( +"" );   // 0

```

It actually does the same thing as `Number(...)`, but is shorter.


The binary plus would add them as strings:

```js
let apples = "2";
let oranges = "3";
console.log( apples + oranges ); // "23", the binary plus concatenates strings
```

If we want to treat them as numbers, we need to convert and then sum them:

```js
let apples = "2";
let oranges = "3";

// both values converted to numbers before the binary plus
console.log( +apples + +oranges ); // 5

// the longer variant
// console.log( Number(apples) + Number(oranges) ); // 5

```

From a mathematician’s standpoint, the abundance of pluses may seem strange. But from a programmer’s standpoint, there’s nothing special: unary pluses are applied first, they convert strings to numbers, and then the binary plus sums them up.

## Operator Precedence:

If an expression has more than one operator, the execution order is defined by their _precedence_, or, in other words, the default priority order of operators.

| Precedence | Name           | Sign |
| ---------- | -------------- | ---- |
| …          | …              | …    |
| 14         | unary plus     | `+`  |
| 14         | unary negation | `-`  |
| 13         | exponentiation | `**` |
| 12         | multiplication | `*`  |
| 12         | division       | `/`  |
| 11         | addition       | `+`  |
| 11         | subtraction    | `-`  |
| …          | …              | …    |
| 2          | assignment     | `=`  |
| …          | …              | …    |

## Assignment

Let’s note that an assignment `=` is also an operator. It is listed in the precedence table with the very low priority of `2`.

That’s why, when we assign a variable, like `x = 2 * 2 + 1`, the calculations are done first and then the `=` is evaluated, storing the result in `x`.


```js
let x = 2 * 2 + 1;

console.log( x ); // 5
```

### Assignment = returns a value

The fact of `=` being an operator, not a “magical” language construct has an interesting implication.

All operators in JavaScript return a value. That’s obvious for `+` and `-`, but also true for `=`.

The call `x = value` writes the `value` into `x` _and then returns it_.

Here’s a demo that uses an assignment as part of a more complex expression:

```js
let a = 1;
let b = 2;
let c = 3 - (a = b + 1);
console.log( a ); // 3
console.log c ); // 0
```

In the example above, the result of expression `(a = b + 1)` is the value which was assigned to `a` (that is `3`). It is then used for further evaluations.

Funny code, isn’t it? We should understand how it works, because sometimes we see it in JavaScript libraries.

Although, please don’t write the code like that. Such tricks definitely don’t make code clearer or readable.

### Modify-in-place

We often need to apply an operator to a variable and store the new result in that same variable.

For example:

```js
let n = 2;
n = n + 5;
n = n * 2;
```

This notation can be shortened using the operators `+=` and `*=`:

```js
let n = 2;
n += 5; // now n = 7 (same as n = n + 5)
n *= 2; // now n = 14 (same as n = n * 2)

alert( n ); // 14
```

### Increment/decrement

Increasing or decreasing a number by one is among the most common numerical operations.

So, there are special operators for it:

- **Increment** `++` increases a variable by 1:

```js
let counter = 2;
counter++;        // works the same as counter = counter + 1, but is shorter
alert( counter ); // 3
```

- **Decrement** `--` decreases a variable by 1:

```js
let counter = 2;
counter--;        // works the same as counter = counter - 1, but is shorter
alert( counter ); // 1
```

**Important:** Increment/decrement can only be applied to variables. Trying to use it on a value like `5++` will give an error.

The operators `++` and `--` can be placed either before or after a variable.

- When the operator goes after the variable, it is in “postfix form”: `counter++`.
- The “prefix form” is when the operator goes before the variable: `++counter`.

Both of these statements do the same thing: increase `counter` by `1`.

Is there any difference? Yes, but we can only see it if we use the returned value of `++/--`.

Let’s clarify. As we know, all operators return a value. Increment/decrement is no exception. The prefix form returns the new value while the postfix form returns the old value (prior to increment/decrement).

To see the difference, here’s an example:

```js
let counter = 1;
let a = ++counter; // (*)
alert(a); // 2
```

In the line `(*)`, the _prefix_ form `++counter` increments `counter` and returns the new value, `2`. So, the `alert` shows `2`.

Now, let’s use the postfix form:

```js
let counter = 1;
let a = counter++; // (*) changed ++counter to counter++

alert(a); // 1
```

In the line `(*)`, the _postfix_ form `counter++` also increments `counter` but returns the _old_ value (prior to increment). So, the `alert` shows `1`.

**Increment/decrement among other operators**

The operators `++/--` can be used inside expressions as well. Their precedence is higher than most other arithmetical operations.

For instance:

```js
let counter = 1;
alert( 2 * ++counter ); // 4
```

Compare With:

```js
let counter = 1;
alert( 2 * counter++ ); // 2, because counter++ returns the "old" value
```

Though technically okay, such notation usually makes code less readable. One line does multiple things – not good.

While reading code, a fast “vertical” eye-scan can easily miss something like `counter++` and it won’t be obvious that the variable increased.

We advise a style of “one line – one action”:

```js
let counter = 1;
alert( 2 * counter );
counter++;
```

### Bitwise operators

Bitwise operators treat arguments as 32-bit integer numbers and work on the level of their binary representation.

These operators are not JavaScript-specific. They are supported in most programming languages.

The list of operators:

- AND ( `&` )
- OR ( `|` )
- XOR ( `^` )
- NOT ( `~` )
- LEFT SHIFT ( `<<` )
- RIGHT SHIFT ( `>>` )
- ZERO-FILL RIGHT SHIFT ( `>>>` )

These operators are used very rarely, when we need to fiddle with numbers on the very lowest (bitwise) level. We won’t need these operators any time soon, as web development has little use of them, but in some special areas, such as cryptography, they are useful. You can read the [Bitwise Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators#bitwise_operators) chapter on MDN when a need arises.


### Comma

The comma operator `,` is one of the rarest and most unusual operators. Sometimes, it’s used to write shorter code, so we need to know it in order to understand what’s going on.

The comma operator allows us to evaluate several expressions, dividing them with a comma `,`. Each of them is evaluated but only the result of the last one is returned.

```js
let a = (1 + 2, 3 + 4);

alert( a ); // 7 (the result of 3 + 4)
```

Here, the first expression `1 + 2` is evaluated and its result is thrown away. Then, `3 + 4` is evaluated and returned as the result.

> Comma has a very low precedence
> 
> Please note that the comma operator has very low precedence, lower than `=`, so parentheses are important in the example above.
> 
> Without them: `a = 1 + 2, 3 + 4` evaluates `+` first, summing the numbers into `a = 3, 7`, then the assignment operator `=` assigns `a = 3`, and the rest is ignored. It’s like `(a = 1 + 2), 3 + 4`.


Why do we need an operator that throws away everything except the last expression?

Sometimes, people use it in more complex constructs to put several actions in one line.

For example:

```js
// three operations in one line
for (a = 1, b = 3, c = a * b; a < 10; a++) {
 ...
}
```

# Comparisons

We know many comparison operators from maths.

In JavaScript they are written like this:

- Greater/less than: `a > b`, `a < b`.
- Greater/less than or equals: `a >= b`, `a <= b`.
- Equals: `a == b`, please note the double equality sign `==` means the equality test, while a single one `a = b` means an assignment.
- Not equals: In maths the notation is `≠`, but in JavaScript it’s written as `a != b`.

In this article we’ll learn more about different types of comparisons, how JavaScript makes them, including important peculiarities.

At the end you’ll find a good recipe to avoid “JavaScript quirks”-related issues.

### Boolean is the result

All comparison operators return a boolean value:

- `true` – means “yes”, “correct” or “the truth”.
- `false` – means “no”, “wrong” or “not the truth”.

For example:

```js
console.log( 2 > 1 );  // true (correct)
console.log( 2 == 1 ); // false (wrong)
console.log( 2 != 1 ); // true (correct)
```

A comparison result can be assigned to a variable, just like any value:

```js
let result = 5 > 4; // assign the result of the comparison
console.log( result ); // true
```

### String comparison
To see whether a string is greater than another, JavaScript uses the so-called “dictionary” or “lexicographical” order.

In other words, strings are compared letter-by-letter.

For example:

```js
console.log( 'Z' > 'A' ); // true
console.log( 'Glow' > 'Glee' ); // true
console.log( 'Bee' > 'Be' ); // true
```

The algorithm to compare two strings is simple:

1. Compare the first character of both strings.
2. If the first character from the first string is greater (or less) than the other string’s, then the first string is greater (or less) than the second. We’re done.
3. Otherwise, if both strings’ first characters are the same, compare the second characters the same way.
4. Repeat until the end of either string.
5. If both strings end at the same length, then they are equal. Otherwise, the longer string is greater.

In the first example above, the comparison `'Z' > 'A'` gets to a result at the first step.

The second comparison `'Glow'` and `'Glee'` needs more steps as strings are compared character-by-character:

6. `G` is the same as `G`.
7. `l` is the same as `l`.
8. `o` is greater than `e`. Stop here. The first string is greater.

> Not a real dictionary, but Unicode order
> 
> The comparison algorithm given above is roughly equivalent to the one used in dictionaries or phone books, but it’s not exactly the same.
> 
> For instance, case matters. A capital letter `"A"` is not equal to the lowercase `"a"`. Which one is greater? The lowercase `"a"`. Why? Because the lowercase character has a greater index in the internal encoding table JavaScript uses (Unicode). We’ll get back to specific details and consequences of this in the chapter [Strings](https://javascript.info/string).

### Comparison of different types

When comparing values of different types, JavaScript converts the values to numbers.

For example: 

```js
console.log( '2' > 1 ); // true, string '2' becomes a number 2
console.log( '01' == 1 ); // true, string '01' becomes a number 1
```

For boolean values, `true` becomes `1` and `false` becomes `0`.

For example:

```js
alert( true == 1 ); // true
alert( false == 0 ); // true
```


**A funny consequence**

It is possible that at the same time:

- Two values are equal.
- One of them is `true` as a boolean and the other one is `false` as a boolean.

For example:

```js
let a = 0;
alert( Boolean(a) ); // false

let b = "0";
alert( Boolean(b) ); // true

alert(a == b); // true!
```

From JavaScript’s standpoint, this result is quite normal. An equality check converts values using the numeric conversion (hence `"0"` becomes `0`), while the explicit `Boolean` conversion uses another set of rules.

## Strict equality

A regular equality check `==` has a problem. It cannot differentiate `0` from `false`:

```js
alert( 0 == false ); // true
```

The same thing happens with an empty string:

```javascript
alert( '' == false ); // true
```

This happens because operands of different types are converted to numbers by the equality operator `==`. An empty string, just like `false`, becomes a zero.

What to do if we’d like to differentiate `0` from `false`?

**A strict equality operator `===` checks the equality without type conversion.**

In other words, if `a` and `b` are of different types, then `a === b` immediately returns `false` without an attempt to convert them.

Let’s try it:

```js
alert( 0 === false ); // false, because the types are different
```


There is also a “strict non-equality” operator `!==` analogous to `!=`.

The strict equality operator is a bit longer to write, but makes it obvious what’s going on and leaves less room for errors.

## Comparison with null and undefined

There’s a non-intuitive behavior when `null` or `undefined` are compared to other values.

**For a strict equality check `===`**

These values are different, because each of them is a different type.

```javascript
alert( null === undefined ); // false
```

**For a non-strict check `==`**

There’s a special rule. These two are a “sweet couple”: they equal each other (in the sense of `==`), but not any other value.

**For maths and other comparisons `< > <= >=`**

`null/undefined` are converted to numbers: `null` becomes `0`, while `undefined` becomes `NaN`.

Now let’s see some funny things that happen when we apply these rules. And, what’s more important, how to not fall into a trap with them.

## Strange result: null vs 0

Let’s compare `null` with a zero:

```js
alert( null > 0 );  // (1) false
alert( null == 0 ); // (2) false
alert( null >= 0 ); // (3) true
```

Mathematically, that’s strange. The last result states that “`null` is greater than or equal to zero”, so in one of the comparisons above it must be `true`, but they are both false.

The reason is that an equality check `==` and comparisons `> < >= <=` work differently. Comparisons convert `null` to a number, treating it as `0`. That’s why (3) `null >= 0` is true and (1) `null > 0` is false.

On the other hand, the equality check `==` for `undefined` and `null` is defined such that, without any conversions, they equal each other and don’t equal anything else. That’s why (2) `null == 0` is false.


### An incomparable undefined

The value `undefined` shouldn’t be compared to other values:

```js
alert( undefined > 0 ); // false (1)
alert( undefined < 0 ); // false (2)
alert( undefined == 0 ); // false (3)
```


Why does it dislike zero so much? Always false!

We get these results because:

- Comparisons `(1)` and `(2)` return `false` because `undefined` gets converted to `NaN` and `NaN` is a special numeric value which returns `false` for all comparisons.
- The equality check `(3)` returns `false` because `undefined` only equals `null`, `undefined`, and no other value.

### Avoid Problems

Why did we go over these examples? Should we remember these peculiarities all the time? Well, not really. Actually, these tricky things will gradually become familiar over time, but there’s a solid way to avoid problems with them:

- Treat any comparison with `undefined/null` except the strict equality `===` with exceptional care.
- Don’t use comparisons `>= > < <=` with a variable which may be `null/undefined`, unless you’re really sure of what you’re doing. If a variable can have these values, check for them separately.


# Conditional branching: if, '?'

Sometimes, we need to perform different actions based on different conditions.

To do that, we can use the `if` statement and the conditional operator `?`, that’s also called a “question mark” operator.

## The “if” statement

The `if(...)` statement evaluates a condition in parentheses and, if the result is `true`, executes a block of code.

For example:

```js
let year = prompt("In which year was ECMAScript-2015 specification published?","");

if (year == 2015) alert("You are right!");
```

In the example above, the condition is a simple equality check (`year == 2015`), but it can be much more complex.

If we want to execute more than one statement, we have to wrap our code block inside curly braces:

```js
if (year == 2015) {
  alert( "That's correct!" );
  alert( "You're so smart!" );
}
```

We recommend wrapping your code block with curly braces `{}` every time you use an `if` statement, even if there is only one statement to execute. Doing so improves readability

## Boolean conversion

The `if (…)` statement evaluates the expression in its parentheses and converts the result to a boolean.

Let’s recall the conversion rules from the chapter [Type Conversions](https://javascript.info/type-conversions):

- A number `0`, an empty string `""`, `null`, `undefined`, and `NaN` all become `false`. Because of that they are called “falsy” values.
- Other values become `true`, so they are called “truthy”.

So, the code under this condition would never execute:

```js
if (0) { // 0 is falsy
  ...
}
```

…and inside this condition – it always will:

```js
if (1) { // 1 is truthy
  ...
}
```

We can also pass a pre-evaluated boolean value to `if`, like this:

```js
let cond = (year == 2015); // equality evaluates to true or false

if (cond) {
  ...
}
```

### The “else” clause
The if statement may contain an optional else block. It executes when the condition is falsy.

For example:

```js
let year = prompt('In which year was the ECMAScript-2015 specification published?', '');

if (year == 2015) {
  alert( 'You guessed it right!' );
} else {
  alert( 'How can you be so wrong?' ); // any value except 2015
}
```

### Several conditions: “else if”
Sometimes, we’d like to test several variants of a condition. The else if clause lets us do that.

For example:

```js
let year = prompt('In which year was the ECMAScript-2015 specification published?', '');

if (year < 2015) {
  alert( 'Too early...' );
} else if (year > 2015) {
  alert( 'Too late' );
} else {
  alert( 'Exactly!' );
}
```

In the code above, JavaScript first checks `year < 2015`. If that is falsy, it goes to the next condition `year > 2015`. If that is also falsy, it shows the last `alert`.

There can be more `else if` blocks. The final `else` is optional.

### Conditional operator ‘?’
Sometimes, we need to assign a variable depending on a condition.

For instance:

```js
let accessAllowed;
let age = prompt('How old are you?', '');

if (age > 18) {
  accessAllowed = true;
} else {
  accessAllowed = false;
}

alert(accessAllowed);
```

The so-called “conditional” or “question mark” operator lets us do that in a shorter and simpler way.

The operator is represented by a question mark ?. Sometimes it’s called “ternary”, because the operator has three operands. It is actually the one and only operator in JavaScript which has that many.

The syntax is:

```js
let result = condition ? value1 : value2;
```

The `condition` is evaluated: if it’s truthy then `value1` is returned, otherwise – `value2`.

For example:

```js
let accessAllowed = (age > 18) ? true : false;
```

Technically, we can omit the parentheses around `age > 18`. The question mark operator has a low precedence, so it executes after the comparison `>`.

This example will do the same thing as the previous one:

```
// the comparison operator "age > 18" executes first anyway
// (no need to wrap it into parentheses)
let accessAllowed = age > 18 ? true : false;
```

But parentheses make the code more readable, so we recommend using them.

**Please note:** In the example above, you can avoid using the question mark operator because the comparison itself returns `true/false`:

```js
// the same
let accessAllowed = age > 18;
```

## Multiple ‘?’

A sequence of question mark operators `?` can return a value that depends on more than one condition.

For instance:

```js
let age = prompt("age?", 18);

let message =
  age < 3
    ? "Hi, baby!"
    : age < 18
    ? "Hello!"
    : age < 100
    ? "Greetings!"
    : "What an unusual age!";

alert(message);
```


It may be difficult at first to grasp what’s going on. But after a closer look, we can see that it’s just an ordinary sequence of tests:

1. The first question mark checks whether `age < 3`.
2. If true – it returns `'Hi, baby!'`. Otherwise, it continues to the expression after the colon “:”, checking `age < 18`.
3. If that’s true – it returns `'Hello!'`. Otherwise, it continues to the expression after the next colon “:”, checking `age < 100`.
4. If that’s true – it returns `'Greetings!'`. Otherwise, it continues to the expression after the last colon “:”, returning `'What an unusual age!'`.

Here’s how this looks using `if..else`:

```js
if (age < 3) {
  message = 'Hi, baby!';
} else if (age < 18) {
  message = 'Hello!';
} else if (age < 100) {
  message = 'Greetings!';
} else {
  message = 'What an unusual age!';
}
```

# Logical operators

There are four logical operators in JavaScript: `||` (OR), `&&` (AND), `!` (NOT), `??` (Nullish Coalescing). Here we cover the first three, the `??` operator is in the next article.

Although they are called “logical”, they can be applied to values of any type, not only boolean. Their result can also be of any type.

Let’s see the details.

## || (OR)

The “OR” operator is represented with two vertical line symbols:

```javascript
result = a || b;
```

In classical programming, the logical OR is meant to manipulate boolean values only. If any of its arguments are `true`, it returns `true`, otherwise it returns `false`.

In JavaScript, the operator is a little bit trickier and more powerful. But first, let’s see what happens with boolean values.

There are four possible logical combinations:

```js
console.log( true || true );   // true
console.log( false || true );  // true
console.log( true || false );  // true
console.log( false || false ); // false
```

As we can see, the result is always `true` except for the case when both operands are `false`.

If an operand is not a boolean, it’s converted to a boolean for the evaluation.

For instance, the number `1` is treated as `true`, the number `0` as `false`:

```js
if (1 || 0) { // works just like if( true || false )
  alert( 'truthy!' );
}
```

Most of the time, OR `||` is used in an `if` statement to test if _any_ of the given conditions is `true`.

For example:


```js
let hour = 9;

if (hour < 10 || hour > 18) {
  alert( 'The office is closed.' );
}
```

We can pass more conditions:

```js
let hour = 12;
let isWeekend = true;

if (hour < 10 || hour > 18 || isWeekend) {
  alert( 'The office is closed.' ); // it is the weekend
}
```


### OR "||" finds the first truthy value

The logic described above is somewhat classical. Now, let’s bring in the “extra” features of JavaScript.

The extended algorithm works as follows.

Given multiple OR’ed values:

```js
result = value1 || value2 || value3;
```

The OR || operator does the following:

Evaluates operands from left to right.
For each operand, converts it to boolean. If the result is true, stops and returns the original value of that operand.
If all operands have been evaluated (i.e. all were false), returns the last operand.
A value is returned in its original form, without the conversion.

In other words, a chain of OR || returns the first truthy value or the last one if no truthy value is found.

For instance:

```js
console.log(1 || 0); // 1 (1 is truthy)
console.log(null || 1); // 1 (1 is the first truthy value)
console.log(null || 0 || 1); // 1 (the first truthy value)
console.log(undefined || null || 0); // 0 (all falsy, returns the last value)
```

This leads to some interesting usage compared to a “pure, classical, boolean-only OR”.

**Getting the first truthy value from a list of variables or expressions.**

For instance, we have firstName, lastName and nickName variables, all optional (i.e. can be undefined or have falsy values).

Let’s use OR || to choose the one that has the data and show it (or "Anonymous" if nothing set):

```js
let firstName = "";
let lastName = "";
let nickName = "SuperCoder";

console.log( firstName || lastName || nickName || "Anonymous"); // SuperCoder
```

If all variables were falsy, `"Anonymous"` would show up.

**Short-circuit evaluation.**

Another feature of OR `||` operator is the so-called “short-circuit” evaluation.

It means that `||` processes its arguments until the first truthy value is reached, and then the value is returned immediately, without even touching the other argument.

The importance of this feature becomes obvious if an operand isn’t just a value, but an expression with a side effect, such as a variable assignment or a function call.

In the example below, only the second message is printed:

```js
true || alert("not printed");
false || alert("printed");
```

In the first line, the OR `||` operator stops the evaluation immediately upon seeing `true`, so the `alert` isn’t run.

Sometimes, people use this feature to execute commands only if the condition on the left part is falsy.

## && (AND)

The AND operator is represented with two ampersands `&&`:

```js
result = a && b;
```

In classical programming, AND returns `true` if both operands are truthy and `false` otherwise:

```js
console.log( true && true );   // true
console.log( false && true );  // false
console.log( true && false );  // false
console.log( false && false ); // false
```

An example with `if`:

```js
let hour = 12;
let minute = 30;

if (hour == 12 && minute == 30) {
  alert( 'The time is 12:30' );
}
```

Just as with OR, any value is allowed as an operand of AND:

```js
if (1 && 0) { // evaluated as true && false
  alert( "won't work, because the result is falsy" );
}
```

## AND “&&” finds the first falsy value

Given multiple AND’ed values:

```js
result = value1 && value2 && value3;
```


The AND `&&` operator does the following:

- Evaluates operands from left to right.
- For each operand, converts it to a boolean. If the result is `false`, stops and returns the original value of that operand.
- If all operands have been evaluated (i.e. all were truthy), returns the last operand.

In other words, AND returns the first falsy value or the last value if none were found.

The rules above are similar to OR. The difference is that AND returns the first _falsy_ value while OR returns the first _truthy_ one.

Examples:

```js
// if the first operand is truthy,
// AND returns the second operand:
alert( 1 && 0 ); // 0
alert( 1 && 5 ); // 5

// if the first operand is falsy,
// AND returns it. The second operand is ignored
alert( null && 5 ); // null
alert( 0 && "no matter what" ); // 0
```

We can also pass several values in a row. See how the first falsy one is returned:

```js
alert( 1 && 2 && null && 3 ); // null
```

When all values are truthy, the last value is returned:

```js
alert( 1 && 2 && 3 ); // 3, the last one
```

> Precedence of AND && is higher than OR ||
> The precedence of AND && operator is higher than OR ||.
> 
> So the code a && b || c && d is essentially the same as if the && expressions were in parentheses: (a && b) || (c && d).


**Don’t replace `if` with `||` or `&&`**

Sometimes, people use the AND `&&` operator as a “shorter way to write `if`”.

For instance:

```js
let x = 1;

(x > 0) && alert( 'Greater than zero!' );
```

The action in the right part of `&&` would execute only if the evaluation reaches it. That is, only if `(x > 0)` is true.

So we basically have an analogue for:

```js
let x = 1;

if (x > 0) alert( 'Greater than zero!' );
```

Although, the variant with `&&` appears shorter, `if` is more obvious and tends to be a little bit more readable. So we recommend using every construct for its purpose: use `if` if we want `if` and use `&&` if we want AND.

### ! (NOT)
The boolean NOT operator is represented with an exclamation sign !.

The syntax is pretty simple:

```js
result = !value;
```

The operator accepts a single argument and does the following:

Converts the operand to boolean type: true/false.
Returns the inverse value.

For instance:

```js
alert( !true ); // false
alert( !0 ); // true
```

A double NOT `!!` is sometimes used for converting a value to boolean type:

```js
alert( !!"non-empty string" ); // true
alert( !!null ); // false
```

That is, the first NOT converts the value to boolean and returns the inverse, and the second NOT inverses it again. In the end, we have a plain value-to-boolean conversion.

There’s a little more verbose way to do the same thing – a built-in `Boolean` function:

```js
alert( Boolean("non-empty string") ); // true
alert( Boolean(null) ); // false
```

The precedence of NOT `!` is the highest of all logical operators, so it always executes first, before `&&` or `||`.

# Nullish coalescing operator '??'

The nullish coalescing operator is written as two question marks `??`.

As it treats `null` and `undefined` similarly, we’ll use a special term here, in this article. For brevity, we’ll say that a value is “defined” when it’s neither `null` nor `undefined`.

The result of `a ?? b` is:

- if `a` is defined, then `a`,
- if `a` isn’t defined, then `b`.

In other words, `??` returns the first argument if it’s not `null/undefined`. Otherwise, the second one.

The nullish coalescing operator isn’t anything completely new. It’s just a nice syntax to get the first “defined” value of the two.

We can rewrite `result = a ?? b` using the operators that we already know, like this:

```js
result = (a !== null && a !== undefined) ? a : b;
```

Now it should be absolutely clear what ?? does. Let’s see where it helps.

The common use case for ?? is to provide a default value.

For example, here we show user if its value isn’t null/undefined, otherwise Anonymous:

```js
let user;

alert(user ?? "Anonymous"); // Anonymous (user is undefined)
```

Here’s the example with `user` assigned to a name:

```js
let user = "John";
alert(user ?? "Anonymous"); // John (user is not null/undefined)
```

We can also use a sequence of `??` to select the first value from a list that isn’t `null/undefined`.

Let’s say we have a user’s data in variables `firstName`, `lastName` or `nickName`. All of them may be not defined, if the user decided not to fill in the corresponding values.

We’d like to display the user name using one of these variables, or show “Anonymous” if all of them are `null/undefined`.

Let’s use the `??` operator for that:

```js
let firstName = null;
let lastName = null;
let nickName = "Supercoder";

// shows the first defined value:
alert(firstName ?? lastName ?? nickName ?? "Anonymous"); // Supercoder
```


# Loops: while and for

## The “while” loop

The `while` loop has the following syntax:

```js
while (condition) {
  // code
  // so-called "loop body"
}
```


While the condition is truthy, the code from the loop body is executed.

For instance, the loop below outputs i while i < 3:

```js
let i = 0;
while (i < 3) { // shows 0, then 1, then 2
  alert( i );
  i++;
}
```


A single execution of the loop body is called _an iteration_. The loop in the example above makes three iterations.

If `i++` was missing from the example above, the loop would repeat (in theory) forever. In practice, the browser provides ways to stop such loops, and in server-side JavaScript, we can kill the process.

Any expression or variable can be a loop condition, not just comparisons: the condition is evaluated and converted to a boolean by `while`.

For instance, a shorter way to write `while (i != 0)` is `while (i)`:

```js
let i = 3;
while (i) { // when i becomes 0, the condition becomes falsy, and the loop stops
  alert( i );
  i--;
}
```

**Curly braces are not required for a single-line body**

If the loop body has a single statement, we can omit the curly braces `{…}`:

```js
let i = 3;
while (i) alert(i--);
```


## The “do…while” loop

The condition check can be moved below the loop body using the do..while syntax:

```js
do {
  // loop body
} while (condition);
```

The loop will first execute the body, then check the condition, and, while it’s truthy, execute it again and again.

```js
let i = 0;
do {
  alert( i );
  i++;
} while (i < 3);
```

This form of syntax should only be used when you want the body of the loop to execute **at least once** regardless of the condition being truthy. Usually, the other form is preferred: `while(…) {…}`.

## The “for” loop

The for loop is more complex, but it’s also the most commonly used loop.

It looks like this:

```
for (begin; condition; step) {
  // ... loop body ...
}
```

Let’s learn the meaning of these parts by example. The loop below runs alert(i) for i from 0 up to (but not including) 3:

```js
for (let i = 0; i < 3; i++) { // shows 0, then 1, then 2
  alert(i);
}
```

Let’s examine the `for` statement part-by-part:

| part      |             |                                                               |
| --------- | ----------- | ------------------------------------------------------------- |
| begin     | `let i = 0` | executes once upon entering the loop                          |
| condition | `i< 3`      | Checked before every loop iteration. If false, the loop stops |
| body      | `alert(i)`  | Run again and again while the condition is truthy             |
| step      | `i++`       | Executes after the body on each iteration.                    |
The general loop algorithm works like this:

```
Run begin
→ (if condition → run body and run step)
→ (if condition → run body and run step)
→ (if condition → run body and run step)
→ ...
```

That is, `begin` executes once, and then it iterates: after each `condition` test, `body` and `step` are executed.

If you are new to loops, it could help to go back to the example and reproduce how it runs step-by-step on a piece of paper.

Here’s exactly what happens in our case:


```js
// for (let i = 0; i < 3; i++) alert(i)

// run begin
let i = 0
// if condition → run body and run step
if (i < 3) { alert(i); i++ }
// if condition → run body and run step
if (i < 3) { alert(i); i++ }
// if condition → run body and run step
if (i < 3) { alert(i); i++ }
// ...finish, because now i == 3
```

## Breaking the loop

Normally, a loop exits when its condition becomes falsy.

But we can force the exit at any time using the special `break` directive.

For example, the loop below asks the user for a series of numbers, “breaking” when no number is entered:

```js
let sum = 0;

while (true) {
  let value = +prompt("Enter a number", '');
  if (!value) break; // (*)
  sum += value;
}
alert( 'Sum: ' + sum );
```

The `break` directive is activated at the line `(*)` if the user enters an empty line or cancels the input. It stops the loop immediately, passing control to the first line after the loop. Namely, `alert`.

The combination “infinite loop + `break` as needed” is great for situations when a loop’s condition must be checked not in the beginning or end of the loop, but in the middle or even in several places of its body.


## Continue to the next iteration

The `continue` directive is a “lighter version” of `break`. It doesn’t stop the whole loop. Instead, it stops the current iteration and forces the loop to start a new one (if the condition allows).

We can use it if we’re done with the current iteration and would like to move on to the next one.

The loop below uses `continue` to output only odd values:

```js
for (let i = 0; i < 10; i++) {

  // if true, skip the remaining part of the body
  if (i % 2 == 0) continue;
  alert(i); // 1, then 3, 5, 7, 9
}
```

For even values of `i`, the `continue` directive stops executing the body and passes control to the next iteration of `for` (with the next number). So the `alert` is only called for odd values.


**No `break/continue` to the right side of ‘?’**

Please note that syntax constructs that are not expressions cannot be used with the ternary operator `?`. In particular, directives such as `break/continue` aren’t allowed there.

For example, if we take this code:

```js
if (i > 5) {
  alert(i);
} else {
  continue;
}
```

…and rewrite it using a question mark:

```javascript
(i > 5) ? alert(i) : continue; // continue isn't allowed here
```

…it stops working: there’s a syntax error.

This is just another reason not to use the question mark operator `?` instead of `if`.

## Labels for break/continue

Sometimes we need to break out from multiple nested loops at once.

For example, in the code below we loop over `i` and `j`, prompting for the coordinates `(i, j)` from `(0,0)` to `(2,2)`:

```js
for (let i = 0; i < 3; i++) {

  for (let j = 0; j < 3; j++) {

    let input = prompt(`Value at coords (${i},${j})`, '');

    // what if we want to exit from here to Done (below)?
  }
}

alert('Done!');
```

We need a way to stop the process if the user cancels the input.

The ordinary `break` after `input` would only break the inner loop. That’s not sufficient – labels, come to the rescue!

A _label_ is an identifier with a colon before a loop:

```js
labelName: for (...) {
  ...
}
```

The `break <labelName>` statement in the loop below breaks out to the label:

```js
outer: for (let i = 0; i < 3; i++) {

  for (let j = 0; j < 3; j++) {

    let input = prompt(`Value at coords (${i},${j})`, '');

    // if an empty string or canceled, then break out of both loops
    if (!input) break outer; // (*)

    // do something with the value...
  }
}
alert('Done!');
```

In the code above, `break outer` looks upwards for the label named `outer` and breaks out of that loop.

So the control goes straight from `(*)` to `alert('Done!')`.

We can also move the label onto a separate line:

```js
outer:
for (let i = 0; i < 3; i++) { ... }
```

The `continue` directive can also be used with a label. In this case, code execution jumps to the next iteration of the labeled loop.

**Labels do not allow to “jump” anywhere**

Labels do not allow us to jump into an arbitrary place in the code.

For example, it is impossible to do this:

```js
break label; // jump to the label below (doesn't work)

label: for (...)
```

A `break` directive must be inside a code block. Technically, any labelled code block will do, e.g.:

```js
label: {
  // ...
  break label; // works
  // ...
}
```

…Although, 99.9% of the time `break` is used inside loops, as we’ve seen in the examples above.

A `continue` is only possible from inside a loop.


# The "switch" statement

A `switch` statement can replace multiple `if` checks.

It gives a more descriptive way to compare a value with multiple variants.

## The syntax

The `switch` has one or more `case` blocks and an optional default.

It looks like this:

```js
switch(x) {
  case 'value1':  // if (x === 'value1')
    ...
    [break]

  case 'value2':  // if (x === 'value2')
    ...
    [break]

  default:
    ...
    [break]
}
```

- The value of `x` is checked for a strict equality to the value from the first `case` (that is, `value1`) then to the second (`value2`) and so on.
- If the equality is found, `switch` starts to execute the code starting from the corresponding `case`, until the nearest `break` (or until the end of `switch`).
- If no case is matched then the `default` code is executed (if it exists).

## Type matters

Let’s emphasize that the equality check is always strict. The values must be of the same type to match.

For example, let’s consider the code:

```js
let arg = prompt("Enter a value?");
switch (arg) {
  case '0':
  case '1':
    alert( 'One or zero' );
    break;

  case '2':
    alert( 'Two' );
    break;

  case 3:
    alert( 'Never executes!' );
    break;
  default:
    alert( 'An unknown value' );
}
```

1. For `0`, `1`, the first `alert` runs.
2. For `2` the second `alert` runs.
3. But for `3`, the result of the `prompt` is a string `"3"`, which is not strictly equal `===` to the number `3`. So we’ve got a dead code in `case 3`! The `default` variant will execute.

# Functions

Quite often we need to perform a similar action in many places of the script.

For example, we need to show a nice-looking message when a visitor logs in, logs out and maybe somewhere else.

Functions are the main “building blocks” of the program. They allow the code to be called many times without repetition.

We’ve already seen examples of built-in functions, like alert(message), prompt(message, default) and confirm(question). But we can create functions of our own as well.

## Function Declaration

To create a function we can use a function declaration.

It looks like this:

```js
function showMessage() {
  alert( 'Hello everyone!' );
}
```

The `function` keyword goes first, then goes the _name of the function_, then a list of _parameters_ between the parentheses (comma-separated, empty in the example above, we’ll see examples later) and finally the code of the function, also named “the function body”, between curly braces.

```js
function name(parameter1, parameter2, ... parameterN) {
 // body
}
```

Our new function can be called by its name: `showMessage()`.

The call showMessage() executes the code of the function. Here we will see the message two times.

This example clearly demonstrates one of the main purposes of functions: to avoid code duplication.

If we ever need to change the message or the way it is shown, it’s enough to modify the code in one place: the function which outputs it.

## Local variables

A variable declared inside a function is only visible inside that function.

For example:

```js
function showMessage() {
  let message = "Hello, I'm JavaScript!"; // local variable

  alert( message );
}

showMessage(); // Hello, I'm JavaScript!

alert( message ); // <-- Error! The variable is local to the function
```

## Outer Variables

A function can access an outer variable as well, for example:

```js
let userName = 'John';

function showMessage() {
  let message = 'Hello, ' + userName;
  alert(message);
}

showMessage(); // Hello, John
```

The function has full access to the outer variable. It can modify it as well.

For instance:

```js
let userName = 'John';

function showMessage() {
  userName = "Bob"; // (1) changed the outer variable

  let message = 'Hello, ' + userName;
  alert(message);
}

alert( userName ); // John before the function call

showMessage();

alert( userName ); // Bob, the value was modified by the function
```

The outer variable is only used if there’s no local one.

If a same-named variable is declared inside the function then it _shadows_ the outer one. For instance, in the code below the function uses the local `userName`. The outer one is ignored:

```js
let userName = 'John';

function showMessage() {
  let userName = "Bob"; // declare a local variable

  let message = 'Hello, ' + userName; // Bob
  alert(message);
}

// the function will create and use its own userName
showMessage();

alert( userName ); // John, unchanged, the function did not access the outer variable
```

## Parameters

We can pass arbitrary data to functions using parameters.

In the example below, the function has two parameters: `from` and `text`.

```js
function showMessage(from, text) { // parameters: from, text
  alert(from + ': ' + text);
}

showMessage('Ann', 'Hello!'); // Ann: Hello! (1)
showMessage('Ann', "What's up?"); // Ann: What's up? (2)
```

When the function is called in lines (1) and (2), the given values are copied to local variables from and text. Then the function uses them.

Here’s one more example: we have a variable from and pass it to the function. Please note: the function changes from, but the change is not seen outside, because a function always gets a copy of the value:

```js
function showMessage(from, text) {

  from = '*' + from + '*'; // make "from" look nicer

  alert( from + ': ' + text );
}

let from = "Ann";

showMessage(from, "Hello"); // *Ann*: Hello

// the value of "from" is the same, the function modified a local copy
alert( from ); // Ann
```

When a value is passed as a function parameter, it’s also called an argument.

In other words, to put these terms straight:

A parameter is the variable listed inside the parentheses in the function declaration (it’s a declaration time term).
An argument is the value that is passed to the function when it is called (it’s a call time term).
We declare functions listing their parameters, then call them passing arguments.

In the example above, one might say: “the function showMessage is declared with two parameters, then called with two arguments: from and "Hello"”.

## Default values

If a function is called, but an argument is not provided, then the corresponding value becomes undefined.

For instance, the aforementioned function showMessage(from, text) can be called with a single argument:

```js
function showMessage(from, text = "no text given") {
  alert( from + ": " + text );
}

showMessage("Ann"); // Ann: no text given
```

**Default parameters in old JavaScript code**
Several years ago, JavaScript didn’t support the syntax for default parameters. So people used other ways to specify them.

Nowadays, we can come across them in old scripts.

For example, an explicit check for undefined:

```js
function showMessage(from, text) {
  if (text === undefined) {
    text = 'no text given';
  }

  alert( from + ": " + text );
}
```

…Or using the `||` operator:

```js
function showMessage(from, text) {
  // If the value of text is falsy, assign the default value
  // this assumes that text == "" is the same as no text at all
  text = text || 'no text given';
  ...
}
```


## Alternative default parameters

Sometimes it makes sense to assign default values for parameters at a later stage after the function declaration.

We can check if the parameter is passed during the function execution, by comparing it with `undefined`:

```js
function showMessage(text) {
  // ...

  if (text === undefined) { // if the parameter is missing
    text = 'empty message';
  }

  alert(text);
}

showMessage(); // empty message
```


## Returning a value

A function can return a value back into the calling code as the result.

The simplest example would be a function that sums two values:

```js
function sum(a, b) {
  return a + b;
}

let result = sum(1, 2);
console.log( result ); // 3
```



A function with an empty `return` or without it returns `undefined`

If a function does not return a value, it is the same as if it returns `undefined`

```js
function doNothing() { /* empty */ }

alert( doNothing() === undefined ); // true
```

An empty `return` is also the same as `return undefined`:

```js
function doNothing() {
  return;
}

alert( doNothing() === undefined ); // true
```

**One function – one action**

A function should do exactly what is suggested by its name, no more.

Two independent actions usually deserve two functions, even if they are usually called together (in that case we can make a 3rd function that calls those two).

A few examples of breaking this rule:

- `getAge` – would be bad if it shows an `alert` with the age (should only get).
- `createForm` – would be bad if it modifies the document, adding a form to it (should only create it and return).
- `checkPermission` – would be bad if it displays the `access granted/denied` message (should only perform the check and return the result).

These examples assume common meanings of prefixes. You and your team are free to agree on other meanings, but usually they’re not much different. In any case, you should have a firm understanding of what a prefix means, what a prefixed function can and cannot do. All same-prefixed functions should obey the rules. And the team should share the knowledge.


# Function expressions

In JavaScript, a function is not a “magical language structure”, but a special kind of value.

The syntax that we used before is called a _Function Declaration_:

```js
function sayHi() {
  alert( "Hello" );
}
```

There is another syntax for creating a function that is called a Function Expression.

It allows us to create a new function in the middle of any expression.

For example:

```js
let sayHi = function() {
  alert( "Hello" );
};
```

Here we can see a variable `sayHi` getting a value, the new function, created as `function() { alert("Hello"); }`.

As the function creation happens in the context of the assignment expression (to the right side of `=`), this is a _Function Expression_.

Please note, there’s no name after the `function` keyword. Omitting a name is allowed for Function Expressions.

Here we immediately assign it to the variable, so the meaning of these code samples is the same: “create a function and put it into the variable `sayHi`”.

In more advanced situations, that we’ll come across later, a function may be created and immediately called or scheduled for a later execution, not stored anywhere, thus remaining anonymous.

## Function is a value

Let’s reiterate: no matter how the function is created, a function is a value. Both examples above store a function in the `sayHi` variable.

We can even print out that value using `alert`:

```js
function sayHi() {
  alert( "Hello" );
}

alert( sayHi ); // shows the function code
```

Please note that the last line does not run the function, because there are no parentheses after `sayHi`. There are programming languages where any mention of a function name causes its execution, but JavaScript is not like that.

In JavaScript, a function is a value, so we can deal with it as a value. The code above shows its string representation, which is the source code.

Surely, a function is a special value, in the sense that we can call it like `sayHi()`.

But it’s still a value. So we can work with it like with other kinds of values.

We can copy a function to another variable:

```js
function sayHi() {   // (1) create
  alert( "Hello" );
}

let func = sayHi;    // (2) copy

func(); // Hello     // (3) run the copy (it works)!
sayHi(); // Hello    //     this still works too (why wouldn't it)
```

Here’s what happens above in detail:

1. The Function Declaration `(1)` creates the function and puts it into the variable named `sayHi`.
2. Line `(2)` copies it into the variable `func`. Please note again: there are no parentheses after `sayHi`. If there were, then `func = sayHi()` would write _the result of the call_ `sayHi()` into `func`, not _the function_ `sayHi` itself.
3. Now the function can be called as both `sayHi()` and `func()`.

We could also have used a Function Expression to declare `sayHi`, in the first line:

```js
let sayHi = function() { // (1) create
  alert( "Hello" );
};

let func = sayHi;
// ...
```

Everything would work the same.

**Why is there a semicolon at the end?**

You might wonder, why do Function Expressions have a semicolon `;` at the end, but Function Declarations do not:

```js
function sayHi() {
  // ...
}

let sayHi = function() {
  // ...
};
```

The answer is simple: a Function Expression is created here as function(…) {…} inside the assignment statement: let sayHi = …;. The semicolon ; is recommended at the end of the statement, it’s not a part of the function syntax.

The semicolon would be there for a simpler assignment, such as let sayHi = 5;, and it’s also there for a function assignment.

## function callbacks

Let’s look at more examples of passing functions as values and using function expressions.

We’ll write a function `ask(question, yes, no)` with three parameters:

`question`

Text of the question

`yes`

Function to run if the answer is “Yes”

`no`

Function to run if the answer is “No”

The function should ask the `question` and, depending on the user’s answer, call `yes()` or `no()`:

```js
function ask(question, yes, no) {
  if (confirm(question)) yes()
  else no();
}

function showOk() {
  alert( "You agreed." );
}

function showCancel() {
  alert( "You canceled the execution." );
}

// usage: functions showOk, showCancel are passed as arguments to ask
ask("Do you agree?", showOk, showCancel);
```

In practice, such functions are quite useful. The major difference between a real-life `ask` and the example above is that real-life functions use more complex ways to interact with the user than a simple `confirm`. In the browser, such functions usually draw a nice-looking question window. But that’s another story.

**The arguments `showOk` and `showCancel` of `ask` are called _callback functions_ or just _callbacks_.**

The idea is that we pass a function and expect it to be “called back” later if necessary. In our case, `showOk` becomes the callback for “yes” answer, and `showCancel` for “no” answer.

We can use Function Expressions to write an equivalent, shorter function:

```js
function ask(question, yes, no) {
  if (confirm(question)) yes()
  else no();
}

ask(
  "Do you agree?",
  function() { alert("You agreed."); },
  function() { alert("You canceled the execution."); }
);
```


Here, functions are declared right inside the `ask(...)` call. They have no name, and so are called _anonymous_. Such functions are not accessible outside of `ask` (because they are not assigned to variables), but that’s just what we want here.

Such code appears in our scripts very naturally, it’s in the spirit of JavaScript.


**A function is a value representing an “action”**
Regular values like strings or numbers represent the data.

A function can be perceived as an action.

We can pass it between variables and run when we want.

## Function Expression vs Function Declaration

Let’s formulate the key differences between Function Declarations and Expressions.

First, the syntax: how to differentiate between them in the code.

- _Function Declaration:_ a function, declared as a separate statement, in the main code flow:

```js
// Function Declaration
function sum(a, b) {
  return a + b;
}
```

- _Function Expression:_ a function, created inside an expression or inside another syntax construct. Here, the function is created on the right side of the “assignment expression” `=`:

```js
// Function Expression
let sum = function(a, b) {
  return a + b;
};
```

The more subtle difference is _when_ a function is created by the JavaScript engine.

- **A Function Expression is created when the execution reaches it and is usable only from that moment.**

Once the execution flow passes to the right side of the assignment `let sum = function…` – here we go, the function is created and can be used (assigned, called, etc. ) from now on.

Function Declarations are different.

- **A Function Declaration can be called earlier than it is defined.**

For example, a global Function Declaration is visible in the whole script, no matter where it is.

That’s due to internal algorithms. When JavaScript prepares to run the script, it first looks for global Function Declarations in it and creates the functions. We can think of it as an “initialization stage”.

And after all Function Declarations are processed, the code is executed. So it has access to these functions.

For example, this works:

```js
sayHi("John"); // Hello, John

function sayHi(name) {
  alert( `Hello, ${name}` );
}
```

The Function Declaration sayHi is created when JavaScript is preparing to start the script and is visible everywhere in it.

…If it were a Function Expression, then it wouldn’t work

```js
sayHi("John"); // error!

let sayHi = function(name) {  // (*) no magic any more
  alert( `Hello, ${name}` );
};
```

- **In strict mode, when a Function Declaration is within a code block, it’s visible everywhere inside that block. But not outside of it.**


> **When to choose Function Declaration versus Function Expression?**
> As a rule of thumb, when we need to declare a function, the first thing to consider is Function Declaration syntax. It gives more freedom in how to organize our code, because we can call such functions before they are declared.
> 
> That’s also better for readability, as it’s easier to look up function f(…) {…} in the code than let f = function(…) {…};. Function Declarations are more “eye-catching”.
> 
> …But if a Function Declaration does not suit us for some reason, or we need a conditional declaration (we’ve just seen an example), then Function Expression should be used.

## Summary

- Functions are values. They can be assigned, copied or declared in any place of the code.
- If the function is declared as a separate statement in the main code flow, that’s called a “Function Declaration”.
- If the function is created as a part of an expression, it’s called a “Function Expression”.
- Function Declarations are processed before the code block is executed. They are visible everywhere in the block.
- Function Expressions are created when the execution flow reaches them.

In most cases when we need to declare a function, a Function Declaration is preferable, because it is visible prior to the declaration itself. That gives us more flexibility in code organization, and is usually more readable.

So we should use a Function Expression only when a Function Declaration is not fit for the task. We’ve seen a couple of examples of that in this chapter, and will see more in the future.

# Arrow functions, the basics

There’s another very simple and concise syntax for creating functions, that’s often better than Function Expressions.

It’s called “arrow functions”, because it looks like this:

```js
let func = (arg1, arg2, ..., argN) => expression;
```

This creates a function `func` that accepts arguments `arg1..argN`, then evaluates the `expression` on the right side with their use and returns its result.

In other words, it’s the shorter version of:

```js
let func = function(arg1, arg2, ..., argN) {
  return expression;
};
```

Let’s see a concrete example:

```js
let sum = (a, b) => a + b;

/* This arrow function is a shorter form of:

let sum = function(a, b) {
  return a + b;
};
*/

alert( sum(1, 2) ); // 3
```

As you can see, `(a, b) => a + b` means a function that accepts two arguments named `a` and `b`. Upon the execution, it evaluates the expression `a + b` and returns the result.

- If we have only one argument, then parentheses around parameters can be omitted, making that even shorter.

For example:

```js
let double = n => n * 2;
// roughly the same as: let double = function(n) { return n * 2 }

alert( double(3) ); // 6
```

- If there are no arguments, parentheses are empty, but they must be present:

```js
let sayHi = () => alert("Hello!");

sayHi();
```

Arrow functions can be used in the same way as Function Expressions.

For instance, to dynamically create a function:

```js
let age = prompt("What is your age?", 18);

let welcome = (age < 18) ?
  () => alert('Hello!') :
  () => alert("Greetings!");

welcome();
```

Arrow functions may appear unfamiliar and not very readable at first, but that quickly changes as the eyes get used to the structure.

They are very convenient for simple one-line actions, when we’re just too lazy to write many words.

## Multiline arrow functions

The arrow functions that we’ve seen so far were very simple. They took arguments from the left of =>, evaluated and returned the right-side expression with them.

Sometimes we need a more complex function, with multiple expressions and statements. In that case, we can enclose them in curly braces. The major difference is that curly braces require a return within them to return a value (just like a regular function does).

Like this:

```js
let sum = (a, b) => {  // the curly brace opens a multiline function
  let result = a + b;
  return result; // if we use curly braces, then we need an explicit "return"
};

alert( sum(1, 2) ); // 3
```

**More to come**
Here we praised arrow functions for brevity. But that’s not all!

Arrow functions have other interesting features.

To study them in-depth, we first need to get to know some other aspects of JavaScript, so we’ll return to arrow functions later in the chapter Arrow functions revisited.

For now, we can already use arrow functions for one-line actions and callbacks.

## Summary

Arrow functions are handy for simple actions, especially for one-liners. They come in two flavors:

1. Without curly braces: `(...args) => expression` – the right side is an expression: the function evaluates it and returns the result. Parentheses can be omitted, if there’s only a single argument, e.g. `n => n*2`.
2. With curly braces: `(...args) => { body }` – brackets allow us to write multiple statements inside the function, but we need an explicit `return` to return something.

