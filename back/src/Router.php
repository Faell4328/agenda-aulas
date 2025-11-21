<?php

namespace App;

use App\Middleware;
use App\Tools\Cookie;

class Router{
    private $accepted_routes_path_and_methods = [
        '/' => ["GET"],

        '/login' => ["POST"],
        '/cadastrar' => ["POST"],
        '/logout' => ["POST"],
        
        '/aulas' =>["GET"],
        '/aulas/ingressadas' => ["GET"],

        '/aulas/adicionar' => ["POST"],
        '/aulas/atualizar' => ["PUT"],
        '/aulas/ingressar' => ["POST"],
    ];
    
    public function __construct($req_route_path, $req_method, $req_body_json){
        if(array_key_exists($req_route_path, $this->accepted_routes_path_and_methods) && in_array($req_method, $this->accepted_routes_path_and_methods[$req_route_path])){
            $this->route($req_route_path, $req_body_json);
        }
        else{
            new \App\Controller\SendingPattern(404, "Not Found");
        }
    }

    private function route($route, $req_body_json){
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
            
            $register_controller = new \App\Controller\Auth;
            $register_controller -> registerUser($req_body_json);
        }
        else if($route == "/login"){
            $middleware -> routeWithoutLogin($user_information);

            $login_controller = new \App\Controller\Auth;
            $login_controller -> logInUser($req_body_json);
        }
        else if($route == "/logout"){
            $middleware -> routeWithLogin($user_information);

            $login_controller = new \App\Controller\Auth;
            $login_controller -> logOut();
        }
        else if($route == "/aulas"){
            #$middleware -> routeWithLogin($user_information);

            $lesson_controller = new \App\Controller\Lesson;
            $lesson_controller -> listAllLessons();
        }
        else if($route == "/aulas/adicionar"){
            $middleware -> routeForTeachersOnly($user_information);
            
            $lesson_controller = new \App\Controller\Lesson;
            $lesson_controller -> createLesson($req_body_json);
        }
        else if($route == "/aulas/atualizar"){
            $middleware -> routeForTeachersOnly($user_information);
            
            $lesson_controller = new \App\Controller\Lesson;
            $lesson_controller -> updateLesson($req_body_json);
        }
        else if($route == "/aulas/ingressar"){
            $middleware -> routeForStudentOnly($user_information);
            
            $lesson_controller = new \App\Controller\Lesson;
            $lesson_controller -> joinLesson();
        }
        else if($route == "/aulas/ingressadas"){
            $middleware -> routeForStudentOnly($user_information);
            
            $lesson_controller = new \App\Controller\Lesson;
            $lesson_controller -> listYourLessons();
        }
    }
}

?>