<?php

namespace App;
use App\Middleware;

class Router{
    private $accepted_routes_and_methods = ['/' => ["GET"], '/login' => ["POST"], '/cadastrar' => ["POST"], '/aula' =>["GET"], '/aula/add' => ["POST"], '/aula/update' => ["POST"], '/aula/ingressar' => ["POST"]];

    private function route($route, $method){
        $middleware = new Middleware;

        if($route == "/cadastrar"){
            $middleware->routeWithoutLogin();
            
            $register_controller = new \App\Controller\SignUp;
            $register_controller -> registerUser();
        }
        else if($route == "/login"){
            $middleware -> routeWithoutLogin();

            $login_controller = new \App\Controller\SignIn;
            $login_controller -> logInUser();
        }
        else if($route == "/aula"){
            $middleware -> routeForTeachersOnly();

            $lesson_controller = new \App\Controller\Lesson;
            $lesson_controller -> listAllLessons();
        }
        else if($route == "/aula/adicionar"){
            $middleware -> routeForTeachersOnly();

            $lesson_controller = new \App\Controller\Lesson;
            $lesson_controller -> createLesson();
        }
        else if($route == "/aula/atualizar"){
            $middleware -> routeForTeachersOnly();

            $lesson_controller = new \App\Controller\Lesson;
            $lesson_controller -> updateLesson();
        }
        else if($route == "/aula/ingressar"){
            $middleware -> routeForStudentOnly();

            $lesson_controller = new \App\Controller\Lesson;
            $lesson_controller -> joinLesson();
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