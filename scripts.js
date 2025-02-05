// JavaScript Functions Home Page (index)

function handleSearch() {
    var searchTerm = document.getElementById("search-input").value.trim().toLowerCase();
  
    if (searchTerm === "moto" || searchTerm === "motos") {
      window.location.href = "motos.html";  
    } else {
      window.location.href = "index.html";  
    }
}