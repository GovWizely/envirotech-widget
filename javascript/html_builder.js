var EnvirotechHTMLBuilder = {
  veryLargeInt: 999999,
  resultsPerPage: 25,

  translate: function (key) {
              var langCode = window.envirotechLangCode;
              return window.envirotechLangConf[langCode][key];
            },

  langKey: function () {
             return EnvirotechHTMLBuilder.translate('key');
           },

  resultsDivId: function (regulationId) {
                  return 'enviro-regulation-table-' + regulationId;
                },

  resultsListId: function (regulationId) {
                   return 'enviro-results-list-' + regulationId;
                 },

  searchForm: function () {
                var searchForm = $('<form>');
                searchForm.on('submit', function (e) {
                  e.preventDefault();
                  EnvirotechHTMLBuilder.loadResults();
                  return false;
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

  getSelectBoxFor: function (type) {
                     return $('select[name=envirotech-select-' + type + ']');
                   },

  emptyOptionHTML: function () {
                     return '<option value="">' + EnvirotechHTMLBuilder.translate('select_an_option') + '</option>';
                   },

  buildOptionHTML: function (value, text) {
                     return '<option value="' + value + '">' + text + '</option>'
                   },

  formGroupFor: function (type) {
                  var name = 'envirotech-select-' + type;
                  var formGroup = $('<div class="form-group col-xs-4">' +
                      '<label for="'+name+'">'+EnvirotechHTMLBuilder.translate(type)+'</label>' +
                    '</div>');
                  formGroup.append(EnvirotechHTMLBuilder.selectBoxFor(type));
                  return formGroup;
                },

  selectBoxFor: function (type) {
                  var name = 'envirotech-select-' + type;
                  var box = $('<select class="form-control" name="' + name + '" id=' + name + '">').prop("disabled", "disabled");
                  box.append(EnvirotechHTMLBuilder.emptyOptionHTML());

                  var options = {
                    size: EnvirotechHTMLBuilder.veryLargeInt
                  };

                  EnvirotechWidget.loadData(type, options, function (data) {
                    EnvirotechHTMLBuilder.loadDataInto(type, data);
                  }, true);

                  box.on("change", function (e) {
                    EnvirotechHTMLBuilder.loadOptionsFor(box, type);
                  });

                  return box;
                },

  loadOptionsFor: function (box, type) {
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

  loadOptionsForIssues: function (box) {
                          EnvirotechHTMLBuilder.disableBoxesFor(['regulations', 'solutions', 'providers']);

                          var options = {
                            issue_ids: box.val(),
                            size: EnvirotechWidget.veryLargeInt
                          };

                          // Load regulations
                          EnvirotechWidget.loadData('regulations', options, function (regulations) {
                            EnvirotechHTMLBuilder.loadDataInto('regulations', regulations);
                          });

                          // Load solutions
                          EnvirotechWidget.loadData('solutions', options, function (solutions) {
                            EnvirotechHTMLBuilder.loadDataInto('solutions', solutions);
                            var ps_options = {
                              size: EnvirotechHTMLBuilder.veryLargeInt,
                              solution_ids: EnvirotechUtility.collectFromArray(solutions, 'source_id').join(',')
                            };

                            EnvirotechWidget.loadData('provider_solutions', ps_options, function (provider_solutions) {
                              var p_options = {
                                size: EnvirotechHTMLBuilder.veryLargeInt,
                                source_ids: EnvirotechUtility.collectFromArray(provider_solutions, 'provider_id').join(',')
                              };
                              EnvirotechWidget.loadData('providers', p_options, function (providers) {
                                EnvirotechHTMLBuilder.loadDataInto('providers', providers);
                              });
                            });
                          });
                        },

  loadOptionsForRegulations: function (box) {
                               EnvirotechHTMLBuilder.disableBoxesFor(['issues', 'solutions', 'providers']);

                               var options = {
                                 regulation_ids: box.val(),
                                 size: EnvirotechHTMLBuilder.veryLargeInt
                               };

                               //Load issues
                               EnvirotechWidget.loadData('issues', options, function (issues) {
                                 EnvirotechHTMLBuilder.loadDataInto('issues', issues);
                               });

                               // Load solutions
                               EnvirotechWidget.loadData('solutions', options, function (solutions) {
                                 EnvirotechHTMLBuilder.loadDataInto('solutions', solutions);
                                 var ps_options = {
                                   size: EnvirotechHTMLBuilder.veryLargeInt,
                                   solution_ids: EnvirotechUtility.collectFromArray(solutions, 'source_id').join(',')
                                 };

                                 EnvirotechWidget.loadData('provider_solutions', ps_options, function (provider_solutions) {
                                   var p_options = {
                                     size: EnvirotechHTMLBuilder.veryLargeInt,
                                     source_ids: EnvirotechUtility.collectFromArray(provider_solutions, 'provider_id').join(',')
                                   };
                                   EnvirotechWidget.loadData('providers', p_options, function (providers) {
                                     EnvirotechHTMLBuilder.loadDataInto('providers', providers);
                                   });
                                 });
                               });
                             },

  loadOptionsForSolutions: function (box) {
                             EnvirotechHTMLBuilder.disableBoxesFor(['regulations']);
                             EnvirotechHTMLBuilder.disableBoxesFor(['issues']);
                             EnvirotechHTMLBuilder.disableBoxesFor(['providers']);
                             var options = {
                               size: EnvirotechHTMLBuilder.veryLargeInt,
                               solution_ids: box.val()
                             };

                             EnvirotechWidget.loadData('provider_solutions', options, function (provider_solutions) {
                               var p_options = {
                                 size: EnvirotechHTMLBuilder.veryLargeInt,
                                 source_ids: EnvirotechUtility.collectFromArray(provider_solutions, 'provider_id').join(',')
                               };
                               EnvirotechWidget.loadData('providers', p_options, function (providers) {
                                 EnvirotechHTMLBuilder.loadDataInto('providers', providers);
                               });
                             });

                             EnvirotechWidget.loadData('regulations', options, function (regulations) {
                               EnvirotechHTMLBuilder.loadDataInto('regulations', regulations);
                               var issue_ids = [];
                               $.each(regulations, function(i, regulation) {
                                 issue_ids.push(regulation.issue_ids.join(","));
                               });

                               var i_options = {
                                 size: EnvirotechHTMLBuilder.veryLargeInt,
                                 source_ids: issue_ids.join(",")
                               };
                               EnvirotechWidget.loadData('issues', i_options, function(issues) {
                                 EnvirotechHTMLBuilder.loadDataInto('issues', issues);
                               });
                             });
                           },

  loadOptionsForProviders: function (box) {
                           },

  loadDataInto: function (type, data) {
              var box = EnvirotechHTMLBuilder.getSelectBoxFor(type);
              var langKey = EnvirotechHTMLBuilder.langKey();

              box.empty().append(EnvirotechHTMLBuilder.emptyOptionHTML());

              $.each(data, function (i, record) {
                var optionHTML = EnvirotechHTMLBuilder.buildOptionHTML(record['source_id'], record['name_' + langKey]);
                box.append(optionHTML);
              });

              if(data.length == 1) {
                box.val(data[0].source_id);
              }

              box.prop("disabled", false);
            },

  disableBoxesFor: function (types) {
                     $.each(types, function (i, type) {
                       var box = EnvirotechHTMLBuilder.getSelectBoxFor(type);
                       box.prop("disabled", "disabled").trigger("chosen:updated");
                     });
                   },

  submitBtn: function () {
               return '<div class="form-actions col-xs-8">' +
                 '<input type="submit" class="btn btn-primary btn-lg" value="' + EnvirotechHTMLBuilder.translate('submit') + '">' +
                 '<input type="reset" class="btn btn-default btn-lg" value="' + EnvirotechHTMLBuilder.translate('clear') + '">' +
               '</div>';
             },

  languageSelection: function () {
                       var buttons = $('<div>');
                       buttons.append(EnvirotechHTMLBuilder.languageButtons());
                       return buttons;
                     },

  languageButtons: function () {
                     var buttonsHTML = $('<span>');

                     $.each(window.envirotechLangConf, function (langCode, conf) {
                       var button = $('<a href="#">')
                       .addClass('btn btn-default')
                       .html(conf['name'])
                       .data('lang_code', langCode);

                       button.on("click", function (e) {
                         e.preventDefault();
                         window.envirotechLangCode = $(this).data('lang_code');
                         EnvirotechWidget.initialize();
                       });

                       buttonsHTML.append(button);
                     });

                     return buttonsHTML;
                   },

  searchPanel: function () {
                 var panel = $('<div class="panel panel-default">');
                 panel.append(
                   $('<div class="panel-heading">' +
                       '<h3 class="panel-title">' + EnvirotechHTMLBuilder.translate('search') + '</h3>' +
                     '</div>'));

                 var panelBody = $('<div class="panel-body"></div>');
                 panelBody.append(EnvirotechHTMLBuilder.searchForm());
                 panel.append(panelBody);
                 return panel;
               },

  resultsContainer: function () {
                      var container = $('<div class="container" id="envirotech-results-container"></div>');
                      return container;
                    },

  loadIssueInfo: function () {
                   var issuesBox = EnvirotechHTMLBuilder.getSelectBoxFor('issues');
                   if (issuesBox.val() != "") {
                     var issue      = EnvirotechActiveRecord.findById('issues', issuesBox.val());
                     var langKey    = EnvirotechHTMLBuilder.langKey();
                     var issueName  = issue['name_' + langKey];
                     var resultsDiv = $('<div class="container"></div>');
                     resultsDiv.append('<h3>' + issueName + '</h3>');
                     resultsDiv.append('<div class="row">' + issue['abstract_' + langKey] + '</div>');
                     var options = {
                       size: EnvirotechHTMLBuilder.veryLargeInt,
                       issue_ids: issue.source_id
                     };

                     $.each(['background_links', 'analysis_links'], function (i, link_type) {
                       EnvirotechWidget.loadData(link_type, options, function (links) {
                         $.each(links, function (i, link) {
                           var linkHTML = '<a target="_blank" href="' + link['url'] + '">' + link['name_' + langKey] + '</a>';
                           var linkDiv  = $('<div class="row"></div>');
                           linkDiv.append(linkHTML)
                           resultsDiv.append(linkDiv);
                           $('#envirotech-issue-info').empty().append(resultsDiv);
                         });
                       });
                     });
                   }
                 },

  getSelectedIds: function (type) {
                    var box = EnvirotechHTMLBuilder.getSelectBoxFor(type);
                    var ids = [];
                    if (box.val() == '') {
                      $.each(box.find('option'), function (i, option) {
                        if ($(option).attr('value') != '') {
                          ids.push($(option).attr('value'));
                        }
                      });
                    } else {
                      ids.push(box.val());
                    }
                    return ids;
                  },

  loadRegulationsInfo: function () {
                         var container = $('#envirotech-regulations-container');
                         var regulationIds = EnvirotechHTMLBuilder.getSelectedIds('regulations');
                         var solutionsBox  = EnvirotechHTMLBuilder.getSelectBoxFor('solutions');
                         var providersBox  = EnvirotechHTMLBuilder.getSelectBoxFor('providers');

                         $.each(regulationIds, function (i, regulationId) {
                           var table_id = EnvirotechHTMLBuilder.resultsDivId(regulationId);
                           container.append('<div id="' + table_id + '"</div>');
                         });
                         $.each(regulationIds, function (i, regulationId) {
                           var table_id = EnvirotechHTMLBuilder.resultsDivId(regulationId);
                           var regulation = EnvirotechActiveRecord.findById('regulations', regulationId);
                           if (regulation) {
                             var params = {
                               size: EnvirotechHTMLBuilder.resultsPerPage,
                               solution_ids: regulation.solution_ids.join(',')
                             };
                             if (solutionsBox.val() != "") {
                               params['solution_ids'] = solutionsBox.val();
                             }
                             if (providersBox.val() != "") {
                               params['provider_ids'] = providersBox.val();
                             }

                             EnvirotechWidget.loadData('provider_solutions', params, function (provider_solutions, total) {
                               var html = '<h3>' + regulation['name_' + EnvirotechHTMLBuilder.langKey()] + '</h3>';
                               html = html + '<a href="' + regulation['url'] + '">' +
                                 regulation['name_' + EnvirotechHTMLBuilder.langKey()] + '</a>';
                               html = html + '<div class="enviro-list" id="' + EnvirotechHTMLBuilder.resultsListId(regulationId) + '"></div>';
                               $('#' + table_id).html(html);
                               $('#' + table_id).append(EnvirotechHTMLBuilder.buildPaginationDiv(params, total, regulationId));
                             });
                           }
                         });
                       },

  resultsListHTML: function (provider_solutions) {
                     var html = '<div class="row envirotech-list-header">' +
                       '<div class="col-md-6">Environmental Solution</div>' +
                       '<div class="col-md-6">U.S. Solution Provider</div>' +
                       '</div>';
                     var langKey = EnvirotechHTMLBuilder.langKey();
                     $.each(provider_solutions, function (i, ps) {
                       var provider = EnvirotechActiveRecord.findById('providers', ps.provider_id);
                       var solution = EnvirotechActiveRecord.findById('solutions', ps.solution_ids);
                       if (provider && solution) {
                         html = html + '<div class="row">' +
                           '<div class="col-md-6">' + solution['name_' + langKey] + '</div>' +
                           '<div class="col-md-6"><a href="' + ps.url + '">' + provider.name_english + '</a></div>' +
                           '</div>';
                       }
                     });
                     return html;
                   },

  loadPage: function (page, params, regulationId) {
              params['size']   = EnvirotechHTMLBuilder.resultsPerPage;
              params['offset'] = (page - 1) * EnvirotechHTMLBuilder.resultsPerPage;
              var container = $('#' + EnvirotechHTMLBuilder.resultsListId(regulationId));
              EnvirotechWidget.loadData('provider_solutions', params, function (provider_solutions) {
                container.html(EnvirotechHTMLBuilder.resultsListHTML(provider_solutions));
              });
            },

  buildPaginationDiv: function (params, total, regulationId) {
                        var paginationDiv = $('<div class="envirotech-search-widget-pagination" id="regulation-paging-' +
                            regulationId + '"></div>');

                        paginationDiv.paging(total, {
                          format: '[< nncnn >]',
                          perpage: EnvirotechHTMLBuilder.resultsPerPage,
                          lapping: 0,
                          page: 1,
                          onSelect: function (page) {
                            EnvirotechHTMLBuilder.loadPage(page, params, regulationId);
                          },
                          onFormat: function (type) {
                            switch (type) {
                              case 'block': // n and c
                                if (this.value == this.page) {
                                  return '<span class="current">' + this.value + '</span>';
                                } else {
                                  return '<a href="#">' + this.value + '</a>';
                                }
                              case 'next': // >
                                return '<a href="#">&gt;</a>';
                              case 'prev': // <
                                return '<a href="#">&lt;</a>';
                              case 'first': // [
                                return '<a href="#">First</a>';
                              case 'last': // ]
                                return '<a href="#">Last</a>';
                            }
                          }
                        });
                        return paginationDiv;
                      },

  loadResults: function () {
                 var resultsContainer           = $('#envirotech-results-container');
                 var issueInfoContainer         = $('<div id="envirotech-issue-info"></div>');
                 var regulationDetailsContainer = $('<div id="envirotech-regulations-container"></div>');

                 resultsContainer.empty();
                 resultsContainer.append(issueInfoContainer);
                 resultsContainer.append(regulationDetailsContainer);

                 EnvirotechHTMLBuilder.loadIssueInfo();
                 EnvirotechHTMLBuilder.loadRegulationsInfo();
               },
};

var EnvirotechUtility = {
  collectFromArray: function (arr, key) {
                      var ret = [];

                      $.each(arr, function (i, v) {
                        ret.push(v[key]);
                      });

                      return ret;
                    }
};
