# Email provider

## Usage

```js
Fliplet.Widget.open('com.fliplet.email-provider', {
  data: {
    subject: 'Hello world'
  }
}).then(function (results) {

});

## Sample of results

```json
{
  "subject": "Hi {{name}}",
  "body": "<p>Hi {{name}}, how are you?</p>",
  "to": [
    {
      "email": "alice@example.org",
      "name": "Alice"
    },
    {
      "email": "bob@example.org"
    },
    {
      "email": "{{email}}",
      "name": "{{name}}"
    }
  ]
}
```