# PostCSS Ampify [![Build Status][ci-img]][ci]

[PostCSS] plugin that removes CSS properties not allowed by AMP HTML specification..

[PostCSS]: https://github.com/postcss/postcss
[ci-img]:  https://travis-ci.org/dpiatkowski/postcss-ampify.svg
[ci]:      https://travis-ci.org/dpiatkowski/postcss-ampify

```css
.foo {
    /* Input example */
}
```

```css
.foo {
  /* Output example */
}
```

## Usage

```js
postcss([ require('postcss-ampify') ])
```

See [PostCSS] docs for examples for your environment.
