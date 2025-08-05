// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "TreeSitterGlorp",
    products: [
        .library(name: "TreeSitterGlorp", targets: ["TreeSitterGlorp"]),
    ],
    dependencies: [
        .package(url: "https://github.com/ChimeHQ/SwiftTreeSitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterGlorp",
            dependencies: [],
            path: ".",
            sources: [
                "src/parser.c",
                // NOTE: if your language has an external scanner, add it here.
            ],
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterGlorpTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterGlorp",
            ],
            path: "bindings/swift/TreeSitterGlorpTests"
        )
    ],
    cLanguageStandard: .c11
)
