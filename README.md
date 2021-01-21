# React + Apollo + Node.js + GraphQL + MonogDB


### This Project Stack

<a href="https://twitter.com/M_ckymn"><img align="right" src="https://img.shields.io/twitter/follow/fbjest.svg?style=social&label=Follow%20@M_ckymn" alt="Follow on Twitter"></a>
</p>

<p align="center"><img src="https://user-images.githubusercontent.com/60356676/102683377-a5339400-41e1-11eb-9d15-a47f96feabf0.png"></p>

<h2 align="center">✔ GraphQL Movie API</h2>

### Getting Started
     SERVER
       npm install 
       npm start
     CLIENT
       npm install
       npm start

### Docs

GraphQL, API'ler için tasarlanmış bir dildir ve yalnızca her bir müşterinin istediği belirli verileri yükler, bu da ana cazibe merkezidir. Başlangıçta Facebook tarafından oluşturulan, büyüyen ekosistemi, GraphQL topluluğunun tarafsız bir yuvası olan GraphQL Vakfı'nı oluşturdu. Başlıktan da anlaşılacağı gibi, bir alışveriş listesi için bir API oluşturmak üzere Express kullanarak Node'da bir GraphQL sunucusu uygulayacağız. Öyleyse, projemizi oluşturalım!

        mkdir GraphqlMovie
        cd GraphQLShoppingnpm init -ynpm install express express-graphql gaphql

Yeni bir Node projesi oluşturduk ve Express ve GraphQL'i kurduk. Daha sonra, uygulamamız için giriş noktası olan index.js'yi oluşturmamız gerekiyor ve müşterilerimizden aramak için bir rotaya ihtiyacımız var. GraphQL ile ilgili harika olan şey, genellikle bir REST API'de sahip olduğumuz çok sayıda rota yerine yalnızca bir rotaya ihtiyacınız olmasıdır . Bu rota, verilerin yapısına sahip bir sorgu alır ve istenen yapıdaki verilerle bir JSON nesnesi döndürür. Bu eğitim için / graphql rotasını oluşturacağız :

        const express = require("express");
        ‍const graphqlHTTP = require("express-graphql");
        ‍const GraphQLSchema = require("graphql").GraphQLSchema;
        ‍const app = express();
        app.use(  
        "/graphql",    graphqlHTTP({    
            schema: new GraphQLSchema({}),    
            graphiql: true  
        }));
        app.listen(3000, () => {  
        console.log("now listening on port 3000");});

Rotayı oluşturduk ve express-graphql ara yazılımını birkaç seçenekle kullandık: boş bir şema ve graphiql bayrağı true olarak ayarlanmış . Graphiql'i etkinleştirmek , tarayıcıda GraphQL sunucusuyla konuşmak için güzel bir araca sahip olmamızı sağlar, böylece http: // localhost: 3000 / graphql'ye göz attığımızda şunu elde ederiz:

Görüntülenen hata mesajına dikkatinizi çekmek istiyorum:

        {
            "errors":[
                {
                    "message":"GraphQL middleware options must contain a schema."
                }
            ]
        }

Bu mesaj, daha önce oluşturduğumuz boş şema nedeniyle ortaya çıkıyor. Peki nasıl çalışıyor? Şemalar GraphQL ne türleri arasındaki türleri ve ilişkileri can GraphQL anlamı, bizim sorguları tanımlama yoludur kararlılığını . Türler, verilerimizin şeklini belirlemenin dilden bağımsız bir yolu olan GraphQL şema dilini kullanarak verilerin yapısını tanımlayan nesnelerdir.

Örneğin, bir kullanıcı dizimiz olduğunu varsayalım:

/*schema/schema.js*/
        const users = [
            { name: 'Muhammet', id: '1' },
            { name: 'Ahmet', id: '2' }
        ]

Ardından, graphql Node kitaplığını kullanarak bir kullanıcı türü tanımlıyoruz:

        const UserType = new GraphQLObjectType({  
            name: "User",    fields: () => ({    
            id: { type: GraphQLID },    
            name: { type: GraphQLString }  
            })
        ‍});


Biz ne yaptık? Bir GraphQLObjectType oluşturduk , ona bir isim verdik ve bir dizi alan tanımladık. Her alanın GraphQL tipi sistemden bir türü vardır. İd bir olduğunu GraphQLID dizeleri ve sayı kabul, ve adı bir olan GraphQLString bir dize olarak alan tanımlar. Diğer türleri [GraphQL belgelerinde görebilirsiniz](https://graphql.org/graphql-js/type/)


### Şema tanımı
Schema.js dosyasını oluşturalım . Artık türler oluşturabildiğimize göre, şemamızda bu türden veriler için bir sorgu tanımlama zamanı. Önce GraphQL'i içe aktaralım:

/*schema/schema.js*/

        ‍const graphql = require("graphql");
            ‍const {  
            GraphQLObjectType,  
            GraphQLString,  
            GraphQLSchema,  
            GraphQLID,  
            GraphQLBoolean,  
            GraphQLFloat,  
            GraphQLNonNull,  
            GraphQLList} = graphql;

Artık türlerimize sahip olduğumuza göre, sorgularımızı ve şemamızı tanımlama zamanı.

/*schema/schema.js*/
    const RootQuery = new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
            items: {
            type: new GraphQLList(ItemType),
            resolve (parent, args) {
                return items
            }
            },
            users: {
            type: new GraphQLList(UserType),
            resolve (parent, args) {
                return users
            }
            }
        }
        })

        module.exports = new GraphQLSchema({
        query: RootQuery
        })

Bizim için bir sorgu tanımlanan öğelerin iç RootQuery nesne, tip bir örneği olup GraphQLList adından da anlaşılacağı gibi, bu şekil bir listesi olduğunu GraphQL söyler, itemtype daha önce tanımlanmış. Unutulmaması gereken ilginç bir şey, çözümleme işlevidir: öğeleri sorguladığımızda , çözümleme işlevi, Öğe Türü şekliyle eşleşen öğelerin bir listesini döndürmelidir . Son olarak, sorgumuzla GraphQLSchema'nın bir örneğini dışa aktarıyoruz . Bu, express-graphql ara yazılımına sağlamamız gereken şema .

/*index.js*/

        const express = require('express')
        const {graphqlHTTP} = require('express-graphql')
        const GraphQLSchema = require("graphql").GraphQLSchema;
        const schema = require('./schema/schema')

        const app = express()
        app.use(
        '/graphql', graphqlHTTP({
            shcema: new GraphQLSchema({}), 
            schema:schema,
            graphiql: true,
        })
        )

        app.listen(3000,()=>{
            console.log('now listening on port 3000')
        })

Şimdi node index.js'yi çalıştırırsak ve http: // localhost: 3000 / graphql'ye erişirsek sayfayi acalim
Harika eger herhangi bir hataniz bulunmuyorsa soldaki schema'da sorgu sagdaki schema'da ise verileri gorecegiz.

### Sorgular ve ilişkiler

GraphQL sorgusu, sunucudan bazı verileri elde etmek için tanımladığımız özel olarak yapılandırılmış bir dizedir. Nasıl yapılandırıldığını görelim.

    {  
        items{    
            id    
            text    
            completed  
    }}


Bu nedenle, öğeler dizesini küme parantezlerinin içine koyarız ; bu dizge, RootQuery nesnesindeki alanların içine koyduğumuz öğeler anahtarıyla eşleşmelidir . Ardından, ItemType nesnesinden almak istediğimiz tüm alanları küme parantezlerinin içine koyarız; bu durumda: id , metin ve tamamlandı . Oynat düğmesine bastığımızda aşağıdakileri alırız:
Harika, ürün listemiz var! Ya öğeyi hangi kullanıcının oluşturduğunu bilmek istersem - nasıl ilişki kurabiliriz? ItemType'a geri dönelim ve bunu yapalım.

//Item Type
        const ItemType = new GraphQLObjectType({
            name: 'Item',
            fields: () => ({
                id: { type: GraphQLID },
                text: { type: GraphQLString },
                qty: { type: GraphQLFloat },
                completed: { type: GraphQLBoolean },
                user: {
                    type: UserType,
                    resolve(parent,args){
                      return users.find(user => user.id === parent.userId)
                    }
                }
             })
        })

Kullanıcı özelliğini ItemType'a ekledik ve daha önce tanımladığımız UserType olduğunu söyledik . Artık bir müşteri ilişkiyi yüklemek isterse, GraphQL, çözümleme işlevinden verileri alabilir . Kullanıcı verilerini yüklememiz gerekirse, kimliği üst userId değeriyle eşleşen bir kullanıcı bulacaktır. Bu üst öğe, alışveriş listesindeki bir öğedir, bu nedenle GraphQL bize tüm özelliklerine erişim sağlar ve bu listedeki her öğe için çözümleme işlevini çağırır. Öğeleri ve onu oluşturan kullanıcının adını sorgulamak için aşağıdakileri kullanırız:

        {  
        items{    
            id    
            text    
            completed    
            user{      
                name    
                }  
            }
        }

/*schema/schema.js*/        
        const RootQuery = new GraphQLObjectType({
            name: 'RootQueryType',
            fields: {
                items: {
                type: new GraphQLList(ItemType),
                args:{
                    userId:{
                        type: GraphQLID
                    }
                },
                resolve(parent,{userId}){
                    return items.filter(item => item.userId === userId)
                }
            }})

Artık GraphQL, öğeleri sorgularken gerekli olan, userId args adlı bazı argümanları biliyor . GraphQL'e bu argümanın GraphQLID türünde olduğunu, yani değer olarak bir dize veya sayıyı iletebileceğimiz anlamına geldiğini söyledik. Ardından, alışveriş öğelerini filtrelemek için args parametresini kullanmak için çözümleme işlevini değiştirdik. Args parametresi, daha önce tanımladığımız userId verilerine sahip bir nesnedir . Bu, aşağıdaki gibi bir sorguya dönüşür:

        {   items(userId:1){    
            id    
            text    
            completed    
            user{      
            name    
            }  
        }}


