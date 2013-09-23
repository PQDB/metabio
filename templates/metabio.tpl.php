 <?php
 /**
 * @file
 * Default template to use when an entity is rendered using the 'full' view mode.
 * TODO: split into separate template files for each section
 */
?>

<!-- OVERVIEW -->
<div class="metabio-section-header">
  <h2><?php print t('Overview'); ?></h2>
</div>
<?php if(!empty($content['overview']['dataset_description'])): ?>
  <p><?php print $content['overview']['dataset_description']; ?></p>
<?php endif; ?>
<?php if(!empty($content['overview']['data_holder_last_name'])): ?>
  <?php print theme('metabio_contact', array('content' => $content)); ?>
<?php endif; ?>
<?php if(!empty($content['overview']['data_collector'])): ?>
  <p><span class="metabio-field-header"><?php print t('Data collector'); ?>:</span><?php print $content['data_collector']; ?></p>
<?php endif; ?>


<!-- BIOLOGY -->
<div class="metabio-section-header">
  <h2><?php print t('Biology'); ?></h2>
</div>

<!-- STUDY DETAILS -->
<div class="metabio-section-header">
  <h2><?php print t('Study Details'); ?></h2>
</div>

<!-- SITE DETAILS -->
<div class="metabio-section-header">
  <h2><?php print t('Site Details'); ?></h2>
</div>
<?php if(!empty($content['site_details']['site-description'])): ?>
  <p><?php print $content['site_details']['site_description']; ?></p>
<?php endif; ?>
<?php if(!empty($content['site_details']['geography'])): ?>
  <?php print theme('metabio_geography', array('content' => $content['site_details']['geography'])); ?>
<?php endif; ?>

<!-- CITATIONS -->
<div class="metabio-section-header">
  <h2><?php print t('Citations'); ?></h2>
</div>

<!-- FILES -->
<div class="metabio-section-header">
  <h2><?php print t('Data'); ?></h2>
</div>