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
                searchForm.on('submit', function(e) {
                  e.preventDefault();
                  console.log("Form submitted");
                });

                var container = $('<div class="container"></div>');

                var row1 = $('<div class="row"></div>');
                row1.append(EnvirotechHTMLBuilder.formGroupFor('issues'));
                row1.append(EnvirotechHTMLBuilder.formGroupFor('regulations'));
                row1.append(EnvirotechHTMLBuilder.formGroupFor('solutions'));
                container.append(row1);

                var row2 = $('<div class="row"></div>');
                row2.append(EnvirotechHTMLBuilder.formGroupFor('providers'));
                row2.append(EnvirotechHTMLBuilder.submitBtn());
                container.append(row2);

                searchForm.append(container);

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

  formGroupFor: function(type) {
                  var name = 'envirotech-select-' + type;
                  var formGroup = $('<div class="form-group col-xs-4">' +
                      '<label for="'+name+'">'+EnvirotechHTMLBuilder.translate(type)+'</label>' +
                    '</div>');
                  formGroup.append(EnvirotechHTMLBuilder.selectBoxFor(type));
                  return formGroup;
                },

  selectBoxFor: function(type) {
                  var name = 'envirotech-select-' + type;
                  var box = $('<select class="form-control" name="' + name + '" id=' + name + '">').prop("disabled", "disabled");
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
                        EnvirotechHTMLBuilder.loadOptionsForSolutions(box);
                        break;
                      case 'providers':
                        EnvirotechHTMLBuilder.loadOptionsForProviders(box);
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
                          EnvirotechWidget.loadData('regulations', options, function(regulations) {
                            EnvirotechHTMLBuilder.loadDataInto('regulations', regulations);
                          });

                          // Load solutions
                          EnvirotechWidget.loadData('solutions', options, function(solutions) {
                            EnvirotechHTMLBuilder.loadDataInto('solutions', solutions);
                            var ps_options = {
                              size: EnvirotechHTMLBuilder.veryLargeInt,
                              solution_ids: EnvirotechUtility.collectFromArray(solutions, 'source_id').join(',')
                            };

                            EnvirotechWidget.loadData('provider_solutions', ps_options, function(provider_solutions) {
                              var p_options = {
                                size: EnvirotechHTMLBuilder.veryLargeInt,
                                source_ids: EnvirotechUtility.collectFromArray(provider_solutions, 'provider_id').join(',')
                              };
                              EnvirotechWidget.loadData('providers', p_options, function(providers) {
                                EnvirotechHTMLBuilder.loadDataInto('providers', providers);
                              });
                            });
                          });

                        },

  loadOptionsForRegulations: function(box) {
                               EnvirotechHTMLBuilder.disableBoxesFor(['issues', 'solutions', 'providers']);

                               var options = {
                                 regulation_ids: box.val(),
                                 size: EnvirotechHTMLBuilder.veryLargeInt
                               };

                               //Load issues
                               EnvirotechWidget.loadData('issues', options, function(issues) {
                                 EnvirotechHTMLBuilder.loadDataInto('issues', issues);
                               });

                               // Load solutions
                               EnvirotechWidget.loadData('solutions', options, function(solutions) {
                                 EnvirotechHTMLBuilder.loadDataInto('solutions', solutions);
                                 var ps_options = {
                                   size: EnvirotechHTMLBuilder.veryLargeInt,
                                   solution_ids: EnvirotechUtility.collectFromArray(solutions, 'source_id').join(',')
                                 };

                                 EnvirotechWidget.loadData('provider_solutions', ps_options, function(provider_solutions) {
                                   var p_options = {
                                     size: EnvirotechHTMLBuilder.veryLargeInt,
                                     source_ids: EnvirotechUtility.collectFromArray(provider_solutions, 'provider_id').join(',')
                                   };
                                   EnvirotechWidget.loadData('providers', p_options, function(providers) {
                                     EnvirotechHTMLBuilder.loadDataInto('providers', providers);
                                   });
                                 });
                               });
                             },

  loadOptionsForSolutions: function(box) {
                             EnvirotechHTMLBuilder.disableBoxesFor(['providers']);
                             var options = {
                               size: EnvirotechHTMLBuilder.veryLargeInt,
                               solution_ids: box.val()
                             };

                             EnvirotechWidget.loadData('provider_solutions', options, function(provider_solutions) {
                               var p_options = {
                                 size: EnvirotechHTMLBuilder.veryLargeInt,
                                 source_ids: EnvirotechUtility.collectFromArray(provider_solutions, 'provider_id').join(',')
                               };
                               EnvirotechWidget.loadData('providers', p_options, function(providers) {
                                 EnvirotechHTMLBuilder.loadDataInto('providers', providers);
                               });
                             });
                           },

  loadOptionsForProviders: function(box) {
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
                       box.prop("disabled", "disabled").trigger("chosen:updated");
                     });
                   },

  submitBtn: function() {
               return '<div class="form-actions col-xs-8">' +
                 '<input type="submit" class="btn btn-primary btn-lg" value="' + EnvirotechHTMLBuilder.translate('submit') + '">' +
                 '<input type="reset" class="btn btn-default btn-lg" value="' + EnvirotechHTMLBuilder.translate('clear') + '">' +
               '</div>';
             },

  languageSelection: function() {
                       var buttons = $('<div>');
                       buttons.append(EnvirotechHTMLBuilder.languageButtons());
                       return buttons;
                     },

  languageButtons: function() {
                     var buttonsHTML = $('<span>');

                     $.each(window.envirotechLangConf, function(langCode, conf) {
                       var button = $('<a href="#">')
                       .addClass('btn btn-default')
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
                   },

  searchPanel: function() {
                 var panel = $('<div class="panel panel-default">');
                 panel.append(
                   $('<div class="panel-heading">' +
                       '<h3 class="panel-title">' + EnvirotechHTMLBuilder.translate('search') + '</h3>' +
                     '</div>'));

                 var panelBody = $('<div class="panel-body"></div>');
                 panelBody.append(EnvirotechHTMLBuilder.searchForm());
                 panel.append(panelBody);
                 return panel;
               }
};

var EnvirotechUtility = {
  collectFromArray: function(arr, key) {
                      var ret = [];

                      $.each(arr, function(i, v) {
                        ret.push(v[key]);
                      });

                      return ret;
                    }
};
