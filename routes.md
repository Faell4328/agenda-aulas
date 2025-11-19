## Rotas:

As informações tem que ser enviado no formato JSON para o back end.

### Front

`GET /` - Consultar o calendário de aulas.

`GET /aula/:id` - Consultar informações especifica de uma aula.

`GET /cadastrar` - Realizar cadastro.

`GET /login` - Realizar login.

### Back

**Somente usuário não logados:**

`POST /cadastrar` - Realizar cadastro.
- Campos: `name`, `role`, `email` e `password`.

`POST /login` - Realizar login.
- Campos: `name`, `password`.

**Somente usuários logados:**

`GET /aula` - Consultar todas as aulas cadastradas.

**Somente professores:**

`GET /aula/cadastradas` - Consultar aulas cadastradas pelo professor.

`POST /aula/adicionar` - Adicionar aula.
- Campos: `name`, `data`, `start_time` e `quantity` (quantidade máxima de alunos).

`PUT /aula/atualizar?id=id_aula` - Atualizar aula especifica.
- Campos: `name`, `data`, `start_time` e `quantity` (quantidade máxima de alunos).

**Somente alunos:**

`GET /aula/ingressadas` - Consultar aulas ingressadas.

`POST /aula/ingressar?id=id_aula` - Ingressar na aula.