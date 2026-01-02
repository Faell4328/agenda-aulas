## Regras

## Rotas:

As informações tem que ser enviado no formato JSON para o back end.

**Sem restrição:**

`GET /` - Retorna a role do usuário.

`GET /aulas` - Consultar todas as aulas cadastradas.
! Retorna ordenado por timestamp_lesson_start.

**Somente usuário não logados:**

`POST /cadastrar` - Realizar cadastro.
- Campos: `name`, `role`, `email` e `password`.

`POST /login` - Realizar login.
- Campos: `email`, `password`.

**Somente usuário logados**

`POST logout/` - Desloga o usuário.

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
