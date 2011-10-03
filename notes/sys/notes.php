<?php

if(isset($_REQUEST['mode'])){
    switch($_REQUEST['mode']){
        case 'load':
            $src = file_get_contents('docs/'.$_REQUEST['fn'].'.dm');
            echo json_encode(array('src'=>$src));
            break;
        case 'save':
            file_put_contents('docs/'.$_REQUEST['fn'].'.dm', $_REQUEST['dm']);
            require 'wiki-v3.lib.php';
            $html = wiki_parse_string($_REQUEST['dm']);
            $html = str_replace('<img src="sys/docs/', '<img src="', $html);
            file_put_contents('docs/'.$_REQUEST['fn'].'.html', $html);
            break;
        case 'save_image':
            $sketch = 'docs/'.$_REQUEST['fn'].'_'.genRandomString().'.png';
            while (file_exists($sketch)) {
                $sketch = 'docs/'.$_REQUEST['fn'].'_'.genRandomString().'.png';
            }
            $png = base64_decode(substr($_REQUEST['pic'],22));
            file_put_contents($sketch, $png);
            echo json_encode(array('img'=>'sys/'.$sketch));
            break;
        case 'parse':
            require 'wiki-v3.lib.php';
            file_put_contents('docs/'.$_REQUEST['fn'].'.dm.autosave', $_REQUEST['dm']);
            $html = wiki_parse_string($_POST['dm']);
            echo json_encode(array('html'=>$html));
            break;
    }
}

function genRandomString() {

    $length = 10;
    $characters = '0123456789abcdefghijklmnopqrstuvwxyz';
    $string = '';    
    for ($p = 0; $p < $length; $p++) {
        $string .= $characters[mt_rand(0, strlen($characters)-1)];
    }
    return $string;
}
