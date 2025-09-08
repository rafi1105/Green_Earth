
const showSpinner = () => {
    const spinner = document.getElementById('spinner');
    if (spinner) spinner.style.display = 'flex';
}
const hideSpinner = () => {
    const spinner = document.getElementById('spinner');
    if (spinner) spinner.style.display = 'none';
}

const plantData = async () => {
    showSpinner();
    try {
        const res = await fetch('https://openapi.programming-hero.com/api/plants');
        const data = await res.json();
        console.log(data)
        displayPlantData(data);
    } catch (error) {
        console.error(error);
    } finally {
        hideSpinner();
    }
}
const displayPlantData = async (data) => {
    hideSpinner();
    const plantContainer = document.getElementById('plant-container');
    data.plants.forEach(plant => {
        const plantDiv = document.createElement('div');
        plantDiv.classList.add('card');
        plantDiv.innerHTML = `
            <img src="${plant.image}" alt="${plant.name}" class="w-full h-[200px] object-cover p-0">
            <p class="cursor-pointer font-bold text-2xl py-5 pl-5" onclick="popup('${plant.id}')">${plant.name}</p>
            <p class="break-words text-sm px-5">${plant.description}</p>
            <div class=" cartpp">
                <p class="bg-[var(--tag-color)] p-2 rounded-full text-[var(--primary-color)]">${plant.category}</p>
                <p class="text-[var(--text-color)] text-xl font-bold">৳${plant.price}</p>
            </div>
            <button class="btn2" onclick="addToCart('${plant.name}', ${plant.price})">Add to Cart</button>
        `;
        plantContainer.appendChild(plantDiv);
    });
}
let totalPrice = 0;
async function addToCart(name, price) {
const  cartBag = document.getElementById('cart-bag');
console.log(name, price)
const cartItem = document.createElement('div');
cartItem.classList.add('cart-item');
 cartItem.innerHTML = `
    <p >${name}     ->    ৳${price}</p> <i class="fa-solid text-green-500 fa-xmark" onclick="removeFromCart(this, ${price})"></i>
`;
cartBag.appendChild(cartItem);
totalPrice += price;
updateTotalPrice(totalPrice);
}
function removeFromCart(element,price) {
    const cartItem = element.parentElement;
    console.log("remove item is : ",price);
    cartItem.remove();
    totalPrice -= price;
    console.log(totalPrice)
    const totalPriceElement = document.getElementById('total-price');
    totalPriceElement.innerText = `Total Price: ৳${totalPrice.toFixed(2)}`;
}
function updateTotalPrice(totalPrice) {
    const totalPriceElement = document.getElementById('total-price');
    
        totalPriceElement.innerText = `Total Price: ৳${totalPrice.toFixed(2)}`;
    
}
function filterCategories(category) {
    console.log(category);
    const plantContainer = document.getElementById('plant-container');
    plantContainer.innerHTML = '';
    showSpinner();
    // Remove active class from all category items
    const allCategoryItems = document.querySelectorAll('.categories li');
    allCategoryItems.forEach(item => {
        item.className = "text-xl mb-4 cursor-pointer hover:text-[var(--primary-color)] ";
        item.removeAttribute("style");
    });
    if (!category) {
        // Show all plants and make "All Tree" active
        plantData();
        const allTreeElement = document.querySelector('.categories li:first-of-type');
        setActiveCategory(allTreeElement);
    } else {
        // Filter plants by category
        fetch('https://openapi.programming-hero.com/api/plants')
        .then(res => res.json())
        .then(data => {
            const filteredPlants = data.plants.filter(plant => plant.category === category);
            displayPlantData({plants: filteredPlants});
            // Find and set active the clicked category
            allCategoryItems.forEach(item => {
                if (item.onclick && item.onclick.toString().includes(`'${category}'`)) {
                    setActiveCategory(item);
                }
            });
        })
        .catch(error => console.error('Error fetching plant data:', error))
        .finally(() => {
            hideSpinner();
        });
    }
}

function setActiveCategory(element) {
    element.className = "text-xl mb-4 bg-[var(--primary-color)] text-white px-4 py-2 rounded-[var(--border-radius)] font-bold w-fit cursor-pointer";
    element.style.color = "whitesmoke";
}

function initializeActiveCategory() {
    // Set "All Tree" as active by default
    const allTreeElement = document.querySelector('.categories li:first-of-type');
    setActiveCategory(allTreeElement);
}

plantData();

// Initialize the active category when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeActiveCategory();
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeActiveCategory);
} else {
    initializeActiveCategory();
}
const popup = async (id) => {
    console.log(id)
    const url = `https://openapi.programming-hero.com/api/plant/${id}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(data)
        const plant = data.plants;
        console.log(plant);
        const cardDetails = document.querySelector('.card-details');
        cardDetails.innerHTML = `
            <img src="${plant.image}" alt="${plant.name}" class="w-full h-[300px] object-cover p-0">
            <h3 class="text-3xl font-bold my-4">${plant.name}</h3>
            <p class="py-4">${plant.description}</p>
            <p class="py-4 text-xl">Price: ৳${plant.price}</p>
        `;
        document.getElementById('card_modal').showModal();
    } catch (error) {
        console.error('Error fetching plant details:', error);
    }
}