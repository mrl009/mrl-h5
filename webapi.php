<?php

	function get_auth_headers($header_key = null)
    {
        if (function_exists('apache_request_headers')) {
            /* Authorization: header */
            $headers = apache_request_headers();
            $out = array();
            foreach ($headers AS $key => $value) {
                $key = str_replace(" ", "-", ucwords(strtolower(str_replace("-", " ", $key))));
                $out[$key] = $value;
            }
        } else {
            $out = array();
            if (isset($_SERVER['CONTENT_TYPE'])) {
                $out['Content-Type'] = $_SERVER['CONTENT_TYPE'];
            }
            if (isset($_ENV['CONTENT_TYPE'])) {
                $out['Content-Type'] = $_ENV['CONTENT_TYPE'];
            }
            foreach ($_SERVER as $key => $value) {
                if (substr($key, 0, 5) == "HTTP_") {
                    $key = str_replace(" ", "-", ucwords(strtolower(str_replace("_", " ", substr($key, 5)))));
                    $out[$key] = $value;
                }
            }
        }
        if ($header_key != null) {
            $header_key = ucfirst(strtolower($header_key));
            if (isset($out[$header_key])) {
                return $out[$header_key];
            } else {
                return false;
            }
        }
        return $out;
    }

	/**
     * GET请求
     * @param string $url 请求地址
     * @param string $data 请求参数
     * @return string
     */

    function curl_get($url)
    {
        $url=$url;
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		//$param=$header;
		$param=array(
            'AuthGC: '.get_auth_headers('AuthGC'),
            'FROMWAY: 4'
        );
		curl_setopt($ch, CURLOPT_HTTPHEADER,$param);
		curl_setopt($ch, CURLOPT_USERAGENT,"Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36");
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		$data = curl_exec($ch);
		curl_close($ch);
        return $data;
	}

	/**
     * POST请求
     * @param string $url 请求地址
     * @param string $data 请求参数
     * @return string
     */
	function curl_post($url,$data)
	{
		console.log($data);
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		$param=array(
            'AuthGC: '.get_auth_headers('AuthGC'),
            'FROMWAY: 4'

        );
        curl_setopt($ch, CURLOPT_HTTPHEADER,$param);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($ch, CURLOPT_AUTOREFERER, 1);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
		curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 5.1; rv:23.0) Gecko/20100101 Firefox/23.0");
		//curl_setopt($ch, CURLOPT_REFERER, "http://www.google.ca/");
		$output = curl_exec($ch);
		curl_close($ch);

		return $output;
	}
	//中转调用API
	//$api='https://www.gc0707aqpworvmps.com/';
	$api='http://www.gc360.com/';
	$type = $_POST['act']?$_POST['act']:$_GET['act']; //请求类型
    $url=$api.$_POST['url']; //接口地址


    if($type==1){
    	$arr = curl_get($url.'?'.$_GET['p']);
    }else if($type==2){
    	unset($_POST['act']);
    	unset($_POST['url']);
    	$arr = curl_post($url,$_POST);
    }else{
    	$arr='请求无效';
    }
    echo $arr;
