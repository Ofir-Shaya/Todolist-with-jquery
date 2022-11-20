<?php
$function = $_POST['func'];
if ($function === 'add')
    handle_add();
if ($function === 'update')
    handle_update();
if ($function === 'delete')
    handle_delete();

function handle_add()
{
    $json_file = file_get_contents('./allTasks.json');
    $data = $_POST['task'];
    $data['isComplete'] = (bool) $data['isComplete'];

    $json_a = json_decode($json_file, true);
    array_push($json_a['allTasks'], $data);
    $json_a = json_encode($json_a);


    $myfile = fopen('allTasks.json', 'w') or die('unable to open file');
    fwrite($myfile, $json_a);
    fclose($myfile);
}

function handle_update()
{
    $json_file = file_get_contents('./allTasks.json');
    $id = $_POST['id'];
    $property = $_POST['property'];
    $value = $_POST['value'];

    $json_a = json_decode($json_file, true);
    $newValue = json_decode($value, true);

    foreach ($json_a['allTasks'] as &$task) {
        if ($task['key'] == $id)
            if ($property == 'isComplete') {
                $task[$property] = (bool) $newValue;
            } else {
                $task[$property] = $value;

            }
    }

    $json_a = json_encode($json_a);
    $myfile = fopen('allTasks.json', 'w') or die('unable to open file');
    fwrite($myfile, $json_a);
    fclose($myfile);
}

function handle_id_update($json_a)
{
    foreach ($json_a['allTasks'] as $key => &$task) {
        $task['key'] = (string) $key;
    }
    return $json_a;
}

function handle_delete()
{
    $json_file = file_get_contents('./allTasks.json');
    $id = $_POST['id'];

    $json_a = json_decode($json_file, true);
    array_splice($json_a['allTasks'], $id, 1);

    $json_a = handle_id_update($json_a);

    $json_a = json_encode($json_a);

    $myfile = fopen('allTasks.json', 'w') or die('unable to open file');
    fwrite($myfile, $json_a);
    fclose($myfile);
}

?>