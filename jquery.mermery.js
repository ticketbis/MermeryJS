/*
 * mermery.js
 * http://github.com/eduardoperrino/Mermery.js
 * Author: Eduardo Perrino
 * Licensed under the MIT, GPL licenses.
 * Version: 0.0.1
 */
; // jshint ignore:line
(function jQueryMermeryNamespace(window, $) {

    // EVENTS
    var _eventsSubmit = 'submit.mermery.js';

    // REGULAR EXPRESSIONS
    var _reAction = /^(?:CLEAR|REMOVE|STASH|UNSTASH)$/i;

    // METHODS

    // check if a value is undefined.
    function isUndefined(value) {
        return value === undefined;
    }

    // stash a value to our session store object.
    function stash(storage, storageKey, key, value) {
        // if a value isn't specified; return null
        if (isUndefined(value) || value === null) {
            return null;
        }
        // get the mermery storage object.
        var store = window.JSON.parse(storage.getItem(storageKey));
        // if it doesn't exist, create an empty object.
        if (store === null) {
            store = {};
        }

        // if a value is specified.
        // create an append object literal.
        var append = {};
        // add the new value to the object that we'll append to the store object.
        append[key] = value;
        // extend the mermery store object.
        // in ES6 this can be shortened to just $.extend(store, {[key]: value}), as there would be no need
        // to create a temporary storage object.
        $.extend(store, append);
        // re-session the mermery store again.
        storage.setItem(storageKey, window.JSON.stringify(store));
        // return the value.
        return value;
    }

    // unstash the value from our session store object.
    function unstash(storage, storageKey, key) {
        // get the mermery storage object.
        var store = window.JSON.parse(storage.getItem(storageKey));
        // if it doesn't exist, create an empty object.
        if (store === null) {
            store = {};
        }
        // return the store value if the store value exists; otherwise, null.
        return !isUndefined(store[key]) ? store[key] : null;
    }

    // clear the sessionStorage key based on the options specified.
    function clear(storage, storageKey) {
        // clear value for our storage key.
        storage.removeItem(storageKey);
    }

    // check if a value is a boolean datatype.
    function isBoolean(value) {
        return $.type(value) === 'boolean';
    }

    // check if a value is an object.
    function isObject(value) {
        return $.type(value) === 'object';
    }

    // check if a value is a string datatype and has a length greater than zero (trims whitespace as well).
    function isString(value) {
        return $.type(value) === 'string' && $.trim(value).length > 0;
    }

    // sanitize a particular string option.
    function sanitizeOption(key, defaultKey) {
        // if a string type, then return the key; otherwise the default key.
        return isString(key) ? key : defaultKey;
    }

    // PLUGIN LOGIC

    $.fn.extend({
        // naming our jQuery plugin function.
        mermery: function mermery(action, options) {
            // set our options from the defaults, overriding with the
            // parameter we pass into this function.
            options = $.extend({}, $.fn.mermery.options, options);

            // jscs only workaround
            options.clearOnSubmit = options.clear_on_submit;
            options.clearOnUnload = options.clear_on_unload;
            options.storageMethod = options.storage_method;
            options.storageKey = options.storage_key;
            options.storageKeyPrefix = options.storage_key_prefix;

            // initialize as null by default.
            var storage = null;
            // only 'local' or 'session' are valid options
            if (isString(options.storageMethod)) {
                storage = options.storageMethod.toUpperCase() === 'LOCAL' ? window.localStorage : window.sessionStorage;
            } else if (options.storageMethod !== null && isObject(options.storageMethod)) {
                storage = options.storageMethod;
            }

            // if null or the storage object doesn't contain the valid functions required, then return this.
            if (storage === null || !(isObject(storage) && 'getItem' in storage && 'removeItem' in storage && 'setItem' in storage)) {
                // to maintain chaining in jQuery.
                return this;
            }

            // check the action is valid and convert to uppercase.
            action = isString(action) && _reAction.test(action) ? action.toUpperCase() : 'STASH';

            // strings related to the find functions and event handling.
            var findFields = 'input[id], input[name], select[id], select[name], textarea[id], textarea[name]';

            // sanitize the options strings.
            options.storageKey = sanitizeOption(options.storageKey, 'mermery');
            options.storageKeyPrefix = sanitizeOption(options.storageKeyPrefix, '');

            // iterate through all the matching elements and return
            // the jQuery object to preserve chaining in jQuery.
            return this.each(function eachForm() {
                var $form = $(this);
                var dataAttribute = $form.attr('data-mermery');

                // the data attribute is useful if exist more than one form element
                // append the custom prefix and determine if the data attribute is valid.
                var storageKey = options.storageKeyPrefix + (isString(dataAttribute) ? dataAttribute : options.storageKey);

                switch (action) {
                    case 'CLEAR':
                    case 'REMOVE':
                        clear(storage, storageKey);
                        break;
                    case 'UNSTASH':
                        // load values for all forms from storage in order of the DOM
                        $form.find('*').filter(findFields).each(function eachNode() {
                            var $element = $(this);
                            var name = $element.attr('name');
                            if (isUndefined(name)) {
                                name = $element.attr('id');
                                if (isUndefined(name)) {
                                    return $form;
                                }
                            }
                            var value = null;
                            // tagName returns an uppercase value in HTML5.
                            switch (this.tagName) {
                                case 'INPUT':
                                case 'TEXTAREA':
                                    var type = $element.attr('type');
                                    if (type === 'checkbox') {
                                        var checkedValue = $element.attr('value');
                                        if (!isString(checkedValue)) {
                                            checkedValue = '';
                                        }
                                        value = unstash(storage, storageKey, name + checkedValue);
                                        if (value !== null && value !== this.checked) {
                                            this.checked = (value === true);
                                            $element.trigger('change');
                                        }
                                    } else if (type === 'radio') {
                                        value = unstash(storage, storageKey, name);
                                        if (value !== null && value !== this.checked) {
                                            this.checked = ($element.val() === value);
                                            $element.trigger('change');
                                        }
                                    } else {
                                        value = unstash(storage, storageKey, name);
                                        if (value !== null && !$element.is('[readonly]') && $element.is(':enabled') && $element.val() !== value) {
                                            $element.val(value).trigger('change');
                                        }
                                    }
                                    break;

                                case 'SELECT':
                                    value = unstash(storage, storageKey, name);
                                    if (value !== null) {
                                        $.each(($.isArray(value) ? value : [value]), function eachValue(index, option) {
                                            $element.find('option').filter(function eachOption() {
                                                var $option = $(this);
                                                return ($option.val() === option || $option.html() === option);
                                            }).prop('selected', true).trigger('change');
                                        });
                                    }
                                    break;
                                default:
                                    break;
                            }

                        });
                        break;
                    case 'STASH':
                        $form.find('*').filter(findFields).each(function eachNode() {
                            // cache the jQuery object.
                            var $element = $(this);
                            // get the name attribute.
                            var name = $element.attr('name');
                            // if the name attribute doesn't exist, determine the id attribute instead.
                            if (isUndefined(name)) {
                                // get the id attribute.
                                name = $element.attr('id');
                                // a name attribute is required to store the element data.
                                if (isUndefined(name)) {
                                    return;
                                }

                            }
                            // get the value attribute.
                            var value = $element.attr('value');
                            // pre-append the name attribute with the value if a checkbox; otherwise, use the name only.
                            var stashName = (this.type === 'checkbox' && !isUndefined(value)) ? name + value : name;
                            stash(storage, storageKey, stashName, this.type === 'checkbox' ? $element.prop('checked') : $element.val());

                        });

                        // clear the storage on submit.
                        $form.on(_eventsSubmit, function onClick() {
                            // if not a boolean datatype or is equal to true, then clear the storage.
                            if (!isBoolean(options.clearOnSubmit) || options.clearOnSubmit) {
                                clear(storage, storageKey);
                            }
                        });

                        // clear the storage on unload.
                        $(window).unload(
                            function () {
                                if (!isBoolean(options.clearOnUnload) || options.clearOnUnload) {
                                    clear(storage, storageKey);
                                }
                            }
                        );

                        break;
                    default:
                        break;
                } // end actions.

            }); // return each plugin call.

        }, // end plugin function.

    }); // end jQuery extend.

    // DEFAULTS

    // default options for mermery.js.
    $.fn.mermery.options = {
        clear_on_submit: true,
        clear_on_unload: true,
        storage_method: 'session',
        storage_key: 'mermery',
        storage_key_prefix: '',
    };

    // onload.
    $(function mermeryReady() {
        // load all forms that have the mermery class or data-mermery attribute associated with them.
        $('form.mermery, form[data-mermery]').mermery();

    });

})(window, window.jQuery);
