import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // On appelle l'URL de ton serveur Laravel
    axios.get('http://localhost:8000/api/books')
      .then(response => {
        setBooks(response.data);
      })
      .catch(error => console.error("Erreur :", error));
  }, []);

  return (
    <div>
      <h1>📚 Liste des Livres (BookAway)</h1>
      <ul>
        {books.map(book => (
          <li key={book.id}>{book.title} - {book.author}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;