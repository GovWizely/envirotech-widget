window.envirotechLangCode="en";window.envirotechLangConf={en:{key:"english",name:"English",select_an_option:"Select an Option",submit:"Find Solutions",clear:"Clear",search:"Search",issues:"Environmental Issue",regulations:"EPA Regulation",solutions:"Solution",providers:"U.S. Solution Provider"},sp:{key:"spanish",name:"Español",select_an_option:"Seleccione una Opción",submit:"Encontrar Soluciones",clear:"Claro",search:"Buscar",issues:"Problema medioambiental",regulations:"Reglamento de la EPA",solutions:"Solución",providers:"Proveedor de Soluciones de EE.UU."},pt:{key:"portuguese",name:"Português",select_an_option:"Selecione Uma Opção",submit:"Encontrar Soluções",clear:"Claro",search:"Busca",issues:"Questão ambiental",regulations:"EPA Regulamento",solutions:"Solução",providers:"Solution Provider EUA"},fr:{key:"french",name:"Français",select_an_option:"Sélectionnez une option",submit:"Trouver des solutions",clear:"Clair",search:"Recherche",issues:"L'enjeu environnemental",regulations:"EPA règlement",solutions:"Solution",providers:"Solution Provider États-Unis"},zh:{key:"chinese",name:"中文",select_an_option:"选择一个选项",submit:"查找解决方案",clear:"清除",search:"搜",issues:"环境问题",regulations:"EPA法规",solutions:"解决方法",providers:"美国解决方案提供商"}};var EnvirotechHTMLBuilder={veryLargeInt:999999,resultsPerPage:25,translate:function(key){var langCode=window.envirotechLangCode;return window.envirotechLangConf[langCode][key]},langKey:function(){return EnvirotechHTMLBuilder.translate("key")},resultsDivId:function(regulationId){return"enviro-regulation-div-"+regulationId},resultsTableId:function(regulationId){return"enviro-results-table-"+regulationId},searchForm:function(){var searchForm=$("<form>");searchForm.on("submit",function(e){e.preventDefault();EnvirotechHTMLBuilder.loadResults();return false});searchForm.on("reset",function(e){$("#envirotech-results-container").empty();var box=$("select#envirotech-select-solutions");EnvirotechHTMLBuilder.loadOptionsFor(box,"solutions")});var container=$('<div class="container"></div>');var row1=$('<div class="row"></div>');row1.append(EnvirotechHTMLBuilder.formGroupFor("issues"));row1.append(EnvirotechHTMLBuilder.formGroupFor("regulations"));row1.append(EnvirotechHTMLBuilder.formGroupFor("solutions"));container.append(row1);var row2=$('<div class="row"></div>');row2.append(EnvirotechHTMLBuilder.formGroupFor("providers"));row2.append(EnvirotechHTMLBuilder.submitBtn());container.append(row2);searchForm.append(container);return searchForm},getSelectBoxFor:function(type){return $("select[name=envirotech-select-"+type+"]")},emptyOptionHTML:function(){return'<option value="">'+EnvirotechHTMLBuilder.translate("select_an_option")+"</option>"},buildOptionHTML:function(value,text){return'<option value="'+value+'">'+text+"</option>"},formGroupFor:function(type){var name="envirotech-select-"+type;var formGroup=$('<div class="form-group col-xs-4">'+'<label for="'+name+'">'+EnvirotechHTMLBuilder.translate(type)+"</label>"+"</div>");formGroup.append(EnvirotechHTMLBuilder.selectBoxFor(type));return formGroup},selectBoxFor:function(type){var name="envirotech-select-"+type;var box=$('<select class="form-control" name="'+name+'" id='+name+'">').prop("disabled","disabled");box.append(EnvirotechHTMLBuilder.emptyOptionHTML());var options={size:EnvirotechHTMLBuilder.veryLargeInt};EnvirotechWidget.loadData(type,options,function(data){EnvirotechHTMLBuilder.loadDataInto(type,data)},true);box.on("change",function(e){EnvirotechHTMLBuilder.loadOptionsFor(box,type)});return box},loadOptionsFor:function(box,type){switch(type){case"issues":EnvirotechHTMLBuilder.loadOptionsForIssues(box);break;case"regulations":EnvirotechHTMLBuilder.loadOptionsForRegulations(box);break;case"solutions":EnvirotechHTMLBuilder.loadOptionsForSolutions(box);break;case"providers":EnvirotechHTMLBuilder.loadOptionsForProviders(box);break;default:console.log("Invalid type")}},loadOptionsForIssues:function(box){EnvirotechHTMLBuilder.disableBoxesFor(["regulations","solutions","providers"]);var options={issue_ids:box.val(),size:EnvirotechWidget.veryLargeInt};EnvirotechWidget.loadData("regulations",options,function(regulations){EnvirotechHTMLBuilder.loadDataInto("regulations",regulations)});EnvirotechWidget.loadData("solutions",options,function(solutions){EnvirotechHTMLBuilder.loadDataInto("solutions",solutions);var ps_options={size:EnvirotechHTMLBuilder.veryLargeInt,solution_ids:EnvirotechUtility.collectFromArray(solutions,"source_id").join(",")};EnvirotechWidget.loadData("provider_solutions",ps_options,function(provider_solutions){var p_options={size:EnvirotechHTMLBuilder.veryLargeInt,source_ids:EnvirotechUtility.collectFromArray(provider_solutions,"provider_id").join(",")};EnvirotechWidget.loadData("providers",p_options,function(providers){EnvirotechHTMLBuilder.loadDataInto("providers",providers)})})})},loadOptionsForRegulations:function(box){EnvirotechHTMLBuilder.disableBoxesFor(["issues","solutions","providers"]);var options={regulation_ids:box.val(),size:EnvirotechHTMLBuilder.veryLargeInt};EnvirotechWidget.loadData("issues",options,function(issues){EnvirotechHTMLBuilder.loadDataInto("issues",issues)});EnvirotechWidget.loadData("solutions",options,function(solutions){EnvirotechHTMLBuilder.loadDataInto("solutions",solutions);var ps_options={size:EnvirotechHTMLBuilder.veryLargeInt,solution_ids:EnvirotechUtility.collectFromArray(solutions,"source_id").join(",")};EnvirotechWidget.loadData("provider_solutions",ps_options,function(provider_solutions){var p_options={size:EnvirotechHTMLBuilder.veryLargeInt,source_ids:EnvirotechUtility.collectFromArray(provider_solutions,"provider_id").join(",")};EnvirotechWidget.loadData("providers",p_options,function(providers){EnvirotechHTMLBuilder.loadDataInto("providers",providers)})})})},loadOptionsForSolutions:function(box){EnvirotechHTMLBuilder.disableBoxesFor(["regulations"]);EnvirotechHTMLBuilder.disableBoxesFor(["issues"]);EnvirotechHTMLBuilder.disableBoxesFor(["providers"]);var options={size:EnvirotechHTMLBuilder.veryLargeInt,solution_ids:box.val()};EnvirotechWidget.loadData("provider_solutions",options,function(provider_solutions){var p_options={size:EnvirotechHTMLBuilder.veryLargeInt,source_ids:EnvirotechUtility.collectFromArray(provider_solutions,"provider_id").join(",")};EnvirotechWidget.loadData("providers",p_options,function(providers){EnvirotechHTMLBuilder.loadDataInto("providers",providers)})});EnvirotechWidget.loadData("regulations",options,function(regulations){EnvirotechHTMLBuilder.loadDataInto("regulations",regulations);var issue_ids=[];$.each(regulations,function(i,regulation){issue_ids.push(regulation.issue_ids.join(","))});var i_options={size:EnvirotechHTMLBuilder.veryLargeInt,source_ids:issue_ids.join(",")};EnvirotechWidget.loadData("issues",i_options,function(issues){EnvirotechHTMLBuilder.loadDataInto("issues",issues)})})},loadOptionsForProviders:function(box){},loadDataInto:function(type,data){var box=EnvirotechHTMLBuilder.getSelectBoxFor(type);var langKey=EnvirotechHTMLBuilder.langKey();box.empty().append(EnvirotechHTMLBuilder.emptyOptionHTML());$.each(data,function(i,record){var text=record["name_"+langKey]||record["name_english"];var optionHTML=EnvirotechHTMLBuilder.buildOptionHTML(record["source_id"],text);box.append(optionHTML)});if(data.length==1){box.val(data[0].source_id)}box.prop("disabled",false)},disableBoxesFor:function(types){$.each(types,function(i,type){var box=EnvirotechHTMLBuilder.getSelectBoxFor(type);box.prop("disabled","disabled").trigger("chosen:updated")})},submitBtn:function(){return'<div class="form-actions col-xs-8">'+'<input type="submit" class="btn btn-primary btn-lg" value="'+EnvirotechHTMLBuilder.translate("submit")+'">'+'<input type="reset" class="btn btn-default btn-lg" value="'+EnvirotechHTMLBuilder.translate("clear")+'">'+"</div>"},languageSelection:function(){var buttons=$("<div>");buttons.append(EnvirotechHTMLBuilder.languageButtons());return buttons},languageButtons:function(){var buttonsHTML=$("<span>");$.each(window.envirotechLangConf,function(langCode,conf){var button=$('<a href="#">').addClass("btn btn-default").html(conf["name"]).data("lang_code",langCode);button.on("click",function(e){e.preventDefault();window.envirotechLangCode=$(this).data("lang_code");EnvirotechWidget.initialize()});buttonsHTML.append(button)});return buttonsHTML},searchPanel:function(){var panel=$('<div class="panel panel-default">');panel.append($('<div class="panel-heading">'+'<h3 class="panel-title">'+EnvirotechHTMLBuilder.translate("search")+"</h3>"+"</div>"));var panelBody=$('<div class="panel-body"></div>');panelBody.append(EnvirotechHTMLBuilder.searchForm());panel.append(panelBody);return panel},resultsContainer:function(){var container=$('<div id="envirotech-results-container"></div>');return container},loadIssueInfo:function(){var issuesBox=EnvirotechHTMLBuilder.getSelectBoxFor("issues");if(issuesBox.val()!=""){var issue=EnvirotechActiveRecord.findById("issues",issuesBox.val());var langKey=EnvirotechHTMLBuilder.langKey();var issueName=issue["name_"+langKey];var issueInfoDiv=$("#envirotech-issue-info");issueInfoDiv.empty();issueInfoDiv.append("<h3>"+issueName+"</h3>");issueInfoDiv.append("<p>"+issue["abstract_"+langKey]+"</p>");var options={size:EnvirotechHTMLBuilder.veryLargeInt,issue_ids:issue.source_id};$.each(["background_links","analysis_links"],function(i,link_type){EnvirotechWidget.loadData(link_type,options,function(links){$.each(links,function(i,link){var linkHtml='<p><a target="_blank" href="'+link["url"]+'">'+link["name_"+langKey]+"</a></p>";issueInfoDiv.append(linkHtml)})})})}},getSelectedIds:function(type){var box=EnvirotechHTMLBuilder.getSelectBoxFor(type);var ids=[];if(box.val()==""){$.each(box.find("option"),function(i,option){if($(option).attr("value")!=""){ids.push($(option).attr("value"))}})}else{ids.push(box.val())}return ids},loadRegulationsInfo:function(){var container=$("#envirotech-regulations-container");var regulationIds=EnvirotechHTMLBuilder.getSelectedIds("regulations");var solutionsBox=EnvirotechHTMLBuilder.getSelectBoxFor("solutions");var providersBox=EnvirotechHTMLBuilder.getSelectBoxFor("providers");$.each(regulationIds,function(i,regulationId){var tableId=EnvirotechHTMLBuilder.resultsDivId(regulationId);container.append('<div class="enviro-regulation-div" id="'+tableId+'"></div>')});$.each(regulationIds,function(i,regulationId){var table=$("#"+EnvirotechHTMLBuilder.resultsDivId(regulationId));var regulation=EnvirotechActiveRecord.findById("regulations",regulationId);if(regulation){var params={size:EnvirotechHTMLBuilder.resultsPerPage,solution_ids:regulation.solution_ids.join(",")};if(solutionsBox.val()!=""){params["solution_ids"]=solutionsBox.val()}if(providersBox.val()!=""){params["provider_ids"]=providersBox.val()}EnvirotechWidget.loadData("provider_solutions",params,function(provider_solutions,total,offset){if(total>0){var regulationName=regulation["name_"+EnvirotechHTMLBuilder.langKey()]||regulation["name_english"];var html='<p class="small">Select an Environmental Issue above for more information on Solutions.</p>'+"<h3>"+regulationName+"</h3>"+'<p><a href="'+regulation["url"]+'">'+regulationName+"</a></p>"+'<table class="enviro-list table table-striped" id="'+EnvirotechHTMLBuilder.resultsTableId(regulationId)+'"></table>';table.append(html);var list=$("#"+EnvirotechHTMLBuilder.resultsTableId(regulationId));EnvirotechHTMLBuilder.buildPaginationNav(params,offset,total,regulationId).insertBefore(list)}})}})},resultsListHTML:function(provider_solutions){var html="<tr><th>Environmental Solution</th><th>U.S. Solution Provider</th></tr>";var langKey=EnvirotechHTMLBuilder.langKey();$.each(provider_solutions,function(i,ps){var provider=EnvirotechActiveRecord.findById("providers",ps.provider_id);var solution=EnvirotechActiveRecord.findById("solutions",ps.solution_ids);if(provider&&solution){html=html+"<tr>"+"<td>"+solution["name_"+langKey]+"</td>"+'<td><a target="_blank" href="'+ps.url+'">'+provider.name_english+"</a></td>"+"</tr>"}});return html},loadPage:function(page,params,regulationId){params["size"]=EnvirotechHTMLBuilder.resultsPerPage;params["offset"]=(page-1)*EnvirotechHTMLBuilder.resultsPerPage;var resultsTable=$("#"+EnvirotechHTMLBuilder.resultsTableId(regulationId));EnvirotechWidget.loadData("provider_solutions",params,function(provider_solutions){var nav=resultsTable.siblings("nav.container");nav.find("div.summary .start").html(params.offset+1);nav.find("div.summary .end").html(params.offset+params.size);resultsTable.html(EnvirotechHTMLBuilder.resultsListHTML(provider_solutions))})},buildPaginationNav:function(params,offset,total,regulationId){var start=offset+1;var end=offset+params.size;var nav=$('<nav class="container"></nav>');var row=$('<div class="row"><div class="small summary col-xs-3"><span class="start">'+start+'</span> - <span class="end">'+end+"</span> of "+total+"</div></div>");row.append(EnvirotechHTMLBuilder.buildPaginationUl(params,total,regulationId));nav.append(row);return nav},buildPaginationUl:function(params,total,regulationId){var paginationUl=$('<ul class="pagination envirotech-search-widget-pagination" id="regulation-paging-'+regulationId+'"></ul>');paginationUl.paging(total,{format:"[< nncnn >]",perpage:EnvirotechHTMLBuilder.resultsPerPage,lapping:0,page:1,onSelect:function(page){EnvirotechHTMLBuilder.loadPage(page,params,regulationId)},onFormat:function(type){switch(type){case"block":if(this.value==this.page){return'<li class="active"><a href="#">'+this.value+"</a></li>"}else{return'<li><a href="#">'+this.value+"</a></li>"}case"next":return'<li><a href="#">&gt;</a></li>';case"prev":return'<li><a href="#">&lt;</a></li>';case"first":return'<li><a href="#">First</a></li>';case"last":return'<li><a href="#">Last</a></li>'}}});return $('<div class="col-xs-9"></div>').append(paginationUl)},loadResults:function(){var resultsContainer=$("#envirotech-results-container");var issueInfoContainer=$('<div id="envirotech-issue-info"></div>');var regulationDetailsContainer=$('<div id="envirotech-regulations-container"></div>');resultsContainer.empty();resultsContainer.append(issueInfoContainer);resultsContainer.append(regulationDetailsContainer);EnvirotechHTMLBuilder.loadIssueInfo();EnvirotechHTMLBuilder.loadRegulationsInfo()}};var EnvirotechUtility={collectFromArray:function(arr,key){var ret=[];$.each(arr,function(i,v){ret.push(v[key])});return ret}};(function($,window,undefined){$["fn"]["paging"]=function(number,opts){var self=this,Paging={setOptions:function(opts){var parseFormat=function(format){var gndx=0,group=0,num=1,res={fstack:[],asterisk:0,inactive:0,blockwide:5,current:3,rights:0,lefts:0},tok,pattern=/[*<>pq\[\]().-]|[nc]+!?/g;var known={"[":"first","]":"last","<":"prev",">":"next",q:"left",p:"right","-":"fill",".":"leap"},count={};while(tok=pattern["exec"](format)){tok=""+tok;if(undefined===known[tok]){if("("===tok){group=++gndx}else if(")"===tok){group=0}else if(num){if("*"===tok){res.asterisk=1;res.inactive=0}else{res.asterisk=0;res.inactive="!"===tok.charAt(tok.length-1);res.blockwide=tok["length"]-res.inactive;if(!(res.current=1+tok.indexOf("c"))){res.current=1+res.blockwide>>1}}res.fstack[res.fstack.length]={ftype:"block",fgroup:0,fpos:0};num=0}}else{res.fstack[res.fstack.length]={ftype:known[tok],fgroup:group,fpos:undefined===count[tok]?count[tok]=1:++count[tok]};if("q"===tok)++res.lefts;else if("p"===tok)++res.rights}}return res};Paging.opts=$.extend(Paging.opts||{lapping:0,perpage:10,page:1,refresh:{interval:10,url:null},format:"",lock:false,onFormat:function(type){},onSelect:function(page){return true},onRefresh:function(json){}},opts||{});Paging.opts["lapping"]|=0;Paging.opts["perpage"]|=0;if(Paging.opts["page"]!==null)Paging.opts["page"]|=0;if(Paging.opts["perpage"]<1){Paging.opts["perpage"]=10}if(Paging.interval)window.clearInterval(Paging.interval);if(Paging.opts["refresh"]["url"]){Paging.interval=window.setInterval(function(){$["ajax"]({url:Paging.opts["refresh"]["url"],success:function(data){if(typeof data==="string"){try{data=$["parseJSON"](data)}catch(o){return}}Paging.opts["onRefresh"](data)}})},1e3*Paging.opts["refresh"]["interval"])}Paging.format=parseFormat(Paging.opts["format"]);return Paging},setNumber:function(number){Paging.number=undefined===number||number<0?-1:number;return Paging},setPage:function(page){if(Paging.opts["lock"]){Paging.opts["onSelect"](0,self);return Paging}if(undefined===page){page=Paging.opts["page"];if(null===page){return Paging}}else if(Paging.opts["page"]==page){return Paging}Paging.opts["page"]=page|=0;var number=Paging.number;var opts=Paging.opts;var rStart,rStop;var pages,buffer;var groups=1,format=Paging.format;var data,tmp,node,lapping;var count=format.fstack["length"],i=count;if(opts["perpage"]<=opts["lapping"]){opts["lapping"]=opts["perpage"]-1}lapping=number<=opts["lapping"]?0:opts["lapping"]|0;if(number<0){number=-1;pages=-1;rStart=Math.max(1,page-format.current+1-lapping);rStop=rStart+format.blockwide}else{pages=1+Math.ceil((number-opts["perpage"])/(opts["perpage"]-lapping));page=Math.max(1,Math.min(page<0?1+pages+page:page,pages));if(format.asterisk){rStart=1;rStop=1+pages;format.current=page;format.blockwide=pages}else{rStart=Math.max(1,Math.min(page-format.current,pages-format.blockwide)+1);rStop=format.inactive?rStart+format.blockwide:Math.min(rStart+format.blockwide,1+pages)}}while(i--){tmp=0;node=format.fstack[i];switch(node.ftype){case"left":tmp=node.fpos<rStart;break;case"right":tmp=rStop<=pages-format.rights+node.fpos;break;case"first":tmp=format.current<page;break;case"last":tmp=format.blockwide<format.current+pages-page;break;case"prev":tmp=1<page;break;case"next":tmp=page<pages;break}groups|=tmp<<node.fgroup}data={number:number,lapping:lapping,pages:pages,perpage:opts["perpage"],page:page,slice:[(tmp=page*(opts["perpage"]-lapping)+lapping)-opts["perpage"],Math.min(tmp,number)]};buffer="";function buffer_append(opts,data,type){type=""+opts["onFormat"].call(data,type);if(data["value"])buffer+=type.replace(/<a/i,'<a data-page="'+data["value"]+'"');else buffer+=type}while(++i<count){node=format.fstack[i];tmp=groups>>node.fgroup&1;switch(node.ftype){case"block":for(;rStart<rStop;++rStart){data["value"]=rStart;data["pos"]=1+format.blockwide-rStop+rStart;data["active"]=rStart<=pages||number<0;data["first"]=1===rStart;data["last"]=rStart===pages&&0<number;buffer_append(opts,data,node.ftype)}continue;case"left":data["value"]=node.fpos;data["active"]=node.fpos<rStart;break;case"right":data["value"]=pages-format.rights+node.fpos;data["active"]=rStop<=data["value"];break;case"first":data["value"]=1;data["active"]=tmp&&1<page;break;case"prev":data["value"]=Math.max(1,page-1);data["active"]=tmp&&1<page;break;case"last":if(data["active"]=number<0){data["value"]=1+page}else{data["value"]=pages;data["active"]=tmp&&page<pages}break;case"next":if(data["active"]=number<0){data["value"]=1+page}else{data["value"]=Math.min(1+page,pages);data["active"]=tmp&&page<pages}break;case"leap":case"fill":data["pos"]=node.fpos;data["active"]=tmp;buffer_append(opts,data,node.ftype);continue}data["pos"]=node.fpos;data["last"]=data["first"]=undefined;buffer_append(opts,data,node.ftype)}if(self.length){$("a",self["html"](buffer)).click(function(ev){ev["preventDefault"]();var obj=this;do{if("a"===obj["nodeName"].toLowerCase()){break}}while(obj=obj["parentNode"]);Paging["setPage"]($(obj).data("page"));if(Paging.locate){window.location=obj["href"]}});Paging.locate=opts["onSelect"].call({number:number,lapping:lapping,pages:pages,slice:data["slice"]},page,self)}return Paging}};return Paging["setNumber"](number)["setOptions"](opts)["setPage"]()}})(jQuery,this);var EnvirotechWidget={container:null,options:{},initialize:function(){EnvirotechWidget.container.empty();EnvirotechWidget.container.addClass("envirotech-widget-container");EnvirotechWidget.container.append(EnvirotechHTMLBuilder.languageSelection());EnvirotechWidget.container.append(EnvirotechHTMLBuilder.searchPanel());EnvirotechWidget.container.append(EnvirotechHTMLBuilder.resultsContainer())},loadData:function(type,options,callback,storeResult){var url=EnvirotechWidget.options.host+EnvirotechWidget.searchPath(type);options.api_key=EnvirotechWidget.options.apiKey;$.ajax({url:url,data:options,dataType:"json",success:function(data){if(storeResult){EnvirotechActiveRecord.data[type]=data.results}callback(data.results,data.total,data.offset)}})},searchPath:function(type){return"/envirotech/"+type+"/search"}};(function(){jQuery(document).ready(function($){$.fn.envirotechWidget=function(options){options.host="https://api.govwizely.com",EnvirotechWidget.container=$(this);EnvirotechWidget.options=options;EnvirotechWidget.initialize()}})})();var EnvirotechActiveRecord={data:{},findById:function(type,id){var ret=false;$.each(EnvirotechActiveRecord.data[type],function(i,record){if(record["source_id"]==id){ret=record;return}});return ret},all:function(type){return EnvirotechActiveRecord.data[type]}};