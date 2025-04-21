
function searchBook() {
    const query = document.getElementById('searchInput').value; 
    const resultsDiv = document.getElementById('results'); 
    resultsDiv.innerHTML = ''; 

    if (query.trim() === '') { 
        alert("Por favor ingresa un título de libro.");
        return;
    }

    fetch(`https://openlibrary.org/search.json?q=${query}`) 
        .then(response => response.json())
        .then(data => {
            const books = data.docs; 
            if (books.length > 0) { 
                books.forEach(book => {
                    const bookDiv = document.createElement('div');
                    bookDiv.classList.add('book');

                    const img = document.createElement('img');
                    img.src = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : 'https://via.placeholder.com/120x180?text=No+Image';

                    const bookInfo = document.createElement('div');
                    bookInfo.classList.add('book-info');

                    const title = document.createElement('h3'); 
                    title.textContent = book.title;

                    const author = document.createElement('p'); 
                    author.textContent = `Autor: ${book.author_name ? book.author_name[0] : 'Desconocido'}`;

                    bookInfo.appendChild(title);
                    bookInfo.appendChild(author);

                    bookDiv.appendChild(img);
                    bookDiv.appendChild(bookInfo);

                    resultsDiv.appendChild(bookDiv);

                });
            } else {
                resultsDiv.innerHTML = '<p>No se encontraron resultados.</p>';
            }
        })
        .catch(error => { 
            console.error('Error:', error);
            resultsDiv.innerHTML = '<p>Hubo un problema con la búsqueda. Intenta de nuevo más tarde.</p>';
        });
}
