fetch("http://localhost:3000/api/products")            /* requete serveur de l'api*/
    .then((responseKanap) => responseKanap.json())
    .then((listeKanaps) => ajoutKanaps(listeKanaps))   /* appelle les produits de l'api */

/* ajoutKanaps va recuperer les données de chaque elements  */

function ajoutKanaps(produits) {

/* je creer la fonction ajoutKanaps avec une boucle for each qui va me permettre d'asigner des 
constante aux différentes informations de chaques kanaps */

    produits.forEach((produits) => {
                                         
        const id = produits._id
        const imageUrl = produits.imageUrl                    
        const altTxt = produits.altTxt                     
        const nom = produits.name
        const presentation = produits.description
 
/* je creer aussi une série de constante que j'assigne à des fonction qui me permettrons 
de creer les éléments de la page  */

        const image = creationImage(imageUrl,altTxt)
        const kanap = urlKanaps(id)
        const article = document.createElement("article")
        const h3 = creationH3(nom)
        const p = creationParagraphe(presentation)

        article.appendChild(image)
        article.appendChild(h3)
        article.appendChild(p)
        positionKanap (kanap, article)

/* appendChild me permet d'ajouter des éléments au d'autre
par exemple :  j'ajoute une image, un h3 et un p à l'élément article  */

    })
}

/* cette fonction permet de creer un a href avec chaque id des kanap 
contenue dans l'api */

function urlKanaps(id) {
    const kanap = document.createElement("a")
    kanap.href = "./product.html?id=" + id
    return kanap
}

/* positionKanap me permet de positionner l'ensemble de la section qui 
contient l'id = "items" */
function positionKanap(kanap, article){
    const items = document.querySelector("#items") 
    if (items != null) {
        items.appendChild(kanap)
        kanap.appendChild(article)
    }
}

/* j'intègre l'image avec sa source et sa description et je supprime les attribut 
de titre et de style */
function creationImage (imageUrl, altTxt){
    const image = document.createElement("img")
    image.src = imageUrl
    image.alt = altTxt
    image.removeAttribute("title")
    image.removeAttribute("style")
    return image
}

/* pour ces 2 fonctions, je creer un h3 et un P ou je viens ajouter 
une class avec son contenu */

function creationH3 (nom){
    const h3 = document.createElement("h3")
    h3.textContent = nom
    h3.classList.add("productName")
    return h3
}

function creationParagraphe (presentation){
    const p = document.createElement("p")
    p.textContent = presentation
    p.classList.add("productDescription")
    return p
}