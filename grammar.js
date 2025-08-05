/**
 * @file tree sitter parser for glorp
 * @author Macsen Casaus <macsencasaus@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
    assign: 100,
    pipe: 125,
    function: 150,
    tuple: 175,
    ternary: 200,
    lor: 250,
    land: 251,
    bor: 252,
    xor: 253,
    band: 254,
    equals: 300,
    shift: 350,
    append: 400,
    sum: 500,
    product: 600,
    prefix: 700,
    index: 800,
    compose: 900,
    call: 1000,
    field: 1050,
    unit: 1100,
};

const ASSOC = {
    left: 1,
    right: 2,
};

const FLAG = {
    COLON: 1,
    TUPLE: 2,
    BOR_FLAG: 4,
};

module.exports = grammar({
    name: "glorp",

    extras: ($) => [/\s/, $.comment],

    rules: {
        program: ($) => optional($._expressions),

        comment: (_) => token(/#.*/),

        _expressions: ($) => repeat1(seq($._expression, optional(";"))),

        _expression: ($) =>
            choice(
                $.identifier,
                $.char_literal,
                $.int_literal,
                $.float_literal,
                $.list_literal,
                $.block_expression,
                $.prefix_expression,
                $.assign_expression,
                $.infix_expression,
                $.ternary_expression,
                $.call_expression,
                $.index_expression,
                $.grouped_expression,
                $.unit_expression,
            ),

        unit_expression: (_) => prec(PREC.unit, "()"),

        identifier: (_) => /[a-zA-Z_][a-zA-Z0-9_]*/,

        char_literal: (_) => /([^\\'\n]|\\[abfnrtv\\'"0-7xuU])/,

        int_literal: (_) => /\d+/,

        float_literal: (_) => /(?:\d+\.\d*|\.\d+|\d+)(?:[eE][+-]?\d+)?/,

        list_literal: ($) =>
            field("value", seq("[", commaSep($._expression), "]")),

        block_expression: ($) => seq("{", optional($._expressions), "}"),

        prefix_expression: ($) =>
            prec(
                PREC.prefix,
                seq($._prefix_operator, field("right", $._expression)),
            ),

        assign_expression: ($) =>
            prec.right(
                PREC.assign,
                seq(
                    field("left", $._expression),
                    choice("=", "::"),
                    field("right", $._expression),
                ),
            ),

        infix_expression1: ($) => {
            const table = [
                [PREC.assign, choice("=", "::"), ASSOC.right],
                [PREC.pipe, "<|", ASSOC.left],
                [PREC.pipe, "|>", ASSOC.right],
                [PREC.function, "->", ASSOC.right],
                [PREC.tuple, ",", ASSOC.right],
                [PREC.lor, "||", ASSOC.left],
                [PREC.land, "&&", ASSOC.left],
                [PREC.bor, "|", ASSOC.left],
                [PREC.xor, "^", ASSOC.left],
                [PREC.band, "&", ASSOC.left],
                [
                    PREC.equals,
                    choice("==", "!=", ">", "<", ">=", "<="),
                    ASSOC.left,
                ],
                [PREC.shift, choice("<<", ">>"), ASSOC.left],
                [PREC.append, ":", ASSOC.right],
                [PREC.sum, choice("+", "-"), ASSOC.left],
                [PREC.product, choice("*", "/", "%"), ASSOC.left],
                [PREC.compose, "<<<", ASSOC.left],
                [PREC.compose, ">>>", ASSOC.right],
                [PREC.field, ".", ASSOC.left],
            ];

            return choice(
                ...table.map(([precedence, operator, assoc]) =>
                    // @ts-ignore
                    (assoc == ASSOC.left ? prec.left : prec.right)(
                        // @ts-ignore
                        precedence,
                        seq(
                            field("left", $._expression),
                            // @ts-ignore
                            operator,
                            field("right", $._expression),
                        ),
                    ),
                ),
            );
        },

        infix_expression: ($) => {
            const table = [
                [PREC.assign, choice("=", "::"), ASSOC.right],
                [PREC.pipe, "<|", ASSOC.left],
                [PREC.pipe, "|>", ASSOC.right],
                [PREC.function, "->", ASSOC.right],
                [PREC.tuple, ",", ASSOC.right],
                [PREC.lor, "||", ASSOC.left],
                [PREC.land, "&&", ASSOC.left],
                [PREC.bor, "|", ASSOC.left],
                [PREC.xor, "^", ASSOC.left],
                [PREC.band, "&", ASSOC.left],
                [
                    PREC.equals,
                    choice("==", "!=", ">", "<", ">=", "<="),
                    ASSOC.left,
                ],
                [PREC.shift, choice("<<", ">>"), ASSOC.left],
                [PREC.append, ":", ASSOC.right],
                [PREC.sum, choice("+", "-"), ASSOC.left],
                [PREC.product, choice("*", "/", "%"), ASSOC.left],
                [PREC.compose, "<<<", ASSOC.left],
                [PREC.compose, ">>>", ASSOC.right],
                [PREC.field, ".", ASSOC.left],
            ];

            return choice(
                ...table.map(([precedence, operator, assoc]) =>
                    // @ts-ignore
                    (assoc == ASSOC.left ? prec.left : prec.right)(
                        // @ts-ignore
                        precedence,
                        seq(
                            field("left", $._expression),
                            // @ts-ignore
                            operator,
                            field("right", $._expression),
                        ),
                    ),
                ),
            );
        },

        ternary_expression: ($) =>
            prec.left(
                PREC.ternary,
                seq(
                    field("condition", $._expression),
                    "?",
                    field("consequence", $._expression),
                    ":",
                    field("alternative", $._expression),
                ),
            ),

        call_expression: ($) =>
            prec(
                PREC.call,
                seq(
                    field("function", $._expression),
                    field("argument", seq("(", commaSep($._expression), ")")),
                ),
            ),

        index_expression: ($) =>
            prec(
                PREC.call,
                seq(
                    field("list", $._expression),
                    field("index", seq("[", $._expression, "]")),
                ),
            ),

        grouped_expression: ($) => seq("(", $._expression, ")"),

        _prefix_operator: (_) => choice("-", "!", "++", "--"),
    },
});

/**
 * @param {Rule} rule
 *
 * @returns {ChoiceRule}
 */
function commaSep(rule) {
    return optional(seq(repeat(seq(rule, ",")), rule, optional(",")));
}
