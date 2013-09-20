 <?php
 /**
 * @file
 * Default template to use when an entity is rendered using the 'full' view mode.
 */
?>
<?php if(!empty($content['geography'])): ?>
<?php print theme('metabio_geography', array('content' => $content['geography'])); ?>
<?php endif; ?>