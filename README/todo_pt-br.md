# Especificações da API

## Usuários

**Requisitos Funcionais**

- [x] Deve ser possível criar um usuário
- [x] Deve ser possível confirmar o e-mail do usuário
- [x] Deve ser possível autenticar um usuário com e-mail ou nome de usuário
- [ ] Deve ser possível dar refresh no token de acesso
- [x] Deve ser possível atualizar o e-mail
- [x] Deve ser possível atualizar o nome de usuário
- [x] Deve ser possível atualizar o nome
- [x] Deve ser possível inserir/atualizar o avatar
- [x] Deve ser possível atualizar a senha
- [ ] Deve ser possível recuperar a senha
- [x] Deve ser possível deslogar o usuário
- [x] Deve ser possível deletar o usuário

**Regras de Negócio**

- [x] Não deve ser possível criar um usuário com e-mail já em uso
- [x] Não deve ser possível criar um usuário com nome de usuário já em uso
- [x] Não deve ser possível autenticar um usuário inexistente
- [x] Não deve ser possível autenticar um usuário com a senha incorreta
- [x] Não deve ser possível deletar, deslogar ou atualizar um usuário não autenticado
- [ ] Não deve ser possível que um usuário inexistente recupere uma senha

**Requisitos Não Funcionais**
