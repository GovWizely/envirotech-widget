var HTMLBuilder = {
  translate: function(key) {
              var langCode = window.envirotechLangCode;
              return window.envirotechLangConf[langCode][key];
            },

  searchForm: function() {
                var searchForm = $('<form>');
                searchForm.append(HTMLBuilder.issueBox());
                searchForm.append(HTMLBuilder.submitBtn());

                searchForm.on('submit', function(e) {
                  e.preventDefault();
                  console.log("Form submitted");
                });

                return searchForm;
              },

  issueBox: function() {
              var box = $('<select>');
              box.append('<option value="">' + HTMLBuilder.translate('select_an_option') + '</option>');
              return box;
            },

  submitBtn: function() {
               return '<input type="submit" value="' + HTMLBuilder.translate('submit') + '">';
             },

  languageSelection: function() {
                       var buttons = $('<div>');
                       buttons.append(HTMLBuilder.languageButtons());
                       return buttons;
                     },

  languageButtons: function() {
                     var buttonsHTML = $('<span>');
                     $.each(window.envirotechLangConf, function(langCode, conf) {
                       var button = $('<a href="#">');
                       button.addClass('envirotech-lang-btn');
                       button.html(conf['name']);
                       button.data('lang_code', langCode);

                       button.on("click", function(e) {
                         e.preventDefault();
                         window.envirotechLangCode = $(this).data('lang_code');
                         EnvirotechWidget.initialize();
                       });
                       buttonsHTML.append(button);
                     });
                     return buttonsHTML;
                   }
};
