/* récupération de l'id depuis le liens */
const kanapId = window.location.search.split("?id=").join("")

/* récupération produit */
fetch(`http://localhost:3000/api/products/${kanapId}`)
    .then(reponse => reponse.json())
    .then(function (objetApi) {
        kanap = objetApi;

        /* Récupération element HTML */
        const classImage = document.querySelector("div.item__img")
        const idNom = document.querySelector("#title")
        const idDescription = document.querySelector("#description")
        const idPrix = document.querySelector("#price")

        /* affichage elements */
        idNom.innerHTML = kanap.name
        idDescription.innerText = kanap.description
        idPrix.innerHTML = kanap.price

        /* image */
        const creationImage = document.createElement("img")
        classImage.appendChild(creationImage)
        creationImage.src = kanap.imageUrl
        creationImage.alt = kanap.altTxt
        
        /* option */
        const couleur = document.getElementById('colors')
        for (let i = 0; i < kanap.colors.length; i++) {

            const choixCouleurs = document.createElement("option")
            choixCouleurs.value = `${kanap.colors[i]}`
            choixCouleurs.innerText = kanap.colors[i]
            couleur.append(choixCouleurs)

        }
    })

ajoutPannier()
function ajoutPannier() {
    /* Boutton ajouter au panier */
    const bouttonPannier = document.querySelector("#addToCart");

    /* Listener : action quand le bouton est cliqué */
    bouttonPannier.addEventListener("click", () => {

        /* definitions des objets */
        let choixQuantitee = document.querySelector("#quantity");
        let choixCouleur = document.querySelector("#colors");
        let quantitee = +choixQuantitee.value;
        let _id = kanapId;
        let color = choixCouleur.value;

        /* affiche un message d'erreur si il manque un champs non remplis */
        if (color == null || color == ""  || quantitee == null || quantitee == 0){
            window.alert("merci de choisir une couleur et une quantité")
        }
        
        /* permet de limité la quantité d'un article */
        if (choixQuantitee.value >= 101){
            choixQuantitee.value = 0
        }
        if (choixQuantitee.value < 0){
            choixQuantitee.value = 0
        }

        /* condition : vérifications des champs bien rentrés */
        if (choixQuantitee.value > 0 && choixQuantitee.value < 101 && choixCouleur.value != 0) {
            /* condition : présence dans le panier */
            if (localStorage.getItem("produitDuPannier")) {
                /* récupèration du panier */
                let tableauObjet = getCart();
                /* vérification présence d'item */
                const produitATrouver = tableauObjet.find(
                    (el) => el._id === kanapId && el.color === color
                );
                /* condition : si l'objet est trouvé */
                if (produitATrouver) {
                    /* definition de la variable de la nouvelle quantitée */
                    let nouvelleQuantitee = quantitee + produitATrouver.quantity;

                    /* ajout de la nouvelle quantitée au produit */
                    produitATrouver.quantity = nouvelleQuantitee
                    if(nouvelleQuantitee > 100 ){
                        window.alert("merci de choisir une quantité de maximum 100 pour un même article")
                        return nouvelleQuantitee;
                    }
                    localStorage.setItem("produitDuPannier", JSON.stringify(tableauObjet));
                }
                /* condition : si l'objet n'est pas trouvé */
                else {
                    /* récupération du localStorage */
                    let tableauObjet = JSON.parse(localStorage.getItem("produitDuPannier"));
                    /* création de la boite */
                    let boiteProduit = {
                        quantity: parseFloat(choixQuantitee.value),
                        color,
                        _id,                    
                    };

                    /* intégration de la boite dans le LS */
                    tableauObjet.push(boiteProduit);
                    let stockProduit = JSON.stringify(tableauObjet);
                    localStorage.setItem("produitDuPannier", stockProduit);
                    
                };
                
                /* condition: non présence dans le panier */
            } 
            else {
                let tableauObjet = [];

                /* definitions des objets */
                let choixQuantitee = document.querySelector("#quantity");
                let choixCouleur = document.querySelector("#colors");
                let _id = kanapId;
                let color = choixCouleur.value;

                let boiteProduit = {

                    quantity: parseFloat(choixQuantitee.value),
                    color,
                    _id
                };


                /* intégration de la boite dans le LS */
                tableauObjet.push(boiteProduit);
                let stockProduit = JSON.stringify(tableauObjet);
                localStorage.setItem("produitDuPannier", stockProduit);
            }
            /* transport vers la page panier */
            lienPannier();
            function lienPannier() {
                document.location.href = "cart.html";
            };
        };
    });
};

function getCart() {
    let cart = [];
    if (localStorage.getItem("produitDuPannier")) {
        cart = JSON.parse(localStorage.getItem("produitDuPannier"));
    };
    return cart;
};