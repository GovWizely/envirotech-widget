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

  getSelectBoxFor: function(type) {
                     return $('select[name=envirotech-select-' + type + ']');
                   },

  emptyOptionHTML: function() {
                     return '<option value="">' + EnvirotechHTMLBuilder.translate('select_an_option') + '</option>';
                   },

  buildOptionHTML: function(value, text) {
                     return '<option value="' + value + '">' + text + '</option>'
                   },

  selectBoxFor: function(type) {
                  var box = $('<select name="envirotech-select-' + type + '">').prop("disabled", "disabled");
                  box.append(EnvirotechHTMLBuilder.emptyOptionHTML());

                  var options = {
                    size: EnvirotechHTMLBuilder.veryLargeInt
                  };

                  EnvirotechWidget.loadData(type, options, function(data) {
                    EnvirotechHTMLBuilder.loadDataInto(type, data);
                  });

                  box.on("change", function(e) {
                    EnvirotechHTMLBuilder.loadOptionsFor(box, type);
                  });

                  return box;
                },

  loadOptionsFor: function(box, type) {
                    switch(type) {
                      case 'issues':
                        EnvirotechHTMLBuilder.loadOptionsForIssues(box);
                        break;
                      case 'regulations':
                        EnvirotechHTMLBuilder.loadOptionsForRegulations(box);
                        break;
                      case 'solutions':
                        break;
                      case 'providers':
                        break;
                      default:
                        console.log("Invalid type");
                    }
                  },

  loadOptionsForIssues: function(box) {
                          EnvirotechHTMLBuilder.disableBoxesFor(['regulations', 'solutions', 'providers']);

                          var options = {
                            issue_ids: box.val(),
                            size: EnvirotechWidget.veryLargeInt
                          };

                          // Load regulations
                          EnvirotechWidget.loadData('regulations', options, function(data) {
                            EnvirotechHTMLBuilder.loadDataInto('regulations', data);
                          });

                          // Load solutions
                          EnvirotechWidget.loadData('solutions', options, function(data) {
                            EnvirotechHTMLBuilder.loadDataInto('solutions', data);
                          });

                          // Load providers
                          EnvirotechWidget.loadData('providers', options, function(data) {
                            EnvirotechHTMLBuilder.loadDataInto('providers', data);
                          });
                        },

  loadDataInto: function(type, data) {
              var box = EnvirotechHTMLBuilder.getSelectBoxFor(type);
              var langKey = EnvirotechHTMLBuilder.langKey();

              box.empty().append(EnvirotechHTMLBuilder.emptyOptionHTML());

              $.each(data, function(i, record) {
                var optionHTML = EnvirotechHTMLBuilder.buildOptionHTML(record['source_id'], record['name_' + langKey]);
                box.append(optionHTML);
              });

              if(data.length == 1) {
                box.val(data[0].source_id);
              }

              box.prop("disabled", false);
            },

  disableBoxesFor: function(types) {
                     $.each(types, function(i, type) {
                       var box = EnvirotechHTMLBuilder.getSelectBoxFor(type);
                       box.prop("disabled", "disabled");
                     });
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
