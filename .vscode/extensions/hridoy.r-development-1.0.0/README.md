# R Language Development Toolkit

**Now Updated for R 3.4.1 release**

This extension for Visual Studio Code adds snippets for R Language. More Snippets will be coming soon just release.

[Use Extension](https://github.com/hridoy/r-development-vscode/blob/master/img/snippest-preview.jpg)

## Contributors

<!-- Contributors table start -->
[![Hridoy](https://avatars.githubusercontent.com/hridoy?s=100)<br /><sub>Hridoy</sub>](http://github.com/hridoy)<br />

<!-- Contributors table END -->
See the [CHANGELOG](https://github.com/hridoy/r-development-vscode/master/CHANGELOG.md) for the latest changes




# Usage
Just type the trigger and hit the tab key. For example...

    lm

Expands to...

    ### load lme4 for mixed models
    library(lme4)
    
    ### random intercept and random slope model
    modelName <- lmer(DV ~ fixedFactor1 +* fixedFactor2 + (1 + randomSlope|randomInt), data=df)
    summary(modelName)

Type part of a snippet, press `enter`, and the snippet unfolds.

## Main triggers
```r


"plot": templates for plotting in base R
"edit": options useful for data cleansing and saving
"desc": descriptive statistics of data
"ttest": distinct types of t-test
"aov": distinct analysis of variance models
"lm": linear and logistic regression
"lmem": linear mixed effects models
```

  ```
  ```

## Extra triggers
```r

"subset": make subsets of a DF
"read": read/load/install data/packages into R
"save": save plots, dfs, tables, etc.
"tikz": template for creating R plots in LaTeX

Note All snippets have the following scopes:

source.r, text.html.markdown.knitr, text.tex.latex, text.html.markdown.rmarkdown
```

Alternatively, press `Ctrl`+`Space` (Windows, Linux) or `Cmd`+`Space` (OSX) to activate snippets from within the editor.

## Installation

1. Install Visual Studio Code 1.10.0 or higher
2. Launch Code
3. From the command palette `Ctrl`-`Shift`-`P` (Windows, Linux) or `Cmd`-`Shift`-`P` (OSX)
4. Select `Install Extension`
5. Choose the extension
6. Reload Visual Studio Code