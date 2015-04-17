<?php
// This file is part of mod_offlinequiz for Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * The reports interface for offlinequizzes
 *
 * @package       mod
 * @subpackage    offlinequiz
 * @author        Juergen Zimmer <zimmerj7@univie.ac.at>
 * @copyright     2014 Academic Moodle Cooperation {@link http://www.academic-moodle-cooperation.org}
 * @since         Moodle 2.2+
 * @license       http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 *
 **/

require_once(dirname(__FILE__) . '/../../config.php');
require_once($CFG->dirroot . '/mod/offlinequiz/locallib.php');
require_once($CFG->dirroot . '/mod/offlinequiz/report/reportlib.php');
require_once($CFG->dirroot . '/mod/offlinequiz/report/default.php');

$id = optional_param('id', 0, PARAM_INT);
$q = optional_param('q', 0, PARAM_INT);
$mode = optional_param('mode', '', PARAM_ALPHA);

if ($id) {
    if (!$cm = get_coursemodule_from_id('offlinequiz', $id)) {
        print_error('invalidcoursemodule');
    }
    if (!$course = $DB->get_record('course', array('id' => $cm->course))) {
        print_error('coursemisconf');
    }
    if (!$offlinequiz = $DB->get_record('offlinequiz', array('id' => $cm->instance))) {
        print_error('invalidcoursemodule');
    }

} else {
    if (!$offlinequiz = $DB->get_record('offlinequiz', array('id' => $q))) {
        print_error('invalidofflinequizid', 'offlinequiz');
    }
    if (!$course = $DB->get_record('course', array('id' => $offlinequiz->course))) {
        print_error('invalidcourseid');
    }
    if (!$cm = get_coursemodule_from_instance("offlinequiz", $offlinequiz->id, $course->id)) {
        print_error('invalidcoursemodule');
    }
}

$url = new moodle_url('/mod/offlinequiz/report.php', array('id' => $cm->id));
if ($mode != '') {
    $url->param('mode', $mode);
}
$PAGE->set_url($url);
$PAGE->set_pagelayout('report');

require_login($course, false, $cm);
$context = context_module::instance($cm->id);
require_capability('mod/offlinequiz:viewreports', $context);

$node = $PAGE->settingsnav->find('mod_offlinequiz_results', navigation_node::TYPE_SETTING);
if ($node) {
    $node->make_active();
}

$reportlist = offlinequiz_report_list($context);

if (empty($reportlist)) {
    print_error('erroraccessingreport', 'offlinequiz');
}

// Validate the requested report name.
if ($mode == '') {
    // Default to first accessible report and redirect.
    $url->param('mode', reset($reportlist));
    redirect($url);
} else if (!in_array($mode, $reportlist)) {
    print_error('erroraccessingreport', 'offlinequiz');
}
if (!is_readable("report/$mode/report.php")) {
    print_error('reportnotfound', 'offlinequiz', '', $mode);
}

// Open the selected offlinequiz report and display it.
$file = $CFG->dirroot . '/mod/offlinequiz/report/' . $mode . '/report.php';
if (is_readable($file)) {
    include_once($file);
}
$reportclassname = 'offlinequiz_' . $mode . '_report';
if (!class_exists($reportclassname)) {
    print_error('preprocesserror', 'offlinequiz');
}

// Display the report.
$report = new $reportclassname();
$report->display($offlinequiz, $cm, $course);

// Print footer.
echo $OUTPUT->footer();

// Log that this report was viewed.
$params = array(
        'context' => $context,
        'other' => array(
                'offlinequizid' => $offlinequiz->id,
                'reportname' => $mode
        )
);
$event = \mod_offlinequiz\event\report_viewed::create($params);
$event->add_record_snapshot('course', $course);
$event->add_record_snapshot('offlinequiz', $offlinequiz);
$event->trigger();

