# Email provider

## Provider usage

```js
Fliplet.Widget.open('com.fliplet.email-provider', {
  data: {
    subject: 'Hello world'
  }
}).then(function (result) {

});
```

## Sample result

```json
{
  "subject": "Hi {{name}}",
  "html": "<p>Hi {{name}}, how are you?</p>",
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

---

## Using the provider result

### 1. As a data source hook

```js
Fliplet.DataSources.update(1, {
  hooks: [{
    runOn: ["insert", "update"],
    type: "email",
    payload: result
  }]
});
```

### 2. As a template for `fliplet-communicate`

```
Fliplet.Communicate.sendEmail(result);
```