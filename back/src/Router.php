<?php

namespace App;

class Router{
    private $routes = ['/' => ["GET", "POST"], '/login' => ["POST"], '/cadastrar' => ["POST"]];
    private $rota_atual;
    private $method_atual;

    private function acessarRota(){
        if($this->rota_atual == "/cadastrar"){
            new \App\Controller\Cadastrar();
        }
        else if($this->rota_atual == "/login"){
            new \App\Controller\Login();
        }
    }

    public function __construct($rota_req, $method_req){
        if(array_key_exists($rota_req, $this->routes) && in_array($method_req, $this->routes[$rota_req])){
            $this->rota_atual = $rota_req;
            $this->method_atual = $method_req;
            $this->acessarRota();
        }
        else{
            echo "404";
        }
    }
}

?>