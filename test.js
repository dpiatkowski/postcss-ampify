import postcss from 'postcss';
import test from 'ava';

import plugin from './';

function run(t, input, output, opts = {}) {
    return postcss([plugin(opts)]).process(input)
        .then(result => {
            t.deepEqual(result.css, output);
            t.deepEqual(result.warnings().length, 0);
        });
}

test('!important is illegal', t => {
    return run(t, 'a {border: 0 !important;}', 'a {border: 0;}', {});
});

test('universal selector is illegal', t => {
    return run(t, '* { color: red; }', '', {});
});

test(':not() selector is illegal', t => {
    return run(t, 'a:not(p) { color: red; }', '', {});
});

test('pseudo-selectors on normal components are legal', t => {
    return run(t, 'img:hover { color: red; }', 'img:hover { color: red; }', {});
});

test('pseudo-selectors on amp components are illegal', t => {
    return run(t, 'amp-img:hover { color: red; }', '', {});
});

test('behavior is illegal property', t => {
    return run(t, 'a { behavior: none; border: 0; }', 'a { border: 0; }', {});
});

test('-moz-binding is illegal property', t => {
    return run(t, 'a { -moz-binding: none; border: 0; }', 'a { border: 0; }', {});
});

test('filter is not performant property', t => {
    return run(t, 'a { filter: none; border: 0; }', 'a { border: 0; }', {});
});

test('GPU-accelerated properties are legal', t => {
    return run(t, 'img { transition: opacity .15s ease-in-out; }', 'img { transition: opacity .15s ease-in-out; }', {});
});

test('GPU-accelerated properties are legal 2', t => {
    return run(t, 'img { transition-property: opacity; }', 'img { transition-property: opacity; }', {});
});

test('non-GPU-accelerated properties are illegal', t => {
    return run(t, 'img { transition-property: width; }', 'img { }', {});
});