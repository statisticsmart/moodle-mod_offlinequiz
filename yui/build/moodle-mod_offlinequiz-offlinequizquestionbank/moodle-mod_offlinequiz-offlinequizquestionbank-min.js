YUI.add("moodle-mod_offlinequiz-offlinequizquestionbank",function(e,t){var n={QBANKLOADING:"div.questionbankloading",ADDQUESTIONLINKS:'.menu [data-action="questionbank"]',ADDTOQUIZCONTAINER:"td.addtoofflinequizaction",PREVIEWCONTAINER:"td.previewaction",SEARCHOPTIONS:"#advancedsearch"},r={PAGE:"addonpage",HEADER:"header"},i=function(){i.superclass.constructor.apply(this,arguments)};e.extend(i,e.Base,{loadingDiv:"",dialogue:null,addonpage:0,searchRegionInitialised:!1,tags:"",create_dialogue:function(){var t={headerContent:"",bodyContent:e.one(n.QBANKLOADING),draggable:!0,modal:!0,centered:!0,width:null,visible:!1,postmethod:"form",footerContent:null,extraClasses:["mod_offlinequiz_qbank_dialogue"]};this.dialogue=new M.core.dialogue(t),this.dialogue.bodyNode.delegate("click",this.link_clicked,"a[href]",this),this.dialogue.hide(),this.loadingDiv=this.dialogue.bodyNode.getHTML(),e.later(100,this,function(){this.load_content(window.location.search)})},initializer:function(){if(!e.one(n.QBANKLOADING))return;this.create_dialogue(),e.one("body").delegate("click",this.display_dialogue,n.ADDQUESTIONLINKS,this)},display_dialogue:function(e){e.preventDefault(),this.dialogue.set("headerContent",e.currentTarget.getData(r.HEADER)),this.addonpage=e.currentTarget.getData(r.PAGE);var t=this.dialogue.bodyNode.one(".modulespecificbuttonscontainer");if(t){var n=t.one("input[name=addonpage]");n||(n=t.appendChild('<input type="hidden" name="addonpage">')),n.set("value",this.addonpage)}this.initialiseSearchRegion(),this.dialogue.show()},load_content:function(t){this.dialogue.bodyNode.append(this.loadingDiv),e.io(M.cfg.wwwroot+"/mod/offlinequiz/questionbank.ajax.php"+t,{method:"GET",on:{success:this.load_done,failure:this.load_failed},context:this})},load_done:function(t,n){var r=JSON.parse(n.responseText);if(!r.status||r.status!=="OK"){this.load_failed(t,n);return}this.dialogue.bodyNode.setHTML(r.contents),e.one("#qbheadercheckbox")&&e.one("#qbheadercheckbox").on("click",function(t){t._currentTarget.checked===!0?e.all(".questionbankformforpopup input[type^=checkbox], .select-multiple-checkbox").set("checked","true"):e.all(".questionbankformforpopup input[type^=checkbox], .select-multiple-checkbox").set("checked","")}),e.use("moodle-question-chooser",function(){M.question.init_chooser({})}),this.dialogue.bodyNode.one("form").delegate("change",this.options_changed,".searchoptions",this),this.dialogue.visible&&e.later(0,this.dialogue,this.dialogue.centerDialogue),require(["jquery","core/form-autocomplete"],function(e,t){var n=e('[class="tag-condition-container"]'),r=n.find('[data-region="tag-select"]'),i=n.find('[data-region="overlay-icon-container"]'),s=M.str.offlinequiz.filterbytags,o=M.str.offlinequiz.notagselected;t.enhance(r,!1,!1,s,!1,!0,o).always(function(){i.addClass("hidden")})}),e.on(M.core.event.FILTER_CONTENT_UPDATED,this.options_changed,this),this.searchRegionInitialised=!1,this.dialogue.get("visible")&&this.initialiseSearchRegion(),this.dialogue.fire("widget:contentUpdate"),this.dialogue.get("visible")&&(this.dialogue.hide(),this.dialogue.show())},load_failed:function(){},link_clicked:function(e){if(e.currentTarget.ancestor(n.ADDTOQUIZCONTAINER)){e.currentTarget.set("href",e.currentTarget.get("href")+"&addonpage="+this.addonpage);return}if(e.currentTarget.ancestor(n.PREVIEWCONTAINER)){openpopup(e,{url:e.currentTarget.get("href"),name:"questionpreview",options:"NaNresizable,toolbar,status,directories=0,fullscreen=0,dependent"});return}if(e.currentTarget.ancestor(n.SEARCHOPTIONS))return;e.preventDefault(),this.load_content(e.currentTarget.get("search"))},options_changed:function(t){if(t&&t.currentTarget&&t.currentTarget.get)t.preventDefault(),this.load_content("?"+e.IO.stringify(t.currentTarget.get("form")));else{var n=t.nodes._nodes[0].className;if(n.includes("form-autocomplete-selection")&&n.includes("form-autocomplete-multiple")){var r=this.get_tags(t.nodes._nodes[0].children);if(r!==this.tags){this.tags=r;var i=e.IO.stringify(e.one("#displayoptions"));this.load_content("?"+i),window.onbeforeunload=null}}}},get_tags:function(e){var t="";for(node in e)t+=e[node].textContent;return t},initialiseSearchRegion:function(){if(this.searchRegionInitialised===!0)return;if(!e.one(n.SEARCHOPTIONS))return;M.util.init_collapsible_region(e,"advancedsearch","question_bank_advanced_search",M.util.get_string("clicktohideshow","moodle")),this.searchRegionInitialised=!0}}),M.mod_offlinequiz=M.mod_offlinequiz||{},M.mod_offlinequiz.offlinequizquestionbank=M.mod_offlinequiz.offlinequizquestionbank||{},M.mod_offlinequiz.offlinequizquestionbank.init=function(){return new i}},"@VERSION@",{requires:["base","event","node","io","io-form","yui-later","moodle-question-qbankmanager","moodle-question-chooser","moodle-question-searchform","moodle-core-notification"]});
