var EnvirotechHTMLBuilder = {
  veryLargeInt: 999999,

  translate: function(key) {
              var langCode = window.envirotechLangCode;
              return window.envirotechLangConf[langCode][key];
            },

  langKey: function() {
             return EnvirotechHTMLBuilder.translate('key');
           },

  searchForm: function() {
                var searchForm = $('<form>');
                searchForm.append(EnvirotechHTMLBuilder.selectBoxFor('issues'));
                searchForm.append(EnvirotechHTMLBuilder.selectBoxFor('regulations'));
                searchForm.append(EnvirotechHTMLBuilder.selectBoxFor('solutions'));
                searchForm.append(EnvirotechHTMLBuilder.selectBoxFor('providers'));
                searchForm.append(EnvirotechHTMLBuilder.submitBtn());

                searchForm.on('submit', function(e) {
                  e.preventDefault();
                  console.log("Form submitted");
                });

                return searchForm;
              },

  selectBoxFor: function(type) {
                  var box = $('<select>');
                  box.append('<option value="">' + EnvirotechHTMLBuilder.translate('select_an_option') + '</option>');

                  var options = {
                    size: EnvirotechHTMLBuilder.veryLargeInt
                  };

                  EnvirotechWidget.loadData('/envirotech/' + type + '/search', options, function(data) {
                    var langKey = EnvirotechHTMLBuilder.langKey();
                    $.each(data.results, function(index, record) {
                      box.append('<option value="' + record['source_id'] + '">' + record['name_' + langKey] + '</option>')
                    });
                  });

                  return box;
                },

  submitBtn: function() {
               return '<input type="submit" value="' + EnvirotechHTMLBuilder.translate('submit') + '">';
             },

  languageSelection: function() {
                       var buttons = $('<div>');
                       buttons.append(EnvirotechHTMLBuilder.languageButtons());
                       return buttons;
                     },

  languageButtons: function() {
                     var buttonsHTML = $('<span>');

                     $.each(window.envirotechLangConf, function(langCode, conf) {
                       var button = $('<a href="#" class="envirotech-language-btn">')
                       .addClass('envirotech-lang-btn')
                       .html(conf['name'])
                       .data('lang_code', langCode);

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
