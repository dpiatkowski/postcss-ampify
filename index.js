var postcss = require('postcss');

function isRuleIllegal(rule) {
    return rule.selector === '*' // universal selector
        || rule.selector.indexOf(':not') > -1 // :not() selector
        || (rule.selector.indexOf('amp-') > -1 && rule.selector.indexOf(':' > -1)); // pseudo-selectors on amp components
}

function isIllegalProperty(prop) {
    return ['behavior', '-moz-binding', 'filter'].some(p => p === prop);
}

const gpuAcceleratedValues = ['opacity', 'transform'];

function isValueRestricted(decl) {
    if (decl.prop === 'transition-property') {
        return gpuAcceleratedValues.every(val => decl.value !== val);
    }

    if (decl.prop === 'transition') {
        return gpuAcceleratedValues.every(val => decl.value.indexOf(val) === -1);
    }

    return false;
}

module.exports = postcss.plugin('postcss-ampify', () => {
    return (root) => {
        root.walkRules((rule) => {

            // illegal rules
            if (isRuleIllegal(rule)) {
                root.removeChild(rule);
            } else {
                rule.walkDecls((decl) => {

                    // !important qualifier is illegal
                    if (decl.important === true) {
                        decl.important = false;
                    }

                    // illegal properties
                    if (isIllegalProperty(decl.prop)) {
                        rule.removeChild(decl);
                    }

                    // properties with restricted values
                    if (isValueRestricted(decl)) {
                        rule.removeChild(decl);
                    }
                });
            } 
        });
    };
});
