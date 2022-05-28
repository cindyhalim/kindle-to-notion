# notion <> kindle backend

this project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/). for detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

<br/>

### requirements

> **notion public integration**: in order to meet notion's public integration requirements, your frontend cannot be running in a public IP adddress.

> **email address**: gmail address used for nodemailer's `createTransport` to send documents to kindle. note that in order for this functionality this email address needs to be added to the approved email sender list.

- the following parameters are required in AWS Systems Manager Parameter Store prior to stack deployment:

| parameters             | description                                          |
| ---------------------- | ---------------------------------------------------- |
| `notion-client-id`     | obtained when setting up a public notion integration |
| `notion-client-secret` | obtained when setting up a public notion integration |
| `transporter-email`    | gmail address                                        |
| `transporter-password` | password for the above gmail address                 |

<br/>

### installation/deployment:

> **requires NodeJS `lts/fermium (v.14.15.0)`**. if you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

- run `npm i` to install the project dependencies
- run `npx sls deploy` to deploy this stack to AWS or `sls deploy` if you have serverless installed globally.
