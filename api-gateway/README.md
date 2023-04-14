
# API Gateway - Kuantukusta

Aplicaçao desenvolvida na arquitetura de microservicos onde utiliza um gateway para fazer a orquestracao das requisicoes.


## Ferramentas utilizadas

* Node Js
* Nest Js
* Docker
* RabbitMQ
* Mongo Atlas DB
* PostgreSQL
* Swagger UI
## Execuçao da Aplicacao

Clone o repositorio do projeto:

```bash
  git clone https://github.com/fabiano1133/api-gateway-kuantu-kusta.git
  
  cd api-gateway-kuantu-kusta
```

* API Gateway

Instalando as dependencias
```bash
  cd api-gateway

  npm install

```

Criar um arquivo .env na raiz do projeto

Para rodar esse projeto, você vai precisar adicionar as seguintes variáveis de ambiente no seu .env

`RABBITMQ_USER=guest`
`RABBITMQ_PASSWORD=guest`
`RABBITMQ_HOST=localhost:5673`
`RABBITMQ_QUEUE_NAME=main_queue`
`RABBITMQ_QUEUE_PRODUCT=product_queue`
`RABBITMQ_QUEUE_SHOPPING_CART=shopping_cart_queu`
`RABBITMQ_QUEUE_AUTH=user_queue`

Executando o RabbitMQ no Docker
```bash
  docker compose up -d
```

Executando a aplicacao
```bash
  npm run start:dev
```

Utilizando o Swagger para testar as requisicoes

abra o seu navegador e digite a url:

http://localhost:8080/api
* Microservice Produto

Instalando as dependencias
```bash
  cd product-microservice

  npm install

```

Executando a aplicacao
```bash
  npm run start:dev
```

* Microservice Carrinho de Compras

Instalando as dependencias
```bash
  cd shopping-cart-microservice

  npm install

```

Executando o PostgreSQL no Docker
```bash
  docker compose up -d
```

Executando a aplicacao
```bash
  npm run start:dev
```
* Microservice Autenticacao

Instalando as dependencias
```bash
  cd auth-microservice

  npm install

```

Executando a aplicacao
```bash
  npm run start:dev
```

## Uso da aplicação - Swagger UI
Após o API Gateway estiver executando local, abra o swagger no seu navegador

```bash
  http://localhost:8080/api
```

Necessario acessar a url ```http://localhost:8180/```
com os dados: 
```
sistema: PostgreSQL
servidor: postgres_db
username=admin
password=admin
```
e criar um banco de dados com o nome: ```shopping-cart-ms-db```

## Step 1

Na secao de autenticacao, execute o signin:

`POST /api/v1/user/signin`

```Request Body: ```
```json
{
  email: "user.user@admin.com"
  password: "12345678"
}
```

```Response: ```
```json
{
  access-token: "string"
}
```

## Step 2

Autenticar com o token recebido do response no step 1

## Step 3

Na secao ShoppingCart, crie um carrinho vazio

`POST /api/v1/create-cart`

```Request Body: ```
```json
  {
  "totalPrice": 0,
  "totalQuantity": 0,
  "products": []
}
```

```Response: 201 - Created```

## Step 4

Na secao de produtos, recupere a lista com todos os produtos cadastrados no banco.

```Request```

```GET /api/v1/products```

```Response```

```json
[
	{
		"_id": "6437f9867b28f7252b7ca5d3",
		"name": "Camisa Masculina M",
		"price": 25.9,
		"createdAt": "2023-04-13T12:45:58.368Z",
		"updatedAt": "2023-04-13T12:45:58.368Z",
		"__v": 0
	},
	{
		"_id": "6437f9ce7b28f7252b7ca5d7",
		"name": "Boné Radical Feminino",
		"price": 39.9,
		"createdAt": "2023-04-13T12:47:10.328Z",
		"updatedAt": "2023-04-13T12:47:10.328Z",
		"__v": 0
	},
	{
		"_id": "64381ec92382a746027d1c75",
		"name": "Mochila Radical",
		"price": 39,
		"createdAt": "2023-04-13T15:24:57.973Z",
		"updatedAt": "2023-04-13T15:24:57.973Z",
		"__v": 0
	}
]
```

## Step 5

Na secao de produtos, adicione um produto ao carrinho criado.

```Request```

```POST /api/v1/cartid/{id}/productid/{_id}```

```Request Params: id = id do carrinho _id = produto```

## Step 6

Na secao de carrinho, recupere o carrinho criado ja com o produto adicionado.

```Request```

``` GET/api/v1/getcart/{id}```

```Request Params: id = id do carrinho```

## Step 7

Na secao de produto, deve ser possivel remover um produto do carrinho do usuario pelo _id.

```Request```

```POST /api/v1/cartid/{id}/productid/{_id}/remove```

```Request Params: id = id do carrinho _id = id do produto```





