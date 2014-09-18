/*global jQuery, window, document, self, _gaq, Drupal, google */
(function($) {

  Drupal.behaviors.metabio_taxonomy = {

    attach: function() {
      this.attachTaxonomy();
      this.fillTaxoTable();
    },

    attachTaxonomy: function() {
      var self = this, keyCode = "", sp = "";

      $('#edit-taxonomic-details-input').keypress(function(e) {
        var thisinput=this;
        keyCode = e.keyCode || e.charCode;
        if(keyCode === 13) {
          e.preventDefault();
          sp = $(this).val();
          $.post('metabio/taxonomy_checkitis',{string: sp},function(returndata){
              $('#taxotbl').append(self.buildTaxonomyRow(returndata[0]));
              self.bindDeleteButtons();
              $(thisinput).val('');
              self.refreshTaxonomy();
          });
        }
      });
    },

    fillTaxoTable: function(){
      var self = this,
          taxoin = $("input[name='taxonomic_details']").val(),
          rows = "";

      if(taxoin.length > 0) {
        obj=JSON.parse(taxoin);
        $.each(obj, function() {
          rows += self.buildTaxonomyRow(this);
        });
       /* $.each(taxoin.split('|'), function() {
          rows += self.buildTaxonomyRow(this);
        });
        */
        $('#taxotbl').append(rows);
        this.bindDeleteButtons();
      }
    },

    buildTaxonomyRow: function(name) {
      //return '<tr><td><input type="hidden" name="taxo[]" value="' + name + '">' + name + '</td><td><button class="taxodel" type="button" style="border:none;style="width:25px;"">x</button> </td></tr>';
      displayname=((name.hasOwnProperty('latin_name'))?name.latin_name:name.unknown_name);
      return "<tr><td><input type='hidden' name='taxo[]' value='" + JSON.stringify(name) + "'>" + displayname + '</td><td><button class="taxodel" type="button" style="border:none;style="width:25px;"">x</button> </td></tr>';
    },

    bindDeleteButtons: function() {
      var self = this;

      $('button.taxodel').click(function(){
        $(this).parent('td').parent('tr').remove();
        self.refreshTaxonomy();
      });
    },

    refreshTaxonomy: function() {
      var taxod=[];
      //var taxod = $("input[name='taxo\\[\\]']").map(function(){ return $(this).val(); }).get().join('|');
      //$("input[name='taxo\\[\\]']").map(function(){ return taxod.push($(this).val()); });
      $("input[name='taxo\\[\\]']").each(function(){
        taxod.push($(this).val()); 
      });
      $("input[name='taxonomic_details']").val('['+taxod+']');
    }
  };

}(jQuery));