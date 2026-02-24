## Arquitetura

O projeto utiliza uma arquitetura em camadas (Layered Architecture), composta por quatro principais camadas:

- **Controller:** Responsável por receber e tratar as requisições HTTP, coordenando o fluxo entre as camadas e retornando as respostas adequadas.
- **Service:** Contém a lógica de negócio da aplicação, processando as regras e operações principais antes de interagir com as demais camadas.
- **Model:** Responsável pela representação e manipulação dos dados da aplicação, geralmente mapeando entidades do banco de dados e centralizando regras de persistência e estrutura dos dados.
- **Tools:** Reúne utilitários e ferramentas auxiliares, como validações, manipulação de cookies, integração com banco de dados e outras funções de apoio.

---

**Estrutura do projeto**

```
├─ back/
│ ├─ .htaccess
│ ├─ apache2.conf
│ ├─ composer.json
│ ├─ Dockerfile
│ └─ src/
│   ├─ index.php
│   ├─ Middleware.php
│   ├─ Router.php
│   ├─ Controller/
│   │ ├─ Auth.php
│   │ └─ Lesson.php
│   ├─ Model/
│   │ ├─ BaseModel.php
│   │ ├─ JoinLesson.php
│   │ ├─ Lesson.php
│   │ ├─ Token.php
│   │ └─ User.php
│   ├─ Service/
│   │ ├─ Auth.php
│   │ └─ Lesson.php
│   └─ Tools/
│     ├─ Cookie.php
│     ├─ SendingPattern.php
│     └─ Validation.php
├─ front/
│ ├─ public/
│ └─ src/
│   ├─ ...
├─ docker-compose.yml
├─ README.md
└─ documentation.md
```

## Rotas

As informações tem que ser enviado no formato JSON para o back end.

**Sem restrição:**

`GET /` - Retorna a role do usuário.
! Podendo retorna "teacher", "student" ou "off".

`GET /aulas` - Consultar todas as aulas do mês atual

`GET /aulas?month=month` - Consulta todas as aulas do mês solicitado.
! O mês no valor é em português.

**Somente usuário não logados:**

`POST /cadastrar` - Realizar cadastro.

- Campos: `name`, `role` (teacher ou student), `email` e `password`.

`POST /login` - Realizar login.

- Campos: `email`, `password`.

**Somente usuário logados**

`POST /logout` - Desloga o usuário.

**Somente professores:**

`GET /aulas/cadastradas` - Consultar aulas cadastradas pelo professor.

`POST /aulas/adicionar` - Adicionar aula.

- Campos: `name`, `timestamp` e `quantity` (quantidade máxima de alunos).

`PUT /aulas/atualizar?id=id_aula` - Atualizar aula especifica.

- Campos: `name`, `timestamp` (padrão JS, que inclui milesegundos. Apenas do ano, mês, dia, horas e minutos) e `quantity` (quantidade máxima de alunos).
! Ao alterar a quantidade, os alunos ingressados são removidos. Caso sejá alterado apenas, nome ou timestamp, será mantido os alunos.

`DELETE /aulas/deletar?id=id_aula` - Remove a aula.

**Somente alunos:**

`GET /aulas/ingressadas` - Consultar aulas ingressadas.
! Retorna ordenado por timestamp_lesson_start.

`POST /aulas/ingressar?id=id_aula` - Ingressar na aula.

`DELETE /aulas/sair?id=id_aula` - Sai da aula ingressada.