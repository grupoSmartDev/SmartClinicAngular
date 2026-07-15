# SmartClinicAngular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.2.

## Development server

Pré-requisitos: Node.js 22 e o backend `WebApiSmartClinic` em execução no perfil HTTPS.

```bash
npm ci
npm start
```

Abra `http://localhost:4200/`. A configuração de desenvolvimento usa a API em `https://localhost:7036/`.

Credenciais do ambiente local:

```text
Chave de acesso: 000.000.000-00
E-mail: dev@smartclinic.local
Senha: LocalDev#2026
```

No VS Code, pressione `F5` e escolha `ng serve` para iniciar o servidor e o depurador do navegador.

Para depurar frontend e backend juntos, abra
`../SmartClinic.code-workspace` e execute a configuração
`SmartClinic: Backend + Frontend`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
