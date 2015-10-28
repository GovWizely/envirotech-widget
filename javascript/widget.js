(function() {
  jQuery(document).ready(function($) {
    $.fn.envirotechWidget = function(widgetOptions) {

      var container = $(this);
      var resultsPerPage = 25;


      var initialize = function() {
        container.empty();
        container.addClass('envirotech-widget-container');
        container.append(languageSelection());
        container.append(searchPanel());
        container.append(resultsContainer());
      };

      var loadData = function(type, options, callback, storeResult) {

        var url = widgetOptions.host + searchPath(type);

        if (type === 'solutions' && Object.keys(options).length === 0) {
          options.size = -1;
        } else if (!options.size) {
          options.size = 100;
        }
        options.api_key = widgetOptions.apiKey;

        $.ajax({
          url: url,
          data: options,
          dataType: 'json',
          success: function(data) {
            if (storeResult) { EnvirotechActiveRecord.data[type] = data.results; }
            callback(data.results, data.total, data.offset);
          },
        });
      };

      var searchPath = function(type) {
        return '/envirotech/' + type + '/search';
      };

      var translate = function(key) {
        var langCode = window.envirotechLangCode;
        return window.envirotechLangConf[langCode][key];
      };

      var resultsDivId = function(regulationId) {
        return 'enviro-regulation-div-' + regulationId;
      };

      var resultsTableId = function(regulationId) {
        return 'enviro-results-table-' + regulationId;
      };

      var searchForm = function() {
        var searchForm = $('<form>');

        searchForm.on('submit', function(e) {
          e.preventDefault();
          loadResults();
          return false;
        });

        searchForm.on('reset', function(e) {
          container.find('#envirotech-results-container').empty();
          var box = container.find('select#envirotech-select-solutions');
          loadOptionsFor(box, 'solutions');
        });

        var formContainer = $('<div class="container">');

        var row1 = $('<div class="row">');
        row1.append(formGroupFor('issues'));
        row1.append(formGroupFor('regulations'));
        row1.append(formGroupFor('solutions'));
        formContainer.append(row1);

        var row2 = $('<div class="row">');
        row2.append(formGroupFor('providers'));
        row2.append(submitBtn());
        formContainer.append(row2);

        searchForm.append(formContainer);

        return searchForm;
      };

      var getSelectBoxFor = function(type) {
        return container.find('select[name=envirotech-select-' + type + ']');
      };

      var emptyOptionHTML = function() {
        return '<option value="">' + translate('select_an_option') + '</option>';
      };

      var buildOptionHTML = function(value, text) {
        return '<option value="' + value + '">' + text + '</option>';
      };

      var formGroupFor = function(type) {
        var name = 'envirotech-select-' + type;
        var formGroup = $('<div class="form-group col-xs-4">' +
            '<label for="'+name+'">'+translate(type)+'</label>' +
          '</div>');
        formGroup.append(selectBoxFor(type));
        return formGroup;
      };

      var selectBoxFor = function(type) {
        var name = 'envirotech-select-' + type;
        var box = $('<select class="form-control" name="' + name + '" id="' + name + '">').prop("disabled", "disabled");
        box.append(emptyOptionHTML());

        loadData(type, {}, function(data) {
          loadDataInto(type, data);
        }, true);

        box.on("change", function(e) {
          loadOptionsFor(box, type);
        });

        return box;
      };

      var formButtons = function() {
        return container.find('.form-actions input');
      };

      var loadOptionsFor = function(box, type) {
        switch(type) {
          case 'issues':
            loadOptionsForIssues(box);
            break;
          case 'regulations':
            loadOptionsForRegulations(box);
            break;
          case 'solutions':
            loadOptionsForSolutions(box);
            break;
          case 'providers':
            // no-op
            break;
          default:
            console.log("Invalid type");
        }
      };

      var loadOptionsForIssues = function(box) {
        disableBoxesFor(['regulations', 'solutions', 'providers']);

        var options = {
          issue_ids: box.val()
        };

        // Load regulations
        loadData('regulations', options, function(regulations) {
          loadDataInto('regulations', regulations);
        });

        // Load solutions
        loadData('solutions', options, function(solutions) {
          loadDataInto('solutions', solutions);
          var psOptions = {
            solution_ids: collectFromArray(solutions, 'source_id').join(',')
          };

          loadData('provider_solutions', psOptions, function(providerSolutions) {
            var pOptions = {
              source_ids: collectFromArray(providerSolutions, 'provider_id').join(',')
            };
            loadData('providers', pOptions, function(providers) {
              loadDataInto('providers', providers);
            });
          });
        });
      };

      var loadOptionsForRegulations = function(box) {
        disableBoxesFor(['issues', 'solutions', 'providers']);

        var options = {
          regulation_ids: box.val(),
        };

        //Load issues
        formButtons().attr('disabled', 'disabled');
        loadData('issues', options, function(issues) {
          loadDataInto('issues', issues);
        });

        // Load solutions
        loadData('solutions', options, function(solutions) {
          loadDataInto('solutions', solutions);
          var psOptions = {
            solution_ids: collectFromArray(solutions, 'source_id').join(',')
          };

          loadData('provider_solutions', psOptions, function(providerSolutions) {
            var pOptions = {
              source_ids: collectFromArray(providerSolutions, 'provider_id').join(',')
            };
            loadData('providers', pOptions, function(providers) {
              loadDataInto('providers', providers);
            });
          });
        });
      };

      var loadOptionsForSolutions = function(box) {
        disableBoxesFor(['regulations', 'issues', 'providers']);

        var options = {
          solution_ids: box.val()
        };

        loadData('provider_solutions', options, function(providerSolutions) {
          var pOptions = {
            source_ids: collectFromArray(providerSolutions, 'provider_id').join(',')
          };
          loadData('providers', pOptions, function(providers) {
            loadDataInto('providers', providers);
          });
        });

        loadData('regulations', options, function(regulations) {
          loadDataInto('regulations', regulations);
          var issueIds = [];
          $.each(regulations, function(i, regulation) {
            issueIds.push(regulation.issue_ids.join(","));
          });

          var iOptions = {
            source_ids: issueIds.join(",")
          };

          formButtons().attr('disabled', 'disabled');
          loadData('issues', iOptions, function(issues) {
            loadDataInto('issues', issues);
          });
        });
      };

      // Load select options into select box.
      var loadDataInto = function(type, data) {
        var box = getSelectBoxFor(type),
            selected = box.val(),
            langKey = translate('key'),
            newSelectedValue = '';

        box.empty().append(emptyOptionHTML());

        $.each(data, function(i, record) {
          var text = record['name_' + langKey] || record.name_english;
          var optionHTML = buildOptionHTML(record.source_id, text);
          if (record.source_id == selected) { newSelectedValue = record.source_id }
          box.append(optionHTML);
        });

        if (newSelectedValue) {
          box.val(newSelectedValue);
        } else if (data.length == 1) {
          box.val(data[0].source_id);
        }

        box.prop("disabled", false);

        if (type === 'issues') {
          formButtons().attr('disabled', false);
        }
      };

      var disableBoxesFor = function(types) {
        $.each(types, function(i, type) {
          var box = getSelectBoxFor(type);
          box.prop("disabled", "disabled").trigger("chosen:updated");
        });
      };

      var submitBtn = function() {
        return '<div class="form-actions col-xs-8">' +
          '<input type="submit" disabled="disabled" class="btn btn-primary btn-lg" value="' + translate('submit') + '">' +
          '<input type="reset" disabled="disabled" class="btn btn-default btn-lg" value="' + translate('clear') + '">' +
        '</div>';
      };

      var languageSelection = function() {
        var buttons = $('<div>');
        buttons.append(languageButtons());
        return buttons;
      };

      var languageButtons = function() {
        var buttonsHTML = $('<span>');

        $.each(window.envirotechLangConf, function(langCode, conf) {
          var button = $('<a href="#">')
          .addClass('btn btn-default')
          .html(conf.name)
          .data('lang_code', langCode);

          button.on("click", function(e) {
            e.preventDefault();
            window.envirotechLangCode = $(this).data('lang_code');
            initialize();
          });

          buttonsHTML.append(button);
        });

        return buttonsHTML;
      };

      var searchPanel = function() {
        var panel = $('<div class="panel panel-default">');
        panel.append(
          $('<div class="panel-heading">' +
              '<h3 class="panel-title">' + translate('search') + '</h3>' +
            '</div>'));

        var panelBody = $('<div class="panel-body">');
        panelBody.append(searchForm());
        panel.append(panelBody);
        return panel;
      };

      var resultsContainer = function() {
        return $('<div id="envirotech-results-container">');
      };

      var loadIssueInfo = function() {
        var issuesBox = getSelectBoxFor('issues');
        if (issuesBox.val() !== "") {
          var issue      = EnvirotechActiveRecord.findById('issues', issuesBox.val());
          var langKey = translate('key');
          var issueName  = issue['name_' + langKey];
          var issueInfoDiv = container.find('#envirotech-issue-info');

          issueInfoDiv.empty();
          issueInfoDiv.append('<h3>' + issueName + '</h3>');
          issueInfoDiv.append('<p>' + issue['abstract_' + langKey] + '</p>');
          var options = {
            issue_ids: issue.source_id
          };

          $.each(['background_links', 'analysis_links'], function(i, linkType) {
            loadData(linkType, options, function(links) {
              $.each(links, function(i, link) {
                var linkHtml = '<p><a target="_blank" href="' + link.url + '">' + link['name_' + langKey] + '</a></p>';
                issueInfoDiv.append(linkHtml);
              });
            });
          });
        }
      };

      var getSelectedIds = function(type) {
        var box = getSelectBoxFor(type);
        var ids = [];
        if (box.val() === '') {
          $.each(box.find('option'), function(i, option) {
            if ($(option).attr('value') !== '') {
              ids.push($(option).attr('value'));
            }
          });
        } else {
          ids.push(box.val());
        }
        return ids;
      };

      var loadRegulationsInfo = function() {
        var regulationsContainer = container.find('#envirotech-regulations-container');
        var regulationIds = getSelectedIds('regulations');
        var solutionsBox  = getSelectBoxFor('solutions');
        var providersBox  = getSelectBoxFor('providers');

        $.each(regulationIds, function(i, regulationId) {
          var tableId = resultsDivId(regulationId);
          regulationsContainer.append('<div class="enviro-regulation-div" id="' + tableId + '">');
        });
        $.each(regulationIds, function(i, regulationId) {
          var table = container.find('#' + resultsDivId(regulationId));
          var regulation = EnvirotechActiveRecord.findById('regulations', regulationId);
          if (regulation) {
            var params = {
              solution_ids: regulation.solution_ids.join(',')
            };
            if (solutionsBox.val() !== "") {
              params.solution_ids = solutionsBox.val();
            }
            if (providersBox.val() !== "") {
              params.provider_ids = providersBox.val();
            }

            loadData('provider_solutions', params, function(providerSolutions, total, offset) {
              if (total > 0) {
                var regulationName = regulation['name_' + translate('key')] || regulation.name_english;
                var html = '';

                if (!getSelectBoxFor('issues').val()) {
                  html = html + '<p class="small">Select an Environmental Issue above for more information on Solutions.</p>';
                }

                html = html + '<h3>' + regulationName + '</h3>' +
                 '<p><a href="' + regulation.url + '">' + regulationName + '</a></p>' +
                 '<table class="enviro-list table table-striped" id="' + resultsTableId(regulationId) + '"></table>';
                table.append(html);
                var list = container.find('#' + resultsTableId(regulationId));
                buildPaginationNav(params, offset, total, regulationId).insertBefore(list);
              }
            });
          }
        });
      };

      var resultsListHTML = function(providerSolutions) {
        var html = '<tr><th>Environmental Solution</th><th>U.S. Solution Provider</th></tr>';
        var langKey = translate('key');
        $.each(providerSolutions, function(i, ps) {
          var provider = EnvirotechActiveRecord.findById('providers', ps.provider_id);
          var solution = EnvirotechActiveRecord.findById('solutions', ps.solution_id);
          if (provider && solution) {
            html = html + '<tr>' +
              '<td>' + solution['name_' + langKey] + '</td>' +
              '<td><a target="_blank" href="' + ps.url + '">' + provider.name_english + '</a></td>' +
              '</tr>';
          }
        });
        return html;
      };

      var loadPage = function(page, params, regulationId, total) {
        params.size   = resultsPerPage;
        params.offset = (page - 1) * resultsPerPage;
        var resultsTable = $('#' + resultsTableId(regulationId));
        loadData('provider_solutions', params, function(providerSolutions) {
          var row = resultsTable.siblings('nav.container').find('.row');
          var start = params.offset + 1;
          var end = Math.min(total, params.offset + params.size);
          var summary = $('<div class="small summary col-xs-3">' +
            '<span class="start">' + start + '</span> - <span class="end">' + end + '</span> of ' + total +
          '</div>');

          row.find('.summary').remove();
          row.prepend(summary);

          resultsTable.html(resultsListHTML(providerSolutions));
        });
      };

      var buildPaginationNav = function(params, offset, total, regulationId) {
        var start = offset + 1;
        var end = Math.min(offset + params.size);
        var nav = $('<nav class="container"></nav>');
        var row = $('<div class="row"></div>');
        row.append(buildPaginationUl(params, total, regulationId));
        nav.append(row)
        return nav;
      };

      var buildPaginationUl = function(params, total, regulationId) {
        var paginationUl = $('<ul class="pagination envirotech-search-widget-pagination" id="regulation-paging-' + regulationId + '">');

        paginationUl.paging(total, {
          format: '[< nncnn >]',
          perpage: resultsPerPage,
          lapping: 0,
          page: 1,
          onSelect: function(page) {
            loadPage(page, params, regulationId, total);
          },
          onFormat: function(type) {
            switch (type) {
              case 'block': // n and c
                return '<li' + ((this.value === this.page) ? ' class="active"' : '') + '><a href="#">' + this.value + '</a></li>';
              case 'next': // >
                return '<li><a href="#">&gt;</a></li>';
              case 'prev': // <
                return '<li><a href="#">&lt;</a></li>';
              case 'first': // [
                return '<li><a href="#">First</a></li>';
              case 'last': // ]
                return '<li><a href="#">Last</a></li>';
            }
          }
        });
        return $('<div class="col-xs-9">').append(paginationUl);
      };

      var loadResults = function() {
        var resultsContainer           = container.find('#envirotech-results-container');
        var issueInfoContainer         = $('<div id="envirotech-issue-info"></div>');
        var regulationDetailsContainer = $('<div id="envirotech-regulations-container"></div>');

        resultsContainer.empty();
        resultsContainer.append(issueInfoContainer);
        resultsContainer.append(regulationDetailsContainer);

        loadIssueInfo();
        loadRegulationsInfo();
      };

      var collectFromArray = function(arr, key) {
        var ret = [];
        $.each(arr, function(i, v) {
          ret.push(v[key]);
        });
        return ret;
      };


      initialize();
    };
  });
})();
