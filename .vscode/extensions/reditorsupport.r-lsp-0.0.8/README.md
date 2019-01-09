# VS Code R by LSP

R language support for [VS Code](https://code.visualstudio.com/), powered by the [R language server](https://github.com/REditorSupport/languageserver).

## Requirements

`vscode-r-lsp` requires the [R Language Server](https://github.com/REditorSupport/languageserver).
It can be easily installed via CRAN

```r
install.packages("languageserver")
```

The development version can be installed by

```r
source("https://install-github.me/REditorSupport/languageserver")
```

Also, please set the `r.rpath.lsp` to use other R.exe for `r.rterm.xxx`

## License

MIT License.  See [the license](https://github.com/REditorSupport/vscode-r-lsp/blob/master/LICENSE) for more details.
