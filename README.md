# Library Management System

## Description

The **Library Management System** is a software application designed to help manage the daily operations of a library. It provides a simple and efficient way for library administrators and users to manage books, track borrowing and returning of books, and handle user registrations.

This system allows users to:
- View a catalog of available books
- Borrow and return books
- Search for books by title, author, or genre
- Register and manage user accounts
- Track borrowed books and overdue items

## Features

- **Book Management**: Add, update, delete, and search books in the library catalog.
- **User Management**: Register users, update user information, and assign borrowed books.
- **Book Borrowing & Returning**: Track borrowed books and their due dates. Users can borrow or return books.
- **Search Functionality**: Users can search for books by title, author, or genre.
- **Overdue Management**: Keeps track of overdue books and sends reminders.

## Installation

1. Clone the repository to your local machine:
    ```bash
    git clone https://github.com/dinkarr/Library-Management-System.git
    ```

2. Navigate to the project directory:
    ```bash
    cd library-management-system
    ```

3. Install the necessary dependencies (make sure you have Python and pip installed):
    ```bash
    pip install -r req.txt
    ```

4. Set up the database:
    - Run the necessary migrations or initialize the database as per the configuration.

5. Start the application:
    ```bash
    python app.py
    ```

## Technologies Used

- **Python** (for backend)
- **SQLite** (for database management)
- **Flask** (for web framework)
- **HTML, CSS, JavaScript** (for front-end)

## Usage

1. Visit the homepage of the Library Management System in your browser.
2. Create a user account or log in if you already have one.
3. Browse the catalog of books, borrow books, and manage your borrowed items.
4. As an admin, you can add or remove books and manage user accounts.

## Contributing

If you would like to contribute to this project, feel free to fork the repository, create a branch, and submit a pull request. Please follow the guidelines for writing clear commit messages and well-documented code.
