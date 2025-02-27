import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js';
import { getDatabase, ref, push, onValue, remove } from 'https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js';

const appSettings = {
    databaseURL: "https://shopping-50ba3-default-rtdb.firebaseio.com/"
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, 'shoppingList');

const inputField = document.getElementById('input-field');
const inputPrice = document.getElementById('price');
const addButton = document.getElementById('add-button');
const shoppingList = document.getElementById('shopping-list');

addButton.addEventListener('click', function () {   
    let inputValue = inputField.value.trim();
    let priceValue = inputPrice.value.trim();

    if (inputValue === '' || priceValue === '') {
        alert('Please enter both item and price.');
        return;
    }


    push(shoppingListInDB, {
        item: inputValue,   
        price: priceValue
    });

    clearInputFields();
});

function clearInputFields() {
    inputField.value = '';
    inputPrice.value = '';
}


onValue(shoppingListInDB, function (snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());
        clearShoppingList();

        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i];
            appendItemToShoppingList(currentItem);
        }
    } else {
        shoppingList.innerHTML = 'No items in the list';
    }
});



function appendItemToShoppingList(item) {
    let itemID = item[0];
    let itemValue = item[1];

    let newElement = document.createElement('li');
    newElement.innerHTML = `<strong>${itemValue.item}</strong>  ₹${itemValue.price}`;
    newElement.style.display = "flex";
    newElement.style.justifyContent = "space-between";
    newElement.style.padding = "10px";
    newElement.style.borderBottom = "1px solid #ccc";

    // Double-click to remove item
    newElement.addEventListener('dblclick', function () {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
        remove(exactLocationOfItemInDB);
    });

    shoppingList.append(newElement);
}


function clearShoppingList() {
    shoppingList.innerHTML = '';
}


inputField.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addButton.click();
    }
});
