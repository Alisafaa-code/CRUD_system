const apiUrl = "http://localhost:3000/api/users";

// Fetch and display users
async function fetchUsers() {
     const res = await fetch(apiUrl);
     const users = await res.json();
     const tbody = document.querySelector("#usersTable tbody");
     tbody.innerHTML = "";
     users.forEach((user) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
          <td>${user.id}</td>
          <td>${user.username}</td>
          <td>${user.email}</td>
        `;
          const actionsTd = document.createElement("td");

          const editBtn = document.createElement("img");
          editBtn.src = "./images/editing.png";
          editBtn.addEventListener("click", () => {
               editUser(user.id, user.username, user.email);
          });

          const deleteBtn = document.createElement("img");
          deleteBtn.src = "./images/trash.png";
          deleteBtn.addEventListener("click", () => {
               deleteUser(user.id);
          });

          actionsTd.appendChild(editBtn);
          actionsTd.appendChild(deleteBtn);
          tr.appendChild(actionsTd);
          tbody.appendChild(tr);
     });
}

// Save (Create or Update)
async function saveUser() {
     const id = document.getElementById("userId").value;
     const username = document.getElementById("username").value;
     const email = document.getElementById("email").value;

     if (!username || !email) return alert("Enter username and email");

     if (id) {
          // Update
          await fetch(`${apiUrl}/${id}`, {
               method: "PUT",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ username, email }),
          });
     } else {
          // Create
          await fetch(apiUrl, {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({ username, email }),
          });
     }

     document.getElementById("userId").value = "";
     document.getElementById("username").value = "";
     document.getElementById("email").value = "";
     fetchUsers();
}

// Edit user
function editUser(id, username, email) {
     document.getElementById("userId").value = id;
     document.getElementById("username").value = username;
     document.getElementById("email").value = email;
}

// Delete user
async function deleteUser(id) {
     if (confirm("Are you sure?")) {
          await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
          fetchUsers();
     }
}

// Initial load
fetchUsers();
