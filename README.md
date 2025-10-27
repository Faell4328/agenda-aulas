Um projeto simples desenvolvido para praticar Angular.js e PHP, executado em containers Docker.

## Funcionalidades

**Cadastro (Professor)**
- Informar nome completo, e-mail e senha para realizar o cadastro.
- E-mails duplicados não são permitidos.
- O professor é responsável por criar o login do aluno.

**Login (Professor e Aluno)**
- É necessário informar e-mail e senha corretos para acessar o sistema.

**Criação de Aula (Professor)**
- É necessário informar:
    - Horário de início (cada aula tem duração fixa de 50 minutos);
    - Quantidade máxima de alunos permitida.

**Ingresso na Aula (Aluno)**
- O aluno não pode ingressar em uma aula lotada.
- O aluno não pode participar de duas aulas no mesmo horário.