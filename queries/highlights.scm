(shebang) @keyword
(exec) @keyword

(identifier) @variable

((identifier) @constant
 (#match? @constant "^[A-Z][A-Z\\d_]*$"))

(call_expression
  function: (identifier) @function)

(call_expression
  function: (identifier) @function.builtin
  (#match? @function.builtin "^(append|len|print|println)$"))

(infix_expression
  left: (identifier) @function
  "<<<"
  right: (identifier) @function)

(infix_expression
  left: (identifier) @function
  ">>>"
  right: (identifier) @function)

(infix_expression
  left: (identifier) @function
  "<|" 
  right: (_))

(infix_expression
  left: (_)
  "|>" 
  right: (identifier) @function)

(infix_expression
  left: (_)
  "." 
  right: (identifier) @function)

(infix_expression
  left: (identifier) @function
  operator: (assign_operator)
  right: (infix_expression left: (_) "->" right: (_)))

(infix_expression
  left: (identifier) @function
  operator: (assign_operator)
  right: (infix_expression left: (_) "<<<" right: (_)))

(infix_expression
  left: (identifier) @function
  operator: (assign_operator)
  right: (infix_expression left: (_) ">>>" right: (_)))

(infix_expression
  left: (identifier) @function
  operator: (assign_operator)
  right: (infix_expression left: (_) "<|" right: (_)))

(infix_expression
  left: (identifier) @function
  operator: (assign_operator)
  right: (infix_expression left: (_) "|>" right: (_)))

(infix_expression
  left: (identifier) @function
  operator: (assign_operator)
  right: (infix_expression left: (_) "." right: (_)))

[
  "--"
  "-"
  ":"
  "!"
  "!="
  "*"
  "*"
  "/"
  "%"
  "+"
  "++"
  "<"
  "<="
  "=="
  ">"
  ">="
  "?"
  "|"
  "&"
  "&&"
  "||"
  "<<"
  ">>"
  (assign_operator)
  "<|"
  "|>"
  "->"
  "<<<"
  ">>>"
  "."
] @operator

[
  (int_literal)
  (float_literal)
] @number

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
] @punctuation.delimiter

(comment) @comment @spell
