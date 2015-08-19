(function($) {

  Drupal.behaviors.metabio_file_upload = {

    attach: function() {
      this.attachFiles();
    },

    attachFiles: function(){
      $('#filesbut').click(function(e) {
        e.preventDefault();
        $($("#edit-files")[$("#edit-files").length - 1]).after('<br>
          <input type="file" name="files[files]" size="22" class="form-file" />
          <input type="submit" name="files_upload_button" value="Upload" class="form-submit" />
          <input type="hidden" name="files[fid]" value="0" />');
      });
    }
  }
}(jQuery));