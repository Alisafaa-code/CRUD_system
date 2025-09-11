const apiUrl = "http://localhost:3000/api/users";

// safer DOM ready and form handling
document.addEventListener("DOMContentLoaded", () => {
     const form = document.getElementById("userForm");
     form.addEventListener("submit", (e) => {
          e.preventDefault();
          saveUser();
     });

     document.getElementById("clearBtn").addEventListener("click", () => {
          document.getElementById("userId").value = "";
          document.getElementById("username").value = "";
          document.getElementById("email").value = "";
     });

     fetchUsers();
});

// Fetch and display users
async function fetchUsers() {
     try {
          const res = await fetch(apiUrl);
          const users = await res.json();
          const tbody = document.querySelector("#usersTable tbody");
          tbody.innerHTML = "";
          users.forEach((user) => {
               const tr = document.createElement("tr");

               const idTd = document.createElement("td");
               idTd.setAttribute("data-label", "ID");
               idTd.textContent = user.id;

               const nameTd = document.createElement("td");
               nameTd.setAttribute("data-label", "User Name");
               nameTd.textContent = user.username;

               const emailTd = document.createElement("td");
               emailTd.setAttribute("data-label", "Email");
               emailTd.textContent = user.email;

               const actionsTd = document.createElement("td");
               actionsTd.classList.add("actions");
               actionsTd.setAttribute("data-label", "Actions");

               const editBtn = document.createElement("img");
               editBtn.src = "./images/editing.png";
               editBtn.alt = "edit";
               editBtn.title = "Edit";
               editBtn.addEventListener("click", () => {
                    editUser(user.id, user.username, user.email);
                    // scroll to top of form on mobile
                    window.scrollTo({ top: 0, behavior: "smooth" });
               });

               const deleteBtn = document.createElement("img");
               deleteBtn.src = "./images/trash.png";
               deleteBtn.alt = "delete";
               deleteBtn.title = "Delete";
               deleteBtn.addEventListener("click", () => {
                    deleteUser(user.id);
               });

               actionsTd.appendChild(editBtn);
               actionsTd.appendChild(deleteBtn);

               tr.appendChild(idTd);
               tr.appendChild(nameTd);
               tr.appendChild(emailTd);
               tr.appendChild(actionsTd);

               tbody.appendChild(tr);
          });
     } catch (err) {
          console.error("Failed to fetch users:", err);
     }
}

// Save (Create or Update)
async function saveUser() {
     const id = document.getElementById("userId").value;
     const username = document.getElementById("username").value.trim();
     const email = document.getElementById("email").value.trim();

     if (!username || !email) return alert("Enter username and email");

     try {
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
     } catch (err) {
          console.error("Save failed:", err);
          alert("Could not save user.");
     }
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
          try {
               await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
               fetchUsers();
          } catch (err) {
               console.error("Delete failed:", err);
               alert("Could not delete user.");
          }
     }
}
