<?php

function metabio_form_alter(&$form, &$form_state, $form_id) {

if($form_id == 'user_register_form' | $form_id == 'user_profile_form'){
    $form['first_name'] = array(
      '#title' => t("Prénom"),
      '#type' => 'textfield',
      '#required' => TRUE,
      '#default_value' => isset($form_state['user']->first_name) ? $form_state['user']->first_name : "",
      '#size'=> 30,
      );
    $form['last_name'] = array(
      '#title' => t("Nom de famille"),
      '#type' => 'textfield',
      '#required' => TRUE,
      '#default_value' => isset($form_state['user']->last_name) ? $form_state['user']->last_name : "",
      '#size'=> 30,
      );
    $form['organization'] = array(
      '#title' => t("Organization"),
      '#type' => 'textfield',
      '#required' => TRUE,
      '#default_value' => isset($form_state['user']->organization) ? $form_state['user']->organization : "",
      '#size'=> 60,
      );
    $form['phone'] = array(
      '#title' => t("Phone number (optional)"),
      '#type' => 'textfield',
      '#required' => FALSE,
      '#default_value' => isset($form_state['user']->telephone) ? $form_state['user']->telephone : "",
      '#size'=> 30,
      );
    $form['contact'] = array(
      '#title' => t("I want to stay informed about this project by receiving news through email (max 3-4 emails a year)."),
      '#type' => 'radios',
      '#required' => FALSE,
      '#options' => array(
        1 => 'Oui',
        0 => 'Non',
        ),
      '#default_value' => isset($form_state['user']->contact) ? $form_state['user']->contact : 0,
      '#size'=> 30,
      );    
    $form['validate'] = array(
      '#title' => t("<b>Verification question</b>: complete the name of the website: "),
      '#type' => 'textfield',
      '#required' => TRUE,
      '#default_value' => '',
      '#size'=> 30,
      );
    $form['#validate'][] = 'metabio_user_registration_validate';
    return $form;

}else  if($form_id == 'metabio_node_form') {

    drupal_add_js(array('metabio_mode' => 'edit'), 'setting');
    $form['vertical_tabs'] = array(
    '#type' => 'vertical_tabs',
    '#default_tab' => 'overview_tab',
   );
    $form['overview'] = array(
      '#title' => t('Overview'),
      '#type' => 'fieldset',
      '#collapsible' => TRUE,
      '#collapsed' => FALSE,
      '#group' => 'vertical_tabs',
      '#tree' =>FALSE,
      );

    $form['overview']['dataset_name'] = array(
      '#title' => t('Dataset name'),
      '#type' => 'textfield',
      '#size' => 50,
      '#required' => TRUE,
      '#default_value' => isset($form['#node']->metabio['overview']['dataset_name']) ? $form['#node']->metabio['overview']['dataset_name'] : ""
      );

    $form['overview']['dataset_description'] = array(
      '#title' => t('Dataset description'),
      '#type' => 'textarea',
      '#cols' => 50,
      '#rows' => 6,
      '#required' => TRUE,
      '#default_value' => isset($form['#node']->metabio['overview']['dataset_description']) ? $form['#node']->metabio['overview']['dataset_description'] : ""
      );

    $form['overview']['tags'] = array(
      '#type' => 'hidden',
      '#prefix' => '<div class="metabox"><h3>'.t('Tags / keywords').'</h3>',
      '#default_value' => isset($form['#node']->metabio['overview']['tags']) ? $form['#node']->metabio['overview']['tags'] : "",
      );

    $form['overview']['tags_input'] = array(
      '#type' => 'textfield',
      '#title' => '',
      '#prefix' => "<h4>".t('Add tags/keywords here. Start typing and choose an existing tag, or enter a new one, then press the ENTER key.')."</h4><table id='tagstbl'></table>",
      '#autocomplete_path' => 'metabio/tags_autocomplete',
      '#maxlength' => 1024,
      '#suffix' => '</div><br>'
    );

    $form['overview']['data_collector'] = array(
      '#title' => t('Data collector(s)'),
      '#type' => 'textfield',
      '#size' => 50,
      '#required' => FALSE,
      '#default_value' => isset($form['#node']->metabio['overview']['data_collector']) ? $form['#node']->metabio['overview']['data_collector'] : ""
      );
    
    $form['overview']['data_holder_contact'] = array(
      '#title' => t('Contact information for data holder'),
      '#type' => 'fieldset', 
      '#collapsible' => FALSE, 
      );

    $form['overview']['data_holder_contact']['data_holder_first_name'] = array(
      '#title' => t('First name'),
      '#type' => 'textfield',
      '#size' => 50,
      '#required' => FALSE,
      '#default_value' => isset($form['#node']->metabio['overview']['data_holder_first_name']) ? $form['#node']->metabio['overview']['data_holder_first_name'] : ""
      );

    $form['overview']['data_holder_contact']['data_holder_last_name'] = array(
      '#title' => t('Last name'),
      '#type' => 'textfield',
      '#size' => 50,
      '#required' => FALSE,
      '#default_value' => isset($form['#node']->metabio['overview']['data_holder_last_name']) ? $form['#node']->metabio['overview']['data_holder_last_name'] : ""
      );

    $form['overview']['data_holder_contact']['data_holder_institution'] = array(
      '#title' => t('Institution'),
      '#type' => 'textfield',
      '#size' => 50,
      '#required' => FALSE,
      '#default_value' => isset($form['#node']->metabio['overview']['data_holder_institution']) ? $form['#node']->metabio['overview']['data_holder_institution'] : ""
      );

    $form['overview']['data_holder_contact']['data_holder_email'] = array(
      '#title' => t('Email'),
      '#type' => 'textfield',
      '#size' => 50,
      '#required' => FALSE,
      '#default_value' => isset($form['#node']->metabio['overview']['data_holder_email']) ? $form['#node']->metabio['overview']['data_holder_email'] : ""
      );

    $form['overview']['data_holder_contact']['data_holder_phone'] = array(
      '#title' => t('Telephone'),
      '#type' => 'textfield',
      '#size' => 50,
      '#required' => FALSE,
      '#default_value' => isset($form['#node']->metabio['overview']['data_holder_phone']) ? $form['#node']->metabio['overview']['data_holder_phone'] : ""
      );

    $form['overview']['data_holder_contact']['data_holder_address'] = array(
      '#title' => t('Address'),
      '#type' => 'textarea',
      '#cols' => 50,
      '#rows' => 3,
      '#size' => 50,
      '#required' => FALSE,
      '#default_value' => isset($form['#node']->metabio['overview']['data_holder_address']) ? $form['#node']->metabio['overview']['data_holder_address'] : ""
      );

    $form['overview']['other_institutions'] = array(
      '#title' => t('Other institution(s) involved in data collection, analysis, archiving, etc. (e.g. university, government, department)'),
      '#type' => 'textarea',
      '#cols' => 50,
      '#rows' => 6,
      '#required' => FALSE,
      '#default_value' => isset($form['#node']->metabio['overview']['other_institutions']) ? $form['#node']->metabio['overview']['other_institutions'] : ""
      );

    $form['overview']['funding_sources'] = array(
      '#title' => t('Funding sources for data collection'),
      '#type' => 'textarea',
      '#cols' => 50,
      '#rows' => 6,
      '#required' => FALSE,
      '#default_value' => isset($form['#node']->metabio['overview']['funding_sources']) ? $form['#node']->metabio['overview']['funding_sources'] : ""
      );

    $form['overview']['dataset_format'] = array(
      '#title' => t('In what format is the dataset?'),
      '#type' => 'textarea',
      '#cols' => 50,
      '#rows' => 6,
      '#required' => FALSE,
      '#default_value' => isset($form['#node']->metabio['overview']['dataset_format']) ? $form['#node']->metabio['overview']['dataset_format'] : ""
      );

    $form['overview']['responsible_person'] = array(
      '#title' => t('Person currently responsible for this metadata'),
      '#type' => 'textfield',
      '#size' => 50,
      '#required' => FALSE,
      '#default_value' => isset($form['#node']->metabio['overview']['responsible_person']) ? $form['#node']->metabio['overview']['responsible_person'] : ""
      );

    $form['overview']['additional_comments'] = array(
      '#title' => t('Additional comments'),
      '#type' => 'textarea',
      '#cols' => 50,
      '#rows' => 6,
      '#required' => FALSE,
      '#default_value' => isset($form['#node']->metabio['overview']['additional_comments']) ? $form['#node']->metabio['overview']['additional_comments'] : ""
      );

    $form['biology'] = array(
      '#title' => t('Biology'),
      '#type' => 'fieldset',
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      '#group' => 'vertical_tabs',
      '#tree' => FALSE
      );

    $form['biology']['taxa_studied'] = array(
      '#title' => t('Taxa studied'),
      '#type' => 'textfield',
      '#size' => 100,
      '#required' => FALSE,
      '#default_value' => isset($form['#node']->metabio['biology']['taxa_studied']) ? $form['#node']->metabio['biology']['taxa_studied'] : ""
      );

    $form['biology']['taxonomic_information'] = array(
      '#title' => t('Taxonomic information'),
      '#type' => 'checkboxes',
      '#options' => _options_taxonomic_information(),
      '#default_value' => isset($form['#node']->metabio['biology']['taxonomic_information']) && is_array($form['#node']->metabio['biology']['taxonomic_information']) ? $form['#node']->metabio['biology']['taxonomic_information'] : array()
      );

    $form['biology']['taxonomic_details'] = array(
      '#type' => 'hidden',
      '#prefix' => '<div class="metabox"><h3>'.t('Taxonomic Details').'</h3>',
      '#default_value' => isset($form['#node']->metabio['biology']['taxonomic_details']) ? $form['#node']->metabio['biology']['taxonomic_details'] : "",
      );


    $form['biology']['taxonomic_details_input'] = array(
      '#type' => 'textfield',
      '#size' => 100,
      '#required' => FALSE,
      '#prefix' => "<h4>".t('Add taxa here by typing either the scientific or common name. Press the ENTER key when the name is selected')."</h4><table id='taxotbl'></table>",
      '#suffix' => "</div>",
      '#autocomplete_path' => (db_table_exists('itis_names')) ? 'metabio/taxonomy_autocomplete' : '',
      );  

    $form['study_details'] = array(
      '#title' => t('Study details'),
      '#type' => 'fieldset',
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      '#group' => 'vertical_tabs',
      '#tree' =>FALSE,
      );

    $form['study_details']['study_design'] = array(
      '#title' => t('Describe the study design'),
      '#type' => 'textarea',
      '#cols' => 50,
      '#rows' => 6,
      '#required' => FALSE,
      '#default_value' => isset($form['#node']->metabio['study_details']['study_design']) ? $form['#node']->metabio['study_details']['study_design'] : ""
      );

    $form['study_details']['study_status'] = array(
      '#title' => t('Study status'),
      '#type' => 'radios',
      '#options' => _options_study_status(),
      '#default_value' => isset($form['#node']->metabio['study_details']['study_status']) ? $form['#node']->metabio['study_details']['study_status'] : ""
      );

    $form['study_details']['sampling_approaches'] = array(
      '#title' => t('Sampling approach(es)'),
      '#type' => 'checkboxes',
      '#options' => _options_sampling_approaches(),
      '#default_value' => isset($form['#node']->metabio['study_details']['sampling_approaches']) && is_array($form['#node']->metabio['study_details']['sampling_approaches']) ? $form['#node']->metabio['study_details']['sampling_approaches'] : array()
      );

    $form['study_details']['sampling_approaches_other'] = array(
      '#type' => 'textfield',
      '#size' => 70,
      '#title' => '<h4>'.t('Please define "other"').'</h4>',
      '#states' => array(
        'visible' => array(
          ':input[name="sampling_approaches[6]"]' => array('checked' => TRUE),
        ),
      ),
      '#default_value' => (isset($form['#node']->metabio['study_details']['sampling_approaches_other']) && in_array(6, $form['#node']->metabio['study_details']['sampling_approaches'])) ? $form['#node']->metabio['study_details']['sampling_approaches_other'] : ""
    );

    $form['study_details']['study_goals'] = array(
      '#title' => t('Study goal(s)'),
      '#type' => 'checkboxes',
      '#options' => _options_study_goals(),
      '#default_value' => isset($form['#node']->metabio['study_details']['study_goals']) && is_array($form['#node']->metabio['study_details']['study_goals']) ? $form['#node']->metabio['study_details']['study_goals'] : array()
      );

    $form['study_details']['study_goals_other'] = array(
      '#type' => 'textfield',
      '#size' => 70,
      '#title' => '<h4>'.t('Please define "other"').'</h4>',
      '#states' => array(
        'visible' => array(
          ':input[name="study_goals[9]"]' => array('checked' => TRUE),
        ),
      ),
      '#default_value' => isset($form['#node']->metabio['study_details']['study_goals_other']) ? $form['#node']->metabio['study_details']['study_goals_other'] : ""
    );


    $form['study_details']['data_types'] = array(
      '#title' => t('Data type(s)'),
      '#type' => 'checkboxes',
      '#options' => _options_data_types(),
      '#default_value' => isset($form['#node']->metabio['study_details']['data_types']) && is_array($form['#node']->metabio['study_details']['data_types']) ? $form['#node']->metabio['study_details']['data_types'] : array()
      );


    $form['study_details']['data_types_other'] = array(
      '#type' => 'textfield',
      '#size' => 70,
      '#title' => '<h4>'.t('Please define "other"').'</h4>',
      '#states' => array(
        'visible' => array(
          ':input[name="data_types[8]"]' => array('checked' => TRUE),
        ),
      ),
      '#default_value' => isset($form['#node']->metabio['study_details']['data_types_other']) ? $form['#node']->metabio['study_details']['data_types_other'] : ""
    );

    $form['study_details']['frequency_of_sampling'] = array(
      '#title' => t('Frequency of sampling'),
      '#type' => 'textarea',
      '#cols' => 30,
      '#rows' => 2,
      '#required' => FALSE,
      '#default_value' => isset($form['#node']->metabio['study_details']['frequency_of_sampling']) ? $form['#node']->metabio['study_details']['frequency_of_sampling'] : ""
      );

    $form['study_details']['first_year'] = array(
      '#title' => t('First year of data collection'),
      '#type' => 'date_select',
      '#date_format' => 'Y',
      '#default_value' => '2013',
      '#date_year_range' => '-100:0',
      '#required' => FALSE,
      '#date_label_position' => 'within',
      '#default_value' => isset($form['#node']->metabio['study_details']['first_year']) ? $form['#node']->metabio['study_details']['first_year'] : ""
      );

    $form['study_details']['last_year'] = array(
      '#title' => t('Last year of data collection'),
      '#type' => 'date_select',
      '#date_format' => 'Y',
      '#default_value' => '2013',
      '#date_year_range' => '-100:0',
      '#required' => FALSE,
      '#date_label_position' => 'within',
      '#default_value' => isset($form['#node']->metabio['study_details']['last_year']) ? $form['#node']->metabio['study_details']['last_year'] : ""
      );

    $form['site_details'] = array(
      '#title' => t('Site details'),
      '#type' => 'fieldset',
      '#attributes' => array(
        'class' => array('site_details_fieldset'),
      ),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      '#group' => 'vertical_tabs',
      '#tree' =>FALSE
      );

    $form['site_details']['number_of_sites'] = array(
      '#title' => t('Number of sites included in the study'),
      '#type' => 'textfield',
      '#size' => 100,
      '#required' => FALSE,
      '#default_value' => isset($form['#node']->metabio['site_details']['number_of_sites']) ? $form['#node']->metabio['site_details']['number_of_sites'] : ""
      );

    $form['site_details']['site_description'] = array(
      '#title' => t('Describe the site(s) (including distribution of sites if more than one)'),
      '#type' => 'textarea',
      '#cols' => 50,
      '#rows' => 6,
      '#required' => FALSE,
      '#default_value' => isset($form['#node']->metabio['site_details']['site_description']) ? $form['#node']->metabio['site_details']['site_description'] : ""
      );

    $form['site_details']['site_habitat'] = array(
      '#title' => t('Describe site habitat(s)'),
      '#type' => 'textarea',
      '#cols' => 50,
      '#rows' => 6,
      '#required' => FALSE,
      '#default_value' => isset($form['#node']->metabio['site_details']['site_habitat']) ? $form['#node']->metabio['site_details']['site_habitat'] : ""
      );

    $form['site_details']['site_environment'] = array(
      '#title' => t('Site environment(s)'),
      '#type' => 'checkboxes',
      '#options' => _options_site_environment(),
      '#required' => FALSE,
      '#default_value' => isset($form['#node']->metabio['site_details']['site_environment']) && is_array($form['#node']->metabio['site_details']['site_environment']) ? $form['#node']->metabio['site_details']['site_environment'] : array()
      );

    $form['site_details']['location_name'] = array(
      '#title' => t('Location name'),
      '#type' => 'textfield',
      '#size' => 100,
      '#required' => FALSE,
      '#prefix' => '<div class="metabox"><h2>'.t('Geography').'</h2>',
      '#suffix' => '<div id="noloc" style="display:none;">'.t('Location not recognized!').'</div><button type="button" id="addbynamebut">'.t('Add marker at this location').'</button>',
      '#default_value' => isset($form['#node']->metabio['site_details']['location_name']) ? $form['#node']->metabio['site_details']['location_name'] : ""
      );

    $form['site_details']['geography'] = array(
      '#title' => t('Geography'),
      '#type' => 'hidden',
      '#size' => 200,
      '#required' => FALSE,
      '#default_value' => isset($form['#node']->metabio['site_details']['geography']) ? $form['#node']->metabio['site_details']['geography'] : "",
      '#prefix' => '<h3>'.t('Define extent/location of study site(s)').'</h3>
        <p>'.t('Add geographic coordinates of each study site in the box below, one coordinate per line or add the sites directly on the map below.').'
          <textarea id="inputcoords"></textarea>
          <div id="coorderror">'.t('Coordinate(s) not recognized!').'</div>
          <button type="button" id="inputcoordsbut" class="metabio-button">'.t('Add to map').'</button>
        </p>
        <p>'.t('For points, single-click to delete. For polygons, double-click on a node to delete, click and drag to relocate.').'</p>',
      '#suffix' => '<p>
        <button type="button" id="polybut">'.t('Add polygon').'</button>
        <button type="button" id="pointbut">'.t('Add point(s)').'</button>
        <button type="button" id="metabio-clear">'.t('Clear all').'</button>
        </p>
        <div id="map" width="700" height="500"></div></div>'
      );

    $form['citations'] = array(
      '#title' => t('Citations'),
      '#type' => 'fieldset',
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      '#group' => 'vertical_tabs',
      '#tree' =>FALSE
      );

    $form['citations']['publications_types'] = array(
      '#title' => t('Publications'),
      '#type' => 'checkboxes',
      '#options' => _options_publication_types(),
      '#default_value' => isset($form['#node']->metabio['citations']['publications_types']) && is_array($form['#node']->metabio['citations']['publications_types']) ? $form['#node']->metabio['citations']['publications_types'] : array()
      );

    $form['citations']['publications'] = array(
      '#title' => t('List of publications'),
      '#type' => 'textarea',
      '#cols' => 50,
      '#rows' => 6,
      '#required' => FALSE,
      '#default_value' => isset($form['#node']->metabio['citations']['publications']) ? $form['#node']->metabio['citations']['publications'] : ""
      );

    $form['citations']['publications_hyperlinks'] = array(
      '#title' => t('Hyperlinks to publications'),
      '#type' => 'textarea',
      '#cols' => 50,
      '#rows' => 6,
      '#required' => FALSE,
      '#default_value' => isset($form['#node']->metabio['citations']['publications_hyperlinks']) ? $form['#node']->metabio['citations']['publications_hyperlinks'] : ""
      );

    $form['citations']['publications_dois'] = array(
      '#title' => t('Publications Digital Object Identifiers (DOIs)'),
      '#type' => 'textarea',
      '#cols' => 50,
      '#rows' => 6,
      '#required' => FALSE,
      '#default_value' => isset($form['#node']->metabio['citations']['publications_dois']) ? $form['#node']->metabio['citations']['publications_dois'] : ""
      );

    $form['citations']['specimens'] = array(
      '#title' => t('Specimens'),
      '#type' => 'checkboxes',
      '#options' => _options_specimens(),
      '#default_value' => isset($form['#node']->metabio['citations']['specimens']) && is_array($form['#node']->metabio['citations']['specimens']) ? $form['#node']->metabio['citations']['specimens'] : array()
      );

    $form['citations']['collections'] = array(
      '#title' => t('Name of collection(s)'),
      '#type' => 'textarea',
      '#rows' => 6,
      '#cols' => 50,
      '#default_value' => isset($form['#node']->metabio['citations']['collections']) ? $form['#node']->metabio['citations']['collections'] : array()
      );

    $form['filesfield'] = array(
      '#title' => t('Files'),
      '#type' => 'fieldset',
      //'#title_display' => 'invisible',
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      '#group' => 'vertical_tabs',
      '#tree' =>FALSE
      );

    $form['filesfield']['filelist'] = array(
      '#type' => 'fieldset',
      '#title_display' => 'invisible',
      '#prefix' => '<div id="files-div">',
      '#suffix' => '</div>',
      '#tree' =>FALSE
      );

    $numuploads = 0;
    if(array_key_exists('values',$form_state)){
      foreach ($form_state['values'] as $key => $value) {
        if (strpos($key,"file_") !== false) {
        $numuploads++;
        }
      }
    }

    if (isset($form['#node']->metabio['files']['files']) && $numuploads == 0){
      $filesindb = explode(';',$form['#node']->metabio['files']['files']);
      $numuploads = count($filesindb);
    }

    for ($i=0; $i<=$numuploads; $i++){
      $form['filesfield']['filelist']['file_'.$i]= array(
        '#title' => t('Choose a file'),
        '#type' => 'managed_file',
        '#title_display' => 'invisible',
        '#size' => 22,
        '#default_value' => isset($filesindb[$i]) ? $filesindb[$i] : "",
        '#upload_location' => 'public://metabio_files/',
        '#upload_validators' => array(
          'file_validate_extensions' => array('gif png jpg jpeg pdf xls xlsx doc docx csv csvt odf txt rtf'),
          // Pass the maximum file size in bytes
        ),
      );
    }

    $form['filesfield']['addnewfile'] = array(
      '#type' => 'submit',
      '#value' => t('Add more files'),
      '#executes_submit_callback' => FALSE,
      '#ajax' => array(
        'callback' => 'ajax_addfiles_callback',
        'wrapper' => 'files-div',
        'method' => 'append',
        'effect' => 'fade',
        ),
      );

    $module_path = base_path().drupal_get_path('module', 'metabio');
    $js_files = array(
      'http://maps.google.com/maps/api/js?sensor=false',
      $module_path . '/javascript/metabio.map.js',
      $module_path . '/javascript/metabio.taxonomy.js',
      $module_path . '/javascript/metabio.tags.js',
      );
    $form['#attached']['js'] = $js_files;
    $form['#pre_render'][] = 'vertical_tabs_form_pre_render';
    $form['#validate'][] = 'metabio_form_validate';
    $form['#submit'][] = 'metabio_form_submit';
    $form['additional_settings']['#access'] = FALSE;
    $form['options']['status']['#default_value'] = TRUE;
    $form['options']['status']['#input'] = TRUE;
    $form['options']['status']['#return_value'] = TRUE;
    $form['options']['status']['#value'] = TRUE;
    $form['options']['status']['#checked'] = TRUE;
  }

}

function metabio_search_form($form,&$form_state){
    if(!array_key_exists('values',$form_state)) {
      $content=metabio_list('',false);
    }else{
      $content='';
    }
   $form['searchbox'] = array(
      '#title' => t(''),
      '#type' => 'textfield',
      '#size' => 50,
      '#required' => FALSE,
      );

   $form['searchbutton'] = array(
      '#type' => 'submit',
      '#value' => t('Search'),
      //'#executes_submit_callback' => FALSE,
      '#ajax' => array(
        'callback' => '_ajax_metabio_list',
        'wrapper' => 'search_results',
        'method' => 'replace',
        'effect' => 'fade',
        ),
      );

   $form['box'] = array(
      '#type' => 'markup',
      '#prefix' => '<div id="search_results">',
      '#suffix' => '</div>',
      '#markup' => $content,
      );

    $module_path = base_path().drupal_get_path('module', 'metabio');
    $js_files = array(
      'http://maps.google.com/maps/api/js?sensor=false',
      $module_path . '/javascript/metabio.map.js',
      );
    $form['#attached']['js'] = $js_files;
    return $form;
}

function _metabio_search_form() {
  return drupal_get_form('metabio_search_form');
}

?>