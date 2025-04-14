document.addEventListener('DOMContentLoaded', () => {
    const formBook = document.querySelector('#bookForm');
    const isNotComplete = document.querySelector("#incompleteBookList")
    const isCompletes = document.querySelector("#completeBookList")

    loadBooksFromLocalStorage();

    formBook.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("bookFormTitle").value;
        const author = document.getElementById("bookFormAuthor").value;
        const year = document.getElementById("bookFormYear").value;
        const isComplete = document.getElementById("bookFormIsComplete").checked;
        console.log(title, author, year, isComplete)

        const id = Date.now();

        const bookItem = renderBook(id, title, author, year, isComplete)

        saveBookToLocalStorage({ id, title, author, year, isComplete });

        if(isComplete) {
            isCompletes.appendChild(bookItem)
        }else{
            isNotComplete.appendChild(bookItem)
        }

        formBook.reset()
    })

    function renderBook(id, title, author, year, selesai) {
        const bookItem = document.createElement("div");
        bookItem.setAttribute("data-bookid", id);
        bookItem.setAttribute("data-testid", "bookItem");

        bookItem.innerHTML = `
                    <h3 data-testid="bookItemTitle">${title}</h3>
                    <p data-testid="bookItemAuthor">Penulis: ${author}</p>
                    <p data-testid="bookItemYear">Tahun: ${year}</p>
                    <div class='button-book'>
                        <button data-testid="bookItemIsCompleteButton">${selesai ? 'Selesai dibaca' : 'Belum selesai dibaca'}</button>
                        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
                        <button data-testid="bookItemEditButton">Edit Buku</button>
                    </div>
        `;

        bookItem.querySelector('[data-testid="bookItemIsCompleteButton"]').addEventListener('click', () => completeHandle(bookItem))
        bookItem.querySelector('[data-testid="bookItemDeleteButton"]').addEventListener('click', () => deleteBook(bookItem))
        bookItem.querySelector('[data-testid="bookItemEditButton"]').addEventListener('click', () => editBook(bookItem))

        return bookItem
    }

    function completeHandle(bookItem) {
        const button = bookItem.querySelector("[data-testid='bookItemIsCompleteButton']");
        const bookId = bookItem.getAttribute('data-bookid');
        if(button.textContent === 'Selesai dibaca') {
            isCompletes.removeChild(bookItem);
            isNotComplete.appendChild(bookItem);
            button.textContent = 'Belum selesai dibaca';
            updateBookInLocalStorage(bookId, { isComplete: false });
        } else {
            isNotComplete.removeChild(bookItem);
            isCompletes.appendChild(bookItem);
            button.textContent = 'Selesai dibaca';
            updateBookInLocalStorage(bookId, { isComplete: true });
        }
    }

    function deleteBook(bookItem) {
        const bookId = bookItem.getAttribute('data-bookid');
        if(confirm('Yakin diapus?')) {
            bookItem.remove();
            deleteBookFromLocalStorage(bookId);
        }
    }

    function editBook(bookItem) {
        const currentTitle = bookItem.querySelector('[data-testid="bookItemTitle"]').textContent;
        const currentAuthor = bookItem.querySelector('[data-testid="bookItemAuthor"]').textContent.replace('Penulis: ', '');
        const currentYear = bookItem.querySelector('[data-testid="bookItemYear"]').textContent.replace('Tahun: ', '');
        const currentIsComplete = bookItem.querySelector('[data-testid="bookItemIsCompleteButton"]').textContent === 'Selesai dibaca';
        const bookId = bookItem.getAttribute('data-bookid');

        const newTitle = prompt("Edit judul buku:", currentTitle);
        const newAuthor = prompt("Edit penulis buku:", currentAuthor);
        const newYear = prompt("Edit tahun rilis buku:", currentYear);
        const newIsComplete = confirm("Apakah buku sudah selesai dibaca?");

        if (newTitle === null || newAuthor === null || newYear === null) {
            return;
        }

        bookItem.querySelector('[data-testid="bookItemTitle"]').textContent = newTitle;
        bookItem.querySelector('[data-testid="bookItemAuthor"]').textContent = `Penulis: ${newAuthor}`;
        bookItem.querySelector('[data-testid="bookItemYear"]').textContent = `Tahun: ${newYear}`;

        const completeButton = bookItem.querySelector('[data-testid="bookItemIsCompleteButton"]');
        completeButton.textContent = newIsComplete ? 'Selesai dibaca' : 'Belum selesai dibaca';

        if (newIsComplete !== currentIsComplete) {
            if (newIsComplete) {
                isNotComplete.removeChild(bookItem);
                isCompletes.appendChild(bookItem);
            } else {
                isCompletes.removeChild(bookItem);
                isNotComplete.appendChild(bookItem);
            }
        }

        updateBookInLocalStorage(bookId, { title: newTitle, author: newAuthor, year: newYear, isComplete: newIsComplete });
    }

    function saveBookToLocalStorage(book) {
        let books = JSON.parse(localStorage.getItem('books')) || [];
        book.year = Number(book.year);
        console.log(typeof book.year)
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    function updateBookInLocalStorage(bookId, updatedData) {
        let books = JSON.parse(localStorage.getItem('books')) || [];
        books = books.map(book => {
            if (book.id === parseInt(bookId)) {
                return { ...book, ...updatedData };
            }
            return book;
        });
        localStorage.setItem('books', JSON.stringify(books));
    }

    function deleteBookFromLocalStorage(bookId) {
        let books = JSON.parse(localStorage.getItem('books')) || [];
        books = books.filter(book => book.id !== parseInt(bookId));
        localStorage.setItem('books', JSON.stringify(books));
    }

    function loadBooksFromLocalStorage() {
        const books = JSON.parse(localStorage.getItem('books')) || [];
        books.forEach(book => {
            book.year = Number(book.year)
            const bookItem = renderBook(book.id, book.title, book.author, book.year, book.isComplete);
            if (book.isComplete) {
                isCompletes.appendChild(bookItem);
            } else {
                isNotComplete.appendChild(bookItem);
            }
        });
    }
});
