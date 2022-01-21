# Especificações da API

## Usuários

**Requisitos Funcionais**

- [x] Deve ser possível criar um usuário
- [x] Deve ser possível confirmar o e-mail do usuário
- [ ] Deve ser possível autenticar um usuário com e-mail ou nome de usuário
- [ ] Deve ser possível atualizar o e-mail
- [ ] Deve ser possível atualizar o nome de usuário
- [ ] Deve ser possível inserir/atualizar o avatar
- [ ] Deve ser possível atualizar a senha
- [ ] Deve ser possível recuperar a senha
- [ ] Deve ser possível deslogar o usuário
- [x] Deve ser possível deletar o usuário

**Regras de Negócio**

- [x] Não deve ser possível criar um usuário com e-mail já em uso
- [x] Não deve ser possível criar um usuário com nome de usuário já em uso
- [ ] Não deve ser possível autenticar um usuário inexistente
- [ ] Não deve ser possível autenticar um usuário com a senha incorreta
- [ ] Não deve ser possível deletar, deslogar ou atualizar um usuário não autenticado
- [ ] Não deve ser possível que um usuário inexistente recupere uma senha

**Requisitos Não Funcionais**
