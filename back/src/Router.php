<?php

namespace App;
use App\Middleware;

class Router{
    private $accepted_routes_and_methods = ['/' => ["GET"], '/login' => ["POST"], '/cadastrar' => ["POST"], '/aula' =>["POST", "PUT"]];

    private function route($route, $method){
        $middleware = new Middleware;

        if($route == "/cadastrar"){
            $middleware->routeWithoutLogin();
            
            $register_controller = new \App\Controller\SignUp;
            $register_controller -> registerUser();
        }
        else if($route == "/login"){
            $middleware->routeWithoutLogin();

            $login_controller = new \App\Controller\SignIn;
            $login_controller -> logInUser();
        }
        else if($route == "/"){
            $middleware->routeWithLogin();

            echo "oi";
        }
    }

    public function __construct($rota_req, $method_req){
        if(array_key_exists($rota_req, $this->accepted_routes_and_methods) && in_array($method_req, $this->accepted_routes_and_methods[$rota_req])){
            $this->route($rota_req, $method_req);
        }
        else{
            echo "404";
        }
    }
}

?>