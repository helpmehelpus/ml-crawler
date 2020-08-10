# ml-crawler
Crawler básico para queries no Mercado Livre

### Instalação e execução
Após clonar o projeto, execute ```npm install``` na raíz. Com as dependências instaladas, execute ``` npm run start``` .

### Uso
O projeto contém uma rota única ``` /search``` , que recebe obrigatoriamente os parâmetros ``` search```  do tipo ``` String```  e ``` limit```  do tipo ``` Number``` 

Uma requisição a este endpoint realiza uma busca na página do mercado livre com a query string passada por ```search``` e retorna uma lista de objetos que contém o nome, link e preço do produto. Requisições feitas desta forma realizam uma única chamada HTTP ao Mercado Livre, e populam a lista de retornos rapidamente.

Como esta página de resultados da busca não contém a loja ou o estado, foi incluído o parâmetro opcional ```deepSearch```, que quando ```true```, acessa as URLs de cada produto para então acessar as URLs das lojas respectivas de cada produto. Este parâmetro é opcional porque o número máximo de requisições feitas neste caso é ```2n + 1```, onde ```n``` é o número de resultados esperados, o que diminui a velocidade da coleta.

Em ambos os tipos de busca, o crawler loga todos os resultados na pasta ```log/```. Os resultados também são logados no console da aplicação durante a execução.

### Hipóteses e limitações

A página de busca do Mercado Livre não apresentava sempre uniformidade no número de resultados. Durante os testes, houve casos em que a página de resultados oferecia 46, 50, 54 ou 56 resultados, sem previsibilidade. Além disso, no caso de haver mais de uma página de resultados, não era possível determinar quantas ocorrências haviam sido em contradas. Em virtude de tais restrições, definimos que o valor máximo que ```limit``` pode assumir é 46, para garantir assim o funcionamento confiável do crawler.

No caso de buscas em profundidade com o parâmetro ```deepSearch```, observe que às vezes mesmo que haja o link para o produto, o crawler não é capaz de popular ```store``` e ```state```. Isso se deve ao fato de que, ao acessar a URL do produto, o Mercado Livre abre uma modal com promoção de frete grátis ou menor frete, e a ocorrência de tal evento também não pode ser determinada. Nestes casos, o crawler retorna ```Ǹ/A``` para os dois últimos campos e continua a busca.
