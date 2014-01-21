 <?php
 /**
 * @file
 * Default template to use when an entity is rendered using the 'full' view mode.
 * TODO: split into separate template files for each section
 */
?>

<!-- OVERVIEW -->
<?php if(!empty(array_filter($content['overview']))): ?>
  <?php print theme('metabio_overview', array('content' => $content['overview'])); ?>
<?php endif; ?>

<!-- SITE DETAILS -->
<?php if(!empty(array_filter($content['site_details']))): ?>
  <?php print theme('metabio_site_details', array('content' => $content['site_details'])); ?>
<?php endif; ?>

<!-- BIOLOGY -->
<?php if(!empty(array_filter($content['biology']))): ?>
  <?php print theme('metabio_biology', array('content' => $content['biology'])); ?>
<?php endif; ?>

<!-- STUDY DETAILS -->
<?php if(!empty(array_filter($content['study_details']))): ?>
  <?php print theme('metabio_study_details', array('content' => $content['study_details'])); ?>
<?php endif; ?>

<!-- CITATIONS -->
<?php if(!empty(array_filter($content['citations']))): ?>
  <?php print theme('metabio_citations', array('content' => $content['citations'])); ?>
<?php endif; ?>

<!-- FILES -->
<?php if(!empty(array_filter($content['files']))): ?>
  <?php print theme("metabio_files", array('content' => $content['files'])); ?>
<?php endif; ?>