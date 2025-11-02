<?php

namespace App;
use App\Middleware;
use App\Tools\Cookie;

class Router{
    private $accepted_routes_and_methods = ['/' => ["GET"], '/login' => ["POST"], '/cadastrar' => ["POST"], '/aula' =>["GET"], '/aula/adicionar' => ["POST"], '/aula/update' => ["POST"], '/aula/ingressar' => ["POST"]];
    
    public function __construct($rota_req, $method_req){
        if(array_key_exists($rota_req, $this->accepted_routes_and_methods) && in_array($method_req, $this->accepted_routes_and_methods[$rota_req])){
            $this->route($rota_req, $method_req);
        }
        else{
            echo "404";
        }
    }

    private function route($route){
        $middleware = new Middleware;
        $cookie = new Cookie();

        if(isset($_COOKIE["token"])){
            $user_information = $cookie -> getUserInformation($_COOKIE["token"]);
        }
        else{
            $user_information = null;
        }

        if($route == "/cadastrar"){
            $middleware -> routeWithoutLogin($user_information);
            
            $register_controller = new \App\Controller\SignUp;
            $register_controller -> registerUser();
        }
        else if($route == "/login"){
            $middleware -> routeWithoutLogin($user_information);

            $login_controller = new \App\Controller\SignIn;
            $login_controller -> logInUser();
        }
        else if($route == "/aula"){
            $middleware -> routeForTeachersOnly($user_information);

            $lesson_controller = new \App\Controller\Lesson;
            $lesson_controller -> listAllLessons();
        }
        else if($route == "/aula/adicionar"){
            $middleware -> routeForTeachersOnly($user_information);

            $lesson_controller = new \App\Controller\Lesson;
            $lesson_controller -> createLesson();
        }
        else if($route == "/aula/atualizar"){
            $middleware -> routeForTeachersOnly($user_information);

            $lesson_controller = new \App\Controller\Lesson;
            $lesson_controller -> updateLesson();
        }
        else if($route == "/aula/ingressar"){
            $middleware -> routeForStudentOnly($user_information);

            $lesson_controller = new \App\Controller\Lesson;
            $lesson_controller -> joinLesson();
        }
    }
}

?>