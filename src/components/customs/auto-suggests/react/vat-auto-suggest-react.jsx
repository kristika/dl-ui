import React from 'react';
import AutoSuggestReact from '../../../form/basic/react/auto-suggest-react.jsx';
import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api";

const resource = 'master/vats';

const empty = {
    name: '',
    rate: 0,
    toString: function () {
        return '';
    }
}

'use strict';

export default class VatAutoSuggestReact extends AutoSuggestReact {
    constructor(props) {
        super(props);
    }

    init(props) {
        var options = Object.assign({}, VatAutoSuggestReact.defaultProps.options, props.options);
        var initialValue = Object.assign({}, empty, props.value);
        initialValue.toString = function () {
            return [this.name, this.rate]
                .filter((item, index) => {
                    return item && item.toString().trim().length > 0;
                }).join(" - ");
        };
        this.setState({ value: initialValue, label: initialValue.toString(), options: options, suggestions: [initialValue] });
    }
}

VatAutoSuggestReact.propTypes = {
    options: React.PropTypes.shape({
        readOnly: React.PropTypes.bool,
        suggestions: React.PropTypes.oneOfType([
            React.PropTypes.array,
            React.PropTypes.func
        ])
    })
};

VatAutoSuggestReact.defaultProps = {
    options: {
        readOnly: false,
        suggestions: function (keyword, filter) {
            var config = Container.instance.get(Config);
            var endpoint = config.getEndpoint("core");

            return endpoint.find(resource, { keyword: keyword, filter: JSON.stringify(filter) })
                .then(results => {
                    return results.data.map(vat => {
                        vat.toString = function () {
                            return [this.name, this.rate]
                                .filter((item, index) => {
                                    return item && item.toString().trim().length > 0;
                                }).join(" - ");
                        }
                        return vat;
                    })
                })
        }
    }
};
