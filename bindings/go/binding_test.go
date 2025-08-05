package tree_sitter_glorp_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_glorp "github.com/macsencasaus/tree-sitter-glorp/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_glorp.Language())
	if language == nil {
		t.Errorf("Error loading Glorp grammar")
	}
}
