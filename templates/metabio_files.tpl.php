<div class="metabio-section-header">
<h2><?php echo t('Data'); ?>
</h2>
</div>
  <?php 
 		echo '<h2>'.t('Data').'</h2></div>';
  		echo '<ul class="files_list">';
  		$files=explode(';',$content['files']);
  		foreach($files as $f){
  			$file=file_load($f);
  			echo '<li><a href="'.file_create_url($file->uri).'">'.$file->filename.'</a></li>';
  		}
  		echo '</ul>';
  ?>  
