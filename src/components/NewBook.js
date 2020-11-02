import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ALL_BOOKS, CREATE_BOOK } from '../queries'

const NewBook = ({ show, setError, setPage }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [published, setPublished] = useState('')
    const [genre, setGenre] = useState('')
    const [genres, setGenres] = useState([])

    const [ createBook ] = useMutation(CREATE_BOOK, {
        refetchQueries: [ { query: ALL_BOOKS } ],
        onError: (error) => {
            console.log(error)
            setError(error.graphQLErrors[0].message)
        }
    })

    const submit = async (event) => {
        event.preventDefault()
        console.log('add book...')
        setGenres(genres.filter(x => x.length > 0))
        createBook({
            variables: { title, author, published, genres }
        })

        setTitle('')
        setPublished('')
        setAuthor('')
        setGenres([])
        setGenre('')
        setPage('books')
    }

    const addGenre = () => {
        setGenres(genres.concat(genre))
        setGenre('')
    }

    if (!show) {
        return null
    }

    return (
        <div>
            <form onSubmit={submit}>
                <div>
                    title
                    <input
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </div>
                <div>
                    author
                    <input
                        value={author}
                        onChange={({ target }) => setAuthor(target.value)}
                    />
                </div>
                <div>
                    published
                    <input
                        type='number'
                        value={published}
                        onChange={({ target }) => setPublished(target.value)}
                    />
                </div>
                <div>
                    <input
                        value={genre}
                        onChange={({ target }) => setGenre(target.value)}
                    />
                    <button onClick={addGenre} type="button">add genre</button>
                </div>
                <div>
                    genres: {genres.join(' ')}
                </div>
                <button type='submit'>create book</button>
            </form>
        </div>
    )
}

export default NewBook