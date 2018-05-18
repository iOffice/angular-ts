# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) and this project
adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).


## [Unreleased]


## [1.1.0] - May 18, 2018
- Added `loadNgModuleNoDefault` so that ngModules may be exported with their name ending in
  `Module`. This is for projects where the linter prohibits the use of `export default`.
- Fixed types for `ngRegister`: `name` and `requires` properties.


## [1.0.2] - May 1, 2018
- Added file to npm ignore.


## [1.0.1] - March 27, 2018
- Verifying tc-build process.
- Added permissions to team city to create releases.


## [1.0.0] - March 27, 2018
- Published to npm under the `@ioffice` scope


[Unreleased]: https://github.com/ioffice/angular-ts/compare/1.1.0...HEAD
[1.1.0]: https://github.com/ioffice/angular-ts/compare/1.0.2...1.1.0
[1.0.2]: https://github.com/ioffice/angular-ts/compare/1.0.1...1.0.2
[1.0.1]: https://github.com/ioffice/angular-ts/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/ioffice/angular-ts/compare/v0.3.0...1.0.0
