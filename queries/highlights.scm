; function calls

(call_expression
  function: (identifier) @Function)

(call_expression
  function: (identifier) @function.builtin
  (#match? @function.builtin "^(append|len|print|println)$"))

; function definitions

(assign_expression
    left: (identifier) @Function
    right: (function_literal))

; identifiers

(identifier) @Identifier

; operators

[
  "--"
  "-"
  ":"
  "::"
  "!"
  "!="
  "*"
  "*"
  "/"
  "%"
  "+"
  "++"
  "->"
  "<"
  "<="
  "="
  "=="
  ">"
  ">="
  "?"
  "."
] @operator

; literals

[
    (int_literal)
] @number

; punctuation

[
 "("
 ")"
 "{"
 "}"
 "["
 "]"
] @punctuation.bracket

[
 ","
 ";"
 "\\"
] @punctuation.delimiter

; comments

(comment) @comment @spell
