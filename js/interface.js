Fliplet().then(function () {
  var multipleFields = ['to', 'cc', 'bcc', 'replyTo'];
  var data = _.omit(Fliplet.Widget.getData(), ['id', 'uuid']);
  var $textarea = $('textarea');

  multipleFields.forEach(function (name) {
    var value = data[name];
    if (Array.isArray(value) && value.length) {
      $('[name="' + name + '"]').val(value.map(function (val) {
        if (val.name && val.name !== val.email) {
          return val.name + ' <' + val.email + '>';
        }

        return val.email;
      }).join(', ')).closest('.form-group').removeClass('hidden');

      $('[data-display="' + name + '"]').remove();
    }
  });

  function multiple(value) {
    return _.compact(value.split(',').map(function (val) {
      var pieces = val.trim().match(/(.+)<(.+)>/);
      if (!pieces) {
        pieces = [null, val, val];
      }

      var name = pieces[1].trim().replace(/^"/, '').replace(/"$/, '');
      var email = pieces[2].trim().replace(/'"/g, '');

      if (!email) {
        return;
      }

      var person = {
        email: email
      };

      if (name && name !== email) {
        person.name = name;
      }

      return person;
    }));
  }

  $('[data-display]').click(function (event) {
    event.preventDefault();
    $('input[name="' + $(this).data('display') + '"]').closest('.form-group').removeClass('hidden');
    $(this).remove();
  });

  $('form').submit(function (event) {
    event.preventDefault();

    data.subject = $('[name="subject"]').val(),

    multipleFields.forEach(function (name) {
      var value = multiple($('[name="' + name + '"]').val());

      if (value.length) {
        data[name] = value;
      } else if (data[name]) {
        delete data[name];
      }
    });

    Fliplet.Widget.save(data).then(function () {
      Fliplet.Widget.complete();
    });
  });



  Fliplet.Widget.onSaveRequest(function () {
    $('form').submit();
  });

  $textarea.tinymce({
    theme: 'modern',
    plugins: [
      'advlist lists link image charmap hr',
      'searchreplace insertdatetime table textcolor colorpicker code'
    ],
    menubar: false,
    statusbar: true,
    inline: false,
    resize: true,
    min_height: 300,
    toolbar: [
      'formatselect | fontselect fontsizeselect | bold italic underline strikethrough |',
      'alignleft aligncenter alignright alignjustify | link | bullist numlist outdent indent |',
      'blockquote subscript superscript | table charmap hr | removeformat | code'
    ].join(' '),
    setup: function (ed) {
      ed.on('keyup paste', function(e) {
        data.html = ed.getContent();
      });
    }
  });
});