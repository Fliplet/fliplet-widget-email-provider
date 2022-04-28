Fliplet().then(function() {
  function multiple(type, value) {
    if (!type || !value) {
      return;
    }

    return _.compact(value.split(',').map(function(val) {
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
        type: type,
        email: email
      };

      if (name && name !== email) {
        person.name = name;
      }

      return person;
    }));
  }

  function checkMultipleFieldToggles() {
    if (!$('.data-display [data-display]').length) {
      $('.data-display').remove();
      Fliplet.Widget.autosize();
    }
  }

  var multipleFields = ['to', 'cc', 'bcc'];
  var data = _.omit(Fliplet.Widget.getData(), ['id', 'uuid']);
  var $textarea = $('textarea');

  function showGroup($el) {
    $el.closest('.form-group').removeClass('hidden');
  }

  multipleFields.forEach(function(name) {
    var value = _.filter(data.to, { type: name });

    if (Array.isArray(value) && value.length) {
      showGroup($('[name="' + name + '"]').val(value.map(function(val) {
        if (val.name && val.name !== val.email) {
          return val.name + ' <' + val.email + '>';
        }

        return val.email;
      }).join(', ')));

      $('[data-display="' + name + '"]').remove();
    }
  });

  checkMultipleFieldToggles();

  if (data.headers && data.headers['Reply-To']) {
    showGroup($('[name="replyTo"]').val(data.headers['Reply-To']));
    $('[data-display="replyTo"]').hide();
  }

  $('[data-display]').click(function(event) {
    event.preventDefault();
    showGroup($('input[name="' + $(this).data('display') + '"]'));
    $(this).remove();
    checkMultipleFieldToggles();
    Fliplet.Widget.autosize();
  });

  $('form').submit(function(event) {
    event.preventDefault();

    data.headers = data.headers || {};
    data.to = [];
    data.subject = $('[name="subject"]').val();

    multipleFields.forEach(function(name) {
      var value = $('[name="' + name + '"]').val();

      if (!value) {
        return;
      }

      multiple(name, value).forEach(function(email) {
        if (email) {
          data.to.push(email);
        }
      });
    });

    var replyTo = $('[name="replyTo"]').val();

    data.headers['Reply-To'] = replyTo ? replyTo : 'no-reply@fliplet.com';

    // Don't pass back the options
    delete data.options;

    Fliplet.Widget.save(data).then(function() {
      Fliplet.Widget.complete();
    });
  });

  $(window).on('resize', Fliplet.Widget.autosize);

  Fliplet.Widget.onSaveRequest(function() {
    $('form').submit();
  });

  $textarea.tinymce({
    plugins: [
      'lists advlist image charmap hr code',
      'searchreplace wordcount insertdatetime table textcolor colorpicker'
    ],
    toolbar: [
      'formatselect |',
      'bold italic underline strikethrough |',
      'forecolor backcolor |',
      'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent |',
      'blockquote subscript superscript | table insertdatetime charmap hr |',
      'removeformat | code'
    ].join(' '),
    menubar: false,
    statusbar: false,
    min_height: 300,
    setup: function(ed) {
      ed.on('change keyup paste', function() {
        data.html = ed.getContent();
      });
    }
  });
});
