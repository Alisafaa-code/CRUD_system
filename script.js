import { createClient } from "https://esm.sh/@supabase/supabase-js";
const supabaseUrl = "https://pfnratzuuxzjzzaccspn.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmbnJhdHp1dXh6anp6YWNjc3BuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMDgxNDAsImV4cCI6MjA3NzU4NDE0MH0.IiyfapMKuO8R_N6CYsr5c8MiKX0aJvKn3awj19-EW0w";

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

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
    const { data: users, error } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: true });

    if (error) throw error;
    const tbody = document.querySelector("#usersTable tbody");
    tbody.innerHTML = "";
    users.forEach((user) => {
      const tr = document.createElement("tr");

      const idTd = document.createElement("td");
      idTd.setAttribute("data-label", "ID");
      idTd.textContent = user.id;

      const nameTd = document.createElement("td");
      nameTd.setAttribute("data-label", "User Name");
      nameTd.textContent = user.name;

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
        editUser(user.id, user.name, user.email);
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
  const name = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!name || !email) return alert("Enter name and email");

  try {
    let error;
    if (id) {
      // Update
      const { error: updateError } = await supabase
        .from("orders")
        .update({ name, email })
        .eq("id", id);
      error = updateError;
    } else {
      // Create
      const { error: insertError } = await supabase
        .from("orders")
        .insert([{ name, email }]);
      error = insertError;
    }

    if (error) throw error;
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
function editUser(id, name, email) {
  document.getElementById("userId").value = id;
  document.getElementById("username").value = name;
  document.getElementById("email").value = email;
}

// Delete user
async function deleteUser(id) {
  if (confirm("Are you sure?")) {
    try {
      const { error } = await supabase.from("orders").delete().eq("id", id);

      if (error) throw error;
      fetchUsers();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Could not delete user.");
    }
  }
}
