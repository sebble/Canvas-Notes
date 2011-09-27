<?php

if(isset($_REQUEST['mode'])){
    switch($_REQUEST['mode']){
        case 'load':
            $src = file_get_contents('docs/'.$_REQUEST['fn'].'.dm');
            echo json_encode(array('src'=>$src));
            break;
        case 'save':
            file_put_contents('docs/'.$_REQUEST['fn'].'.dm', $_REQUEST['dm']);
            break;
        case 'parse':
            require 'wiki-v3.lib.php';
            $html = wiki_parse_string($_POST['dm']);
            echo json_encode(array('html'=>$html));
            break;
    }
}
