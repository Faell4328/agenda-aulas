<?php

namespace App;
use App\Middleware;
use App\Tools\Cookie;

class Router{
    private $accepted_routes_path_and_methods = [
        '/' => ["GET"],
        '/login' => ["POST"],
        '/cadastrar' => ["POST"],
        '/aula' =>["GET"],
        '/aula/adicionar' => ["POST"],
        '/aula/atualizar' => ["POST"],
        '/aula/ingressar' => ["POST"],
        '/aula/ingressadas' => ["GET"]
    ];
    
    public function __construct($req_route_path, $req_method){
        if(array_key_exists($req_route_path, $this->accepted_routes_path_and_methods) && in_array($req_method, $this->accepted_routes_path_and_methods[$req_route_path])){
            $this->route($req_route_path, $req_method);
        }
        else{
            echo "404";
            exit;
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