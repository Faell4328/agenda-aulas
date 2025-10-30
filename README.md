Um projeto simples desenvolvido para praticar Angular.js e PHP, executado em containers Docker.

## Funcionalidades

**Cadastro**
- Informar nome completo, cargo (professor ou aluno), e-mail e senha para realizar o cadastro.
- E-mails duplicados não são permitidos.

**Login**
- É necessário informar e-mail e senha corretos para acessar o sistema.

**Criação de Aula (Professor)**
- É necessário informar:
    - Horário de início (cada aula tem duração fixa de 50 minutos);
    - Quantidade máxima de alunos permitida.

**Ingresso na Aula (Aluno)**
- O aluno não pode ingressar em uma aula lotada.
- O aluno não pode participar de duas aulas no mesmo horário.

---

## Especificações técnicas

**Front-end:** Desenvolvido em Angular.js com Angular Material.

**Back-end:** Implementado em PHP.

**Banco de Dados:** Utiliza MongoDB.

**Infraestrutura (CI):** Todos os serviços executam em containers Docker.