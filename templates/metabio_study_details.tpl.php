<div class="metabio-section-header">
  <h2><?php print t('Study Details'); ?></h2>
</div>

<dl class="metabio-definitions">

<?php if(!empty($content['study_design'])): ?>
  <dt><?php print t('Study design'); ?></dt><dd><?php print $content['study_design']; ?></dd>
<?php endif; ?>

<?php if(!empty($content['study_status'])): ?>
  <dt><?php print t('Study status'); ?></dt>
  <dd>
    <?php print theme('metabio_checkbox_values', array('name' => 'study_status', 'selections' => $content['study_status'])); ?>
  </dd>
<?php endif; ?>

<?php if(!empty($content['sampling_approaches']) || !empty($content['sampling_approaches_other'])): ?>
  <dt><?php print t('Sampling approaches'); ?></dt>
  <dd>
    <?php print theme('metabio_checkbox_values_with_other', array('name' => 'sampling_approaches', 'selections' => $content['sampling_approaches'], 'other' => $content['sampling_approaches_other'])); ?>
  </dd>
<?php endif; ?>

<?php if(!empty($content['study_goals']) || !empty($content['study_goals_other'])): ?>
  <dt><?php print t('Study goals'); ?></dt>
  <dd>
    <?php print theme('metabio_checkbox_values_with_other', array('name' => 'study_goals', 'selections' => $content['study_goals'], 'other' => $content['study_goals_other'])); ?>
  </dd>
<?php endif; ?>

<?php if(!empty($content['data_types']) || !empty($content['data_types_other'])): ?>
  <dt><?php print t('Data types'); ?></dt>
  <dd>
    <?php print theme('metabio_checkbox_values_with_other', array('name' => 'data_types', 'selections' => $content['data_types'], 'other' => $content['data_types_other'])); ?>
  </dd>
<?php endif; ?>

<?php if(!empty($content['frequency_of_sampling'])): ?>
  <dt><?php print t('Frequency of sampling'); ?></dt><dd><?php print $content['frequency_of_sampling']; ?></dd>
<?php endif; ?>

<?php if(!empty($content['first_year'])): ?>
  <dt><?php print t('First year of data collection'); ?></dt><dd><?php print $content['first_year']; ?></dd>
<?php endif; ?>

<?php if(!empty($content['last_year'])): ?>
  <dt><?php print t('Last year of data collection'); ?></dt><dd><?php print $content['last_year']; ?></dd>
<?php endif; ?>

</dl>