import XCTest
import SwiftTreeSitter
import TreeSitterGlorp

final class TreeSitterGlorpTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_glorp())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Glorp grammar")
    }
}
