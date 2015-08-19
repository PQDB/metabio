 <?php
 /**
 * @file
 * Default template to use when an entity is rendered using the 'full' view mode.
 * TODO: split into separate template files for each section
 */
?>

<!-- OVERVIEW -->
<?php $af=array_filter($content['overview']); 
if(!empty($af))
 print theme('metabio_overview', array('content' => $content['overview'])); 
?>

<!-- SITE DETAILS -->
<?php $af=array_filter($content['site_details']); 
if(!empty($af))
 print theme('metabio_site_details', array('content' => $content['site_details'])); 
?>

<!-- BIOLOGY -->
<?php $af=array_filter($content['biology']); 
if(!empty($af))
 print theme('metabio_biology', array('content' => $content['biology'])); 
?>

<!-- STUDY DETAILS -->
<?php $af=array_filter($content['study_details']); 
if(!empty($af))
 print theme('metabio_study_details', array('content' => $content['study_details'])); 
?>

<!-- CITATIONS -->
<?php $af=array_filter($content['citations']); 
if(!empty($af))
 print theme('metabio_citations', array('content' => $content['citations'])); 
?>

<!-- FILES -->
<?php $af=array_filter($content['files']); 
if(!empty($af))
 print theme('metabio_files', array('content' => $content['files'])); 
?>