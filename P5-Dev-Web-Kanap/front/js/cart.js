/* récupération du localStorage et de ces items */
let kanapPannier = JSON.parse(localStorage.getItem("produitDuPannier"));

/* Ajout des produits */
/* condition de vérification de panier */
if (kanapPannier) {
    kanapPannier.map((objet) => {
        const idArticle = objet._id;
        const couleurArticle = objet.color;
        const quantiteeArticle = objet.quantity;
        ajoutItem();
        function ajoutItem() {

            fetch(`http://localhost:3000/api/products/${idArticle}`)
                .then(function (res) { return res.json() })
                .then(function (donneeProduit) {
                    product = donneeProduit;
                    /* récupération de la section pour introduire les elements */
                    let section = document.querySelector("#cart__items");

                    /* Article du produit */
                    let article = document.createElement("article");
                    section.appendChild(article);
                    article.classList.add("cart__item");
                    article.dataset.id = `${idArticle}`;
                    article.dataset.color = `${couleurArticle}`;

                    /* Image du produit */
                    let divImage = document.createElement("div");
                    article.appendChild(divImage);
                    divImage.classList.add("cart__item__img");

                    let image = document.createElement("img");
                    divImage.appendChild(image);
                    image.src = product.imageUrl;
                    image.alt = product.altTxt;

                    /* Contenu du produit */
                    let divContenu = document.createElement("div");
                    article.appendChild(divContenu);
                    divContenu.classList.add("cart__item__content");

                    let description = document.createElement("div");
                    divContenu.appendChild(description);
                    description.classList.add("cart__item__content__description");

                    let nomProduit = document.createElement("h2");
                    description.appendChild(nomProduit);
                    nomProduit.innerHTML = product.name;

                    let couleurProduit = document.createElement("p");
                    description.appendChild(couleurProduit);
                    couleurProduit.innerHTML = couleurArticle;

                    let prixProduit = document.createElement("p");
                    description.appendChild(prixProduit);
                    prixProduit.classList.add("price");
                    prixProduit.innerHTML = `${product.price}€`;

                    let divReglage = document.createElement("div");
                    divContenu.appendChild(divReglage);
                    divReglage.classList.add("cart__item__content__settings");

                    /* Quantité du produit */
                    let divQuantitee = document.createElement("div");
                    divReglage.appendChild(divQuantitee);
                    divQuantitee.classList.add("cart__item__content__settings__quantity");

                    let quantitee = document.createElement("p");
                    divQuantitee.appendChild(quantitee);
                    quantitee.innerHTML = quantiteeArticle;
                    quantitee.innerText = "Qté : ";

                    let input = document.createElement("input");
                    divQuantitee.appendChild(input);
                    input.classList.add("itemQuantity");
                    input.type = "number";
                    input.name = 'itemQuantity';
                    input.min = 1;
                    input.max = 100;
                    input.value = quantiteeArticle;


                    /* Bouton Supprimer du produit */
                    let divBouttonSupp = document.createElement("div");
                    divReglage.appendChild(divBouttonSupp);
                    divBouttonSupp.classList.add("cart__item__content__settings__delete");

                    let buttonSupp = document.createElement("p");
                    divBouttonSupp.appendChild(buttonSupp);
                    buttonSupp.classList.add("deleteItem");
                    buttonSupp.innerHTML = "Supprimer";

                    /////////////////////////////////////////////////// FONCTIONS AUTRES ///////////////////////////////////////////////////////////////

                    /* modification quantitée */
                    const changeQuantitee = document.querySelectorAll(".itemQuantity");
                    changeQuantitee.forEach(changement => {

                        changement.addEventListener("change", (e) => {
                            const getRootChange = e.target.closest("article");
                            for (const product of kanapPannier) {
                                if (product._id == getRootChange.dataset.id && product.color == getRootChange.dataset.color) {
                                    product.quantity = e.target.value;
                                
                                    if(product.quantity >= 101){

                                        product.quantity = 1
                                        e.target.value = 1
                                    } 

                                    if(product.quantity < 1 ){

                                        product.quantity = 1
                                        e.target.value = 1
                                    } 
                                
                                    localStorage.setItem("produitDuPannier", JSON.stringify(kanapPannier));
                                    quantiteeTotalPannier();
                                    prixTotal();
                                }
                            }
                        })

                        

                    })
                    /* suppression d'Item */
                    const bouttonSupp = document.querySelectorAll(".deleteItem");
                    bouttonSupp.forEach(btn => {

                        btn.addEventListener("click", (e) => {
                            const getRoot = e.target.closest("article");
                            kanapPannier = kanapPannier.filter((e) => e._id !== getRoot.dataset.id || e.color !== getRoot.dataset.color);
                            majPannier(kanapPannier);
                            getRoot.remove();
                            quantiteeTotalPannier();
                            totalPrice();
                        });
                    });

                    /* affichage quantité total du panier */
                    quantiteeTotalPannier();
                    function quantiteeTotalPannier() {
                        let result = 0;
                        for (const objet of kanapPannier) {
                            result += +objet.quantity;
                        }
                        let totalQuantity = document.querySelector("#totalQuantity")
                        totalQuantity.textContent = result;
                    }

                    /* affichage prix total du panier */
                    prixTotal();
                    function prixTotal() {
                                              
                        let result = 0
                        for (const objet of kanapPannier) {
                            result += product.price * objet.quantity
                            
                        }
                        let shownPrice = document.querySelector("#totalPrice");
                        shownPrice.textContent = result;

                    }

                });
        }
        return objet;
    })
    prixTotal();
    function prixTotal() {
                                              
        let result = 0
        for (const objet of kanapPannier) {
            result += product.price * objet.quantity
                            
        }
        let shownPrice = document.querySelector("#totalPrice");
        shownPrice.textContent = result;

    }
} 
/* mise a jour du panier */
function majPannier(kanapPannier) {
    if (kanapPannier.length === 0) {
        localStorage.removeItem("produitDuPannier");
    } else {
        localStorage.setItem("produitDuPannier", JSON.stringify(kanapPannier));
    }
}

////////////////////////////////////////////// FORMULAIRE /////////////////////////////////////////


/* formulaire commande  */
let formulaireDeCommande = () => {
    document.querySelector("#order").addEventListener("click", e => {
        e.preventDefault()

        /* Récupération formulaire */
        let form = e.target.closest('form').elements

        /* regex List */
        let regEmail = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;
        let regName = /^[a-zA-ZZÀ-ÿ' -]+$/i;
        let regAddress = /^[A-Za-z0-9\é\è\ê\ë\ä\à\ï\ç\ \,\'\-]+$/;
        let regCity = /^[a-zA-ZÀ-ÿ' -]+$/;

        /* validation flag */
        let validate = true;

        /* Champ Name */
        if (!regName.test(form['firstName'].value)) {
            form['firstName'].nextElementSibling.textContent = `Le prenom est invalide, il doit ne contenir que des lettres !`
            validate = false
        }
        /* Champ Last name */
        if (!regName.test(form['lastName'].value)) {
            form['lastName'].nextElementSibling.textContent = `Le nom est invalide, il doit ne contenir que des lettre !`
            validate = false
        }
        /* Champ Address */
        if (!regAddress.test(form['address'].value)) {
            form['address'].nextElementSibling.textContent = `Adresse Invalide, merci de vérifier si elle contient un numéro ainsi qu'un lieu !`
            validate = false
        }
        /* Champ City */
        if (!regCity.test(form['city'].value)) {
            form['city'].nextElementSibling.textContent = `Ville Invalide, merci de renseigner une ville existante !`
            validate = false
        }
        /* Champ Email */
        if (!regEmail.test(form['email'].value)) {
            form['email'].nextElementSibling.textContent = `Email Invalide, merci de renseigner un @ !`
            validate = false
        }

        /* form Error */

        if (!validate) {
            return false;
        }

        /* Envoie de commande */
        let orderFinal;
        let productId = [];

        if (regName && regAddress && regCity && regEmail) {

            for (const product of kanapPannier) {
                productId.push(product._id)
            }

            orderFinal = {
                contact: {
                    firstName: firstName.value,
                    lastName: lastName.value,
                    address: address.value,
                    city: city.value,
                    email: email.value,
                },
                products: productId
            };

            fetch("http://localhost:3000/api/products/order", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderFinal)
            })
                .then(response => response.json())
                .then(data => {
                    localStorage.removeItem('produitDuPannier');
                    window.location.href = "confirmation.html?orderId=" + data.orderId;
                })
                .catch(err => console.log(err))

        }
        else {
            document.querySelector("#order").value = "Veuillez remplir tout les champs"
        };
    });
};


window.addEventListener('load', () => {
    formulaireDeCommande();
})