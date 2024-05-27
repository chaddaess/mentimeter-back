
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Integrating swagger
To document your api endpoints , first include the corresponding module in the Swagger configuration in ``main.ts`` like so:
````js
include: [YourModuleHere]
````
To document the endpoint , annotate it like so 
````js
@ApiTags('section-this-endpoint-belongs-to')
@ApiOperation({ summary: 'short summary', description: 'additionnal description/remarks' })
````
Finally to visualise the Swagger UI run the following  endpoint in your browser
````js
"http://localhost:3000/document"
````

