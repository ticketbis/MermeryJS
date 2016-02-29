## Mermery.js


[![BuildStatus](https://api.travis-ci.org/ticketbis/MermeryJS.svg?branch=gh-pages)](https://travis-ci.org/ticketbis/MermeryJS)

Store form state in HTML5 sessionStorage or localStorage .

To get started, simply include the plugin after your jQuery library is loaded, and add a class of `mermery` to your form. The plugin does its own bindings for that class, otherwise you can set it up to target your forms using the code below:

```js
$('.my-form').mermery();
```

Additionally, you may simply specify a `data-mermery` attribute to your form with its value set to your desired `storage_key` value. This way, you can have several forms with the same input names, and they'll be stored separately in local/sessionStorage.

See the documentation to learn about advanced configuration options, including using localStorage instead of sessionStorage.

*****

### Supported Fields

The following types of fields are supported by Mermery.js.

- `input[type=checkbox]`
- `input[type=color]`
- `input[type=date]`
- `input[type=datetime-local]`
- `input[type=datetime]`
- `input[type=email]`
- `input[type=month]`
- `input[type=number]` (value must be numeric to refill correctly)
- `input[type=radio]`
- `input[type=range]`
- `input[type=search]`
- `input[type=tel]`
- `input[type=text]`
- `input[type=time]`
- `input[type=url]`
- `input[type=week]`
- `textarea`
- `select`

*****

### Browser Support

Browser support for both sessionStorage and JSON (required to parse/stringify data for session storage) are quite deep. If there's no support, the plugin does nothing.

- Internet Explorer 8+
- Firefox 28+
- Chrome 31
- Safari (OSX) 5.1+
- Safari (iOS) 4.0+
- Android 2.1+

*****

### Notes

- Ignore a field by simply adding a class of `mermery-ignore` - the plugin won't save any values that are typed into that field.


*****

### Contributing

To contribute, you'll need [NodeJS](http://nodejs.org/) and [Grunt](http://gruntjs.com/) installed. Fork/clone the repo, then visit the directory in the terminal and type `npm install`. After that you can simply run the `grunt` command to watch the files in the project. It'll automatically lint, test, compile, and minify the plugin files so you can just code.

[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

*****
