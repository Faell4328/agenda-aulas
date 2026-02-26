<?php

declare(strict_types=1);

namespace App;

use App\Middleware;
use App\Tools\SendingPattern;
use App\Tools\Cookie;
use App\Controller\Auth;
use App\Controller\Lesson;

class Router{
    private $accepted_routes_path_and_methods = [
        '/' => ["GET"],

        '/login' => ["POST"],
        '/cadastrar' => ["POST"],
        '/logout' => ["POST"],
        
        '/aulas' =>["GET"],
        '/aulas/cadastradas' => ["GET"],
        '/aulas/ingressadas' => ["GET"],
        '/aulas/ingressar' => ["POST"],
        '/aulas/sair' => ["DELETE"],

        '/aulas/adicionar' => ["POST"],
        '/aulas/atualizar' => ["PUT"],
        '/aulas/deletar' => ["DELETE"],
    ];
    
    public function __construct(string $req_route_path, string $req_method, ?object $req_body_json){
        if(array_key_exists($req_route_path, $this->accepted_routes_path_and_methods) && in_array($req_method, $this->accepted_routes_path_and_methods[$req_route_path])){
            $this->route($req_route_path, $req_body_json);
        }
        else{
            new SendingPattern(404, "Not Found");
        }
    }

    private function route(string $route, ?object $req_body_json): void{
        $middleware = new Middleware();
        $cookie = new Cookie();

        $user_information = null;

        if (isset($_COOKIE["token"])) {
            $user_information = $cookie->findByToken($_COOKIE["token"]);
        }

        if ($route == "/") {
            new SendingPattern(200, null, null, $user_information->role ?? "off");
        }
        else if($route == "/cadastrar"){
            $middleware -> routeWithoutLogin($user_information);
            
            $register_controller = new Auth();
            $register_controller -> registerUser($req_body_json);
        }
        else if($route == "/login"){
            $middleware -> routeWithoutLogin($user_information);

            $login_controller = new Auth();
            $login_controller -> loginUser($req_body_json);
        }
        else if($route == "/logout"){
            $middleware -> routeWithLogin($user_information);

            $loginout_controller = new Auth();
            $loginout_controller -> logOut();
        }
        else if($route == "/aulas"){
            $lesson_controller = new Lesson();
            $lesson_controller -> listLessons();
        }
        else if($route == "/aulas/cadastradas"){
            $middleware -> routeForTeachersOnly($user_information);
            
            $lesson_controller = new Lesson();
            $lesson_controller -> listCreatedLessons($user_information -> _id);
        }
        else if($route == "/aulas/ingressadas"){
            $middleware -> routeForStudentOnly($user_information);
            
            $lesson_controller = new Lesson();
            $lesson_controller -> listEnrolledLessons($user_information -> _id);
        }
        else if($route == "/aulas/adicionar"){
            $middleware -> routeForTeachersOnly($user_information);
            
            $lesson_controller = new Lesson();
            $lesson_controller -> createLesson($req_body_json, $user_information->_id);
        }
        else if($route == "/aulas/atualizar"){
            $middleware -> routeForTeachersOnly($user_information);
            
            $lesson_controller = new Lesson();
            $lesson_controller -> updateLesson($req_body_json);
        }
        else if($route == "/aulas/deletar"){
            $middleware -> routeForTeachersOnly($user_information);
            
            $lesson_controller = new Lesson();
            $lesson_controller -> deleteLesson();
        }
        else if($route == "/aulas/ingressar"){
            $middleware -> routeForStudentOnly($user_information);
            
            $lesson_controller = new Lesson();
            $lesson_controller -> joinLesson($user_information);
        }
        else if($route == "/aulas/sair"){
            $middleware -> routeForStudentOnly($user_information);
            
            $lesson_controller = new Lesson();
            $lesson_controller -> leaveLesson($user_information);
        }
    }
}

?>