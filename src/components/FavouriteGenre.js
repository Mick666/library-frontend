import React from 'react'

const FavouriteGenre = ({ show, books, userDetails }) => {
    if (!show) return null

    if (!userDetails) {
        return (
            <div>
                Missing user details
            </div>
        )
    }

    const filteredBooks = books.filter(book => book.genres.includes(userDetails))

    return (
        <div>
            <h2>books</h2>
            {`Books in favourite genre: ${userDetails}`}
            <table>
                <tbody>
                    <tr style={{ textAlign: 'left' }}>
                        <th>Title</th>
                        <th>
                            author
                        </th>
                        <th>
                            published
                        </th>
                    </tr>
                    {filteredBooks.map(a =>
                        <tr key={a.title}>
                            <td>{a.title}</td>
                            <td>{a.author.name}</td>
                            <td>{a.published}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default FavouriteGenre