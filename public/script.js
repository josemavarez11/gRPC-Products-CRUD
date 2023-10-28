var arrayProducts = [];
const tbody = document.getElementById("table-body");
const addBtn = document.getElementById("add-btn");
const descriptionInput = document.getElementById("description-input");
const updateDescriptionInput = document.getElementById("update-description-input");
const updateBtn = document.getElementById("update-btn");
const cancelBtn = document.getElementById("cancel-btn");

const loadProducts = async () => {
    try {
        const response = await fetch("http://localhost:3000/products", { method: "GET" });
        const data = await response.json();
        arrayProducts = data.sort((a, b) => a.id - b.id);
        renderTable(); 
    } catch (error) {
        handleFetchError(error);
    }
}

const renderTable = () => {
    tbody.innerHTML = "";
    const fragment = document.createDocumentFragment();
    arrayProducts.forEach(product => {
        const row = document.createElement("tr");
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const actionsTd = document.createElement("td");
        const editBtn = document.createElement("button");
        const deleteBtn = document.createElement("button");
        
        editBtn.className = "edit-btn";
        editBtn.innerText = "Edit";
        editBtn.addEventListener("click", () => {
            showUpdateForm(product.description, product.id);
        });
        deleteBtn.className = "delete-btn";
        deleteBtn.innerText = "Delete";
        deleteBtn.addEventListener("click", () => {
            deleteProduct(product.id);
        });

        actionsTd.appendChild(editBtn);
        actionsTd.appendChild(deleteBtn);
        row.appendChild(actionsTd);
        cell1.innerHTML = product.id;
        cell2.innerHTML = product.description;
        fragment.appendChild(row);
    })
    tbody.appendChild(fragment);
}

const updateTableAfterCRUD = () => {
    loadProducts();
    hideUpdateForm();
}

const addProduct = async () => {
    if(descriptionInput.value.trim() != ""){
        try {
            await fetch(`http://localhost:3000/${descriptionInput.value}`, { method: "POST" });
            descriptionInput.value = "";
            updateTableAfterCRUD(); 
            console.log("Producto agregado correctamente")
        } catch (error) {
            handleFetchError(error);
        }
    }else{
        alert("Por favor, ingrese el nombre del producto");
    }
}

const deleteProduct = async (id) => {
    try {
        await fetch(`http://localhost:3000/${id}`, { method: "DELETE" });
        updateTableAfterCRUD();
    } catch (error) {
        handleFetchError(error);
    }
}

const updateProduct = async (id) => {
    const newDescription = updateDescriptionInput.value.trim()
    try {
        await fetch(`http://localhost:3000/${id}/${newDescription}`, { method: "PUT" });
        updateTableAfterCRUD();
    } catch (error) {
        handleFetchError(error);
    }
}

const showUpdateForm = (description, id) => {
    updateDescriptionInput.value = description;
    updateBtn.addEventListener("click", () => {
        updateProduct(id);
    });
    cancelBtn.addEventListener("click", hideUpdateForm)
    updateBtn.style.display = "inline-block";
    cancelBtn.style.display = "inline-block";
    updateDescriptionInput.style.display = "inline-block";
    document.getElementById("update-container").style.display = "block";
}

const hideUpdateForm = () => {
    document.getElementById("update-container").style.display = "none";
    updateBtn.style.display = "none";
    cancelBtn.style.display = "none";
    updateDescriptionInput.style.display = "none";
    updateDescriptionInput.value = "";
    updateBtn.removeEventListener("click", updateProduct);
    cancelBtn.removeEventListener("click", hideUpdateForm);
}

const handleFetchError = (error) => {
    console.error("Error en la solicitud: ", error);
}

addBtn.addEventListener("click", addProduct);
await loadProducts();

